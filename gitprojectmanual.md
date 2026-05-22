# Git & GitHub Project Manual — AISolutions

**The single source of truth for how Claude Code sessions use Git and GitHub in this repository.**

If you are a Claude Code session about to do work in this repo, read this file first. Where a
procedure here conflicts with a habit or a half-remembered convention, **this document wins.**

- **Audience:** Claude Code sessions ("project codes") working on the AISolutions portfolio.
- **Location:** repo root — `gitprojectmanual.md`.
- **Scope:** Git/GitHub workflow only — branching, commits, pull requests, CI, and how to add a project.

---

## 1. Golden rules — never violate these

1. **Work in the real clone only.** The repo lives at
   `/Users/sowthrisomasundaram/Documents/GitHub/AISolutions`. Two *other* folders are also named
   `AISolutions` — `~/Documents/AISolutions` and `~/Documents/SolutionPortfolio/AISolutions` — and
   are **not** this repo. Before working, confirm with `git -C <path> remote -v`; it must show
   `sowthri-industrial-ai/AISolutions`.
2. **Never force-push `main`.** If `main` has diverged, `git fetch` then **rebase** — never
   overwrite remote history.
3. **Verify the branch in the same command as the commit.** Parallel sessions share the shell and
   the branch can change between calls. Always run `git -C "$R" switch <branch> && git -C "$R" commit ...`
   as one command.
4. **Project work goes through a feature branch and a pull request**, squash-merged into `main`.
   Never commit project work straight to `main`. (Only repo-level docs/config — such as this
   manual — are committed directly to `main`.)
5. **Every commit ends with the `Co-Authored-By: Claude` trailer; every PR body ends with the
   `🤖 Generated with Claude Code` line.** See §7.
6. **A new project is a folder *and* a CI workflow.** A `project-N/` folder without its
   `.github/workflows/ci-<track>-project-N.yml` is incomplete. See §6.

---

## 2. Repo facts

| Field | Value |
|---|---|
| Repository | `AISolutions` |
| GitHub | https://github.com/sowthri-industrial-ai/AISolutions |
| Account | `sowthri-industrial-ai` |
| Local clone | `/Users/sowthrisomasundaram/Documents/GitHub/AISolutions` |
| Default branch | `main` |
| Visibility | public |

Throughout this manual, `$R` is the clone path. Define it once per shell session:

```bash
R=/Users/sowthrisomasundaram/Documents/GitHub/AISolutions
```

All git commands use `git -C "$R" ...` so they work regardless of the current directory.

---

## 3. Repository structure

```
AISolutions/
├── README.md · .gitignore · LICENSE      repo-level files
├── gitprojectmanual.md                   this manual
├── .github/workflows/                    one CI workflow per project:
│                                         ci-<track>-project-N.yml
├── docs/                                 repo-wide documentation
├── portfoliowebsite/                     the portfolio website
├── agenticai/        ┐
├── assetsai/         ├ the three tracks
└── physicalai/       ┘
        ├── README.md · .gitignore · LICENSE   track-level files
        ├── docs/                              track documentation
        └── projects/
            ├── project-1/   ┐ each project folder is self-contained:
            ├── project-2/   ├ README.md · .gitignore · LICENSE
            └── project-3/   ┘
```

- **Tracks** are fixed: `agenticai`, `assetsai`, `physicalai`.
- **Projects** are numbered **per track** — `project-1`, `project-2`, … inside each track's
  `projects/` folder.
- Every track and every project folder is *self-contained*: it carries its own `README.md`,
  `.gitignore`, and `LICENSE`. This duplication is intentional — do not "clean it up".

> **On numbering:** there is no global "Project 10". Projects are numbered within their track.
> The 10th project overall is simply the next `project-N` in whichever track it belongs to —
> e.g. `agenticai`'s 4th project is `agenticai/projects/project-4`.

---

## 4. Start of every session

Before any work, sync the local clone:

```bash
R=/Users/sowthrisomasundaram/Documents/GitHub/AISolutions
git -C "$R" remote -v                       # confirm: sowthri-industrial-ai/AISolutions
git -C "$R" fetch origin
git -C "$R" switch main
git -C "$R" pull --ff-only origin main       # fast-forward local main
git -C "$R" status --short --branch          # confirm clean tree, in sync with origin/main
```

If `pull --ff-only` fails, `main` has diverged — stop and see §9 before continuing.

---

## 5. Workflow A — working on an existing project

Example: working on **`agenticai/projects/project-1`**. (Working on `portfoliowebsite/` or
`docs/` follows the same steps; those folders simply have no per-project CI workflow.)

```bash
R=/Users/sowthrisomasundaram/Documents/GitHub/AISolutions
BRANCH=agenticai-project-1-short-description     # see "Branch naming" below

# 1. Sync main (see §4)
git -C "$R" fetch origin && git -C "$R" switch main && git -C "$R" pull --ff-only origin main

# 2. Create a feature branch off main
git -C "$R" switch -c "$BRANCH"

# 3. Do the work — only inside agenticai/projects/project-1/

# 4. Stage, then commit WITH the branch check in one command (golden rule 3)
git -C "$R" add -A
git -C "$R" switch "$BRANCH" && git -C "$R" commit \
  -m "Short imperative subject" \
  -m "Body: what changed and why." \
  -m "Co-Authored-By: Claude <noreply@anthropic.com>"

# 5. Push the branch
git -C "$R" push -u origin "$BRANCH"

# 6. Open a pull request (see §7 for body conventions)
gh pr create -R sowthri-industrial-ai/AISolutions --base main --head "$BRANCH" \
  --title "Short imperative subject" \
  --body "$(cat <<'EOF'
What changed and why.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"

# 7. CI runs automatically — ci-agenticai-project-1.yml triggers because files
#    under agenticai/projects/project-1/** changed.

# 8. After review and green CI, squash-merge and delete the branch
gh pr merge --squash --delete-branch
```

**Branch naming:** `<track>-project-<N>-<short-description>`, lowercase and hyphenated —
e.g. `agenticai-project-1-add-data-loader`.

**Definition of done:** PR squash-merged into `main`, CI green, branch deleted.

---

## 6. Workflow B — scaffolding a new project

Example: adding a **4th project to the `agenticai` track** (`agenticai/projects/project-4`).
The same steps work for any track and any next number.

```bash
R=/Users/sowthrisomasundaram/Documents/GitHub/AISolutions
TRACK=agenticai                       # agenticai | assetsai | physicalai
N=4                                   # the next free project number IN THAT TRACK
BRANCH="$TRACK-project-$N-init"

# 1. Sync main, branch off
git -C "$R" fetch origin && git -C "$R" switch main && git -C "$R" pull --ff-only origin main
git -C "$R" switch -c "$BRANCH"

# 2. Create the project folder and its self-contained files
P="$R/$TRACK/projects/project-$N"
mkdir -p "$P"
cp "$R/LICENSE"    "$P/LICENSE"
cp "$R/.gitignore" "$P/.gitignore"
#    ...then write $P/README.md from the template in §6.1

# 3. Create the project's CI workflow at the REPO ROOT
#    ...write $R/.github/workflows/ci-$TRACK-project-$N.yml from the template in §6.2

# 4. Commit, push, PR, squash-merge — exactly as Workflow A steps 4–8
```

**Definition of done:** the project folder has `README.md` + `.gitignore` + `LICENSE`,
`.github/workflows/ci-<track>-project-N.yml` exists, the PR is squash-merged, and the new
workflow shows a green run in the [Actions tab](https://github.com/sowthri-industrial-ai/AISolutions/actions).

### 6.1 Project `README.md` template

Replace `<N>` and `<Track display name>` (Agentic AI / Assets AI / Physical AI), and
`<track>` (the lowercase slug):

```markdown
# Project <N>

Project <N> of the **<Track display name>** track.

A self-contained project — this folder carries its own `README.md`, `.gitignore`,
and `LICENSE`. CI runs from the repo-root workflow
[`ci-<track>-project-<N>.yml`](../../../.github/workflows/ci-<track>-project-<N>.yml),
path-filtered so it triggers only on changes inside this folder.

## Status

Not started.

## Layout

Add `src/`, `tests/`, and `docs/` as the project takes shape.
```

### 6.2 CI workflow template — `.github/workflows/ci-<track>-project-<N>.yml`

Replace `<TRACK>` and `<N>`. **Keep `${{ github.ref }}` literal** — it is GitHub Actions
expression syntax, not a shell variable.

```yaml
name: "CI · <TRACK>/project-<N>"

# Path-filtered: runs ONLY when this project's files change, so it never
# overlaps with any other project's CI.
on:
  push:
    paths:
      - '<TRACK>/projects/project-<N>/**'
      - '.github/workflows/ci-<TRACK>-project-<N>.yml'
  pull_request:
    paths:
      - '<TRACK>/projects/project-<N>/**'

# Per-project concurrency group: rapid pushes to THIS project supersede each
# other; other projects' workflows run in parallel, unaffected.
concurrency:
  group: ci-<TRACK>-project-<N>-${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Placeholder
        run: echo "CI stub for <TRACK>/projects/project-<N> — add build & test steps here."
```

---

## 7. Commit & pull request conventions

**Commit messages**
- Subject: imperative mood, concise (≤ ~70 chars) — e.g. `Add data loader to agenticai/project-1`.
- Body (optional but preferred): what changed and why.
- Trailer: `Co-Authored-By: Claude <noreply@anthropic.com>`. If your session environment
  specifies an exact co-author string, use that verbatim instead.
- One logical change per commit.

**Pull requests**
- Create with `gh pr create -R sowthri-industrial-ai/AISolutions --base main`.
- Title: same style as a commit subject.
- Body: summary of the change and any CI/test notes. End with:
  `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
- Merge with **squash-merge**: `gh pr merge --squash --delete-branch`. This keeps `main`
  history linear — one commit per merged PR.

---

## 8. CI / GitHub Actions

- Each project has **exactly one** workflow: `.github/workflows/ci-<track>-project-N.yml`,
  living at the **repo root** `.github/workflows/`.
- **Why the repo root:** GitHub Actions only runs workflows from the repo-root
  `.github/workflows/`. A `.github/` folder placed *inside* a project or track is **silently
  ignored** — it never runs. Never create nested `.github/` folders.
- **Isolation via `paths:`** — a workflow triggers only when files under its own project
  folder change. Projects never trigger each other's CI.
- **Concurrency** — each workflow has a per-project `concurrency` group. Different projects
  run in parallel; a rapid re-push to the *same* project cancels its own stale run.
- The job is currently an `echo` stub. Replace it with real build/test steps as the project
  gains code, and **SHA-pin** any marketplace actions you add (e.g.
  `actions/checkout@<full-40-char-sha>`) — never floating tags like `@v4`.

---

## 9. Pitfalls & recovery

| Symptom | Fix |
|---|---|
| Unsure you're in the right repo | `git -C "$R" remote -v` → must be `sowthri-industrial-ai/AISolutions`. The two other `AISolutions` folders are decoys. |
| New project has no CI | The workflow `ci-<track>-project-N.yml` was not created at the repo root. Add it (§6.2). |
| Committed project work to `main` (not yet pushed) | `git -C "$R" branch <feature-branch>` to save the commit, `git -C "$R" switch main`, `git -C "$R" reset --hard origin/main`, then `git -C "$R" switch <feature-branch>` and continue. |
| `pull --ff-only` fails / `main` diverged | `git -C "$R" fetch origin`, inspect with `git -C "$R" log --oneline origin/main..main`, then **rebase** local commits onto `origin/main`. Never force-push `main`. |
| Branch changed unexpectedly mid-task | A parallel session switched it. Always pair `switch` + `commit` in one command (golden rule 3). |
| A nested `.github/workflows/` "isn't running" | It never will — only the repo-root `.github/workflows/` runs (§8). |

---

*Keep this manual current: if the workflow changes, update this file in the same change.
Last reviewed: 2026-05-23.*
