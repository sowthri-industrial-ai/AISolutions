# Tech stack specification — Portfolio website

**Repository location:** `AISolutions/portfolio-website/`
**Owner:** Sowthri (GenAI Architect)
**Status:** Architecture locked. This document is the implementation brief for Claude Code and the design constraints for Figma.
**Last updated:** May 2026

---

## Contents

1. Purpose
2. Architecture summary
3. Stack selection (with rationale)
4. Repository structure
5. Content collection system
6. Two-surface routing
7. Live demo architecture
8. AI features wiring
9. Safeguards
10. Deployment
11. Build pipeline
12. Pre-flight fixes
13. Scaffold commands
14. Figma brief
15. Open questions

---

## 1. Purpose

This document locks the technical foundation for a portfolio that behaves as a control plane for the architect's AI work. Visitors land at a single URL, choose between interactive operation (the control plane) and long-form reading (static case study pages), and find both surfaces rendered from the same content source.

It locks the framework choices, repository layout, content schema, routing, AI integration patterns, safeguards, and deployment plan — so Figma designs against real constraints and Claude Code scaffolds without ambiguity.

---

## 2. Architecture summary

Every project is a self-contained content folder under `/content/{track}/{slug}/`. At build time, an indexer walks `/content`, validates each `project.json`, and registers the project into:

- The control plane sidebar (left navigation, grouped by track)
- The static track index pages (`/agentic`, `/assets`, `/physical`)
- A static project page (`/agentic/{slug}` etc.)
- The semantic search index (Layer 1 — global `⌘K`)
- A per-project vector index (Layer 2 — project-specific copilot)
- The cross-project suggestions graph

The control plane lives at `/control` and is a single Next.js layout that mounts the active project's workspace in the centre while the persistent shell (sidebar, top-bar model controls, observability panel) stays in place. Static pages live at canonical project URLs and are server-rendered for SEO.

Both surfaces cross-link at the project level. The same MDX content drives both views — only the presentation differs.

---

## 3. Stack selection

### Framework: Next.js 16, App Router

Server Components, native streaming, file-based routing that maps cleanly to the two-surface architecture (`/control/...` for the app, `/{track}/{slug}` for static pages), excellent Vercel integration. App Router is non-negotiable for this design — Pages Router cannot stream LLM responses with the same fluency, and Server Components are what make the static surface feel fast.

### UI: Tailwind CSS v4 + shadcn/ui + Radix primitives

Tailwind for utility-first styling. shadcn/ui as the component foundation — not a dependency, a pattern; components are copied into the repo and owned. This matters because the control plane needs heavy customisation that a packaged library would fight. Radix primitives (inside shadcn) handle accessibility for menus, dialogs, popovers, tabs.

### Content: MDX via `next-mdx-remote` + a custom indexer

MDX files compiled with `next-mdx-remote`. Frontmatter parsed via `gray-matter`. Custom components injected (`<Architecture />`, `<PromptBlock />`, `<EvalChart />`, `<DemoEmbed />`). A custom indexer script (`scripts/build-index.ts`) walks `/content`, validates schemas, generates the project manifest, and builds vector indexes.

Avoid Contentlayer (unmaintained). Avoid Velite (too opinionated). A 100-line indexer is simpler and gives full control.

### State: Zustand for control plane state, URL for routing state

Control plane persistence across project switches (model selection, temperature, session history, panel open/closed) → Zustand. Active project and tab → URL. That combination is what makes deep links work while letting controls live above the navigation.

### AI providers: Anthropic primary, with OpenAI and an open-weights provider for the model picker

- Anthropic API → Claude (primary, default selection)
- OpenAI API → GPT (for cross-provider comparison)
- Together AI → open-weights (Llama, Mistral)

All three accessed through the Vercel AI SDK, which abstracts streaming and tool use across providers — `streamText({ model: ... })` is the same surface regardless of vendor.

### Streaming: Vercel AI SDK (`ai` package)

`streamText`, `streamObject`, `useChat`, `useCompletion`, and `experimental_useObject` are the primitives. Critical for the live demo experience because everything streams — partial responses, intermediate tool calls, agent-loop steps. The observability panel watches the stream and renders trace lines in real time.

### Database: Supabase (Postgres + pgvector)

One service for: structured data (sessions, eval runs, feedback), vector search (Layer 1 global, Layer 2 per-project), file storage (cached session recordings, demo media), and auth (optional, for v2).

pgvector specifically: at our scale (a few thousand documents and chunks across projects), Postgres outperforms dedicated vector DBs like Pinecone or Qdrant on latency and is dramatically cheaper. Single-service stack also reduces operational surface area.

### Hosting: Vercel, deployed from a subfolder

The portfolio lives in `AISolutions/portfolio-website/`. The Vercel project root directory is set to that subfolder. Builds run only when files inside the subfolder change.

### Observability: Langfuse + Vercel Analytics

- Langfuse → LLM traces (input, output, intermediate steps, latency, token count, cost per call). Powers the in-UI observability panel — the panel reads from Langfuse's API.
- Vercel Analytics → site-level metrics (visitors, page views, top projects).

### Authentication: none for v1

Public site. Rate limiting (Section 9) gates abuse without requiring login. Auth can be added later for visitor profiles or eval feedback collection.

---

## 4. Repository structure

```
portfolio-website/
├── README.md
├── package.json
├── pnpm-lock.yaml
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── components.json                   shadcn config
├── .env.example
├── .env.local                        gitignored
├── .nvmrc                            Node 20
│
├── content/                          THE source of truth
│   ├── agentic/
│   │   ├── supplychaincopilot/
│   │   │   ├── project.json
│   │   │   ├── overview.mdx
│   │   │   ├── architecture.mdx
│   │   │   ├── prompts.mdx
│   │   │   ├── results.mdx
│   │   │   ├── tradeoffs.mdx
│   │   │   ├── demo.ts               live demo handler
│   │   │   └── sessions/             cached eval runs
│   │   │       └── session-001.json
│   │   └── researchagent/
│   ├── assets/
│   │   ├── promptops/
│   │   └── ragfoundry/
│   ├── physical/
│   │   ├── edgevision/
│   │   └── roboinstruct/
│   └── pages/                        non-project static pages
│       ├── approach.mdx
│       ├── stack.mdx
│       └── about.mdx
│
├── app/
│   ├── layout.tsx                    root layout, fonts, theme provider
│   ├── page.tsx                      home — both routes surfaced
│   ├── globals.css
│   │
│   ├── control/                      control plane shell
│   │   ├── layout.tsx                sidebar + topbar + obs panel
│   │   ├── page.tsx                  welcome workspace
│   │   └── [track]/
│   │       └── [slug]/
│   │           └── page.tsx          project workspace
│   │
│   ├── [track]/                      static surface
│   │   ├── page.tsx                  track index
│   │   └── [slug]/
│   │       └── page.tsx              static project page
│   │
│   ├── (pages)/                      static supporting pages
│   │   ├── approach/page.tsx
│   │   ├── stack/page.tsx
│   │   └── about/page.tsx
│   │
│   └── api/
│       ├── demo/[track]/[slug]/route.ts   live demo handler
│       ├── guide/route.ts                  global AI guide chat
│       ├── copilot/[track]/[slug]/route.ts per-project copilot
│       ├── search/route.ts                 semantic search
│       └── compare/route.ts                compare mode
│
├── components/
│   ├── ui/                           shadcn primitives
│   ├── control-plane/                sidebar, topbar, obs panel, model picker
│   ├── workspace/                    tabs, demo runner, project copilot
│   ├── static-page/                  long-form layout, collapsible sections
│   ├── shared/                       arch diagram, prompt block, eval chart
│   └── mdx/                          MDX component overrides
│
├── lib/
│   ├── content.ts                    read content folder, build manifest
│   ├── ai/
│   │   ├── claude.ts
│   │   ├── openai.ts
│   │   └── openweights.ts
│   ├── vector.ts                     pgvector helpers
│   ├── observability.ts              Langfuse wrapper
│   ├── rate-limit.ts                 Upstash sliding window
│   ├── session.ts                    session capture and replay
│   └── store.ts                      Zustand store
│
├── scripts/
│   ├── build-index.ts                prebuild: generate manifest
│   ├── build-vectors.ts              chunk + embed content
│   └── validate-content.ts           schema check on project.json
│
├── public/
│   ├── fonts/
│   ├── images/
│   └── media/                        videos, GIFs for static demos
│
└── types/
    ├── project.ts                    project.json schema
    ├── demo.ts                       demo handler interface
    └── session.ts                    session JSON schema
```

---

## 5. Content collection system

### project.json schema

```typescript
// types/project.ts

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
```

### MDX file conventions

Each project folder contains six MDX files corresponding to the six workspace tabs and the six sections of the static page:

| File | Tab in workspace | Section on static page |
|---|---|---|
| `overview.mdx` | Overview | Hero + Problem & constraints |
| `architecture.mdx` | Architecture | Architecture (interactive diagram + narrative) |
| `prompts.mdx` | Prompts | Prompts & configurations |
| `results.mdx` | Results | Before/after + Results & evals |
| `tradeoffs.mdx` | Trade-offs | What I'd do differently |
| Generated from `demo.ts` | Demo (live) | Demo preview (video + sample I/O) |

The static page concatenates all six into one long-form scroll with collapsible sections. The control plane workspace renders them as tabs. Same source, two presentations.

### demo.ts interface

```typescript
// types/demo.ts
// Note: AI SDK v6 renamed CoreMessage -> ModelMessage. Import ModelMessage from
// "ai" only where actually needed; the interfaces below do not reference it.

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
```

Each `demo.ts` exports a `DemoHandler` that the API route imports and invokes. The handler streams `DemoStep` objects which the observability panel renders as trace lines and the workspace renders as the streaming response.

### sessions/ folder

Captured runs from development and from eval suites. JSON format:

```typescript
// types/session.ts

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
```

These power the observability panel's *Eval, 24h* row and the *Replay* feature visitors can use if a live demo is rate-limited.

---

## 6. Two-surface routing

### Layout structure

```typescript
// app/control/layout.tsx
import { Sidebar, TopBar, ObservabilityPanel } from "@/components/control-plane";

export default function ControlPlaneLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="control-plane-shell h-screen flex flex-col">
      <TopBar />
      <div className="flex-1 grid grid-cols-[180px_1fr_200px] min-h-0">
        <Sidebar />
        <main className="overflow-y-auto">{children}</main>
        <ObservabilityPanel />
      </div>
    </div>
  );
}
```

### Project workspace route

```typescript
// app/control/[track]/[slug]/page.tsx
import { Workspace } from "@/components/workspace";
import { loadProject } from "@/lib/content";

export default async function ProjectWorkspace({
  params,
}: {
  params: Promise<{ track: string; slug: string }>;
}) {
  const { track, slug } = await params;
  const project = await loadProject(track, slug);
  if (!project) notFound();
  return <Workspace project={project} />;
}
```

### Static project page route

```typescript
// app/[track]/[slug]/page.tsx
import { ProjectArticle } from "@/components/static-page";
import { loadProject } from "@/lib/content";

export async function generateStaticParams() {
  const projects = await listProjects();
  return projects.map((p) => ({ track: p.track, slug: p.slug }));
}

export default async function StaticProjectPage({
  params,
}: {
  params: Promise<{ track: string; slug: string }>;
}) {
  const { track, slug } = await params;
  const project = await loadProject(track, slug);
  if (!project) notFound();
  return <ProjectArticle project={project} />;
}
```

### Cross-link components

`<OpenInControlPlane projectSlug={slug} track={track} />` — appears on every static project page.

`<ReadCaseStudy projectSlug={slug} track={track} />` — appears in the Overview tab of every workspace.

Both render as buttons with appropriate icons and preserve the visitor's current model/temp settings via URL query params on the destination.

---

## 7. Live demo architecture

### Streaming contract

```typescript
// app/api/demo/[track]/[slug]/route.ts

import { loadDemoHandler } from "@/lib/content";
import { rateLimit } from "@/lib/rate-limit";
import { logTrace } from "@/lib/observability";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ track: string; slug: string }> },
) {
  const { track, slug } = await params;
  const { ok, reason } = await rateLimit(req);
  if (!ok) return new Response(reason, { status: 429 });

  const input: DemoInput = await req.json();
  const handler = await loadDemoHandler(track, slug);

  const validation = handler.validate(input);
  if (!validation.ok) return new Response(validation.reason, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const traceId = await logTrace.start({ project: slug, input });
      try {
        for await (const step of handler.run(input, ctx)) {
          controller.enqueue(encoder.encode(JSON.stringify(step) + "\n"));
          await logTrace.step(traceId, step);
        }
        await logTrace.complete(traceId);
      } catch (err) {
        controller.enqueue(encoder.encode(JSON.stringify({ error: String(err) })));
        await logTrace.fail(traceId, err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson" },
  });
}
```

NDJSON (newline-delimited JSON) chosen over SSE because each `DemoStep` is structured and the client parses each line as it arrives. Simpler than SSE event types for our use case.

### Project copilot (Layer 2 RAG)

Each project gets its own vector index built at deploy time from its six MDX files plus `project.json`. The copilot endpoint:

```typescript
// app/api/copilot/[track]/[slug]/route.ts

export async function POST(req: Request, { params }: { params: { track: string; slug: string } }) {
  const { question, conversationId } = await req.json();
  const chunks = await searchProjectIndex(params.track, params.slug, question, { k: 6 });

  const result = streamText({
    model: anthropic("claude-opus-4-7"),
    system: copilotSystemPrompt({ project: params.slug, chunks }),
    messages: await loadConversation(conversationId),
  });

  return result.toAIStreamResponse();
}
```

The system prompt is templated to make the copilot answer *only* from the retrieved chunks of *that project's* docs. No mixing across projects. No hallucinating outside the corpus.

### Global AI guide (Layer 1)

Same pattern, but the vector index covers all projects and supporting pages. Used for cross-project recommendations and navigation help.

---

## 8. AI features wiring

### Model picker

Top-bar component. Reads available models from `lib/ai/registry.ts`, persists selection in Zustand, applies to all subsequent demo runs, copilot queries, and guide chats until changed.

```typescript
// lib/ai/registry.ts
export const MODELS = [
  { id: "claude-opus-4-7", label: "Claude Opus 4.7", provider: "anthropic" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", provider: "anthropic" },
  { id: "gpt-4o", label: "GPT-4o", provider: "openai" },
  { id: "llama-3.3-70b", label: "Llama 3.3 70B", provider: "together" },
];
```

### Compare mode

Top-bar toggle. When enabled, the workspace splits into two columns; each column has its own model selector, temperature, and input box; both run on `Run`. Trace and metrics appear per-column.

Side note for the designer: compare mode is the highest-value differentiator for hiring-manager visitors. Treat its toggle as a prominent affordance, not an obscure setting.

### Observability panel

Reads from Langfuse via `lib/observability.ts`. Three sections:
- Trace (live stream while a demo runs)
- Metrics (tokens, latency, cost, eval score from last 24h)
- Related (cross-project suggestions from a static graph in `project.json`)

Collapsible via top-bar control. Defaults to **open** per earlier decision (the trace is part of the show, not a power-user feature).

### Semantic search (⌘K)

Modal triggered by keyboard shortcut or icon. Searches across all project MDX chunks. Returns ranked results with project slug, section, and a snippet. Clicking navigates to the static page section or the workspace tab depending on visitor preference (toggle in the modal).

---

## 9. Safeguards

### Rate limiting

- Sliding window: **5 demo runs per IP per 10 minutes**
- Hard cap: **50 runs per IP per day**, summed across all projects
- Implementation: `@upstash/ratelimit` + Upstash Redis (free tier sufficient)
- Friendly 429 message offers the *Replay* fallback using cached sessions

### Cost caps

- Daily API spend ceiling: **`$20/day`** (env var `DAILY_BUDGET_USD`, adjustable)
- Cost estimated before each call from token-length heuristic × per-1k rate
- When 100% hit: demos disabled site-wide with a notice; copilot and guide remain (low cost)
- When 80% hit: webhook alert (Slack/email) to admin

### Abuse protection

- Input length cap: **4,000 tokens max** per demo run
- Attachment size cap: **2 MB per attachment**
- Cloudflare proxy in front of Vercel for DDoS mitigation
- Demo input passes through a lightweight content filter to reject obvious injection attempts; nothing heavy (no false-positive moderation overhead for technical visitors).

### Visitor session capture

Hashed IP + UA hash → `visitorId`. Used for rate limiting and to dedupe traces in observability. No PII stored.

---

## 10. Deployment

### Vercel project setup

- Root directory: `portfolio-website` (after the folder rename in Section 12)
- Framework preset: Next.js
- Node version: 20.x (set via `.nvmrc`)
- Build command: `pnpm build` (which runs `scripts/build-index.ts` as prebuild)
- Install command: `pnpm install --frozen-lockfile`

### Environment variables

```
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
TOGETHER_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_SECRET_KEY=
LANGFUSE_BASE_URL=https://cloud.langfuse.com
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
DAILY_BUDGET_USD=20
ADMIN_ALERT_WEBHOOK=
NEXT_PUBLIC_SITE_URL=https://sowthri.dev
```

### Custom domain

The GitHub URL is the source code path, not the live URL. Connect a custom domain (e.g., `sowthri.dev`) via the Vercel dashboard. Add the domain to `NEXT_PUBLIC_SITE_URL` for canonical link generation.

---

## 11. Build pipeline

### Local development

```bash
pnpm install
pnpm dev          starts Next.js + watches /content for changes
```

The dev server triggers `build-index.ts` on file changes inside `/content` so new projects appear without restarting.

### Production build (on Vercel)

1. `prebuild`: `tsx scripts/validate-content.ts && tsx scripts/build-index.ts && tsx scripts/build-vectors.ts`
   - Validates all `project.json` files against the Zod schema
   - Generates `content/_manifest.json` (consumed at runtime)
   - Chunks MDX files, generates embeddings, writes to Supabase pgvector tables
2. `build`: Next.js production build
3. Output: static pages prerendered, dynamic routes (control plane workspaces, API routes) deployed as serverless functions

### CI / CD

GitHub Actions:
- On push to `main`: Vercel deploys automatically (default integration)
- On PR: Vercel preview deploys, GitHub Actions runs `validate-content.ts` as a check
- Optional weekly: a workflow runs eval suites for each project and updates `evalScore` in `project.json` via a PR

---

## 12. Pre-flight fixes

Three things to handle before scaffolding starts:

1. **Folder rename.** The current folder is `1.PortfolioWebsite`. The leading `1.` breaks routing in many Next.js plugins and Vercel's path detection. Rename to `portfolio-website`:
   ```bash
   git mv "1.PortfolioWebsite" "portfolio-website"
   ```
2. **Add `.nvmrc`.** Pin Node 20 to avoid drift between local and Vercel:
   ```bash
   echo "20" > portfolio-website/.nvmrc
   ```
3. **Decide on package manager.** This doc assumes `pnpm`. If `npm` or `yarn` is preferred, swap commands accordingly — no other implications.

4. **Allow build scripts in `pnpm-workspace.yaml`.** pnpm 10+ refuses to run postinstall scripts for packages it doesn't recognise, which causes `pnpm install` to prompt interactively (broken for CI). Add this to `portfolio-website/pnpm-workspace.yaml` after `create-next-app` runs:
   ```yaml
   onlyBuiltDependencies:
     - sharp
     - unrs-resolver
     - esbuild
     - msw
   ```

---

## 13. Scaffold commands

```bash
cd AISolutions/portfolio-website

pnpm dlx create-next-app@latest . \
  --typescript --tailwind --app \
  --src-dir=false --import-alias="@/*"

pnpm add ai @ai-sdk/anthropic @ai-sdk/openai @ai-sdk/togetherai
pnpm add @supabase/supabase-js @supabase/ssr
pnpm add langfuse
pnpm add zustand
pnpm add next-mdx-remote gray-matter
pnpm add @upstash/redis @upstash/ratelimit
pnpm add lucide-react clsx tailwind-merge zod
pnpm add @xyflow/react                   interactive architecture diagrams

pnpm add -D @types/node @types/react eslint prettier tsx

pnpm dlx shadcn@latest init --defaults
pnpm dlx shadcn@latest add button card dialog dropdown-menu \
  input select sheet tabs toggle command badge tooltip \
  resizable scroll-area separator skeleton
```

After these, Claude Code creates the folder structure in Section 4 and starts implementing the components in order: shell → static page template → workspace template → demo handler → copilot → guide → compare mode → observability panel.

---

## 14. Figma brief

### Design tokens to lock with the designer

- Colour palette (CSS variables in `globals.css`) — light and dark mode pairs
- Type scale: sizes, weights (regular 400, medium 500 only — no 600/700), line heights
- Spacing scale: multiples of 4px
- Border radius scale: `md` 8px (default), `lg` 12px (cards), `xl` 16px
- Iconography: Lucide outline icons (no filled variants)
- Surface treatment: flat (no gradients, no shadows except focus rings)

### Canonical screens to design

1. Home (`/`) — both routes surfaced equally
2. Control plane shell, welcome state
3. Control plane shell, project active (matches the mockup already produced)
4. Static project page (single template — all projects use it)
5. Static track index (e.g., `/agentic`)
6. Static editorial page (Approach / Stack / About — single template, three uses)
7. Global AI guide chat overlay
8. Semantic search results (⌘K modal)
9. Compare mode (split workspace)
10. Responsive variants of 1, 4 at narrow widths (375px and 768px)

Total: ten canonical screens. Everything else is a variation of one of these.

### Components to design as a kit (used across screens)

- Project card (used on home, track index, search results)
- Status badge (Live / In dev / Concept)
- Capability tag pill
- Model picker chip
- Trace line item
- Metric row
- Collapsible section (for static page progressive disclosure)
- Streaming response container
- Sample picker (for demo inputs)

---

## 15. Open questions

These are decisions still to make. None blocks scaffolding; each can be answered during implementation:

**For the designer**

- Light or dark mode default? (Recommended: respect system preference, default dark for the control plane shell, default light for static pages — feels like an app vs. a document.)
- Sidebar collapsible on desktop? (Recommended: yes, with a thin icon-rail collapsed state.)
- Where does the AI Guide chat surface — floating button or right-side dock? (Recommended: floating button that opens a right-side panel, so it can coexist with the observability panel.)
- Architecture diagrams — generic component driven by a JSON graph, or hand-authored per project? (Recommended: generic component reading from each project's `architecture.mdx` — consistency beats bespoke at six projects and growing.)

**For Claude Code**

- Vector chunking strategy. Recommended: per-section MDX chunks (one chunk per H2-bounded section), with overlap for cross-section context preservation.
- Tool-calling pattern for agentic demos. Recommended: Vercel AI SDK's `streamText` with `tools: { ... }` map and `maxSteps: 8` — sufficient for the agentic projects in scope.
- Eval harness location. Recommended: a top-level `evals/` folder mirroring `content/`, with one eval file per project. Runs in CI weekly.

**For the architect (you)**

- Custom domain? (Recommended: `sowthri.dev` or similar — short, memorable, easy to put on a CV.)
- Anything to add to the project list once real project names are known.

---

*End of specification.*
