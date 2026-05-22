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
├── portfoliowebsite/         the portfolio website (stack not yet chosen)
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

`portfoliowebsite/` is the site that showcases this portfolio — a sibling of the three
tracks, not a track itself.

- **Status:** placeholder — currently only `README.md`; framework/stack not yet chosen.
- **Workflow:** edits follow the standard branch → PR → squash-merge flow. No dedicated
  CI workflow yet (per-project CI exists only for track projects).
- **To record here once decided:** stack/framework, hosting & deploy target, build &
  preview commands, and how project content feeds the site.

> _Placeholder — the portfolio-website workstream owns this section and will expand it._

## Conventions

- Folder and branch names: lowercase, hyphenated. Feature branches: `<track>-project-<N>-<desc>`.
- `portfoliowebsite/` stack is not yet decided.

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

Authoritative history is `git log` + merged PRs — keep this list to high-level milestones only.

## Key docs

- **[`gitprojectmanual.md`](gitprojectmanual.md)** — the detailed Git/GitHub workflow runbook.
- **[`README.md`](README.md)** — repo overview. Each track and project also has its own `README.md`.
