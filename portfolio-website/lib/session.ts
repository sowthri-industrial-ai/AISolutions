// lib/session.ts
// Session capture + replay (TECH-STACK.md §5 sessions/ folder, §9 visitor session capture).

import type { CapturedSession } from "@/types/session";

/** Persist a finished demo run as a CapturedSession in Supabase + content/{track}/{slug}/sessions/. */
export async function captureSession(_session: CapturedSession): Promise<void> {
  // TODO: write to Supabase Storage and update the per-project sessions/ folder.
}

/** Fetch a captured session for the Replay fallback when a visitor is rate-limited. */
export async function loadSession(_id: string): Promise<CapturedSession | null> {
  // TODO: fetch from Supabase.
  return null;
}
