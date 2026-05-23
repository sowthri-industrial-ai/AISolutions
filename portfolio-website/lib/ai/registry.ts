// lib/ai/registry.ts
// Available models for the top-bar model picker (TECH-STACK.md §8).

export const MODELS = [
  { id: "claude-opus-4-7", label: "Claude Opus 4.7", provider: "anthropic" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", provider: "anthropic" },
  { id: "gpt-4o", label: "GPT-4o", provider: "openai" },
  { id: "llama-3.3-70b", label: "Llama 3.3 70B", provider: "together" },
];
