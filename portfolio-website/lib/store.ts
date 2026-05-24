// lib/store.ts
// Zustand store for control-plane state.
//
// What lives here:
//   - theme (dark | light)               — flipped by the top-bar toggle
//   - sidebar track-group expansion      — which TRACKS groups are open
//
// What does NOT live here:
//   - active project + active tab        — both are URL segments under
//                                          /control/[track]/[slug]/[tab]
//   - search query, model picker, temp   — slice-4 work; placeholders only
//
// Persistence: one JSON blob in localStorage at key "ctrl-plane:v1" — the
// same slot read by the pre-paint script in app/layout.tsx, so the user's
// theme survives across reloads with no FOUC.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Theme = "dark" | "light";

export interface ExpandedTracks {
  agentic: boolean;
  assets: boolean;
  physical: boolean;
}

interface ControlPlaneState {
  theme: Theme;
  expanded: ExpandedTracks;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  toggleTrack: (id: keyof ExpandedTracks) => void;
  setExpanded: (e: ExpandedTracks) => void;
}

// CD bundle defaults — Agentic open, others collapsed.
const DEFAULT_EXPANDED: ExpandedTracks = {
  agentic: true,
  assets: false,
  physical: false,
};

/**
 * Sync the <html> attributes whenever the theme changes. The pre-paint
 * script in app/layout.tsx handles the very first paint; this keeps the
 * DOM aligned with the store after that.
 */
function applyThemeToDocument(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const useControlPlaneStore = create<ControlPlaneState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      expanded: DEFAULT_EXPANDED,
      setTheme: (theme) => {
        applyThemeToDocument(theme);
        set({ theme });
      },
      toggleTheme: () => {
        const next: Theme = get().theme === "dark" ? "light" : "dark";
        applyThemeToDocument(next);
        set({ theme: next });
      },
      toggleTrack: (id) =>
        set((s) => ({ expanded: { ...s.expanded, [id]: !s.expanded[id] } })),
      setExpanded: (expanded) => set({ expanded }),
    }),
    {
      name: "ctrl-plane:v1",
      // Use sessionStorage on the server (where it's a no-op) and localStorage
      // in the browser; the persist key matches the pre-paint script's slot.
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as never),
      ),
      // Only persist user-tunable slots; method references must never be persisted.
      partialize: (s) => ({ theme: s.theme, expanded: s.expanded }),
      // On rehydrate, re-apply the theme so the <html> attributes match what
      // the store believes (the pre-paint script already did one pass).
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeToDocument(state.theme);
      },
    },
  ),
);
