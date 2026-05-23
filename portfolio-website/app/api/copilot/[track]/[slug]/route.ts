// app/api/copilot/[track]/[slug]/route.ts
// Layer 2 — per-project copilot (RAG over a single project's MDX).
// See TECH-STACK.md §7 (project copilot).

export async function POST(
  _req: Request,
  _ctx: { params: Promise<{ track: string; slug: string }> },
) {
  // TODO: searchProjectIndex → streamText with the copilot system prompt.
  return new Response("Not Implemented", { status: 501 });
}
