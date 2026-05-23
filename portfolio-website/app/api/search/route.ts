// app/api/search/route.ts
// Semantic search backing the ⌘K palette (TECH-STACK.md §8).

export async function POST(_req: Request) {
  // TODO: searchGlobalIndex → return ranked results with project + section + snippet.
  return new Response("Not Implemented", { status: 501 });
}
