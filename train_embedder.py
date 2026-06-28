import json, math, numpy as np
import sentence_transformers
from sentence_transformers import SentenceTransformer, InputExample, losses
from torch.utils.data import DataLoader
import config

print("sentence-transformers", sentence_transformers.__version__)
BASE, QP, OUT = config.EMBEDDER, config.QUERY_PREFIX, "models/blending-embedder"

train = [json.loads(l) for l in open("data/train.jsonl") if l.strip()]
val   = [json.loads(l) for l in open("data/val.jsonl") if l.strip()]
chunks = {}
for l in open("data/chunks.jsonl"):
    c = json.loads(l); chunks[f"{c['source']}#{c['chunk']}"] = c["text"]
tags = list(chunks); texts = [chunks[t] for t in tags]

def eval_retrieval(model):
    cemb = model.encode(texts, normalize_embeddings=True, convert_to_numpy=True, batch_size=32)
    r1 = r5 = 0
    for p in val:
        q = model.encode([QP + p["anchor"]], normalize_embeddings=True, convert_to_numpy=True)[0]
        order = np.argsort(-(cemb @ q))
        ranked = [tags[i] for i in order]
        r1 += ranked[0] == p["source"]
        r5 += p["source"] in ranked[:5]
    n = len(val)
    return r1 / n, r5 / n

print("loading base:", BASE)
model = SentenceTransformer(BASE)
model.max_seq_length = 256

print(f"\n[BEFORE] evaluating on {len(val)} unseen queries...")
b1, b5 = eval_retrieval(model)
print(f"  recall@1 = {b1:.1%}   recall@5 = {b5:.1%}")

examples = [InputExample(texts=[QP + p["anchor"], p["positive"]]) for p in train]
loader = DataLoader(examples, shuffle=True, batch_size=8)
loss = losses.MultipleNegativesRankingLoss(model)
epochs = 3
warmup = math.ceil(len(loader) * epochs * 0.1)
print(f"\ntraining: {len(examples)} pairs, {epochs} epochs, {len(loader)} batches/epoch ...")
model.fit(train_objectives=[(loader, loss)], epochs=epochs, warmup_steps=warmup, show_progress_bar=True)

print(f"\n[AFTER] evaluating...")
a1, a5 = eval_retrieval(model)
print("=" * 48)
print(f"  recall@1 : {b1:.1%}  ->  {a1:.1%}")
print(f"  recall@5 : {b5:.1%}  ->  {a5:.1%}")
print("=" * 48)

model.save(OUT)
print("saved blending embedder ->", OUT)
