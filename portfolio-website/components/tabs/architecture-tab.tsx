"use client";

// Architecture tab — six-layer stack with cross-cutting rails for
// Observability & Eval (left) and Security & Governance (right), and an
// infrastructure plinth running below the stack. Mirrors the CD bundle's
// ArchStack / ArchRail / ArchBand / ArchPlinth from src/content.jsx.
//
// Why a hand-built CSS grid instead of a flow graph library: the diagram
// is visually fixed and content-driven — six bands, two rails, one
// plinth, alternating tints, upward chevrons between bands. A grid keeps
// the order semantic (rails are siblings of the stack, not floating
// chrome) and reads cleanly in the DOM.

import Link from "next/link";
import type { ReactNode } from "react";
import {
  getProjectArchitecture,
  type ArchItem,
  type ArchLayer,
  type ArchPlinth,
  type ArchRail,
} from "@/lib/architecture-data";
import type { PortfolioProject } from "@/lib/projects";

interface ArchitectureTabProps {
  project: PortfolioProject;
}

export function ArchitectureTab({ project }: ArchitectureTabProps) {
  const arch = getProjectArchitecture(project.id);
  // Project base used for cross-tab links (e.g. the L4 "see Agent Reaction
  // tab →" callout). Derived in this component rather than passed from the
  // dispatcher so consumers don't need to know about the URL shape.
  const projectBase = `/control/${project.track}/${project.id}`;
  if (!arch) {
    return (
      <div className="prose fade-up">
        <h2>Architecture</h2>
        <p className="muted">
          No architecture diagram authored for {project.name} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="prose fade-up">
      <h2>System shape</h2>
      <p>
        {arch.systemShape.split("Agent Reaction").map((seg, i, arr) => (
          <span key={i}>
            {seg}
            {i < arr.length - 1 && (
              <span style={{ color: "var(--fg)" }}>Agent Reaction</span>
            )}
          </span>
        ))}
      </p>

      <ArchStack
        layers={arch.layers}
        leftRail={arch.leftRail}
        rightRail={arch.rightRail}
        plinth={arch.plinth}
        projectBase={projectBase}
      />

      <h3>Why this shape</h3>
      <p>{arch.whyThisShape}</p>
    </div>
  );
}

interface ArchStackProps {
  layers: ArchLayer[];
  leftRail: ArchRail;
  rightRail: ArchRail;
  plinth: ArchPlinth;
  projectBase: string;
}

function ArchStack({ layers, leftRail, rightRail, plinth, projectBase }: ArchStackProps) {
  return (
    <div
      style={{
        margin: "14px 0 22px",
        border: "0.5px solid var(--border-token)",
        borderRadius: 6,
        overflow: "hidden",
        background: "var(--bg)",
        display: "grid",
        gridTemplateColumns: "160px 1fr 160px",
        gridTemplateRows: "1fr auto",
      }}
    >
      <ArchRailColumn rail={leftRail} side="left" />

      <div style={{ gridColumn: "2 / 3", gridRow: "1 / 2" }}>
        {layers.map((layer, i) => (
          <span key={layer.id}>
            {i > 0 && <FlowChevron />}
            <ArchBand layer={layer} alt={i % 2 === 1} projectBase={projectBase} />
          </span>
        ))}
      </div>

      <ArchRailColumn rail={rightRail} side="right" />

      <ArchPlinthRow plinth={plinth} />
    </div>
  );
}

function ArchRailColumn({
  rail,
  side,
}: {
  rail: ArchRail;
  side: "left" | "right";
}) {
  const isLeft = side === "left";
  const innerEdge = isLeft
    ? { borderRight: "1px dashed var(--border-token)" }
    : { borderLeft:  "1px dashed var(--border-token)" };
  return (
    <aside
      style={{
        gridColumn: isLeft ? "1 / 2" : "3 / 4",
        gridRow: "1 / 2",
        background: "var(--bg-subtle)",
        padding: "20px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
        ...innerEdge,
      }}
    >
      <div style={{ marginBottom: 4 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--fg)",
            lineHeight: 1.3,
          }}
        >
          {rail.name}
        </div>
        <div
          style={{
            fontSize: 10.5,
            color: "var(--fg-muted)",
            fontFamily: "var(--font-mono)",
            marginTop: 4,
            letterSpacing: "0.02em",
          }}
        >
          {rail.purpose}
        </div>
      </div>
      {rail.items.map((item) => (
        <ArchCard key={item.name} item={item} compact />
      ))}
    </aside>
  );
}

function ArchPlinthRow({ plinth }: { plinth: ArchPlinth }) {
  return (
    <section
      style={{
        gridColumn: "1 / 4",
        gridRow: "2 / 3",
        background: "var(--bg-subtle)",
        borderTop: "0.5px dashed var(--border-strong)",
        padding: "18px 22px",
        display: "grid",
        gridTemplateColumns: "170px 1fr",
        gap: 22,
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--fg)",
          }}
        >
          {plinth.name}
        </div>
        <div
          style={{
            fontSize: 10.5,
            color: "var(--fg-muted)",
            fontFamily: "var(--font-mono)",
            marginTop: 4,
            letterSpacing: "0.02em",
          }}
        >
          {plinth.purpose}
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {plinth.items.map((item) => (
          <ArchCard key={item.name} item={item} />
        ))}
      </div>
    </section>
  );
}

function ArchBand({
  layer,
  alt,
  projectBase,
}: {
  layer: ArchLayer;
  alt: boolean;
  projectBase: string;
}) {
  return (
    <section
      style={{
        position: "relative",
        padding: "20px 22px",
        background: alt ? "var(--bg-subtle)" : "var(--bg)",
        display: "grid",
        gridTemplateColumns: "170px 1fr",
        gap: 22,
        alignItems: "start",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--fg-subtle)",
              letterSpacing: "0.06em",
            }}
          >
            L{layer.n}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--fg)",
            }}
          >
            {layer.name}
          </span>
        </div>
        <div
          style={{
            fontSize: 11.5,
            color: "var(--fg-muted)",
            lineHeight: 1.5,
            maxWidth: 150,
          }}
        >
          {layer.purpose}
        </div>
        {layer.crossLink && (
          <Link
            // crossLink.target is a tab slug (e.g. "agent-reaction"); joined
            // with projectBase to form a real /control/<track>/<slug>/<tab>
            // route. next/link gives us client-side navigation + prefetching.
            href={`${projectBase}/${layer.crossLink.target}`}
            style={{
              display: "inline-block",
              marginTop: 8,
              fontSize: 10.5,
              fontFamily: "var(--font-mono)",
              color: "var(--agentic)",
              letterSpacing: "0.02em",
            }}
          >
            {layer.crossLink.label}
          </Link>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {layer.items.map((item) => (
          <ArchCard key={item.name} item={item} />
        ))}
      </div>
    </section>
  );
}

function ArchCard({ item, compact = false }: { item: ArchItem; compact?: boolean }): ReactNode {
  return (
    <div
      title="not yet wired"
      style={{
        flex: item.wide ? "1 1 100%" : "0 0 auto",
        width: compact ? "100%" : undefined,
        minWidth: compact ? 0 : item.wide ? 0 : 160,
        background: "var(--bg-elevated)",
        border: "0.5px solid var(--border-token)",
        borderRadius: 5,
        padding: compact ? "8px 10px" : "10px 12px",
        cursor: "default",
        transition: "border-color .12s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-strong)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-token)";
      }}
    >
      <div
        style={{
          fontSize: compact ? 12 : 12.5,
          fontWeight: 500,
          color: "var(--fg)",
          letterSpacing: "-0.005em",
        }}
      >
        {item.name}
      </div>
      {item.sub && (
        <div
          style={{
            fontSize: compact ? 10.5 : 11,
            color: "var(--fg-muted)",
            marginTop: 2,
            lineHeight: 1.45,
          }}
        >
          {item.sub}
        </div>
      )}
    </div>
  );
}

function FlowChevron() {
  // Upward chevron between bands — communicates data direction without
  // taking layout room (height 14, centered overlay glyph).
  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        height: 14,
        borderTop: "0.5px solid var(--border-token)",
        background: "var(--bg)",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        style={{
          position: "absolute",
          left: "50%",
          top: -1,
          transform: "translate(-50%, -50%)",
          background: "var(--bg)",
          padding: "0 4px",
          boxSizing: "content-box",
        }}
      >
        <polyline
          points="3,9 7,4 11,9"
          fill="none"
          stroke="var(--fg-muted)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
