// types/session.ts
// Captured session JSON schema — see portfolio-website/TECH-STACK.md Section 5.

import type { DemoInput, DemoStep } from "./demo";

export interface CapturedSession {
  id: string;
  projectSlug: string;
  capturedAt: string;
  input: DemoInput;
  steps: DemoStep[];
  metrics: {
    tokens: number;
    latencyMs: number;
    usd: number;
    evalScore?: number;
  };
  model: string;
  notes?: string;
}
