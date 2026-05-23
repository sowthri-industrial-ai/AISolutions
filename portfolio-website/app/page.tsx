// app/page.tsx
// Home — placeholder. Will surface both routes equally: a hero, the
// featured projects from content/*/project.json, and entry points to the
// control plane (/control) and the static tracks (/agentic, /assets,
// /physical). See TECH-STACK.md §6 and §14.

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-medium">AISolutions — portfolio</h1>
      <p className="text-muted-foreground mt-4">
        Home placeholder. The final page surfaces the control plane and the
        static case-study tracks side by side.
      </p>
    </main>
  );
}
