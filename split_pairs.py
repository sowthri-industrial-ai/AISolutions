import json, hashlib

pairs = [json.loads(l) for l in open("data/pairs_clean.jsonl") if l.strip()]

def is_val(source):                      # ~15% of CHUNKS -> validation, deterministic
    h = int(hashlib.md5(source.encode()).hexdigest(), 16)
    return (h % 100) < 15

train = [p for p in pairs if not is_val(p["source"])]
val   = [p for p in pairs if is_val(p["source"])]

with open("data/train.jsonl", "w") as f:
    for p in train: f.write(json.dumps(p) + "\n")
with open("data/val.jsonl", "w") as f:
    for p in val: f.write(json.dumps(p) + "\n")

tc = {p["source"] for p in train}
vc = {p["source"] for p in val}
print(f"train: {len(train)} pairs over {len(tc)} chunks")
print(f"val  : {len(val)} pairs over {len(vc)} chunks")
print(f"chunk overlap (must be 0): {len(tc & vc)}")
