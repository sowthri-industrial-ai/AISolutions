"use client";

// § COMPOSITIONS — Matrix 1 (Element Birth: Anatomy × Role) and
// Matrix 2 (Compounds: Knowledge × Element).
//
// Matrix 1 birth-grid: each compound occupies one (anatomy_row,
// role_col) cell. Lit cells expand to 80×80; everything else stays
// 32×32 inert. The rows AND columns that contain a birth expand to
// 80px to give the grid its rhythm.
//
// Matrix 2 compound matrix: columns are deployed agents, rows are the
// lit T3 knowledge elements. Cells are filled where the compound bonds
// with the knowledge.

import { useState } from "react";
import { Tipped } from "@/components/tabs/agent-reaction/tipped";
import { SubHeading } from "@/components/tabs/agent-reaction/anchor-nav";
import {
  T1N,
  T2N,
  T3N,
  type AgentReaction,
  type Compound,
} from "@/lib/agent-reaction-data";
import type { TrackMeta } from "@/lib/tracks";

interface Matrix1Props {
  reaction: AgentReaction;
  track: TrackMeta;
}

const ROW_LG = 80;
const ROW_SM = 32;
const COL_LG = 80;
const COL_SM = 32;
const GRID_GAP = 1;
const LABEL_COL_W = 110;
const HEADER_ROW_H = 90;

export function Matrix1({ reaction, track }: Matrix1Props) {
  const compounds = reaction.compounds;

  // Resolve birth coordinates: (anatomy row index, role col index) per compound.
  const births = compounds
    .map((cmp, i) => {
      const anatomyIdx = T1N.findIndex((r) => r.row === cmp.birthAnatomy);
      const roleIdx = T2N.findIndex((r) => r.elements.some((e) => e.c === cmp.baseRole));
      return { cmp, atomic: i + 1, ai: anatomyIdx, ri: roleIdx };
    })
    .filter((b) => b.ai >= 0 && b.ri >= 0);

  const birthAt = new Map<string, (typeof births)[number]>();
  births.forEach((b) => birthAt.set(`${b.ai}:${b.ri}`, b));

  const litRows = new Set(births.map((b) => b.ai));
  const litCols = new Set(births.map((b) => b.ri));

  const colWidths = T2N.map((_, j) => (litCols.has(j) ? COL_LG : COL_SM));
  const rowHeights = T1N.map((_, i) => (litRows.has(i) ? ROW_LG : ROW_SM));

  const gridTemplateColumns =
    `${LABEL_COL_W}px ` + colWidths.map((w) => `${w}px`).join(" ");
  const gridTemplateRows =
    `${HEADER_ROW_H}px ` + rowHeights.map((h) => `${h}px`).join(" ");

  return (
    <div style={{ marginBottom: 40 }}>
      <SubHeading sub="The 6 agents are born here. Each occupies its defining (anatomy, role) coordinate. Most cells stay gray; only the 6 birth cells are lit.">
        Matrix 1: Element Birth — Anatomy × Role
      </SubHeading>

      <div style={{ overflowX: "auto", paddingBottom: 6 }}>
        <div
          role="grid"
          aria-label="Element birth matrix"
          style={{
            display: "grid",
            gridTemplateColumns,
            gridTemplateRows,
            gap: GRID_GAP,
          }}
        >
          {/* Top-left empty corner */}
          <div style={{ gridColumn: "1 / 2", gridRow: "1 / 2" }} />

          {/* Column headers — rotated 35° */}
          {T2N.map((c, j) => {
            const isLit = litCols.has(j);
            return (
              <div
                key={`col-${c.row}`}
                style={{
                  gridColumn: `${j + 2} / ${j + 3}`,
                  gridRow: "1 / 2",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: 4,
                }}
              >
                <div
                  style={{
                    transform: "rotate(-35deg)",
                    transformOrigin: "left bottom",
                    whiteSpace: "nowrap",
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    color: isLit ? "var(--fg)" : "var(--fg-subtle)",
                    fontWeight: isLit ? 500 : 400,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {c.row}
                </div>
              </div>
            );
          })}

          {/* Row labels */}
          {T1N.map((r, i) => {
            const isLit = litRows.has(i);
            return (
              <div
                key={`row-${r.row}`}
                style={{
                  gridColumn: "1 / 2",
                  gridRow: `${i + 2} / ${i + 3}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 10,
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: isLit ? "var(--fg)" : "var(--fg-subtle)",
                  fontWeight: isLit ? 500 : 400,
                  whiteSpace: "nowrap",
                }}
              >
                {r.row}
              </div>
            );
          })}

          {/* Cells: 11 × 7 = 77 */}
          {T1N.map((r, i) =>
            T2N.map((c, j) => {
              const birth = birthAt.get(`${i}:${j}`);
              const key = `cell-${i}-${j}`;
              const baseProps = {
                gridColumn: `${j + 2} / ${j + 3}`,
                gridRow: `${i + 2} / ${i + 3}`,
              };
              if (birth) {
                return (
                  <div
                    key={key}
                    style={{ ...baseProps, display: "grid", placeItems: "center" }}
                  >
                    <BirthCell
                      birth={birth}
                      track={track}
                      anatomyRow={r.row}
                      roleRow={c.row}
                    />
                  </div>
                );
              }
              return (
                <div
                  key={key}
                  style={{ ...baseProps, display: "grid", placeItems: "center" }}
                >
                  <div
                    style={{
                      width: ROW_SM,
                      height: COL_SM,
                      background: "var(--bg)",
                      border: "0.5px solid var(--border-token)",
                      borderRadius: 3,
                    }}
                  />
                </div>
              );
            }),
          )}
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            color: "var(--fg-subtle)",
            letterSpacing: "0.02em",
          }}
        >
          6 births · 71 inert cells · expanded rows mark anatomy that defines an agent
        </div>
      </div>
    </div>
  );
}

interface BirthCellProps {
  birth: { cmp: Compound; atomic: number };
  track: TrackMeta;
  anatomyRow: string;
  roleRow: string;
}

function BirthCell({ birth, track, anatomyRow, roleRow }: BirthCellProps) {
  const tip = (
    <div>
      <div style={{ fontWeight: 500, marginBottom: 4 }}>
        Born from {anatomyRow} × {roleRow}.
      </div>
      <div style={{ color: "var(--fg-muted)", fontSize: 11.5, lineHeight: 1.45 }}>
        This is what makes{" "}
        <span style={{ color: "var(--fg)" }}>{birth.cmp.name}</span> this agent
        and not another.
      </div>
    </div>
  );
  return (
    <Tipped tip={tip} asBlock>
      <div
        style={{
          position: "relative",
          width: 80,
          height: 80,
          background: `color-mix(in srgb, ${track.color} 22%, transparent)`,
          border: `1px solid color-mix(in srgb, ${track.color} 70%, transparent)`,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 4px 6px",
          cursor: "default",
          transition: "transform .14s, border-color .14s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.borderColor = `color-mix(in srgb, ${track.color} 95%, transparent)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = `color-mix(in srgb, ${track.color} 70%, transparent)`;
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 5,
            top: 4,
            fontSize: 9,
            fontFamily: "var(--font-mono)",
            color: "var(--fg-subtle)",
            lineHeight: 1,
          }}
        >
          {birth.atomic}
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "var(--fg)",
            lineHeight: 1,
            marginTop: 6,
            letterSpacing: "-0.01em",
          }}
        >
          {birth.cmp.baseRole}
        </span>
        <span
          style={{
            fontSize: 10,
            color: "var(--fg-muted)",
            textAlign: "center",
            lineHeight: 1.2,
            marginTop: 6,
            padding: "0 2px",
            maxHeight: 26,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {birth.cmp.name}
        </span>
      </div>
    </Tipped>
  );
}

interface Matrix2Props {
  reaction: AgentReaction;
  track: TrackMeta;
  onCompoundClick: (name: string) => void;
}

export function Matrix2({ reaction, track, onCompoundClick }: Matrix2Props) {
  const compounds = reaction.compounds;
  const litT3 = new Set(reaction.table3Lit);

  // Only show T3 rows where there is at least one lit element, and within
  // each row only the lit elements — keeps the matrix compact.
  const visibleRows = T3N
    .map((r) => ({ ...r, elements: r.elements.filter((e) => litT3.has(e.c)) }))
    .filter((r) => r.elements.length > 0);

  const baseRoleLabel = (code: string) => {
    for (const row of T2N) {
      const el = row.elements.find((e) => e.c === code);
      if (el) return { row: row.row, name: el.n };
    }
    return null;
  };

  const cellSize = 28;
  const cellGap = 1;
  const colWidth = cellSize + cellGap + 22;
  const rowLabelW = 200;

  const [hoverCompound, setHoverCompound] = useState<string | null>(null);
  const [hoverElement, setHoverElement] = useState<string | null>(null);

  return (
    <div>
      <SubHeading sub="Knowledge sources bond with elements to form compounds. Each column is one deployed agent.">
        Matrix 2: Compounds — Knowledge × Element
      </SubHeading>

      <div style={{ display: "flex", flexDirection: "column", overflowX: "auto", paddingBottom: 6 }}>
        {/* Column headers — compound names + base-role badges */}
        <div style={{ display: "flex", alignItems: "flex-end", height: 150, marginLeft: rowLabelW }}>
          {compounds.map((cmp) => {
            const role = baseRoleLabel(cmp.baseRole);
            const isHover = hoverCompound === cmp.name;
            return (
              <div
                key={cmp.name}
                onMouseEnter={() => setHoverCompound(cmp.name)}
                onMouseLeave={() => setHoverCompound(null)}
                onClick={() => onCompoundClick(cmp.name)}
                style={{
                  width: colWidth,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  cursor: "pointer",
                  height: "100%",
                  gap: 4,
                }}
              >
                <Tipped tip={role ? <span>Base role: <b>{role.name}</b> · {role.row}</span> : null}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 3,
                      background: `color-mix(in srgb, ${track.color} 22%, transparent)`,
                      border: `0.5px solid color-mix(in srgb, ${track.color} 50%, transparent)`,
                      color: track.fg,
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: "var(--font-mono)",
                      display: "grid",
                      placeItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    {cmp.baseRole}
                  </div>
                </Tipped>
                <div
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    fontSize: 11.5,
                    fontWeight: isHover ? 500 : 400,
                    color: isHover ? "var(--fg)" : "var(--fg-muted)",
                    whiteSpace: "nowrap",
                    paddingBottom: 4,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {cmp.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rows: grouped by T3 row */}
        {visibleRows.map((r, ri) => (
          <div key={r.row}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 22,
                marginTop: ri === 0 ? 0 : 6,
              }}
            >
              <div
                style={{
                  width: rowLabelW,
                  textAlign: "right",
                  paddingRight: 12,
                  fontSize: 10.5,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--fg-subtle)",
                  fontWeight: 500,
                }}
              >
                {r.row}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 0,
                  borderTop: "0.5px dashed var(--border-token)",
                }}
              />
            </div>
            {r.elements.map((el) => {
              const elKey = `${el.c}:${r.row}`;
              const isElHover = hoverElement === elKey;
              return (
                <div
                  key={elKey}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: cellSize + cellGap,
                  }}
                >
                  <div
                    onMouseEnter={() => setHoverElement(elKey)}
                    onMouseLeave={() => setHoverElement(null)}
                    style={{
                      width: rowLabelW,
                      textAlign: "right",
                      paddingRight: 12,
                      fontSize: 11.5,
                      fontFamily: "var(--font-sans)",
                      color: isElHover ? "var(--fg)" : "var(--fg-muted)",
                      whiteSpace: "nowrap",
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 6,
                      alignItems: "center",
                      cursor: "default",
                    }}
                  >
                    <span style={{ color: "var(--fg-subtle)", fontFamily: "var(--font-mono)" }}>
                      {el.c}
                    </span>
                    <span>{el.n}</span>
                  </div>
                  {compounds.map((cmp) => {
                    const uses = cmp.knowledge.includes(el.c);
                    const highlightCol = hoverCompound === cmp.name;
                    const highlightRow = isElHover;
                    const tip = (
                      <div>
                        <div style={{ fontWeight: 500, marginBottom: 2 }}>
                          {cmp.name} × {el.n}
                        </div>
                        <div style={{ color: "var(--fg-muted)", fontSize: 11 }}>
                          {uses ? "bonded — knowledge source" : "no bond"}
                        </div>
                      </div>
                    );
                    return (
                      <div
                        key={cmp.name + el.c}
                        style={{
                          width: colWidth,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Tipped tip={tip}>
                          <div
                            style={{
                              width: cellSize,
                              height: cellSize,
                              borderRadius: 2,
                              background: uses
                                ? `color-mix(in srgb, ${track.color} 35%, transparent)`
                                : highlightCol || highlightRow
                                  ? "var(--bg-subtle)"
                                  : "transparent",
                              border: uses
                                ? `0.5px solid color-mix(in srgb, ${track.color} 60%, transparent)`
                                : "0.5px solid var(--border-token)",
                              transition: "background .12s",
                            }}
                          />
                        </Tipped>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
