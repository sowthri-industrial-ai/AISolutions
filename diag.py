import sys, chromadb, config
from embedder import embed_query

client = chromadb.PersistentClient(path=config.VECTOR_DB)
col = client.get_collection(config.COLLECTION)

FACETS = {
    "WATER": ["water", "moisture", "hygroscopic"],
    "OXIDATION": ["oxidation", "stability", "antioxidant", "degrad"],
    "MATERIALS": ["copper", "brass", "bronze", "zinc", "elastomer", "compatib"],
}

q = " ".join(sys.argv[1:]) or "how should biodiesel be stored?"
N = 20
res = col.query(query_embeddings=embed_query(q), n_results=N,
                include=["documents", "metadatas", "distances"])
docs, metas, dists = res["documents"][0], res["metadatas"][0], res["distances"][0]
print(f"\nTop {N} retrieved candidates for: {q}")
print("(only the top 12 ever reach rerank/MMR)\n" + "=" * 72)
found = set()
for r, (d, m, dist) in enumerate(zip(docs, metas, dists), 1):
    low = d.lower()
    tags = [name for name, kws in FACETS.items() if any(k in low for k in kws)]
    found.update(tags)
    flag = ("   <== " + ", ".join(tags)) if tags else ""
    cut = "   --- top12 cutoff ---" if r == 12 else ""
    print(f"{r:2d}. sem={1-dist:.2f} [{m['source']}#{m['chunk']}] {' '.join(d.split())[:44]}...{flag}{cut}")
print("=" * 72)
missing = [f for f in FACETS if f not in found]
print(f"facets present in top {N}: {sorted(found) or 'NONE'}")
print(f"facets MISSING from top {N}: {missing or 'none'}")
