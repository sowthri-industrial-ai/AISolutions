"use client";

// Left rail of the control plane. 200 px wide, dark elevated surface, scrolls
// its own overflow. Shows the three fixed tracks (agentic, assets, physical)
// as collapsible groups; each group lists every project that's registered for
// that track in the manifest.
//
// The active project is detected from the URL via usePathname, so the bar
// stays accurate even on a direct deep-link load.

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { ProjectMetadata, ProjectTrack } from "@/types/project";

const TRACKS: { id: ProjectTrack; label: string }[] = [
  { id: "agentic", label: "Agentic" },
  { id: "assets", label: "Assets" },
  { id: "physical", label: "Physical" },
];

// Per-track utility class lookup, written out so Tailwind's JIT keeps the
// classes alive. Composing `bg-track-${track}-bg` at runtime gets purged.
const TRACK_STYLES: Record<
  ProjectTrack,
  {
    activeBg: string;
    activeBorder: string;
    dotActive: string;
  }
> = {
  agentic: {
    activeBg: "bg-track-agentic-bg",
    activeBorder: "border-track-agentic",
    dotActive: "bg-track-agentic",
  },
  assets: {
    activeBg: "bg-track-assets-bg",
    activeBorder: "border-track-assets",
    dotActive: "bg-track-assets",
  },
  physical: {
    activeBg: "bg-track-physical-bg",
    activeBorder: "border-track-physical",
    dotActive: "bg-track-physical",
  },
};

interface SidebarProps {
  projects: ProjectMetadata[];
}

export function Sidebar({ projects }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col overflow-y-auto border-r-hairline border-border bg-background-elevated">
      <SectionHeader>Tracks</SectionHeader>

      <nav className="flex flex-col">
        {TRACKS.map(({ id, label }) => (
          <TrackGroup
            key={id}
            track={id}
            label={label}
            projects={projects.filter((p) => p.track === id)}
            pathname={pathname}
          />
        ))}
      </nav>
    </aside>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pt-3 pb-1.5 text-2xs font-medium uppercase tracking-wider text-foreground-subtle">
      {children}
    </div>
  );
}

function TrackGroup({
  track,
  label,
  projects,
  pathname,
}: {
  track: ProjectTrack;
  label: string;
  projects: ProjectMetadata[];
  pathname: string;
}) {
  // Auto-expand the group that contains the active project (or the agentic
  // group when there's no active project — gives the user something to look
  // at on the welcome page).
  const hasActive = projects.some(
    (p) => pathname === `/${p.track}/${p.slug}`,
  );
  const defaultOpen = hasActive || track === "agentic";

  return (
    <details className="group" open={defaultOpen}>
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center gap-1.5 px-3 py-1.5 text-base text-foreground select-none hover:bg-background-hover",
          "[&::-webkit-details-marker]:hidden",
        )}
      >
        <Chevron />
        <span className="font-medium">{label}</span>
        <span className="ml-auto font-mono text-2xs text-foreground-subtle">
          {projects.length}
        </span>
      </summary>

      <div className="flex flex-col pb-1">
        {projects.length === 0 ? (
          <div className="pl-9 pr-3 py-1 text-xs italic text-foreground-subtle">
            No projects yet
          </div>
        ) : (
          projects.map((p) => (
            <ProjectRow
              key={p.slug}
              project={p}
              active={pathname === `/${p.track}/${p.slug}`}
            />
          ))
        )}
      </div>
    </details>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="size-3 shrink-0 text-foreground-subtle transition-transform duration-150 group-open:rotate-90"
      aria-hidden
    >
      <path
        d="M4.5 3l3.5 3-3.5 3"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProjectRow({
  project,
  active,
}: {
  project: ProjectMetadata;
  active: boolean;
}) {
  const styles = TRACK_STYLES[project.track];
  return (
    <Link
      href={`/${project.track}/${project.slug}`}
      className={cn(
        "flex items-center gap-2 border-l-2 border-transparent py-1.5 pl-9 pr-3 text-sm",
        "hover:bg-background-hover",
        active
          ? `${styles.activeBg} ${styles.activeBorder} text-foreground`
          : "text-foreground-muted hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "inline-block size-1.5 shrink-0 rounded-full border border-border-strong",
          active && `border-0 ${styles.dotActive}`,
        )}
        aria-hidden
      />
      <span className="truncate">{project.title}</span>
    </Link>
  );
}
