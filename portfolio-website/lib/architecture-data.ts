// lib/architecture-data.ts
// Architecture-tab data for SupplyChainCopilot.
//
// The CD bundle hand-authored the six-layer stack + the two cross-cutting
// rails + the infrastructure plinth in src/content.jsx. We move that into
// a typed module so future projects can drop in their own architecture by
// exporting the same shape.
//
// TODO(content-pipeline): teach scripts/build-index.ts to read
// `architecture.mdx`'s frontmatter for these structures so the data lives
// next to the prose.

export interface ArchItem {
  name: string;
  sub?: string;
  /** When true, the card fills the band's flex row (single-line callouts). */
  wide?: boolean;
}

export interface ArchLayer {
  /** Layer number — 1 = data sources at the bottom, 6 = experience at the top. */
  n: number;
  id: string;
  name: string;
  purpose: string;
  /** A tab-link callout rendered next to the layer purpose. */
  crossLink?: { label: string; target: string };
  items: ArchItem[];
}

export interface ArchRail {
  id: string;
  name: string;
  purpose: string;
  items: ArchItem[];
}

export type ArchPlinth = ArchRail;

export interface ProjectArchitecture {
  /** Prose paragraph shown above the diagram. */
  systemShape: string;
  layers: ArchLayer[];
  leftRail: ArchRail;
  rightRail: ArchRail;
  plinth: ArchPlinth;
  /** Prose paragraph shown below the diagram explaining the trade-offs. */
  whyThisShape: string;
}

const SUPPLY_CHAIN_COPILOT_ARCH: ProjectArchitecture = {
  systemShape:
    "The system runs as a six-layer stack with cross-cutting rails for observability and security. Live inventory, supplier contracts, and historical lead-time records feed a knowledge layer of pgvector indices and SQL tables. A foundation LLM and a custom forecaster sit above that, orchestrated by a six-agent system whose canonical run is documented in the Agent Reaction tab. The application layer serves a buyer chat and an approver dashboard. Tracing, evaluation, secrets, and audit logging span every layer; the whole stack runs on Vercel + Supabase + Upstash.",
  layers: [
    {
      n: 6, id: "experience", name: "Experience",
      purpose: "Where humans touch the system.",
      items: [
        { name: "Buyer chat",           sub: "web UI" },
        { name: "Approver dashboard",   sub: "web UI" },
        { name: "Email notifications",  sub: "transactional" },
      ],
    },
    {
      n: 5, id: "application", name: "Application",
      purpose: "How the system is served.",
      items: [
        { name: "REST API",       sub: "public surface" },
        { name: "Webhooks",       sub: "approver actions" },
        { name: "Streaming SSE",  sub: "chat responses" },
        { name: "Auth",           sub: "JWT" },
      ],
    },
    {
      n: 4, id: "orchestration", name: "Orchestration",
      purpose: "How the agents coordinate.",
      crossLink: { label: "see Agent Reaction tab →", target: "agent-reaction" },
      items: [
        {
          wide: true,
          name: "6-agent system",
          sub: "Procurement Planner · 3 Information Agents · Decision Critic · Order Approver — human-in-the-loop at Approval.",
        },
      ],
    },
    {
      n: 3, id: "intelligence", name: "Intelligence",
      purpose: "The models doing the work.",
      items: [
        { name: "Claude Opus 4.7",         sub: "planner · critic · synthesis" },
        { name: "text-embedding-3-large",  sub: "retrieval embeddings" },
        { name: "Custom lead-time model",  sub: "time-series forecaster" },
      ],
    },
    {
      n: 2, id: "knowledge", name: "Knowledge",
      purpose: "How data is prepared and retrieved.",
      items: [
        { name: "pgvector",           sub: "supplier contract embeddings" },
        { name: "PostgreSQL",         sub: "inventory tables" },
        { name: "Document parser",    sub: "PDF → chunks" },
        { name: "Embedding pipeline", sub: "batch indexing" },
      ],
    },
    {
      n: 1, id: "data", name: "Data Sources",
      purpose: "Where the data originates.",
      items: [
        { name: "ERP",                  sub: "inventory tables" },
        { name: "Supplier contracts",   sub: "PDF · S3 bucket" },
        { name: "Historical lead-time", sub: "data warehouse" },
      ],
    },
  ],
  leftRail: {
    id: "observability",
    name: "Observability & Eval",
    purpose: "Touches every layer.",
    items: [
      { name: "Langfuse",          sub: "agent + LLM trace" },
      { name: "OpenTelemetry",     sub: "structured logs" },
      { name: "Eval harness",      sub: "hallucinated-SKU rate" },
      { name: "Metrics dashboard", sub: "tokens · latency · cost" },
    ],
  },
  rightRail: {
    id: "security",
    name: "Security & Governance",
    purpose: "Touches every layer.",
    items: [
      { name: "Auth0",         sub: "buyer + approver auth" },
      { name: "Secrets vault", sub: "API keys · model creds" },
      { name: "Audit log",     sub: "every approval decision" },
      { name: "PII filter",    sub: "scrubbed before logging" },
    ],
  },
  plinth: {
    id: "infrastructure",
    name: "Infrastructure",
    purpose: "Where it runs.",
    items: [
      { name: "Vercel",         sub: "app hosting" },
      { name: "Supabase",       sub: "Postgres + pgvector" },
      { name: "Upstash Redis",  sub: "cache · rate limit" },
      { name: "GitHub Actions", sub: "CI/CD" },
      { name: "Sentry",         sub: "error tracking" },
    ],
  },
  whyThisShape:
    "A single-pass agent over-committed to the first supplier match. Splitting plan from critique cut wrong-supplier recommendations from 14% to 2.3% in evals, at +280ms latency. Pulling embeddings and SQL behind the same Knowledge layer kept retrieval transactional with the audit log — a hard requirement from compliance.",
};

const ARCHITECTURES: Record<string, ProjectArchitecture> = {
  "supply-chain-copilot": SUPPLY_CHAIN_COPILOT_ARCH,
};

export function getProjectArchitecture(
  projectId: string,
): ProjectArchitecture | null {
  return ARCHITECTURES[projectId] ?? null;
}
