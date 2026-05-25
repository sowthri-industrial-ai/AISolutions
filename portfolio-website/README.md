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
# Pre-flight: Node 22+ (see .nvmrc), pnpm 11+ (matches package.json#packageManager).
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

## Local development

Install with **pnpm**, run scripts with **npm**. The `.pnpm/` symlinked
`node_modules` layout that pnpm produces is incompatible with `npm install`
(verified in PR #4 — npm errors with `Cannot read properties of null`),
so package installation is locked to pnpm via `package.json#packageManager`
(currently `pnpm@11.2.2`). Scripts under `package.json#scripts` work
identically through either tool; using `npm run <script>` keeps the
commands one-to-one with what CI executes.

```bash
# Install dependencies (pnpm only — npm install breaks on pnpm's .pnpm/ layout)
pnpm install

# Then use npm for everything else:
npm run dev        # start dev server
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # vitest
npm run build      # next build
```

## Deploying to Vercel

One-time setup, done via the Vercel dashboard since CI can't reach the
dashboard.

1. Install the Vercel GitHub App on the AISolutions repo if not already installed
2. Create a new Vercel project linked to this repo
3. Under Project Settings → General → Root Directory, set to `portfolio-website`
4. Vercel will auto-detect Next.js — leave build settings on defaults
5. Under Project Settings → Environment Variables, add the variables listed in
   [TECH-STACK.md §10 → Environment variables](./TECH-STACK.md#environment-variables)
   for Production, Preview, and Development environments
6. Trigger a redeploy of the latest `main` to generate the first production
   deployment

After step 5, every subsequent PR automatically gets a Vercel preview URL
posted as a comment by the Vercel GitHub App.
