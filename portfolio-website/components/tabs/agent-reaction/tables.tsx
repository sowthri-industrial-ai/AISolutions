"use client";

// § TABLES — three stacked periodic tables (Anatomy / Roles / Knowledge).
// Each cell shows atomic number, 2-letter abbreviation, and full name.
// Lit cells are tinted in the project's track color; others are inert.

import { Tipped } from "@/components/tabs/agent-reaction/tipped";
import {
  T1N,
  T2N,
  T3N,
  type AgentReaction,
  type Element,
  type NumberedRow,
} from "@/lib/agent-reaction-data";
import type { TrackMeta } from "@/lib/tracks";

interface TablesSectionProps {
  reaction: AgentReaction;
  track: TrackMeta;
}

export function TablesSection({ reaction, track }: TablesSectionProps) {
  const tables = [
    { num: 1, title: "Agent Anatomy", sub: "What's inside each agent.",                 data: T1N, lit: reaction.table1Lit },
    { num: 2, title: "Agent Roles",   sub: "What functional category each agent fits.", data: T2N, lit: reaction.table2Lit },
    { num: 3, title: "Knowledge",     sub: "What knowledge sources the agents draw on.",data: T3N, lit: reaction.table3Lit },
  ] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {tables.map((t) => {
        const litSet = new Set(t.lit);
        const totalEl = t.data.reduce((n, r) => n + r.elements.length, 0);
        return (
          <div key={t.num}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 2 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--fg)" }}>
                Table {t.num}: {t.title}
              </h3>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--fg-subtle)",
                }}
              >
                {t.data.length} rows · {totalEl} elements · {litSet.size} lit
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--fg-muted)", marginBottom: 10 }}>
              {t.sub}
            </div>
            <PeriodicTable table={t.data} litSet={litSet} track={track} />
          </div>
        );
      })}
    </div>
  );
}

interface PeriodicTableProps {
  table: NumberedRow[];
  litSet: Set<string>;
  track: TrackMeta;
}

function PeriodicTable({ table, litSet, track }: PeriodicTableProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {table.map((r) => (
        <div key={r.row} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Tipped tip={<div style={{ color: "var(--fg-muted)" }}>{r.desc}</div>}>
            <div
              style={{
                width: 100,
                textAlign: "right",
                fontSize: 11.5,
                color: "var(--fg-muted)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "-0.01em",
              }}
            >
              {r.row}
            </div>
          </Tipped>
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {r.elements.map((el) => (
              <ElementCell
                key={el.c + el.num}
                element={el}
                rowName={r.row}
                lit={litSet.has(el.c)}
                track={track}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ElementCellProps {
  element: Element;
  rowName: string;
  lit: boolean;
  track: TrackMeta;
}

export function ElementCell({ element, rowName, lit, track }: ElementCellProps) {
  const trackColor = track.color;
  const tip = (
    <div>
      <div style={{ fontWeight: 500, marginBottom: 2 }}>
        {element.c} · {element.n}
      </div>
      <div style={{ color: "var(--fg-muted)", fontSize: 11 }}>{rowName}</div>
      <div
        style={{
          marginTop: 6,
          paddingTop: 5,
          borderTop: "0.5px solid var(--border-token)",
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          color: lit ? trackColor : "var(--fg-subtle)",
        }}
      >
        {lit ? "lit · used in this project" : "unused here"}
      </div>
    </div>
  );

  return (
    <Tipped tip={tip}>
      <div
        style={{
          position: "relative",
          width: 36,
          height: 40,
          borderRadius: 3,
          border:
            "0.5px solid " +
            (lit
              ? `color-mix(in srgb, ${trackColor} 60%, transparent)`
              : "var(--border-token)"),
          background: lit
            ? `color-mix(in srgb, ${trackColor} 22%, transparent)`
            : "var(--bg-subtle)",
          color: lit ? "var(--fg)" : "var(--fg-subtle)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "default",
          overflow: "hidden",
          transition: "transform .12s, border-color .12s, background .12s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {lit && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: 0,
              top: 4,
              bottom: 4,
              width: 1,
              background: trackColor,
            }}
          />
        )}
        <span
          style={{
            position: "absolute",
            left: 3,
            top: 2,
            fontSize: 9,
            fontFamily: "var(--font-mono)",
            color: "var(--fg-subtle)",
            lineHeight: 1,
          }}
        >
          {element.num}
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1,
            marginTop: 4,
            letterSpacing: "-0.005em",
          }}
        >
          {element.c}
        </span>
        <span
          style={{
            fontSize: 9,
            color: "var(--fg-muted)",
            marginTop: 3,
            maxWidth: 32,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {element.n}
        </span>
      </div>
    </Tipped>
  );
}
