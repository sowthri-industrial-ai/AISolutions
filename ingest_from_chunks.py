# Build the vector DB directly from chunks.jsonl using the local embedder
import json, chromadb, config
from embedder import embed_passages

CHUNKS = "/home/ubuntu/blending-twin/data/chunks.jsonl"

rows = [json.loads(l) for l in open(CHUNKS) if l.strip()]
print(f"Loaded {len(rows)} chunks")

texts = [r["text"]   for r in rows]
ids   = [r["id"]     for r in rows]
metas = [{"source": r["source"], "chunk": r["chunk"]} for r in rows]

print("Embedding with local blending-embedder ...")
vecs = embed_passages(texts)
print(f"Embedded {len(vecs)} vectors, dim={len(vecs[0])}")

client = chromadb.PersistentClient(path=config.VECTOR_DB)
try: client.delete_collection(config.COLLECTION)
except Exception: pass
col = client.get_or_create_collection(config.COLLECTION, metadata={"hnsw:space": "cosine"})

B = 256
for i in range(0, len(rows), B):
    col.add(ids=ids[i:i+B], documents=texts[i:i+B],
            embeddings=vecs[i:i+B], metadatas=metas[i:i+B])
print(f"Stored {col.count()} chunks in collection '{config.COLLECTION}'")
