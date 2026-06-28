from sentence_transformers import SentenceTransformer
import config

_model = SentenceTransformer(config.EMBEDDER)

def embed_passages(texts):
    return _model.encode([config.PASSAGE_PREFIX + t for t in texts], normalize_embeddings=True).tolist()

def embed_query(text):
    return _model.encode([config.QUERY_PREFIX + text], normalize_embeddings=True).tolist()
