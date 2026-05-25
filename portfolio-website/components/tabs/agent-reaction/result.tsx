"use client";

// § RESULT — closing prose paragraph. When a compound name is clicked
// elsewhere in the tab, that compound's mentions here get a soft
// highlight so the visitor sees what they just touched.

import { Fragment } from "react";
import type { AgentReaction } from "@/lib/agent-reaction-data";

interface ResultSectionProps {
  reaction: AgentReaction;
  highlight: string | null;
}

interface MentionedSpan {
  name: string;
  text: string;
}

type ResultPart = string | MentionedSpan;

/**
 * Walk the narrative left-to-right, peeling off compound name mentions.
 * Returns an array of plain strings and compound-name spans, which the
 * renderer wraps with a highlight when the active highlight matches.
 */
function partsFromText(text: string, names: string[]): ResultPart[] {
  if (!names.length) return [text];
  // Longest names first so "Procurement Planner" wins over "Planner".
  const ordered = [...names].sort((a, b) => b.length - a.length);
  const parts: ResultPart[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    let cutIdx = -1;
    let cutLen = 0;
    let cutName: string | null = null;
    ordered.forEach((n) => {
      const i = remaining.toLowerCase().indexOf(n.toLowerCase());
      if (i !== -1 && (cutIdx === -1 || i < cutIdx)) {
        cutIdx = i;
        cutLen = n.length;
        cutName = n;
      }
    });
    if (cutIdx === -1 || cutName === null) {
      parts.push(remaining);
      break;
    }
    if (cutIdx > 0) parts.push(remaining.slice(0, cutIdx));
    parts.push({ name: cutName, text: remaining.slice(cutIdx, cutIdx + cutLen) });
    remaining = remaining.slice(cutIdx + cutLen);
  }
  return parts;
}

export function ResultSection({ reaction, highlight }: ResultSectionProps) {
  const text = reaction.resultNarrative ?? "";
  const names = reaction.compounds.map((c) => c.name);
  const parts = partsFromText(text, names);

  return (
    <p
      style={{
        fontSize: 13.5,
        color: "var(--fg)",
        maxWidth: "64ch",
        lineHeight: 1.65,
        margin: 0,
      }}
    >
      {parts.map((p, i) => {
        if (typeof p === "string") {
          return <Fragment key={i}>{p}</Fragment>;
        }
        const active = highlight !== null && p.name === highlight;
        return (
          <span
            key={i}
            data-compound-name={p.name}
            style={{
              background: active
                ? "color-mix(in srgb, var(--agentic) 25%, transparent)"
                : "transparent",
              padding: active ? "1px 3px" : 0,
              borderRadius: 3,
              transition: "background .2s",
            }}
          >
            {p.text}
          </span>
        );
      })}
    </p>
  );
}
