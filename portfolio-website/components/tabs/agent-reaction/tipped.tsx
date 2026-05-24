"use client";

// Tooltip primitive used throughout the Agent Reaction tab.
// Mirrors the CD bundle's <Tipped> from src/agent-reaction.jsx — follows
// the cursor on hover, fixed-positioned, no global portal needed.

import { useState, type ReactNode } from "react";

interface TippedProps {
  tip: ReactNode;
  /** Render the wrapper as a div instead of a span (block-level tooltips). */
  asBlock?: boolean;
  children: ReactNode;
}

export function Tipped({ tip, children, asBlock = false }: TippedProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const Wrapper = asBlock ? "div" : "span";

  return (
    <Wrapper
      style={{
        position: "relative",
        display: asBlock ? "block" : "inline-block",
      }}
      onMouseEnter={(e) => setPos({ x: e.clientX, y: e.clientY })}
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {pos && tip && (
        <div
          role="tooltip"
          style={{
            position: "fixed",
            left: pos.x + 12,
            top: pos.y + 14,
            zIndex: 1000,
            pointerEvents: "none",
            background: "var(--bg-elevated)",
            border: "0.5px solid var(--border-strong)",
            borderRadius: 4,
            padding: "7px 10px",
            fontSize: 11.5,
            color: "var(--fg)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
            maxWidth: 280,
            lineHeight: 1.45,
            fontFamily: "var(--font-sans)",
          }}
        >
          {tip}
        </div>
      )}
    </Wrapper>
  );
}
