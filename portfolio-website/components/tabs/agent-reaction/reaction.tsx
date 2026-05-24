"use client";

// § REACTION — Graph (topology) and Sequence (canonical run) views with
// a small pill toggle. Graph is the default per CD: it answers "what is
// this system?" before Sequence answers "how does it run?".

import { useState } from "react";
import type {
  AgentReaction,
  ReactionEdge,
  ReactionPhase,
  SequenceStep,
} from "@/lib/agent-reaction-data";
import { T2N } from "@/lib/agent-reaction-data";
import type { TrackMeta } from "@/lib/tracks";

type Mode = "graph" | "sequence";

interface ReactionSectionProps {
  reaction: AgentReaction;
  track: TrackMeta;
  onCompoundClick: (name: string) => void;
}

export function ReactionSection({
  reaction,
  track,
  onCompoundClick,
}: ReactionSectionProps) {
  // Default Graph — locked because Graph answers "what is this system?"
  // before Sequence answers "how does it run?" (CD chat decision).
  const [mode, setMode] = useState<Mode>("graph");

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            flex: 1,
            fontSize: 12.5,
            color: "var(--fg-muted)",
            maxWidth: "56ch",
          }}
        >
          How the compounds react. Toggle between the topology (who talks to
          whom) and the canonical run (one execution trace).
        </div>
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      <div
        style={{
          border: "0.5px solid var(--border-token)",
          borderRadius: 6,
          background: "var(--bg-subtle)",
          padding: 18,
          overflow: "auto",
        }}
      >
        {mode === "graph" ? (
          <GraphView reaction={reaction} track={track} onNodeClick={onCompoundClick} />
        ) : (
          <SequenceView reaction={reaction} />
        )}
      </div>
    </div>
  );
}

interface ModeToggleProps {
  mode: Mode;
  onChange: (next: Mode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const opts: Array<{ id: Mode; label: string }> = [
    { id: "graph",    label: "Graph" },
    { id: "sequence", label: "Sequence" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Reaction view"
      data-testid="reaction-mode-toggle"
      style={{
        height: 28,
        display: "inline-flex",
        padding: 2,
        background: "var(--bg-subtle)",
        border: "0.5px solid var(--border-token)",
        borderRadius: 5,
      }}
    >
      {opts.map((o) => {
        const isActive = mode === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-testid={`reaction-mode-${o.id}`}
            onClick={() => onChange(o.id)}
            style={{
              padding: "0 12px",
              height: "100%",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              color: isActive ? "var(--fg)" : "var(--fg-muted)",
              background: isActive ? "var(--bg-elevated)" : "transparent",
              border:
                "0.5px solid " +
                (isActive ? "var(--border-token)" : "transparent"),
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------- Graph view ----------------

const GRAPH_LAYOUT: Record<string, { x: number; y: number; primary?: boolean; external?: boolean }> = {
  "Procurement Planner":  { x: 280, y: 30,  primary: true },
  "Inventory Analyst":    { x: 80,  y: 180 },
  "Supplier Researcher":  { x: 280, y: 180 },
  "Lead-time Forecaster": { x: 480, y: 180 },
  "Decision Critic":      { x: 170, y: 340 },
  "Order Approver":       { x: 390, y: 340 },
  human:                  { x: 390, y: 470, external: true },
};
const NODE_W = 148;
const NODE_H = 54;
const HUMAN_W = 88;
const HUMAN_H = 30;
const REVIEW_AGENT_NAMES = new Set(["Decision Critic", "Order Approver"]);

interface GraphViewProps {
  reaction: AgentReaction;
  track: TrackMeta;
  onNodeClick: (name: string) => void;
}

function GraphView({ reaction, track, onNodeClick }: GraphViewProps) {
  const [hover, setHover] = useState<string | null>(null);
  const width = 660;
  const height = 560;

  const planner = reaction.compounds.find((c) => c.baseRole === "Pl");
  const plannerName = planner?.name ?? "";

  const dimsOf = (name: string) => {
    const layout = GRAPH_LAYOUT[name];
    return layout && layout.external
      ? { w: HUMAN_W, h: HUMAN_H }
      : { w: NODE_W, h: NODE_H };
  };
  const centerOf = (name: string): { x: number; y: number } | null => {
    const p = GRAPH_LAYOUT[name];
    if (!p) return null;
    const { w, h } = dimsOf(name);
    return { x: p.x + w / 2, y: p.y + h / 2 };
  };

  const edgeKey = (e: ReactionEdge) => `${e.from}→${e.to}`;
  const reverseKey = (e: ReactionEdge) => `${e.to}→${e.from}`;
  const edgeSet = new Set(reaction.edges.map(edgeKey));

  // Planner ↔ Review edges get a hard S-curve that bows around the info row.
  const isReviewEdge = (e: ReactionEdge) =>
    (e.from === plannerName && REVIEW_AGENT_NAMES.has(e.to)) ||
    (e.to === plannerName && REVIEW_AGENT_NAMES.has(e.from));

  return (
    <div style={{ position: "relative" }} className="fade-up">
      <svg
        width={width}
        height={height}
        style={{ display: "block", overflow: "visible" }}
        aria-label="Agent topology"
      >
        <defs>
          <marker
            id="arrow-default"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="var(--fg-subtle)" />
          </marker>
          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill={track.color} />
          </marker>
        </defs>

        {/* Edges */}
        {reaction.edges.map((e, i) => {
          const a = centerOf(e.from);
          const b = centerOf(e.to);
          if (!a || !b) return null;
          const dimsA = dimsOf(e.from);
          const dimsB = dimsOf(e.to);
          const hasReverse = edgeSet.has(reverseKey(e));
          const isHover = hover !== null && (hover === e.from || hover === e.to);
          const review = isReviewEdge(e);

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const offset = hasReverse ? 7 : 0;
          const flip = e.from < e.to ? 1 : -1;
          const nx = (-dy / len) * offset * flip;
          const ny = (dx / len) * offset * flip;

          const ax = a.x + (dx / len) * (dimsA.w / 2 + 4) + nx;
          const ay = a.y + (dy / len) * (dimsA.h / 2 + 4) + ny;
          const bx = b.x - (dx / len) * (dimsB.w / 2 + 4) + nx;
          const by = b.y - (dy / len) * (dimsB.h / 2 + 4) + ny;

          let d: string;
          if (review) {
            // S-bezier routing AROUND the info-agent row: the bow sits on
            // whichever side of the planner the review agent lives.
            const reviewName = e.from === plannerName ? e.to : e.from;
            const reviewCenter = centerOf(reviewName);
            const plannerCenter = centerOf(plannerName);
            const side = reviewCenter && plannerCenter && reviewCenter.x < plannerCenter.x ? -1 : 1;
            const BOW = 150;
            const cp1 = { x: ax + side * BOW, y: ay + (by - ay) * 0.15 };
            const cp2 = { x: bx + side * BOW, y: ay + (by - ay) * 0.85 };
            d = `M ${ax} ${ay} C ${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${bx} ${by}`;
          } else {
            const mx = (ax + bx) / 2 + nx * 1.2;
            const my = (ay + by) / 2 + ny * 1.2;
            d = `M ${ax} ${ay} Q ${mx} ${my} ${bx} ${by}`;
          }

          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={isHover ? track.color : "var(--fg-subtle)"}
              strokeWidth={isHover ? 1.25 : 1}
              opacity={hover && !isHover ? 0.22 : 0.9}
              markerEnd={isHover ? "url(#arrow-active)" : "url(#arrow-default)"}
              style={{ transition: "stroke .14s, opacity .14s" }}
            />
          );
        })}

        {/* Compound nodes */}
        {Object.entries(GRAPH_LAYOUT).map(([name, p]) => {
          if (p.external) return null;
          const cmp = reaction.compounds.find((c) => c.name === name);
          if (!cmp) return null;
          const isHover = hover === name;
          const isPrimary = !!p.primary;
          return (
            <g
              key={name}
              transform={`translate(${p.x}, ${p.y})`}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHover(name)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onNodeClick(name)}
            >
              {isHover && (
                <rect
                  x={-3}
                  y={-3}
                  width={NODE_W + 6}
                  height={NODE_H + 6}
                  rx={7}
                  fill="none"
                  stroke={track.color}
                  strokeWidth={2}
                  opacity={0.5}
                />
              )}
              <rect
                x={0}
                y={0}
                width={NODE_W}
                height={NODE_H}
                rx={5}
                fill={`color-mix(in srgb, ${track.color} ${isPrimary ? 22 : 15}%, var(--bg-elevated))`}
                stroke={`color-mix(in srgb, ${track.color} ${isPrimary ? 70 : 50}%, transparent)`}
                strokeWidth={isPrimary ? 1 : 0.5}
              />
              <text
                x={NODE_W / 2}
                y={22}
                textAnchor="middle"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12.5,
                  fontWeight: 500,
                  fill: "var(--fg)",
                }}
              >
                {cmp.name}
              </text>
              <text
                x={NODE_W / 2}
                y={40}
                textAnchor="middle"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  fill: "var(--fg-muted)",
                }}
              >
                {cmp.baseRole} · {roleNameOf(cmp.baseRole)}
              </text>
            </g>
          );
        })}

        {/* Human node — smaller, dashed, italic */}
        {GRAPH_LAYOUT["human"] && (
          <g transform={`translate(${GRAPH_LAYOUT["human"].x}, ${GRAPH_LAYOUT["human"].y})`}>
            <rect
              x={0}
              y={0}
              width={HUMAN_W}
              height={HUMAN_H}
              rx={HUMAN_H / 2}
              fill="var(--bg-elevated)"
              stroke="var(--border-strong)"
              strokeDasharray="3 3"
              strokeWidth={0.75}
            />
            <text
              x={HUMAN_W / 2}
              y={HUMAN_H / 2 + 4}
              textAnchor="middle"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontStyle: "italic",
                fill: "var(--fg-muted)",
                letterSpacing: "0.02em",
              }}
            >
              human
            </text>
          </g>
        )}
      </svg>

      <div
        style={{
          marginTop: 8,
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          color: "var(--fg-subtle)",
          letterSpacing: "0.02em",
        }}
      >
        {reaction.compounds.length} compounds · {reaction.edges.length} edges ·
        hover any node to highlight its bonds
      </div>
    </div>
  );
}

function roleNameOf(code: string): string {
  for (const r of T2N) {
    const el = r.elements.find((e) => e.c === code);
    if (el) return el.n;
  }
  return code;
}

// ---------------- Sequence view ----------------

const ROW_H = 16;       // intra-step (parallel siblings)
const STEP_GAP = 10;    // between consecutive steps in the same phase
const PHASE_GAP = 16;   // between phases
const HEADER_H = 70;
const TOP_PAD = 18;
const LANE_W = 116;
const LEFT_GUTTER = 96;
const RIGHT_GUTTER = 96;

type LaidOutRow = SequenceStep & { y: number; index: number };

/**
 * Pure layout pass: y-coordinate per sequence message, lane order
 * (Planner leftmost, externals last), and the phase-id-per-step map.
 *
 * Lifted out of the SequenceView component because the React 19 compiler
 * flags mutating a `let y` accumulator inside a component body as a
 * post-render reassignment risk. A plain function is the cleanest fix.
 */
function layoutSequence(reaction: AgentReaction): {
  rows: LaidOutRow[];
  lanes: string[];
  compoundOrder: string[];
  phaseOfStep: Record<number, string>;
} {
  const compounds = reaction.compounds;
  const planner = compounds.find((c) => c.baseRole === "Pl");
  const plannerName = planner?.name ?? "";

  const compoundOrder = [
    ...(plannerName ? [plannerName] : []),
    ...compounds.map((c) => c.name).filter((n) => n !== plannerName),
  ];

  const extra: string[] = [];
  reaction.sequence.forEach((s) => {
    [s.from, s.to].forEach((n) => {
      if (!compoundOrder.includes(n) && !extra.includes(n)) extra.push(n);
    });
  });
  const lanes = [...compoundOrder, ...extra];

  const phaseOfStep: Record<number, string> = {};
  (reaction.phases ?? []).forEach((p) =>
    p.steps.forEach((s) => {
      phaseOfStep[s] = p.id;
    }),
  );

  let y = HEADER_H + TOP_PAD;
  const rows: LaidOutRow[] = reaction.sequence.map((s, i) => {
    if (i > 0) {
      const prev = reaction.sequence[i - 1];
      if (prev.step !== s.step) {
        const prevPhase = phaseOfStep[prev.step];
        const curPhase = phaseOfStep[s.step];
        y += ROW_H + (prevPhase !== curPhase ? PHASE_GAP : STEP_GAP);
      } else {
        y += ROW_H;
      }
    }
    return { ...s, y, index: i };
  });

  return { rows, lanes, compoundOrder, phaseOfStep };
}

function SequenceView({ reaction }: { reaction: AgentReaction }) {
  const { rows, lanes, compoundOrder } = layoutSequence(reaction);
  const planner = reaction.compounds.find((c) => c.baseRole === "Pl");
  const plannerName = planner?.name ?? "";

  const bottomY = rows.length ? rows[rows.length - 1].y + ROW_H : HEADER_H + TOP_PAD;
  const TOTAL_H = bottomY + 24;
  const TOTAL_W = LEFT_GUTTER + lanes.length * LANE_W + RIGHT_GUTTER;

  // Step → row indexes (for parallel-cluster bracket).
  const stepToRows: Record<number, Array<(typeof rows)[number]>> = {};
  rows.forEach((r) => {
    (stepToRows[r.step] ??= []).push(r);
  });

  const phases: ReactionPhase[] = reaction.phases ?? [];
  const phaseRanges = phases
    .map((p) => {
      const stepRows = rows.filter((r) => p.steps.includes(r.step));
      if (!stepRows.length) return null;
      const minY = Math.min(...stepRows.map((r) => r.y)) - 4;
      const maxY = Math.max(...stepRows.map((r) => r.y)) + ROW_H - 4;
      return { ...p, top: minY, bottom: maxY };
    })
    .filter((p): p is ReactionPhase & { top: number; bottom: number } => p !== null);

  return (
    <div className="fade-up">
      {reaction.scenario && (
        <div
          style={{
            fontSize: 13,
            color: "var(--fg-muted)",
            fontStyle: "italic",
            marginBottom: 16,
            maxWidth: "64ch",
            lineHeight: 1.55,
          }}
        >
          {reaction.scenario}
        </div>
      )}

      <div style={{ position: "relative", overflow: "auto" }}>
        <div style={{ position: "relative", width: TOTAL_W, height: TOTAL_H }}>
          {/* Phase brackets (left gutter) */}
          {phaseRanges.map((p) => (
            <div
              key={p.id}
              style={{
                position: "absolute",
                left: 8,
                top: p.top,
                width: LEFT_GUTTER - 20,
                height: p.bottom - p.top,
                display: "flex",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 1,
                  background: "color-mix(in srgb, var(--fg-subtle) 70%, transparent)",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", paddingTop: 2 }}>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--fg-muted)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.label}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--fg-subtle)",
                    fontFamily: "var(--font-mono)",
                    marginTop: 2,
                  }}
                >
                  {p.steps.length === 1
                    ? `step ${p.steps[0]}`
                    : `steps ${Math.min(...p.steps)}–${Math.max(...p.steps)}`}
                </div>
              </div>
            </div>
          ))}

          {/* Elapsed-time annotations (right gutter) */}
          {phaseRanges.map(
            (p) =>
              p.duration && (
                <div
                  key={`dur-${p.id}`}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: p.top,
                    width: RIGHT_GUTTER - 20,
                    height: p.bottom - p.top,
                    display: "flex",
                    gap: 8,
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      paddingTop: 2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10.5,
                        fontFamily: "var(--font-mono)",
                        color: "var(--fg-muted)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {p.duration}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 1,
                      background: "color-mix(in srgb, var(--fg-subtle) 70%, transparent)",
                    }}
                  />
                </div>
              ),
          )}

          {/* Lane headers */}
          {lanes.map((name, i) => {
            const isExtra = !compoundOrder.includes(name);
            const isPlanner = name === plannerName;
            return (
              <div
                key={name}
                style={{
                  position: "absolute",
                  left: LEFT_GUTTER + i * LANE_W,
                  top: 0,
                  width: LANE_W,
                  height: HEADER_H,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingBottom: 8,
                  borderBottom: "0.5px solid var(--border-token)",
                }}
              >
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: isPlanner ? 600 : 500,
                    color: isExtra ? "var(--fg-muted)" : "var(--fg)",
                    textAlign: "center",
                    lineHeight: 1.25,
                    padding: "0 6px",
                    fontStyle: isExtra ? "italic" : "normal",
                  }}
                >
                  {name}
                </div>
              </div>
            );
          })}

          {/* Lane lines */}
          {lanes.map((name, i) => (
            <div
              key={`line-${name}`}
              style={{
                position: "absolute",
                left: LEFT_GUTTER + i * LANE_W + LANE_W / 2,
                top: HEADER_H,
                bottom: 0,
                width: 0,
                borderLeft: "0.5px dashed var(--border-token)",
              }}
            />
          ))}

          {/* Messages */}
          <svg
            width={TOTAL_W}
            height={TOTAL_H}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            aria-label="Canonical run sequence"
          >
            <defs>
              <marker
                id="seq-arrow-out"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 Z" fill="var(--fg)" />
              </marker>
              <marker
                id="seq-arrow-in"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 Z" fill="var(--fg-muted)" />
              </marker>
            </defs>

            {/* Faint parallel-cluster bracket beside each multi-message step */}
            {Object.entries(stepToRows).map(([step, stepRows]) => {
              if (stepRows.length <= 1) return null;
              const y0 = stepRows[0].y - 2;
              const y1 = stepRows[stepRows.length - 1].y + 2;
              return (
                <line
                  key={`cluster-${step}`}
                  x1={LEFT_GUTTER - 4}
                  y1={y0}
                  x2={LEFT_GUTTER - 4}
                  y2={y1}
                  stroke="color-mix(in srgb, var(--fg-subtle) 50%, transparent)"
                  strokeWidth={1}
                />
              );
            })}

            {rows.map((s: SequenceStep & { y: number; index: number }) => {
              const fi = lanes.indexOf(s.from);
              const ti = lanes.indexOf(s.to);
              if (fi < 0 || ti < 0) return null;
              const yy = s.y;
              const xa = LEFT_GUTTER + fi * LANE_W + LANE_W / 2;
              const xb = LEFT_GUTTER + ti * LANE_W + LANE_W / 2;
              const labelX = (xa + xb) / 2;
              const outbound = s.from === plannerName;
              const stroke = outbound ? "var(--fg)" : "var(--fg-muted)";
              const dash = outbound ? undefined : "3 3";
              const marker = outbound ? "url(#seq-arrow-out)" : "url(#seq-arrow-in)";
              return (
                <g key={s.index}>
                  <line
                    x1={xa}
                    y1={yy}
                    x2={xb}
                    y2={yy}
                    stroke={stroke}
                    strokeWidth={1}
                    strokeDasharray={dash}
                    markerEnd={marker}
                  />
                  <text
                    x={labelX}
                    y={yy - 4}
                    textAnchor="middle"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                      fill: outbound ? "var(--fg)" : "var(--fg-muted)",
                    }}
                  >
                    {s.message}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div
            style={{
              position: "absolute",
              right: 4,
              top: 4,
              display: "flex",
              gap: 14,
              fontSize: 10.5,
              fontFamily: "var(--font-mono)",
              color: "var(--fg-subtle)",
              letterSpacing: "0.02em",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <svg width="22" height="6">
                <line x1="0" y1="3" x2="22" y2="3" stroke="var(--fg)" strokeWidth="1" />
              </svg>
              outbound
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <svg width="22" height="6">
                <line
                  x1="0"
                  y1="3"
                  x2="22"
                  y2="3"
                  stroke="var(--fg-muted)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              </svg>
              response
            </span>
          </div>
        </div>
      </div>

      {reaction.totalDuration && (
        <div
          style={{
            marginTop: 8,
            paddingTop: 10,
            borderTop: "0.5px solid var(--border-token)",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "baseline",
            gap: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            paddingRight: 16,
          }}
        >
          <span style={{ color: "var(--fg)" }}>{reaction.totalDuration}</span>
          {reaction.baselineNote && (
            <span style={{ color: "var(--fg-subtle)" }}>{reaction.baselineNote}</span>
          )}
        </div>
      )}
    </div>
  );
}
