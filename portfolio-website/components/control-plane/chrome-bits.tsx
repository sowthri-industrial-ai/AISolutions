"use client";

// Two-row chrome primitives used by the top bar: a pill-style Chip and a
// square IconButton. Both swap their background on hover via inline event
// handlers (no Tailwind hover utility — these styles are inline because the
// CD bundle drives them off CSS variables that change with the theme).

import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  title?: string;
}

export function Chip({ children, onClick, title }: ChipProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        height: 28,
        padding: "0 10px",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "var(--bg-subtle)",
        border: "0.5px solid var(--border-token)",
        borderRadius: 5,
        fontSize: 12,
        color: "var(--fg-muted)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg-subtle)";
      }}
    >
      {children}
    </button>
  );
}

interface IconButtonProps {
  children: ReactNode;
  title: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}

export function IconButton({ children, title, onClick, style }: IconButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        display: "inline-grid",
        placeItems: "center",
        background: "transparent",
        border: "0.5px solid var(--border-token)",
        borderRadius: 5,
        color: "var(--fg-muted)",
        cursor: "pointer",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-hover)";
        e.currentTarget.style.color = "var(--fg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--fg-muted)";
      }}
    >
      {children}
    </button>
  );
}
