// types/project.ts
// project.json schema — see portfolio-website/TECH-STACK.md Section 5.

export type ProjectStatus = "live" | "in-dev" | "concept";
export type ProjectTrack = "agentic" | "assets" | "physical";

export type Capability =
  | "rag"
  | "fine-tuning"
  | "multi-agent"
  | "tool-use"
  | "eval"
  | "edge-inference"
  | "streaming"
  | "prompt-engineering"
  | "vector-search";

export type ModelFamily = "claude" | "gpt" | "llama" | "open-weights" | "custom";

export interface ProjectMetadata {
  slug: string;                       // matches folder name, kebab-case
  title: string;                      // display name
  track: ProjectTrack;
  status: ProjectStatus;
  summary: string;                    // one-line description, ~120 chars
  capabilities: Capability[];
  modelsUsed: ModelFamily[];
  hero?: string;                      // path to hero image in public/
  publishedAt: string;                // ISO date
  featured?: boolean;                 // shown on home page
  defaultModel: string;               // e.g., "claude-opus-4-7"
  evalScore?: number;                 // 0-100 from last eval run
  averageRunCost?: { tokens: number; usd: number };
  relatedProjects?: string[];         // slugs for cross-references
}
