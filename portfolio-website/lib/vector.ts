// lib/vector.ts
// pgvector helpers: chunking, embedding, semantic search.
// See TECH-STACK.md Sections 3 (Supabase + pgvector) and 7.

/** Layer 2 — per-project RAG. */
export async function searchProjectIndex(
  _track: string,
  _slug: string,
  _query: string,
  _opts: { k: number },
): Promise<Array<{ id: string; text: string; score: number }>> {
  // TODO: query the project-scoped pgvector index.
  return [];
}

/** Layer 1 — site-wide semantic search (⌘K). */
export async function searchGlobalIndex(
  _query: string,
  _opts: { k: number },
): Promise<
  Array<{
    projectSlug: string;
    track: string;
    section: string;
    snippet: string;
    score: number;
  }>
> {
  // TODO: query the global pgvector index.
  return [];
}
