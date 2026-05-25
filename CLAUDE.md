# CLAUDE.md — AISolutions

Working memory and rules for this repository, auto-loaded into every Claude Code session.
**Keep it tight** — rules, status, and pointers, not prose. Detailed procedures live in
linked docs. Update the Projects table and Milestones as work progresses.

- **Repo:** `AISolutions` — https://github.com/sowthri-industrial-ai/AISolutions (public, default branch `main`)
- **Real clone:** `/Users/sowthrisomasundaram/Documents/GitHub/AISolutions`
- ⚠️ Two other local folders are also named `AISolutions` (`~/Documents/AISolutions`,
  `~/Documents/SolutionPortfolio/AISolutions`) and are **not** this repo. Verify with `git remote -v`.

## Working agreement — non-negotiable

1. **Branch for every change.** Never commit project work to `main`. Always:
   branch off `main` → commit → push → open a PR → **squash-merge** back to `main`.
   Only repo-level docs/config may be committed directly to `main`.
2. **Never force-push `main`.** If `main` has diverged: `git fetch` then rebase.
3. **Verify the branch before committing** — run `git switch <branch> && git commit …`
   as a single command (parallel sessions share the shell).
4. **Trailers:** every commit ends with the `Co-Authored-By: Claude` trailer; every PR
   body ends with `🤖 Generated with Claude Code`.
5. **A new project = a folder *and* a CI workflow.** `project-N/` is incomplete without
   `.github/workflows/ci-<track>-project-N.yml`.

→ Full procedure — commands, templates, recovery: **[`gitprojectmanual.md`](gitprojectmanual.md)**

## Structure

```
AISolutions/
├── README.md · LICENSE · .gitignore · .gitattributes · CLAUDE.md · gitprojectmanual.md
├── .github/        workflows/ci-<track>-project-N.yml (per project) · pull_request_template.md
├── docs/                     repo-wide documentation
├── portfolio-website/        the portfolio website (Next.js + MDX; see its TECH-STACK.md)
├── agenticai/ · assetsai/ · physicalai/      the three fixed tracks
│       └── projects/project-N/   self-contained: README · .gitignore · LICENSE
```

- Three fixed tracks; projects are numbered **per track** (no global "Project N").
- Every track and project folder is self-contained (own README/.gitignore/LICENSE) — intentional, not redundant.
- **CI:** path-filtered per-project workflows live only at the **repo-root** `.github/workflows/`.
  A nested `.github/` folder is silently ignored by GitHub — never create one.

## Projects — status

| Track | Projects | Status |
|-------|----------|--------|
| `agenticai` | project-1, project-2, project-3 | Not started |
| `assetsai` | project-1, project-2, project-3 | Not started |
| `physicalai` | project-1, project-2, project-3 | Not started |

Keep this table current. Add a project via `gitprojectmanual.md` §6.

## Portfolio website

`portfolio-website/` is the visitor-facing showcase — a sibling of the three tracks, not a
track itself. It *describes and demos* the work that lives in `<track>/projects/project-N/`,
which are independent codebases.

- **Authoritative spec:** [`portfolio-website/TECH-STACK.md`](portfolio-website/TECH-STACK.md)
  — folder structure, content schema, routing, AI features, safeguards, deployment.
- **Stack (locked):** Next.js 15 (App Router) · Tailwind v4 + shadcn/ui · MDX via
  `next-mdx-remote` · Supabase + pgvector · Vercel AI SDK (Anthropic, OpenAI, Together) ·
  Langfuse for LLM observability · Upstash Redis for rate limiting · Vercel hosting,
  deployed from the `portfolio-website/` subfolder.
- **Architecture in one line:** two surfaces — a control plane at `/control` (interactive
  workspaces with live demos) and static case study pages at `/{track}/{slug}` — both
  rendered from a single source at `portfolio-website/content/{track}/{slug}/`. Adding a
  project is dropping a folder there.
- **AI features (three layers):** global AI guide (chat across the site) · per-project
  copilot (RAG over each project's MDX) · live workspace demos (real model calls,
  streamed). Plus a top-bar model picker, compare mode, and an observability panel.
- **Relationship to root tracks:** the portfolio's `content/` describes work whose
  codebase lives at `<track>/projects/project-N/`. Cross-links go both ways. The portfolio
  does not import code from those folders — they are independent concerns.
- **Status:** architecture locked, spec committed, scaffold pending.

### Working boundary

- **Owned by this workstream:** everything inside `portfolio-website/`.
- **Not touched by this workstream:** root tracks (`agenticai/`, `assetsai/`, `physicalai/`),
  their CI workflows, the root-level docs (`README.md`, `gitprojectmanual.md`, sections of
  this file outside the Portfolio website section).
- **Branching:** standard branch → PR → squash-merge. Feature branches use the prefix
  `portfolio-<short-desc>`.
- **CI:** none yet — the per-project CI pattern in the root tracks does not apply here.
  A dedicated workflow (lint + typecheck + build + Vercel preview) will be added once the
  Next.js scaffold lands.

### What future Claude sessions should do here

- Read `portfolio-website/TECH-STACK.md` first. All implementation decisions defer to that
  document unless explicitly amended in this section.
- Never modify root track folders or their CI workflows as part of portfolio-website work.
- Adding a project to the portfolio = drop a folder under
  `portfolio-website/content/{track}/{slug}/` per Section 5 of the spec. Do not create
  the project's underlying codebase from here — that's a separate workstream.

## Conventions

- Folder and branch names: lowercase, hyphenated. Feature branches: `<track>-project-<N>-<desc>`.
- `portfolio-website/` stack: Next.js 15 (App Router) + Tailwind + shadcn/ui + MDX. Authoritative spec lives in `portfolio-website/TECH-STACK.md`.

## Claude Code tooling

Corrected against how Claude Code plugins actually work — not every item here is an
installable "plugin":

| Tool | What it is | How to enable |
|------|-----------|---------------|
| **Code Review** | The one installable plugin — on-demand local code review (`/code-review`) | `/plugin install code-review@claude-plugins-official`, then `/reload-plugins`. ⚠️ Research preview — may require a Team/Enterprise plan. |
| **Security Review** | A **built-in** command, not a plugin | Already available — run `/security-review`. Nothing to install. |
| **Auto Memory** | Built-in persistent cross-session context | Already active. |
| **codeburn** | A **standalone CLI tool**, not a Claude Code plugin — cost/observability dashboard | Optional; install separately from `github.com/getagentseal/codeburn`. |

Plugins are a repo-wide concern — configured at the repo root, never per-project. To share an
installed plugin set with everyone who clones the repo, commit it to `.claude/settings.json`
under `enabledPlugins`. Keep the set minimal.

**Deferred:** workflow-framework and output-style plugins — excluded to keep tooling minimal.
Revisit a frontend/design plugin only once `portfoliowebsite/` development begins.

## Milestones

- **2026-05-22** — Repo scaffolded: 4 top-level folders, 3 tracks.
- **2026-05-22** — 9 project folders added with per-folder independence + path-filtered CI.
- **2026-05-23** — `gitprojectmanual.md` Git/GitHub runbook added.
- **2026-05-23** — `CLAUDE.md` created as the repo's working memory.
- **2026-05-23** — Branch protection on `main`; PR template + `.gitattributes` added; plugin/tooling guidance corrected to match how Claude Code actually works.
- **2026-05-23** — `portfolio-website/` architecture authored; TECH-STACK.md spec drafted.
- **2026-05-23** — Folder renamed `portfoliowebsite` → `portfolio-website` (hyphen per spec).
- **2026-05-23** — `portfolio-website/` Next.js scaffold landed (PR #1 → `19b147b`): Next 16.2.6 + Tailwind v4 + shadcn/ui + MDX + Supabase + Vercel AI SDK; pnpm-managed.
- **2026-05-25** — Slice 3 design implementation merged (PR #4 → `a4ef03a`): control-plane shell + Architecture tab + Agent Reaction tab at full fidelity; 5 skeleton tabs; routing `/control/[track]/[slug]/[tab]`; 23 vitest tests.
- **2026-05-25** — TECH-STACK.md §6 reconciled (`faa658d`) to record the implemented `/control/[track]/[slug]/[tab]` route shape, ControlPlaneShell client wrapper, and the [slug]→/overview redirect.

Authoritative history is `git log` + merged PRs — keep this list to high-level milestones only.

## Key docs

- **[`gitprojectmanual.md`](gitprojectmanual.md)** — the detailed Git/GitHub workflow runbook.
- **[`README.md`](README.md)** — repo overview. Each track and project also has its own `README.md`.
