// lib/projects.ts
// In-memory project registry for the slice-3 design implementation.
//
// TODO(content-pipeline): replace with the MDX-driven loader from
// lib/content.ts once `scripts/build-index.ts` is wired (see TECH-STACK.md
// §11). For now this file is the single source of truth for what the
// sidebar renders, the status dots show, and the observability panel
// summarises.

import type {
  Capability,
  ModelFamily,
  ProjectMetadata,
  ProjectStatus,
  ProjectTrack,
} from "@/types/project";

/** Display state shown in sidebar dots and the status badge. */
export type DisplayStatus = ProjectStatus | "beta" | "draft";

/**
 * Trace line rendered live in the observability panel. `tone` maps to the
 * status palette in globals.css (success / info / warning / muted / fg).
 */
export interface TraceLine {
  kind: "call" | "note" | "arrow";
  text?: string;
  tone?: "success" | "info" | "muted" | "warning";
}

/** Per-project sample metrics shown in the right-rail Metrics block. */
export interface ProjectMetrics {
  tokens?: string;
  latency?: string;
  cost?: string;
  eval?: string;
}

/** Sibling-project hint shown in the right-rail Related block. */
export interface RelatedHint {
  label: string;
  track: ProjectTrack;
  note: string;
}

/** Display-side view model. Subset of ProjectMetadata + control-plane extras. */
export interface PortfolioProject {
  id: string;
  name: string;
  track: ProjectTrack;
  status: DisplayStatus;
  summary: string;
  capabilities?: readonly Capability[] | readonly string[];
  modelsUsed?: readonly ModelFamily[];
  metrics?: ProjectMetrics;
  trace?: readonly TraceLine[];
  related?: RelatedHint;
  defaultModel?: string;
  /** Date string for sorting; absent for stubs */
  publishedAt?: string;
  featured?: boolean;
}

/**
 * The portfolio's projects, ordered as in the CD bundle. Only
 * `supply-chain-copilot` is documented at full fidelity; the rest render
 * via the StubProject component until their content arrives.
 */
export const PROJECTS: readonly PortfolioProject[] = [
  {
    id: "supply-chain-copilot",
    name: "SupplyChainCopilot",
    track: "agentic",
    status: "live",
    summary: "Multi-agent procurement decisions for mid-market manufacturing.",
    capabilities: ["multi-agent", "tool-use", "rag"],
    modelsUsed: ["claude", "gpt"],
    metrics: { tokens: "1,247", latency: "1.2s", cost: "$0.018", eval: "92%" },
    trace: [
      { kind: "call",  text: "supplier.query()",      tone: "success" },
      { kind: "call",  text: "inventory.lookup()",    tone: "success" },
      { kind: "call",  text: "alternates.fetch()",    tone: "success" },
      { kind: "arrow", tone: "muted" },
      { kind: "call",  text: "decision.synthesize()", tone: "info"    },
      { kind: "note",  text: "formatting…",           tone: "muted"   },
    ],
    related: { label: "RAGFoundry", track: "assets", note: "Shares retrieval with" },
    defaultModel: "claude-opus-4-7",
    publishedAt: "2026-03-15",
    featured: true,
  },
  {
    id: "research-agent",
    name: "ResearchAgent",
    track: "agentic",
    status: "draft",
    summary: "Deep-research planner with self-critique and source budgeting.",
  },
  {
    id: "prompt-ops",
    name: "PromptOps",
    track: "assets",
    status: "live",
    summary: "Versioned prompts with offline evals and gated rollout.",
  },
  {
    id: "rag-foundry",
    name: "RAGFoundry",
    track: "assets",
    status: "live",
    summary: "Hybrid retrieval over enterprise corpora with grounded answers.",
  },
  {
    id: "edge-vision",
    name: "EdgeVision",
    track: "physical",
    status: "beta",
    summary: "On-device perception for industrial inspection.",
  },
  {
    id: "robo-instruct",
    name: "RoboInstruct",
    track: "physical",
    status: "draft",
    summary: "Natural-language teach pendant for collaborative arms.",
  },
] as const;

export function projectsByTrack(track: ProjectTrack | string): PortfolioProject[] {
  return PROJECTS.filter((p) => p.track === track);
}

export function projectById(id: string): PortfolioProject | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function projectByTrackAndSlug(
  track: string,
  slug: string,
): PortfolioProject | undefined {
  return PROJECTS.find((p) => p.track === track && p.id === slug);
}

/** Status palette used by the workspace header badge. */
export const STATUS_STYLES: Record<
  DisplayStatus,
  { label: string; color: string; bg: string }
> = {
  live:    { label: "Live",    color: "var(--success)",  bg: "var(--success-bg)" },
  beta:    { label: "Beta",    color: "var(--warning)",  bg: "color-mix(in srgb, var(--warning) 18%, transparent)" },
  draft:   { label: "Draft",   color: "var(--fg-muted)", bg: "var(--bg-subtle)" },
  "in-dev": { label: "In dev",  color: "var(--warning)",  bg: "color-mix(in srgb, var(--warning) 18%, transparent)" },
  concept: { label: "Concept", color: "var(--fg-muted)", bg: "var(--bg-subtle)" },
};

/** Canonical tab order from the CD bundle. Slug = URL-safe id. */
export interface TabDef {
  slug: string;
  label: string;
}

export const TABS: readonly TabDef[] = [
  { slug: "overview",       label: "Overview" },
  { slug: "architecture",   label: "Architecture" },
  { slug: "agent-reaction", label: "Agent Reaction" },
  { slug: "demo",           label: "Demo" },
  { slug: "prompts",        label: "Prompts" },
  { slug: "results",        label: "Results" },
  { slug: "tradeoffs",      label: "Trade-offs" },
] as const;

export const DEFAULT_TAB = TABS[0].slug; // "overview"

export function tabBySlug(slug: string): TabDef | undefined {
  return TABS.find((t) => t.slug === slug);
}

export function isValidTab(slug: string): boolean {
  return TABS.some((t) => t.slug === slug);
}

/** Re-export the track helpers for ergonomic single-import usage. */
export { TRACKS, trackById } from "@/lib/tracks";

/**
 * Adapt a PortfolioProject into the broader ProjectMetadata schema. Used by
 * future MDX-driven pages without changing the display-side view model.
 */
export function toMetadata(p: PortfolioProject): ProjectMetadata {
  return {
    slug: p.id,
    title: p.name,
    track: p.track,
    // The display-side `status` set is wider than ProjectMetadata's contract;
    // collapse beta/draft → in-dev/concept for the public schema.
    status:
      p.status === "live"   ? "live" :
      p.status === "beta"   ? "in-dev" :
      p.status === "in-dev" ? "in-dev" :
                              "concept",
    summary: p.summary,
    capabilities: (p.capabilities ?? []) as Capability[],
    modelsUsed: (p.modelsUsed ?? []) as ModelFamily[],
    publishedAt: p.publishedAt ?? "2026-01-01",
    featured: p.featured,
    defaultModel: p.defaultModel ?? "claude-opus-4-7",
  };
}
