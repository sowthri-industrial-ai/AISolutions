# Blending RAG - clean build

## Step 1 - Foundation
- New project at ~/blend-rag with src/ docs/ data/ eval/.
- config.py holds all best-of-breed choices in one place.
- Reused existing venv; carried over the biodiesel PDF.

## Step 2 - Ingest
- embedder.py wraps the best-of-breed embedder (from config).
- ingest.py: read (PDF/text) -> chunk (config size + overlap) -> embed -> vector DB with source metadata.
- Driven entirely by config.py; tuning = edit config, re-run.

## Swap to retrieval-tuned embedder
- EMBEDDER -> BAAI/bge-base-en-v1.5 (retrieval-tuned, query->passage).
- embedder.py now has embed_passages() + embed_query() for the prefix asymmetry.
- Re-ingested. NOTE: BGE is Chinese -> on the production swap-back list.
- Niche lever for later: fine-tune the embedder on blending Q&A pairs (needs a golden set).

## Step 3 - Retrieve + rerank
- retrieve.py: stage 1 semantic (top 12 via BGE query embed) -> stage 2 cross-encoder rerank (keep top 4).
- Reranker: cross-encoder/ms-marco-MiniLM-L-6-v2 (best-of-breed; swap-back at prod).
- retrieve() is importable - the brain (Step 4) will call it.

## Step 4 - The brain (generate)
- brain.py: retrieve() -> guard (refuse if best rerank < MIN_RERANK_SCORE) -> LLM writes a cited answer.
- Brain = Qwen2.5-1.5B-Instruct (Alibaba; best-of-breed-for-CPU dev choice).
- SWAP-BACK at production -> Param2 (sovereign). bf16 on CPU; GPU at prod.
- answer() is importable - the chat console (Serve stage) will call it.

## Step 5b - Browser console (Streamlit)
- app.py: chat UI; @st.cache_resource loads model ONCE across reruns.
- Reached via SSH tunnel (no security-group change, not exposed publicly).
- Run: streamlit run app.py --server.address localhost --server.port 8501 --server.headless true

## Step 5c - Golden set + metrics
- eval/golden.json: questions with must_cover facets (answer) or type=refuse (guard).
- run_eval.py: runs the pipeline over the set, auto-scores facet coverage + guard accuracy.
- Baseline run = first real numbers. Storage expected ~1/4 (coverage gap demo).
- This file is also the seed for Specialize (fine-tune embedder + RAFT data).

## Step 5d - MMR retrieval diversity
- retrieve.py: rerank all 12 -> normalize relevance -> MMR picks a relevant-but-diverse 4.
- config.MMR_LAMBDA = 0.6 (relevance vs diversity dial); chunk-chunk sim via BGE embeddings.
- Guard unchanged (MMR seeds with top-reranked chunk). Single-variable change vs baseline 69% / 2:2.

## Step 5d - MMR retrieval diversity
- retrieve.py: rerank all 12 -> normalize relevance -> MMR picks a relevant-but-diverse 4.
- config.MMR_LAMBDA = 0.6 (relevance vs diversity dial); chunk-chunk sim via BGE embeddings.
- Guard unchanged (MMR seeds with top-reranked chunk). Single-variable change vs baseline 69% / 2:2.

## Step 5d - MMR retrieval diversity
- retrieve.py: rerank all 12 -> normalize relevance -> MMR picks a relevant-but-diverse 4.
- config.MMR_LAMBDA = 0.6 (relevance vs diversity dial); chunk-chunk sim via BGE embeddings.
- Guard unchanged (MMR seeds with top-reranked chunk). Single-variable change vs baseline 69% / 2:2.

## Step 5e - Query expansion (multi-query retrieval)
- brain.expand_queries(): LLM writes 3-4 focused sub-queries (JSON array).
- retrieve.retrieve_pool(queries, original): search each -> pool/dedupe -> rerank vs original -> MMR.
- Guard runs on plain question first (skips expansion on out-of-corpus). config.USE_QUERY_EXPANSION toggle.

## Step 5f - Focused pass (sharper expander + per-query rerank + honest scoring)
- EXPAND_SYS: forces 4 DISTINCT aspects (conditions/contamination/materials/degradation).
- retrieve_pool: rerank each chunk against its best-matching query (max over queries).
- golden.json: oxidation keywords broadened (induction time, acid number, d6751, shelf).
- Verdict run: if water/materials still miss, root fix = domain embedder (Specialize).

## Step 6b - Fine-tune the blending embedder
- train_embedder.py: BGE + MultipleNegativesRankingLoss on data/train.jsonl (query prefix on anchor).
- Held-out eval on data/val.jsonl (unseen chunks): recall@1 / recall@5 before vs after.
- Output: models/blending-embedder. CPU run; GPU at production.

## Step 7a - Assemble RAFT inputs
- assemble_raft.py: for each clean pair (question + oracle), pull distractors via the blending embedder.
- 300 examples; 20% oracle removed (refusal targets); 3 distractors each; context shuffled.
- Output data/raft_inputs.jsonl -> Antigravity writes gold answers next.

## Step 7a - Assemble RAFT inputs
- assemble_raft.py: for each clean pair (question + oracle), pull distractors via the blending embedder.
- 300 examples; 20% oracle removed (refusal targets); 3 distractors each; context shuffled.
- Output data/raft_inputs.jsonl -> Antigravity writes gold answers next.

## Step 7a - Assemble RAFT inputs
- assemble_raft.py: for each clean pair (question + oracle), pull distractors via the blending embedder.
- 300 examples; 20% oracle removed (refusal targets); 3 distractors each; context shuffled.
- Output data/raft_inputs.jsonl -> Antigravity writes gold answers next.

## Step 7b - Build RAFT SFT file
- build_raft_sft.py: join inputs+answers by id; validate (Case A must cite a context tag; Case B must be exact refusal).
- Renders context as "[src #n] text" to match brain.py inference format. Output data/raft_sft.jsonl (chat messages).

## Step 7c - Train the blending SLM (LoRA SFT)
- train_slm.py: Qwen2.5-0.5B-Instruct + LoRA (r=16) on data/raft_sft.jsonl, completion-only loss.
- 3 epochs, bs1 x grad-accum8, CPU. Merges adapter -> models/blending-slm. SWAP-BACK: 1.5B+ on GPU at prod.
