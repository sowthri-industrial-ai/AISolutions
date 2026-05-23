// types/demo.ts
// Live demo handler interface — see portfolio-website/TECH-STACK.md Section 5.
//
// Note: the spec opens with `import type { CoreMessage } from "ai"`, but the
// AI SDK v6 (installed via `pnpm add ai` @latest) renamed `CoreMessage` to
// `ModelMessage`. The import was unused in the spec body, so it's omitted
// here. When demo handlers start consuming SDK message types, import
// `ModelMessage` (or the role-specific variants like `UserModelMessage`,
// `AssistantModelMessage`, `ToolModelMessage`) from "ai".

export interface DemoContext {
  model: string;                      // selected from model picker
  temperature: number;
  visitorId: string;                  // hashed IP, for rate limiting + session capture
  abortSignal: AbortSignal;
}

export interface DemoInput {
  prompt: string;
  attachments?: Array<{ type: "image" | "doc"; data: string }>;
  sampleId?: string;                  // if visitor chose a preset sample
}

export interface DemoStep {
  agent?: string;                     // e.g., "inventory.agent"
  tool?: string;                      // e.g., "supplier.query"
  content: string;
  metadata?: Record<string, unknown>;
}

export interface DemoHandler {
  samples: Array<{ id: string; label: string; input: DemoInput }>;
  validate(input: DemoInput): { ok: true } | { ok: false; reason: string };
  run(input: DemoInput, ctx: DemoContext): AsyncIterable<DemoStep>;
}
