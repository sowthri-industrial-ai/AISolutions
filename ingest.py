import os, glob
import chromadb
from pypdf import PdfReader
import config
from embedder import embed_passages

def read_any(path):
    if path.lower().endswith(".pdf"):
        return "\n".join((p.extract_text() or "") for p in PdfReader(path).pages)
    return open(path, encoding="utf-8", errors="ignore").read()

def chunk(text):
    words = text.split()
    out, i = [], 0
    while i < len(words):
        out.append(" ".join(words[i:i+config.CHUNK_WORDS]))
        i += config.CHUNK_WORDS - config.CHUNK_OVERLAP
    return out

paths = sorted(glob.glob(os.path.join(config.DOCS_DIR, "*")))
print(f"Found {len(paths)} document(s) in {config.DOCS_DIR}/")

docs, metas, ids = [], [], []
for path in paths:
    name = os.path.basename(path)
    chunks = chunk(read_any(path))
    print(f"  {name} -> {len(chunks)} chunks")
    for j, c in enumerate(chunks):
        docs.append(c); metas.append({"source": name, "chunk": j}); ids.append(f"{name}::{j}")

client = chromadb.PersistentClient(path=config.VECTOR_DB)
try: client.delete_collection(config.COLLECTION)
except Exception: pass
col = client.get_or_create_collection(config.COLLECTION, metadata={"hnsw:space": "cosine"})
col.upsert(ids=ids, documents=docs, metadatas=metas, embeddings=embed_passages(docs))
print(f"Stored {col.count()} chunks in collection '{config.COLLECTION}'.")
