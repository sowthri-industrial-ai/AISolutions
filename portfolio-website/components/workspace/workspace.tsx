// Workspace — the middle column of the control plane when a project is
// active. Composed of four bands top-to-bottom:
//
//   1. Project header  — title + status + summary + capability pills
//   2. Tab strip       — Overview / Architecture / Demo / Prompts / Results /
//                        Trade-offs, URL-driven (?tab=…), no client JS
//   3. Tab content     — the requested MDX section compiled via
//                        next-mdx-remote/rsc, OR a placeholder card for Demo
//   4. Copilot strip   — sticky to the bottom of the main column, visual
//                        only in slice 3 (RAG wires in slice 5)
//
// The whole component is a server component. MDXRemote is awaited inside,
// so loading a tab is a real server render — no client hydration cost on
// the MDX itself.

import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import remarkGfm from "remark-gfm";

import { ArrowRight, Sparkles } from "lucide-react";

import { mdxComponents } from "@/components/mdx/mdx-components";
import type { LoadedProject, SectionName } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Capability, ProjectStatus } from "@/types/project";

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

const TAB_DEFS: {
  id: TabId;
  label: string;
  section?: SectionName;
}[] = [
  { id: "overview", label: "Overview", section: "overview" },
  { id: "architecture", label: "Architecture", section: "architecture" },
  { id: "demo", label: "Demo" }, // placeholder card in slice 3
  { id: "prompts", label: "Prompts", section: "prompts" },
  { id: "results", label: "Results", section: "results" },
  { id: "tradeoffs", label: "Trade-offs", section: "tradeoffs" },
];

export type TabId =
  | "overview"
  | "architecture"
  | "demo"
  | "prompts"
  | "results"
  | "tradeoffs";

const TAB_IDS: TabId[] = [
  "overview",
  "architecture",
  "demo",
  "prompts",
  "results",
  "tradeoffs",
];

/** Coerce an arbitrary string into a known TabId. Falls back to "overview". */
export function normalizeTab(input: string | undefined): TabId {
  return TAB_IDS.includes(input as TabId) ? (input as TabId) : "overview";
}

// ---------------------------------------------------------------------------
// Workspace
// ---------------------------------------------------------------------------

interface WorkspaceProps {
  project: LoadedProject;
  tab: TabId;
}

export function Workspace({ project, tab }: WorkspaceProps) {
  const { metadata, sections } = project;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ProjectHeader
        title={metadata.title}
        status={metadata.status}
        summary={metadata.summary}
        capabilities={metadata.capabilities}
      />

      <TabStrip current={tab} track={metadata.track} slug={metadata.slug} />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <TabContent tab={tab} sections={sections} projectTitle={metadata.title} />
        </div>
      </div>

      <CopilotStrip projectTitle={metadata.title} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function ProjectHeader({
  title,
  status,
  summary,
  capabilities,
}: {
  title: string;
  status: ProjectStatus;
  summary: string;
  capabilities: Capability[];
}) {
  return (
    <header className="border-b-hairline border-border px-6 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-medium tracking-tight text-foreground">
          {title}
        </h1>
        <StatusBadge status={status} />
      </div>
      <p className="mt-2 max-w-2xl text-sm text-foreground-muted">{summary}</p>
      {capabilities.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {capabilities.map((cap) => (
            <li
              key={cap}
              className="rounded-sm bg-info-bg px-2 py-0.5 text-xs text-info"
            >
              {cap}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, { bg: string; fg: string; label: string }> = {
    live: { bg: "bg-success-bg", fg: "text-success", label: "Live" },
    "in-dev": { bg: "bg-info-bg", fg: "text-info", label: "In dev" },
    concept: {
      bg: "bg-background-subtle",
      fg: "text-foreground-muted",
      label: "Concept",
    },
  };
  const s = styles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
        s.bg,
        s.fg,
      )}
    >
      {s.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

function TabStrip({
  current,
  track,
  slug,
}: {
  current: TabId;
  track: string;
  slug: string;
}) {
  return (
    <nav className="flex gap-0 border-b-hairline border-border px-6">
      {TAB_DEFS.map(({ id, label }) => {
        const isActive = id === current;
        const href = id === "overview" ? `/${track}/${slug}` : `/${track}/${slug}?tab=${id}`;
        return (
          <Link
            key={id}
            href={href}
            scroll={false}
            className={cn(
              "border-b-2 px-3 py-2.5 text-md transition-colors",
              isActive
                ? "border-foreground text-foreground"
                : "border-transparent text-foreground-muted hover:text-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Tab content
// ---------------------------------------------------------------------------

async function TabContent({
  tab,
  sections,
  projectTitle,
}: {
  tab: TabId;
  sections: LoadedProject["sections"];
  projectTitle: string;
}) {
  if (tab === "demo") {
    return <DemoPlaceholder projectTitle={projectTitle} />;
  }

  const sectionName = TAB_DEFS.find((t) => t.id === tab)?.section as
    | SectionName
    | undefined;
  if (!sectionName) {
    return <DemoPlaceholder projectTitle={projectTitle} />;
  }

  const source = sections[sectionName];
  return (
    <article>
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </article>
  );
}

function DemoPlaceholder({ projectTitle }: { projectTitle: string }) {
  return (
    <div className="rounded-md border-hairline border-border bg-background-subtle p-5">
      <div className="flex items-center gap-2">
        <span className="rounded-sm bg-info-bg px-2 py-0.5 text-2xs font-medium uppercase tracking-wider text-info">
          Preview
        </span>
        <span className="text-md font-medium text-foreground">
          Live demo: wires in Slice 4
        </span>
      </div>
      <p className="mt-2 text-sm text-foreground-muted">
        The runner that drives {projectTitle}&apos;s agent loop streams trace
        lines into the observability panel on the right. For now the input
        and Run button below are visual placeholders so the layout can be
        reviewed before the handler is plumbed in.
      </p>

      <div className="mt-5 space-y-2">
        <label
          htmlFor="demo-input-stub"
          className="block text-2xs font-medium uppercase tracking-wider text-foreground-subtle"
        >
          Prompt
        </label>
        <div className="flex items-stretch gap-2">
          <input
            id="demo-input-stub"
            type="text"
            disabled
            defaultValue="Try a sample run — handler lands in slice 4."
            className="flex-1 rounded-md border-hairline border-border bg-background px-3 py-2 text-sm text-foreground-muted"
          />
          <button
            type="button"
            disabled
            className="rounded-md border-hairline border-border bg-background-elevated px-4 text-sm text-foreground-muted"
          >
            Run
          </button>
        </div>
        <p className="text-xs text-foreground-subtle">
          The runner is not implemented yet — coming in Slice 4.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Copilot strip
// ---------------------------------------------------------------------------

function CopilotStrip({ projectTitle }: { projectTitle: string }) {
  return (
    <footer className="border-t-hairline border-border bg-background-elevated px-6 py-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-2xs font-medium uppercase tracking-wider text-foreground-subtle">
        <Sparkles className="size-3" />
        Ask about this project
      </div>
      <form
        // Visual only — slice 5 wires the RAG copilot. Disabled inputs make
        // that obvious without disabling keyboard navigation entirely.
        action="#"
        className="flex items-stretch gap-2"
      >
        <input
          type="text"
          placeholder={`Why pgvector instead of Pinecone in ${projectTitle}?`}
          disabled
          className="flex-1 rounded-md border-hairline border-border bg-background-subtle px-3 py-2 text-sm placeholder:text-foreground-subtle"
          aria-label="Ask the project copilot"
        />
        <button
          type="submit"
          disabled
          className="grid w-9 place-items-center rounded-md border-hairline border-border bg-background text-foreground-muted"
          aria-label="Send (visual only — wires in slice 5)"
        >
          <ArrowRight className="size-4" />
        </button>
      </form>
    </footer>
  );
}
