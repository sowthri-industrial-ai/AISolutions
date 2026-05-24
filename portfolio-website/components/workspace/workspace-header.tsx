// Workspace header: title + status badge, summary, capability pills.
// Server-rendered — purely from the project data.

import { StatusBadge } from "@/components/workspace/status-badge";
import { CapabilityPill } from "@/components/workspace/capability-pill";
import type { PortfolioProject } from "@/lib/projects";
import type { TrackMeta } from "@/lib/tracks";

interface WorkspaceHeaderProps {
  project: PortfolioProject;
  track: TrackMeta;
}

export function WorkspaceHeader({ project, track }: WorkspaceHeaderProps) {
  return (
    <div style={{ padding: "20px 28px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "-0.015em",
            margin: 0,
            color: "var(--fg)",
          }}
        >
          {project.name}
        </h1>
        <StatusBadge status={project.status} />
      </div>
      <p
        style={{
          margin: "0 0 12px",
          color: "var(--fg-muted)",
          fontSize: 13,
          lineHeight: 1.55,
          maxWidth: "64ch",
        }}
      >
        {project.summary}
      </p>
      {project.capabilities && project.capabilities.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {project.capabilities.map((c) => (
            <CapabilityPill key={c} track={track} label={c} />
          ))}
        </div>
      )}
    </div>
  );
}
