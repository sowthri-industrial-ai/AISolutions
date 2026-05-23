"use client";

// Right rail of the control plane. 220 px wide, dark elevated surface, scrolls
// its own overflow. Shows three sections — TRACE, METRICS, RELATED — when a
// project is active.
//
// Slice 3 scope: trace lines are HARD-CODED mock output, just enough to make
// the panel feel alive while the layout is being designed. Metrics + related
// come from the active project's manifest. Real Langfuse-backed trace and
// live metrics land in slice 4.

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { ProjectMetadata, ProjectTrack } from "@/types/project";

interface ObservabilityPanelProps {
  projects: ProjectMetadata[];
}

export function ObservabilityPanel({ projects }: ObservabilityPanelProps) {
  const pathname = usePathname();
  const active = matchActive(pathname, projects);

  return (
    <aside className="flex h-full flex-col overflow-y-auto border-l-hairline border-border bg-background-elevated">
      {active ? (
        <ActiveContent project={active} all={projects} />
      ) : (
        <EmptyHint />
      )}
    </aside>
  );
}

function EmptyHint() {
  return (
    <div className="flex h-full items-center justify-center px-4 text-center text-xs text-foreground-subtle">
      Select a project to begin.
    </div>
  );
}

function ActiveContent({
  project,
  all,
}: {
  project: ProjectMetadata;
  all: ProjectMetadata[];
}) {
  return (
    <div className="flex flex-col gap-5 px-3 py-4">
      <TraceSection />
      <Divider />
      <MetricsSection project={project} />
      {project.relatedProjects && project.relatedProjects.length > 0 && (
        <>
          <Divider />
          <RelatedSection
            track={project.track}
            slugs={project.relatedProjects}
            all={all}
          />
        </>
      )}
    </div>
  );
}

function Divider() {
  return <div className="border-t-hairline border-border" />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-1 text-2xs font-medium uppercase tracking-wider text-foreground-subtle">
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TRACE — mocked
// ---------------------------------------------------------------------------

const MOCK_TRACE: { content: string; tone: TraceTone }[] = [
  { content: "supplier.query()", tone: "success" },
  { content: "inventory.lookup()", tone: "success" },
  { content: "alternates.fetch()", tone: "success" },
  { content: "decision.synthesize()", tone: "info" },
  { content: "formatting…", tone: "subtle" },
];

type TraceTone = "success" | "info" | "subtle";

function TraceSection() {
  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Trace</SectionLabel>
      <ul className="flex flex-col gap-1 px-1 font-mono text-xs">
        {MOCK_TRACE.map((line) => (
          <li key={line.content} className="flex gap-1.5">
            <span className="text-foreground-subtle">→</span>
            <span className={traceToneClass(line.tone)}>{line.content}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function traceToneClass(tone: TraceTone): string {
  switch (tone) {
    case "success":
      return "text-success";
    case "info":
      return "text-info";
    case "subtle":
      return "text-foreground-subtle";
  }
}

// ---------------------------------------------------------------------------
// METRICS — from project manifest
// ---------------------------------------------------------------------------

function MetricsSection({ project }: { project: ProjectMetadata }) {
  const tokens = project.averageRunCost
    ? project.averageRunCost.tokens.toLocaleString()
    : "—";
  const usd = project.averageRunCost
    ? `$${project.averageRunCost.usd.toFixed(3)}`
    : "—";
  const evalScore =
    typeof project.evalScore === "number" ? `${project.evalScore}%` : "—";

  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Metrics</SectionLabel>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 px-1 text-xs">
        <MetricRow label="Tokens" value={tokens} />
        <MetricRow label="Latency" value="1.2s" />
        <MetricRow label="Cost" value={usd} />
        <MetricRow label="Eval, 24h" value={evalScore} tone="success" />
      </dl>
    </section>
  );
}

function MetricRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success";
}) {
  return (
    <>
      <dt className="text-foreground-muted">{label}</dt>
      <dd
        className={cn(
          "text-right font-mono text-sm",
          tone === "success" ? "text-success" : "text-foreground",
        )}
      >
        {value}
      </dd>
    </>
  );
}

// ---------------------------------------------------------------------------
// RELATED — cross-project suggestion strip
// ---------------------------------------------------------------------------

function RelatedSection({
  track,
  slugs,
  all,
}: {
  track: ProjectTrack;
  slugs: string[];
  all: ProjectMetadata[];
}) {
  const items = slugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is ProjectMetadata => Boolean(p));

  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Related</SectionLabel>
      <ul className="flex flex-col gap-2 px-1 text-xs leading-snug text-foreground-muted">
        {items.map((p) => (
          <li key={p.slug}>
            Shares retrieval with{" "}
            <Link
              href={`/${p.track}/${p.slug}`}
              className="text-info hover:underline"
            >
              {p.title}
            </Link>{" "}
            in <span className="capitalize">{p.track}</span>.
            {p.track !== track && (
              <span className="ml-1 text-foreground-subtle">
                (cross-track)
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------

function matchActive(
  pathname: string,
  projects: ProjectMetadata[],
): ProjectMetadata | null {
  const m = pathname.match(/^\/([^/]+)\/([^/]+)/);
  if (!m) return null;
  const [, track, slug] = m;
  return projects.find((p) => p.track === track && p.slug === slug) ?? null;
}
