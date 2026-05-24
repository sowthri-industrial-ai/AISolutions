// Welcome state shown by /control when no project is selected. Lists
// the three tracks with project counts and points to ⌘K for fast jumps.

import { Dot } from "@/components/control-plane/dot";
import { projectsByTrack } from "@/lib/projects";
import { TRACKS } from "@/lib/tracks";

export function WelcomeWorkspace() {
  return (
    <main
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "grid",
          placeItems: "center",
          padding: 28,
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "left" }}>
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--fg-subtle)",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Dot color="var(--success)" size={5} />
            <span>Control plane · ready</span>
          </div>
          <div
            style={{
              fontSize: 15,
              color: "var(--fg)",
              lineHeight: 1.6,
              marginBottom: 16,
              maxWidth: "38ch",
            }}
          >
            Pick a project from the sidebar to open its case study,
            traces, and metrics.
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
            {TRACKS.map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 12,
                  color: "var(--fg-muted)",
                }}
              >
                <Dot color={t.color} size={6} />
                <span>{t.label}</span>
                <span style={{ color: "var(--fg-subtle)", fontFamily: "var(--font-mono)" }}>
                  {projectsByTrack(t.id).length}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--fg-subtle)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>Or press</span>
            <span
              className="mono"
              style={{
                border: "0.5px solid var(--border-strong)",
                background: "var(--bg-subtle)",
                padding: "1px 6px",
                borderRadius: 3,
                fontSize: 11,
                color: "var(--fg-muted)",
              }}
            >
              ⌘K
            </span>
            <span>to jump.</span>
          </div>
        </div>
      </div>
    </main>
  );
}
