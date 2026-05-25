// Tab dispatcher: maps a tab slug to the component that renders it.
// Lives outside the route tree so per-tab pages stay one-liners.
//
// Three tabs are full-fidelity in slice 3 (Overview's body is intentionally
// left as a skeleton — see PR description for scope rationale):
//   - Architecture        → ArchitectureTab (six-layer stack + rails)
//   - Agent Reaction      → AgentReactionTab (Tables/Comp/Reaction/Result)
// The rest (Overview, Demo, Prompts, Results, Trade-offs) render the
// SkeletonTab placeholder; their MDX bodies arrive in a later slice.

import { SkeletonTab } from "@/components/tabs/skeleton-tab";
import { ArchitectureTab } from "@/components/tabs/architecture-tab";
import { AgentReactionTab } from "@/components/tabs/agent-reaction-tab";
import { StubProject } from "@/components/workspace/stub-project";
import type { PortfolioProject, TabDef } from "@/lib/projects";

/** Projects with a full Architecture + Agent Reaction implementation. */
const DOCUMENTED_PROJECTS = new Set<string>(["supply-chain-copilot"]);

export function isDocumented(project: PortfolioProject): boolean {
  return DOCUMENTED_PROJECTS.has(project.id);
}

interface TabContentProps {
  project: PortfolioProject;
  tab: TabDef;
}

export function TabContent({ project, tab }: TabContentProps) {
  // Non-documented projects always show the StubProject panel — the case
  // study isn't written yet, so per-tab navigation would be a lie.
  if (!isDocumented(project)) {
    return <StubProject project={project} />;
  }

  if (tab.slug === "architecture") {
    return <ArchitectureTab project={project} />;
  }
  if (tab.slug === "agent-reaction") {
    return <AgentReactionTab project={project} />;
  }
  return <SkeletonTab project={project} tab={tab} />;
}
