// app/api/compare/route.ts
// Compare mode — runs the same demo input through two models side by side.
// See TECH-STACK.md §8 (compare mode).

export async function POST(_req: Request) {
  // TODO: invoke two demo handlers in parallel, multiplex their NDJSON
  // streams keyed by column id.
  return new Response("Not Implemented", { status: 501 });
}
