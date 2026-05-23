// app/control/[track]/[slug]/page.tsx
// Project workspace — placeholder.
// TECH-STACK.md §6: tabbed view (Overview / Architecture / Prompts / Results
// / Trade-offs / Demo) rendered from content/{track}/{slug}/*.mdx + demo.ts.

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ track: string; slug: string }>;
}) {
  const { track, slug } = await params;
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-medium">
        Workspace · {track} / {slug}
      </h1>
      <p className="mt-4 text-muted-foreground">
        Project workspace placeholder. Final page mounts the six-tab
        workspace with the live demo runner.
      </p>
    </main>
  );
}
