// Workspace shell for a single project: header + tab strip + content
// slot + sticky ask bar. Server component — children are the per-tab
// content rendered by app/control/[track]/[slug]/[tab]/page.tsx.

import type { ReactNode } from "react";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { TabStrip } from "@/components/workspace/tab-strip";
import { AskBar } from "@/components/workspace/ask-bar";
import type { PortfolioProject } from "@/lib/projects";
import type { TrackMeta } from "@/lib/tracks";

interface WorkspaceShellProps {
  project: PortfolioProject;
  track: TrackMeta;
  /** The currently-active tab slug (from URL). */
  activeTab: string;
  /** When true, the tab strip is shown disabled (StubProject content). */
  disabled?: boolean;
  children: ReactNode;
}

export function WorkspaceShell({
  project,
  track,
  activeTab,
  disabled = false,
  children,
}: WorkspaceShellProps) {
  const projectBase = `/control/${project.track}/${project.id}`;
  return (
    <>
      <WorkspaceHeader project={project} track={track} />
      <TabStrip projectBase={projectBase} active={activeTab} disabled={disabled} />
      {/*
        The tab content scrollable container. The Agent Reaction tab walks
        the DOM upward looking for an overflow:auto ancestor — this div is
        that ancestor, by design (do not change without verifying that
        scroll-spy still works).
      */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px 28px 24px",
          minHeight: 0,
        }}
      >
        {children}
      </div>
      <AskBar projectName={project.name} />
    </>
  );
}
