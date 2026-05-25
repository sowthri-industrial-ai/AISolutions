// Status badge — Live / Beta / Draft pill shown next to the project title.

import { STATUS_STYLES, type DisplayStatus } from "@/lib/projects";

export function StatusBadge({ status }: { status: DisplayStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: 20,
        padding: "0 8px",
        background: s.bg,
        color: s.color,
        border: `0.5px solid color-mix(in srgb, ${s.color} 40%, transparent)`,
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.color,
        }}
      />
      {s.label}
    </span>
  );
}
