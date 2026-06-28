import json, chromadb, config
col = chromadb.PersistentClient(path=config.VECTOR_DB).get_collection(config.COLLECTION)
data = col.get(include=["documents", "metadatas"])
n = 0
with open("data/chunks.jsonl", "w") as f:
    for id_, doc, meta in zip(data["ids"], data["documents"], data["metadatas"]):
        f.write(json.dumps({"id": id_, "source": meta["source"],
                            "chunk": meta["chunk"], "text": doc}) + "\n")
        n += 1
print(f"wrote {n} chunks to data/chunks.jsonl")
