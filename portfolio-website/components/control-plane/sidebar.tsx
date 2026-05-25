"use client";

// Left navigation. TRACKS header → three expandable track groups, each
// containing project rows. Active row gets a left-edge accent in the
// track color, a tinted background, and a haloed dot. Footer signature
// shows version + online status (CD bundle parity).

import Link from "next/link";
import type { MouseEventHandler } from "react";
import {
  IconChevronDown,
  IconChevronRight,
} from "@/components/control-plane/icons";
import { Dot } from "@/components/control-plane/dot";
import { useControlPlaneStore } from "@/lib/store";
import {
  PROJECTS,
  projectsByTrack,
  type PortfolioProject,
} from "@/lib/projects";
import { TRACKS, type TrackMeta } from "@/lib/tracks";
import { DEFAULT_TAB } from "@/lib/projects";

interface SidebarProps {
  /** Currently-active project id, or null when on the welcome page. */
  activeId: string | null;
}

const SIDEBAR_WIDTH = 212;

export function Sidebar({ activeId }: SidebarProps) {
  return (
    <aside
      aria-label="Project navigation"
      style={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        background: "var(--bg-elevated)",
        borderRight: "0.5px solid var(--border-token)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 14px 8px",
          fontSize: 10.5,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--fg-subtle)",
          fontWeight: 500,
        }}
      >
        Tracks
      </div>
      <nav
        aria-label="Tracks"
        style={{ overflow: "auto", padding: "0 6px 12px", flex: 1 }}
      >
        {TRACKS.map((track) => (
          <TrackGroup
            key={track.id}
            track={track}
            activeId={activeId}
          />
        ))}
      </nav>
      <Footer />
    </aside>
  );
}

interface TrackGroupProps {
  track: TrackMeta;
  activeId: string | null;
}

function TrackGroup({ track, activeId }: TrackGroupProps) {
  const open = useControlPlaneStore((s) => s.expanded[track.id]);
  const toggleTrack = useControlPlaneStore((s) => s.toggleTrack);
  const items = projectsByTrack(track.id);

  const handleToggle: MouseEventHandler<HTMLButtonElement> = () => {
    toggleTrack(track.id);
  };

  return (
    <div style={{ margin: "2px 0" }}>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls={`track-panel-${track.id}`}
        data-testid={`track-toggle-${track.id}`}
        style={{
          width: "100%",
          height: 28,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 8px",
          color: "var(--fg)",
          fontSize: 13,
          fontWeight: 600,
          borderRadius: 4,
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--bg-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        {open ? (
          <IconChevronDown size={12} style={{ color: "var(--fg-muted)" }} />
        ) : (
          <IconChevronRight size={12} style={{ color: "var(--fg-muted)" }} />
        )}
        <span>{track.label}</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            color: "var(--fg-subtle)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {items.length}
        </span>
      </button>
      {open && (
        <div
          id={`track-panel-${track.id}`}
          role="group"
          style={{ padding: "2px 0 6px" }}
        >
          {items.length === 0 ? (
            <div
              style={{
                padding: "4px 10px 4px 28px",
                fontSize: 12,
                color: "var(--fg-subtle)",
                fontStyle: "italic",
              }}
            >
              No projects yet
            </div>
          ) : (
            items.map((p) => (
              <ProjectRow
                key={p.id}
                project={p}
                track={track}
                active={p.id === activeId}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface ProjectRowProps {
  project: PortfolioProject;
  track: TrackMeta;
  active: boolean;
}

function ProjectRow({ project, track, active }: ProjectRowProps) {
  const statusColor =
    project.status === "live"
      ? "var(--success)"
      : project.status === "beta"
        ? "var(--warning)"
        : "var(--fg-subtle)";

  // Deep-link straight into the Overview tab so navigation always lands
  // somewhere meaningful, never on a redirect dummy URL.
  const href = `/control/${project.track}/${project.id}/${DEFAULT_TAB}`;

  return (
    <Link
      href={href}
      data-testid={`project-row-${project.id}`}
      aria-current={active ? "page" : undefined}
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: 26,
        alignItems: "center",
        gap: 8,
        padding: "0 10px 0 22px",
        color: "var(--fg)",
        background: active ? track.bg : "transparent",
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        borderRadius: 4,
        textAlign: "left",
        marginBottom: 1,
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "var(--bg-hover)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      {active && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 3,
            bottom: 3,
            width: 2,
            background: track.color,
            borderRadius: 1,
          }}
        />
      )}
      <Dot color={active ? track.color : statusColor} ring={active} />
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {project.name}
      </span>
    </Link>
  );
}

function Footer() {
  // Total project count drives the version string suffix — the CD bundle
  // hard-codes "v0.4.2", so we mirror that exactly.
  void PROJECTS;
  return (
    <div
      style={{
        padding: "10px 14px",
        borderTop: "0.5px solid var(--border-token)",
        fontSize: 11,
        color: "var(--fg-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span className="mono">v0.4.2</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        <Dot color="var(--success)" />
        <span>online</span>
      </span>
    </div>
  );
}
