// StubProject — full-fidelity workspace shell for projects whose case
// study is "still being written". Renders project title + summary + a
// callout explaining what's coming.

import { trackById } from "@/lib/tracks";
import type { PortfolioProject } from "@/lib/projects";

export function StubProject({ project }: { project: PortfolioProject }) {
  const track = trackById(project.track);
  return (
    <div className="prose fade-up" style={{ padding: "24px 0" }}>
      <div
        style={{
          fontSize: 10.5,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--fg-subtle)",
          marginBottom: 6,
        }}
      >
        {track?.label ?? project.track} track
      </div>
      <h2 style={{ fontSize: 18, margin: "0 0 8px" }}>{project.name}</h2>
      <p style={{ maxWidth: "52ch" }}>{project.summary}</p>
      <div className="callout">
        Case study still being written. The trace and metrics panel
        shows the most recent run; tabs below will be backfilled with
        Overview · Architecture · Prompts · Results · Trade-offs as
        each section ships.
      </div>
    </div>
  );
}
