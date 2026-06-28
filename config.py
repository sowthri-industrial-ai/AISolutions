# Central settings (best-of-breed; swap to sovereign at production)
EMBEDDER = "models/blending-embedder"
QUERY_PREFIX   = "Represent this sentence for searching relevant passages: "
PASSAGE_PREFIX = ""
RERANKER       = "cross-encoder/ms-marco-MiniLM-L-6-v2"
VECTOR_DB      = "data/vectordb"
COLLECTION     = "blend"
DOCS_DIR       = "docs"
CHUNK_WORDS    = 120
CHUNK_OVERLAP  = 20
TOP_K_RETRIEVE = 12
TOP_K_RERANK   = 4

# --- brain (Step 4) ---
BRAIN = "models/blending-slm-hub"
MIN_RERANK_SCORE = 0.0   # if the best reranked chunk scores below this, refuse (guard)

# --- retrieval diversity (MMR) ---
MMR_LAMBDA = 0.6   # 1.0 = pure relevance, 0.0 = pure diversity; 0.6 leans relevant

# --- query expansion (multi-query retrieval) ---
USE_QUERY_EXPANSION = True
