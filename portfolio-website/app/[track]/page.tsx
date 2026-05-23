// app/[track]/page.tsx
// Static track index — placeholder.
// TECH-STACK.md §2, §6: lists every project in the track using
// listProjects() filtered by track. Single template, three uses
// (/agentic, /assets, /physical).

export default async function TrackIndexPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-medium">Track · {track}</h1>
      <p className="mt-4 text-muted-foreground">
        Track index placeholder. Final page lists every project in the
        track with cards linking into the control plane and the static
        case studies.
      </p>
    </main>
  );
}
