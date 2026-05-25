// lib/tracks.ts
// Track metadata — labels + CSS-var accents — mirroring the CD bundle's
// `TRACKS` array. Keep this in sync with the `--{track}-{slot}` variables
// in app/globals.css.

import type { ProjectTrack } from "@/types/project";

export interface TrackMeta {
  id: ProjectTrack;
  label: string;
  /** Solid accent (left-border, dots, hover state) */
  color: string;
  /** Tinted background (pill, active-row fill) */
  bg: string;
  /** On-tint foreground (pill text, related-project links) */
  fg: string;
}

export const TRACKS: readonly TrackMeta[] = [
  { id: "agentic",  label: "Agentic",  color: "var(--agentic)",  bg: "var(--agentic-bg)",  fg: "var(--agentic-fg)"  },
  { id: "assets",   label: "Assets",   color: "var(--assets)",   bg: "var(--assets-bg)",   fg: "var(--assets-fg)"   },
  { id: "physical", label: "Physical", color: "var(--physical)", bg: "var(--physical-bg)", fg: "var(--physical-fg)" },
] as const;

export function trackById(id: string): TrackMeta | undefined {
  return TRACKS.find((t) => t.id === id);
}
