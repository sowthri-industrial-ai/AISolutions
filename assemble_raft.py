import json, random, chromadb
import config
from embedder import embed_query

random.seed(7)
SAMPLE = 300
NO_ORACLE_FRAC = 0.20
N_DISTRACTORS = 3
NEIGHBOR_WINDOW = 2     # exclude oracle's +/-2 neighbours from distractors (anti-leak)

col = chromadb.PersistentClient(path=config.VECTOR_DB).get_collection(config.COLLECTION)

chunks = {}
for l in open("data/chunks.jsonl"):
    c = json.loads(l); chunks[f"{c['source']}#{c['chunk']}"] = c["text"]
all_tags = list(chunks)

pairs = [json.loads(l) for l in open("data/pairs_clean.jsonl") if l.strip()]
random.shuffle(pairs)
if SAMPLE:
    pairs = pairs[:SAMPLE]

def parse_tag(t):
    src, n = t.rsplit("#", 1)
    return src, int(n)

def is_neighbor(t, oracle_tag, window=NEIGHBOR_WINDOW):
    try:
        s1, n1 = parse_tag(t); s2, n2 = parse_tag(oracle_tag)
    except Exception:
        return False
    return s1 == s2 and abs(n1 - n2) <= window

def distractors_for(question, oracle_tag, k):
    res = col.query(query_embeddings=embed_query(question), n_results=k + 12,
                    include=["metadatas"])
    cand = [f"{m['source']}#{m['chunk']}" for m in res["metadatas"][0]]
    cand = [t for t in cand if t != oracle_tag and t in chunks and not is_neighbor(t, oracle_tag)]
    while len(cand) < k:
        r = random.choice(all_tags)
        if r != oracle_tag and r not in cand and not is_neighbor(r, oracle_tag):
            cand.append(r)
    return cand[:k]

out = []
n_no = int(len(pairs) * NO_ORACLE_FRAC)
for i, p in enumerate(pairs):
    q, oracle = p["anchor"], p["source"]
    has_oracle = i >= n_no
    if has_oracle:
        ctx_tags = distractors_for(q, oracle, N_DISTRACTORS) + [oracle]
    else:
        ctx_tags = distractors_for(q, oracle, N_DISTRACTORS + 1)
    random.shuffle(ctx_tags)
    out.append({
        "id": f"raft_{i:04d}",
        "question": q,
        "oracle_tag": oracle if has_oracle else None,
        "has_oracle": has_oracle,
        "context": [{"tag": t, "text": chunks[t]} for t in ctx_tags],
    })

random.shuffle(out)
with open("data/raft_inputs.jsonl", "w") as f:
    for r in out:
        f.write(json.dumps(r) + "\n")

print(f"wrote {len(out)} raft inputs -> data/raft_inputs.jsonl")
print(f"  with oracle (answer target) : {sum(1 for r in out if r['has_oracle'])}")
print(f"  no oracle  (refuse target)  : {sum(1 for r in out if not r['has_oracle'])}")
print("\n--- sample example ---")
ex = next(r for r in out if r["has_oracle"])
print("Q:", ex["question"])
print("oracle:", ex["oracle_tag"])
for c in ex["context"]:
    mark = "ORACLE" if c["tag"] == ex["oracle_tag"] else "distractor"
    print(f"  [{c['tag']}] ({mark}) {' '.join(c['text'].split())[:58]}...")
