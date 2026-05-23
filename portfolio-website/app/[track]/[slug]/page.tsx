// app/[track]/[slug]/page.tsx
// Static project page — placeholder.
// TECH-STACK.md §6: single long-form scroll concatenating the six MDX
// files with collapsible sections + cross-link into the control plane.

export default async function StaticProjectPage({
  params,
}: {
  params: Promise<{ track: string; slug: string }>;
}) {
  const { track, slug } = await params;
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-medium">
        {track} / {slug}
      </h1>
      <p className="mt-4 text-muted-foreground">
        Static project page placeholder. Final page renders the six MDX
        sections with collapsible navigation and a cross-link into the
        control plane workspace.
      </p>
    </main>
  );
}
