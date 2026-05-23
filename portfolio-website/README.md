# Portfolio website

The visitor-facing portfolio for the projects in this repository. Two
surfaces, one content source: an interactive control plane at `/control`
with live AI demos, and static case-study pages at `/{track}/{slug}`. Both
read from `content/{track}/{slug}/`.

**Authoritative spec:** [`TECH-STACK.md`](TECH-STACK.md) — folder structure,
content schema, routing, AI features, safeguards, deployment. Anything
not in this README is in there.

## Stack

Next.js 15+ (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · MDX
via `next-mdx-remote` · Supabase (Postgres + pgvector) · Vercel AI SDK
(Anthropic, OpenAI, Together) · Langfuse · Upstash Redis · Vercel hosting.

## Get started

```bash
# Pre-flight: Node 20+ (see .nvmrc), pnpm.
pnpm install
cp .env.example .env.local   # fill in real values
pnpm dev                     # http://localhost:3000
```

`.env.example` lists every variable, grouped. None of them are required to
boot the dev server today — most code paths are still TODO stubs.

## Layout

```
portfolio-website/
├── app/                 routes — control plane, static pages, /api
├── components/          ui (shadcn) + control-plane / workspace / static-page / shared / mdx
├── content/             source of truth — one folder per project
├── lib/                 content, vector, observability, rate-limit, session, store, ai/
├── scripts/             build-index, build-vectors, validate-content (prebuild)
├── types/               project, demo, session schemas
└── public/              fonts, images, media
```

## Scripts

| Command         | Use                                                  |
| --------------- | ---------------------------------------------------- |
| `pnpm dev`      | dev server                                           |
| `pnpm build`    | production build                                     |
| `pnpm start`    | serve the production build                           |
| `pnpm lint`     | ESLint                                               |

## Status

Scaffold only. The control plane, workspace, demo handlers, copilot, and
guide are placeholder routes and stub modules. Implementation order is
in TECH-STACK.md §13.

## Working agreement

Branch off `main` with the prefix `portfolio-<short-desc>`, open a PR,
squash-merge. Repo-wide rules live in [`../CLAUDE.md`](../CLAUDE.md);
the Git/GitHub runbook is [`../gitprojectmanual.md`](../gitprojectmanual.md).
