# Adding a project to the portfolio

This file is the **single source of truth** for what to fill in when
adding a new project to the portfolio. It bundles three things into one
doc so you only have to open one tab when starting:

1. **Reference guide** — file-by-file checklist of what gets created
   and where
2. **Copy-paste templates** — `project.json`, each MDX skeleton, and
   the `demo.ts` stub, ready to fill in
3. **Fillable Claude brief** — at the end, a brief template you can
   paste into a Claude session when delegating the work

Read TECH-STACK.md §5 (content schema) and §6 (routing) once for the
full picture, then come back here. Working agreements (branching,
commit trailers, env-var slice discipline) live in the repo-root
[`CLAUDE.md`](../CLAUDE.md).

---

## Decide three things first

Before touching files, answer these. They drive everything downstream.

| | Question | Notes |
|---|---|---|
| 1 | **Slug** | kebab-case, matches folder name, becomes the URL segment under `/control/<track>/<slug>/`. Examples: `supply-chain-copilot`, `rag-foundry`. |
| 2 | **Track** | One of `agentic` · `assets` · `physical`. Determines the colour accent throughout the UI and the sidebar group. |
| 3 | **Fidelity tier** | **Full** = Architecture tab + Agent Reaction tab + all MDX bodies; **Skeleton** = project.json only, all tabs render the "Design pending" stub. SupplyChainCopilot is the only full-fidelity project today. |

The fidelity tier governs how much of the checklist applies. Skeleton
projects need only steps 1-3 below; full-fidelity needs all 10.

---

## Step-by-step checklist

### 1. Create the content folder

```bash
mkdir -p portfolio-website/content/<track>/<slug>
mkdir -p portfolio-website/content/<track>/<slug>/sessions
```

### 2. Fill `project.json` (required for all projects)

Copy from the template block below and edit. Every field except
`hero`, `evalScore`, `averageRunCost`, `relatedProjects`, and
`featured` is required. Schema is enforced in `types/project.ts`.

### 3. Add the project to the in-memory registry

Open `portfolio-website/lib/projects.ts` and append an entry to the
`PROJECTS` array. The view-model is a superset of `project.json` —
extra fields for the chrome:

```typescript
{
  id: "<slug>",                           // matches project.json slug
  name: "<title>",                        // matches project.json title
  track: "<track>",                       // matches project.json track
  status: "live" | "beta" | "draft",      // display status (drives sidebar dot color)
  summary: "<one-line description>",      // matches project.json summary
  capabilities: ["multi-agent", "rag"],   // shown as pills under the title
  metrics: {                              // shown in right-rail METRICS block
    tokens: "1,247",
    latency: "1.2s",
    cost: "$0.018",
    eval: "92%",
  },
  trace: [                                // shown in right-rail TRACE block
    { kind: "call",  text: "supplier.query()",      tone: "success" },
    { kind: "call",  text: "inventory.lookup()",    tone: "success" },
    { kind: "arrow", tone: "muted" },
    { kind: "call",  text: "decision.synthesize()", tone: "info"    },
    { kind: "note",  text: "formatting…",           tone: "muted"   },
  ],
  related: {                              // shown in right-rail RELATED block
    label: "RAGFoundry",
    track: "assets",
    note: "Shares retrieval with",
  },
  defaultModel: "claude-opus-4-7",        // top-bar model chip default
  publishedAt: "2026-MM-DD",
  featured: true,                          // if true, surfaces on the home page
}
```

> For **skeleton projects**, only `id`, `name`, `track`, `status`,
> `summary` are needed. Omit the rest — the StubProject panel
> doesn't read `metrics` / `trace` / `related`.

---

### Steps 4-10 — full-fidelity projects only

If your project is skeleton-tier, you're done after step 3.
If full-fidelity, continue.

### 4. Write the MDX bodies

Six files, one per tab (the seven-tab strip's `Agent Reaction` is a
bespoke React tab — no MDX). Templates at the bottom of this doc.

| File | Tab | What goes in |
|---|---|---|
| `overview.mdx` | Overview | The problem · what the system does · outcome. ~3 paragraphs. |
| `architecture.mdx` | Architecture | Prose only — the diagram is in `lib/architecture-data.ts`. Use this MDX for the "Why this shape" paragraph and any architectural commentary. |
| `prompts.mdx` | Prompts | Annotated prompt blocks for each agent. Use `<pre><code>` with the `.tok-*` syntax tokens for highlighting (see `app/globals.css`). |
| `results.mdx` | Results | Evaluation table, production stats, anything quantitative. |
| `tradeoffs.mdx` | Trade-offs | Decisions made + counter-positions + what you'd revisit. |

### 5. Add architecture data — `lib/architecture-data.ts`

Append an entry to the `ARCHITECTURES` map. Shape: 6 layer bands
(`layers`), 2 cross-cutting rails (`leftRail`, `rightRail`),
1 plinth (`plinth`), 1 system-shape paragraph, 1 why-this-shape
paragraph. See SupplyChainCopilot's entry as the working reference.

### 6. Add agent reaction data — `lib/agent-reaction-data.ts`

Required only if the project is multi-agent. Append to
`AGENT_REACTIONS`. Need to specify:

- `table1Lit` / `table2Lit` / `table3Lit` — 2-letter codes that
  "light up" in each periodic table
- `compounds` — array of deployed agents, each with `name`,
  `baseRole` (Table 2 code), `birthAnatomy` (Table 1 row name),
  `anatomy[]`, `knowledge[]`
- `edges` — directed graph topology
- `sequence` — array of message-passing steps with `phase` + `step`
- `phases` — phase brackets (Discovery / Decision / Approval)
- `scenario` · `totalDuration` · `baselineNote` · `resultNarrative`

The shape is large but mechanical. See SupplyChainCopilot for the
reference implementation.

### 7. Add the slug to the documented-project gate

Open `portfolio-website/components/workspace/tab-content.tsx` and
add your slug to the `DOCUMENTED_PROJECTS` Set:

```typescript
const DOCUMENTED_PROJECTS = new Set<string>([
  "supply-chain-copilot",
  "<your-slug>",
]);
```

> **Future refactor (TODO when 3rd documented project lands):**
> derive this from MDX-file-presence via `fs.existsSync` at build
> time instead of hand-maintaining the Set. Leave a TODO if you're
> adding the 2nd project; do the refactor on the 3rd.

### 8. Implement (or stub) `demo.ts`

If the project has a runnable demo, implement the `DemoHandler`
interface from `types/demo.ts`. If not, copy the stub template
below — it satisfies the type so the loader doesn't crash.

### 9. Optional — `sessions/session-001.json`

A captured demo run for the right-rail trace replay. Schema is in
`types/session.ts`. Used for offline-mode playback when the live
demo runtime isn't reachable.

### 10. Env vars (per slice that adds reads)

**Working agreement:** any PR that introduces `process.env.X` reads
must name the new vars in its description with a *"Vercel update
required before merge"* note, so Vercel env config stays in sync
with what code reads. Set vars in Vercel as part of merging the
slice that adds the reads, never proactively. See
[TECH-STACK.md §10](./TECH-STACK.md#environment-variables) for the
current spec list.

---

## Templates

### `project.json`

```json
{
  "slug": "<kebab-case-slug>",
  "title": "<DisplayName>",
  "track": "<agentic|assets|physical>",
  "status": "<live|in-dev|concept>",
  "summary": "<one-line description, ~120 chars>",
  "capabilities": ["multi-agent", "tool-use", "rag"],
  "modelsUsed": ["claude", "gpt"],
  "publishedAt": "2026-MM-DD",
  "featured": false,
  "defaultModel": "claude-opus-4-7",
  "evalScore": 0,
  "averageRunCost": { "tokens": 0, "usd": 0 },
  "relatedProjects": []
}
```

### `overview.mdx`

```mdx
---
title: Overview
order: 1
---

## The problem

<What pain was this built to solve? Quantify if you can — dollars,
hours, error rate.>

## What the system does

- <Capability one>
- <Capability two>
- <Capability three>

## Outcome

<What did it move? Time-to-decision, accuracy, cost. Concrete metrics.>

<div className="callout">
  <Operator-in-the-loop note, safety boundary, or any
  non-obvious constraint the visitor should know.>
</div>
```

### `architecture.mdx`

```mdx
---
title: Architecture
order: 2
---

## System shape

<2-3 sentence summary of the stack. The interactive 6-layer diagram
is rendered from `lib/architecture-data.ts`; this MDX exists so the
static surface and future authoring tools have prose alongside the
structure.>

## Why this shape

<The decisions and their counter-positions. What did you NOT do, and
why? What was the cost of the path you took?>
```

### `prompts.mdx`

```mdx
---
title: Prompts
order: 4
---

## <AgentName> — system prompt

<Brief framing of what this agent does.>

```text
# role: system
You are <AgentName> for <use case>.

Rules:
  · <constraint>
  · <constraint>

Tools:
  - tool.one(arg)
  - tool.two(arg)
```

## <CriticAgent> — adversarial pass

```text
# role: system
You are <CriticAgent>. Given a draft from <AgentName>, ...
```

### Version

`<agent>@x.y.z` · gated rollout via PromptOps.
```

### `results.mdx`

```mdx
---
title: Results
order: 5
---

## Offline evals

<Benchmark description — how many scenarios, where they came from,
held-out vs. tuning split.>

| Metric                       | Baseline | <version> | Δ |
| ---------------------------- | -------: | -------:  | -:|
| <metric one>                 |          |           |   |
| <metric two>                 |          |           |   |

## Production, 24h window

- <stat>
- <stat>
- <stat>
```

### `tradeoffs.mdx`

```mdx
---
title: Trade-offs
order: 6
---

## What we chose, and what it cost

<One-paragraph framing.>

### <Decision one>

<What you chose, what you gave up, why the trade was worth it.>

### <Decision two>

<Same shape.>

### What I'd revisit

- <Item>
- <Item>
```

### `demo.ts` (stub)

```typescript
import type { DemoHandler, DemoInput, DemoStep } from "@/types/demo";

const samples: DemoHandler["samples"] = [
  { id: "sample-one", label: "Sample one", input: { prompt: "<seed>" } },
];

const handler: DemoHandler = {
  samples,
  validate(input: DemoInput) {
    if (!input.prompt?.trim()) return { ok: false, reason: "Empty prompt" };
    return { ok: true };
  },
  async *run(): AsyncIterable<DemoStep> {
    // TODO(runtime): replace with a real run streamed from
    // /api/demo/[track]/[slug]/route.ts.
    yield { agent: "stub", content: "Demo runtime not yet wired." };
  },
};

export default handler;
```

---

## Fillable Claude brief (paste this into a session)

Copy from `# Slice — Add` to the bottom, fill in the bracketed
fields, and paste to a Claude session. The shape mirrors the
slice-3 and slice-4 briefs that produced PRs #4 and #5.

```markdown
# Slice — Add <ProjectName> to the portfolio (<fidelity-tier> tier)

You're adding one new project to the AISolutions portfolio under
`portfolio-website/content/<track>/<slug>/`. Current `main` tip:
[check `git log -1` and paste here].

## Identity
- **Slug:** <kebab-case>
- **Track:** <agentic | assets | physical>
- **Status:** <live | in-dev | concept>
- **Summary:** <one line, ~120 chars>
- **Capabilities:** <list from Capability union in types/project.ts>
- **Models used:** <claude / gpt / llama / open-weights / custom>
- **Default model:** <e.g. claude-opus-4-7>
- **Fidelity tier:** <full | skeleton>

## Read these three files first
1. `portfolio-website/ADDING-A-PROJECT.md` (this guide)
2. `portfolio-website/TECH-STACK.md` §5 (content schema) + §6 (routing)
3. `portfolio-website/content/agentic/supply-chain-copilot/` (working example)

## Execution mode: autonomous, no permission prompts

### Permitted without asking
- File reads/writes under `portfolio-website/content/<track>/<slug>/`
- Edits to `portfolio-website/lib/projects.ts`
- For full-fidelity: edits to `lib/architecture-data.ts`,
  `lib/agent-reaction-data.ts`, `components/workspace/tab-content.tsx`
- `git`, `npm run lint/typecheck/test/build`, `pnpm install`
- `gh pr create/view/comment`

### Forbidden
- Push directly to `main`
- Force push
- Modify other projects' content folders
- Modify `TECH-STACK.md`, `CLAUDE.md`, or `gitprojectmanual.md`
  unless this brief explicitly directs you to
- Commit secrets

## Branch + PR shape
- Branch: `portfolio-add-<slug>`
- PR title: `feat(portfolio): add <ProjectName> (<fidelity-tier>)`
- PR body must include:
  - Acceptance checklist (project.json present, MDX bodies present
    if full-fidelity, registry entry added, gate updated if
    documented)
  - Decisions made under ambiguity
  - Note any env vars introduced (per env-var working agreement)

## Acceptance criteria
- `npm run lint && npm run typecheck && npm test && npm run build`
  all green
- Project appears in the sidebar under the right track
- Clicking the project navigates to `/control/<track>/<slug>/overview`
  (or whichever tab is wired)
- For full-fidelity: Architecture + Agent Reaction tabs render
  correctly with the project's bespoke data

## Architecture data (paste below if fidelity = full)

<6 layers, each with name, purpose, items[]>
<Left rail: Observability & Eval items>
<Right rail: Security & Governance items>
<Plinth: Infrastructure items>
<System shape paragraph>
<Why this shape paragraph>

## Agent Reaction data (paste below if multi-agent)

<Lit cells in T1 (anatomy), T2 (roles), T3 (knowledge)>
<Compounds: name, baseRole, birthAnatomy, anatomy[], knowledge[]>
<Edges: from → to>
<Sequence: step, phase, from → to, message>
<Phases: id, label, steps[], duration>
<Scenario · totalDuration · baselineNote · resultNarrative>
```

---

## Reference

- **Schema:** [`types/project.ts`](./types/project.ts), [`types/demo.ts`](./types/demo.ts), [`types/session.ts`](./types/session.ts)
- **Working example:** [`content/agentic/supply-chain-copilot/`](./content/agentic/supply-chain-copilot/)
- **Authoritative spec:** [`TECH-STACK.md`](./TECH-STACK.md) §5 (content schema), §6 (routing), §10 (env vars)
- **Working agreements:** [`../CLAUDE.md`](../CLAUDE.md) (root)
- **Git runbook:** [`../gitprojectmanual.md`](../gitprojectmanual.md) (root)
