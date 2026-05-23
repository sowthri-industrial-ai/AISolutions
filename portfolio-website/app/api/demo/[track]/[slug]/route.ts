// app/api/demo/[track]/[slug]/route.ts
// Live demo handler — streams DemoStep objects as NDJSON.
// See TECH-STACK.md §7 for the streaming contract.

export async function POST(
  _req: Request,
  _ctx: { params: Promise<{ track: string; slug: string }> },
) {
  // TODO: rate-limit → load demo handler → validate input → stream NDJSON.
  return new Response("Not Implemented", { status: 501 });
}
