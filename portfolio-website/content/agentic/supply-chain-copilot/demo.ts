// content/agentic/supply-chain-copilot/demo.ts
//
// Stub live-demo handler for SupplyChainCopilot.
// Slice 3 doesn't wire the runtime — the Demo tab renders the
// SkeletonTab placeholder. This file exists so the loader API in
// lib/content.ts has something real to dynamic-import once the
// runtime lands.

import type { DemoHandler, DemoInput, DemoStep } from "@/types/demo";

const samples: DemoHandler["samples"] = [
  {
    id: "sku-shortage",
    label: "SKU shortage",
    input: { prompt: "SKU 4421-B lead time slipping to 14d." },
  },
  {
    id: "lead-time-slip",
    label: "Lead-time slip",
    input: { prompt: "Supplier B has slipped 2 weeks on SKU-3318-A." },
  },
];

const handler: DemoHandler = {
  samples,
  validate(input: DemoInput) {
    if (!input.prompt?.trim()) {
      return { ok: false, reason: "Empty prompt" };
    }
    if (input.prompt.length > 4000) {
      return { ok: false, reason: "Prompt exceeds 4000-token cap" };
    }
    return { ok: true };
  },
  async *run(): AsyncIterable<DemoStep> {
    // TODO(runtime): replace with a real multi-agent run streamed from
    // /api/demo/[track]/[slug]/route.ts. For now, the stub yields a
    // single descriptive step so the streaming pipeline can be
    // exercised end-to-end without hitting any model API.
    yield {
      agent: "stub",
      content:
        "Demo runtime is not yet wired in slice 3. See PROJECT_PLAN.md for the slice that adds the live-demo pipeline.",
    };
  },
};

export default handler;
