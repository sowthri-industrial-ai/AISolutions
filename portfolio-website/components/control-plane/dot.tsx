// Tiny status dot — colored fill, optional halo for the "active" state.
// Used in: sidebar project rows, status badges, footer "online" indicator,
// observability panel "streaming" indicator.

import type { CSSProperties } from "react";

interface DotProps {
  color?: string;
  size?: number;
  /** When true, draws a soft halo around the dot in the same color. */
  ring?: boolean;
  style?: CSSProperties;
  "aria-hidden"?: boolean;
}

export function Dot({
  color = "var(--fg-subtle)",
  size = 6,
  ring = false,
  style,
  ...rest
}: DotProps) {
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        boxShadow: ring
          ? `0 0 0 3px color-mix(in srgb, ${color} 22%, transparent)`
          : "none",
        display: "inline-block",
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    />
  );
}
