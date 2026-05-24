// Pills under the project title showing capabilities (multi-agent,
// tool-use, rag, …). Tinted in the project's track color.

import type { TrackMeta } from "@/lib/tracks";

interface CapabilityPillProps {
  track: TrackMeta;
  label: string;
}

export function CapabilityPill({ track, label }: CapabilityPillProps) {
  return (
    <span
      style={{
        fontSize: 11.5,
        fontWeight: 500,
        padding: "3px 9px",
        borderRadius: 4,
        background: track.bg,
        color: track.fg,
        border: `0.5px solid color-mix(in srgb, ${track.color} 25%, transparent)`,
        letterSpacing: "-0.005em",
      }}
    >
      {label}
    </span>
  );
}
