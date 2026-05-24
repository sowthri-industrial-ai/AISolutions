// Right rail: TRACE (live tool calls) · METRICS (tokens/latency/cost/eval)
// · RELATED (cross-project link). Tail strip reads `streaming · tail -f`.
// Receives the active project — server-component friendly.

import { trackById } from "@/lib/tracks";
import { Dot } from "@/components/control-plane/dot";
import type { PortfolioProject, TraceLine } from "@/lib/projects";

const PANEL_WIDTH = 232;

interface ObsPanelProps {
  project: PortfolioProject | null;
}

export function ObsPanel({ project }: ObsPanelProps) {
  if (!project) {
    return (
      <aside
        aria-label="Observability"
        style={{ ...panelShellStyle, width: PANEL_WIDTH }}
      >
        <div
          style={{
            padding: 14,
            color: "var(--fg-subtle)",
            fontSize: 12,
            lineHeight: 1.55,
          }}
        >
          Select a project to begin.
        </div>
      </aside>
    );
  }

  const metrics = project.metrics ?? {};

  return (
    <aside
      aria-label="Observability"
      style={{ ...panelShellStyle, width: PANEL_WIDTH }}
    >
      <div style={{ padding: "14px 14px 4px", overflow: "auto", flex: 1 }}>
        <SectionLabel>Trace</SectionLabel>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            lineHeight: 1.8,
            marginBottom: 18,
          }}
        >
          {(project.trace ?? []).map((line, i) => (
            <TraceLineRow key={i} line={line} />
          ))}
        </div>

        <SectionLabel>Metrics</SectionLabel>
        <div style={{ marginBottom: 18 }}>
          <MetricRow label="Tokens"   value={metrics.tokens} />
          <MetricRow label="Latency"  value={metrics.latency} />
          <MetricRow label="Cost"     value={metrics.cost} />
          <MetricRow label="Eval, 24h" value={metrics.eval} valueColor="var(--success)" />
        </div>

        {project.related && <RelatedBlock related={project.related} />}
      </div>

      {/* Tail — live indicator */}
      <div
        style={{
          padding: "8px 14px",
          borderTop: "0.5px solid var(--border-token)",
          fontSize: 10.5,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--fg-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Dot color="var(--success)" size={5} />
        <span>streaming</span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            textTransform: "none",
            letterSpacing: 0,
          }}
        >
          tail -f
        </span>
      </div>
    </aside>
  );
}

const panelShellStyle = {
  flexShrink: 0,
  background: "var(--bg-elevated)",
  borderLeft: "0.5px solid var(--border-token)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
} as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10.5,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--fg-subtle)",
        fontWeight: 500,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function TraceLineRow({ line }: { line: TraceLine }) {
  if (line.kind === "arrow") {
    return <div style={{ color: "var(--fg-subtle)" }}>↪</div>;
  }
  const color =
    line.tone === "success" ? "var(--success)" :
    line.tone === "info"    ? "var(--info)"    :
    line.tone === "muted"   ? "var(--fg-muted)":
                              "var(--fg)";
  return (
    <div style={{ display: "flex", gap: 6, color }}>
      <span style={{ color: "var(--fg-subtle)" }}>↪</span>
      <span style={{ fontStyle: line.kind === "note" ? "italic" : "normal" }}>
        {line.text}
      </span>
    </div>
  );
}

interface MetricRowProps {
  label: string;
  value: string | undefined;
  valueColor?: string;
}

function MetricRow({ label, value, valueColor = "var(--fg)" }: MetricRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        padding: "5px 0",
        fontSize: 12,
      }}
    >
      <span style={{ color: "var(--fg-muted)" }}>{label}</span>
      <span
        style={{
          color: valueColor,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
        }}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

function RelatedBlock({
  related,
}: {
  related: NonNullable<PortfolioProject["related"]>;
}) {
  const track = trackById(related.track);
  return (
    <>
      <SectionLabel>Related</SectionLabel>
      <div
        style={{
          fontSize: 12.5,
          color: "var(--fg-muted)",
          lineHeight: 1.55,
        }}
      >
        {related.note}{" "}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{ color: track?.fg ?? "var(--fg)" }}
        >
          {related.label}
        </a>{" "}
        in {track?.label ?? related.track}.
      </div>
    </>
  );
}
