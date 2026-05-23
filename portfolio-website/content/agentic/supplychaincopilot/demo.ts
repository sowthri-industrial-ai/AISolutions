// content/agentic/supplychaincopilot/demo.ts
//
// DemoHandler stub. The type contract is real so the API route and the
// workspace tab can wire against it now; run() throws because the actual
// agent loop, tools, and pgvector queries land in a later slice.
//
// Once implemented, run() will:
//   - Call the inventory agent (tool-use loop), then the supplier agent,
//     then the decision agent.
//   - Yield DemoStep entries per agent turn and per tool call so the
//     observability panel renders the trace as it streams.

import type { DemoHandler, DemoInput, DemoStep } from "@/types/demo";

const handler: DemoHandler = {
  samples: [
    {
      id: "flagged-po-471203",
      label: "Flagged PO 471203 — tier-2 supplier slip on bearing assembly",
      input: {
        prompt:
          "PO 471203: supplier reports 9-day delay on bearing assembly part #B-4471. Stock level 38, demand forecast 52 for the next four weeks. Recommend an action.",
      },
    },
  ],

  validate(input: DemoInput) {
    if (!input.prompt || input.prompt.trim().length === 0) {
      return { ok: false, reason: "prompt is required" };
    }
    if (input.prompt.length > 4000) {
      return { ok: false, reason: "prompt exceeds 4,000 character cap" };
    }
    return { ok: true };
  },

  async *run(): AsyncIterable<DemoStep> {
    throw new Error(
      "SupplyChainCopilot live demo is not yet wired up — see TECH-STACK.md §7.",
    );
  },
};

export default handler;
