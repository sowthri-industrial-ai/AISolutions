// app/api/guide/route.ts
// Layer 1 — global AI guide (chat across the whole site).
// See TECH-STACK.md §7 (global guide).

export async function POST(_req: Request) {
  // TODO: vector search across the global index, then streamText.
  return new Response("Not Implemented", { status: 501 });
}
