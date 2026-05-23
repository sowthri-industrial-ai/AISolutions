// app/(pages)/approach/page.tsx
// Static editorial page — placeholder.
// TECH-STACK.md §4: rendered from content/pages/approach.mdx via a shared
// static-page template (single template, three uses with stack/ and about/).

export default function ApproachPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-medium">Approach</h1>
      <p className="mt-4 text-muted-foreground">
        Approach placeholder. Final page renders content/pages/approach.mdx.
      </p>
    </main>
  );
}
