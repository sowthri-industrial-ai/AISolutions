// Skeleton tab — shown for Overview / Demo / Prompts / Results / Trade-offs
// in slice 3. Renders inside the control-plane shell so tab navigation
// stays exercisable; content area carries a project title and the
// "Design pending" affordance so reviewers see what's coming without
// mistaking the placeholder for finished work.

import type { TabDef } from "@/lib/projects";
import type { PortfolioProject } from "@/lib/projects";

interface SkeletonTabProps {
  project: PortfolioProject;
  tab: TabDef;
}

export function SkeletonTab({ project, tab }: SkeletonTabProps) {
  return (
    <div className="prose fade-up" style={{ padding: "8px 0" }}>
      <div
        style={{
          fontSize: 10.5,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--fg-subtle)",
          marginBottom: 6,
          fontFamily: "var(--font-mono)",
        }}
      >
        {project.name} · {tab.label}
      </div>
      <h2 style={{ margin: "0 0 8px" }}>Design pending</h2>
      <p className="muted" style={{ maxWidth: "56ch" }}>
        The <strong style={{ color: "var(--fg)" }}>{tab.label}</strong> tab is
        scoped for a later slice. The control-plane shell, navigation, and
        the right-rail trace are already wired so this URL is reachable and
        link-shareable.
      </p>
      <div className="callout">
        Once the content pipeline lands, this tab renders the MDX file
        at <code>content/{project.track}/{project.id}/{tab.slug}.mdx</code>{" "}
        with the project&rsquo;s <code>defaultModel</code> in scope for the live
        copilot.
      </div>
    </div>
  );
}
