import sys
import numpy as np
import chromadb
from sentence_transformers import CrossEncoder
import config
from embedder import embed_query

_client = chromadb.PersistentClient(path=config.VECTOR_DB)
_col = _client.get_collection(config.COLLECTION)
_reranker = CrossEncoder(config.RERANKER)

def _search(query, n):
    res = _col.query(query_embeddings=embed_query(query), n_results=n,
                     include=["documents", "metadatas", "distances", "embeddings"])
    out = []
    for doc, meta, dist, emb in zip(res["documents"][0], res["metadatas"][0],
                                    res["distances"][0], res["embeddings"][0]):
        out.append({"key": f"{meta['source']}#{meta['chunk']}", "doc": doc,
                    "meta": meta, "sem": 1 - dist, "emb": np.array(emb, dtype=float)})
    return out

def _mmr(rel, embs, k, lam):
    selected = [int(np.argmax(rel))]
    cands = [i for i in range(len(rel)) if i not in selected]
    while len(selected) < min(k, len(rel)):
        best_c, best_s = None, -1e9
        for c in cands:
            sim = max(float(np.dot(embs[c], embs[s])) for s in selected)
            sc = lam * rel[c] - (1 - lam) * sim
            if sc > best_s:
                best_s, best_c = sc, c
        selected.append(best_c); cands.remove(best_c)
    return selected

def retrieve_pool(queries, rerank_against, per_query=None, k_final=None):
    per_query = per_query or config.TOP_K_RETRIEVE
    k_final = k_final or config.TOP_K_RERANK
    pool = {}
    for q in queries:
        for c in _search(q, per_query):
            if c["key"] not in pool or c["sem"] > pool[c["key"]]["sem"]:
                pool[c["key"]] = c
    cands = list(pool.values())
    # rerank each candidate against its BEST-matching query (max over queries)
    rqs = list(dict.fromkeys([rerank_against] + list(queries)))
    pairs = [(q, c["doc"]) for c in cands for q in rqs]
    flat = np.array(_reranker.predict(pairs), dtype=float).reshape(len(cands), len(rqs))
    scores = flat.max(axis=1)
    lo, hi = float(scores.min()), float(scores.max())
    rel = (scores - lo) / (hi - lo + 1e-9)
    embs = np.array([c["emb"] for c in cands])
    idx = _mmr(rel, embs, k_final, config.MMR_LAMBDA)
    chosen = [(float(scores[i]), float(cands[i]["sem"]), cands[i]["doc"], cands[i]["meta"]) for i in idx]
    chosen.sort(key=lambda x: x[0], reverse=True)
    return chosen, len(cands)

def retrieve(question):
    chosen, _ = retrieve_pool([question], question)
    return chosen, None

if __name__ == "__main__":
    q = " ".join(sys.argv[1:]) or "how should biodiesel be stored?"
    chosen, n = retrieve_pool([q], q)
    print(f"pool {n}; final {len(chosen)} for: {q}\n")
    for sc, sem, doc, m in chosen:
        print(f"  rr={sc:+.2f} (sem {sem:.2f}) [{m['source']}#{m['chunk']}] {' '.join(doc.split())[:58]}...")
