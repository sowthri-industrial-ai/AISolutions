// app/[track]/page.tsx
// Track index — one template, three routes (/agentic, /assets, /physical).
// 404s on anything else. See TECH-STACK.md §6.

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectCard } from "@/components/static-page/project-card";
import { listProjects, TRACKS } from "@/lib/content";
import { cn } from "@/lib/utils";

const TRACK_META: Record<
  (typeof TRACKS)[number],
  { label: string; description: string; eyebrowClass: string }
> = {
  agentic: {
    label: "Agentic AI",
    description:
      "Multi-agent systems, tool use, autonomous workflows. Projects where the model is one moving part of a larger negotiation.",
    eyebrowClass: "text-track-agentic",
  },
  assets: {
    label: "Assets AI",
    description:
      "Reusable AI building blocks — RAG pipelines, eval harnesses, prompt versioning. The unglamorous infrastructure under the product.",
    eyebrowClass: "text-track-assets",
  },
  physical: {
    label: "Physical",
    description:
      "Edge inference, embodied AI, on-device intelligence. AI that runs where the work happens.",
    eyebrowClass: "text-track-physical",
  },
};

interface PageProps {
  params: Promise<{ track: string }>;
}

function isTrack(value: string): value is (typeof TRACKS)[number] {
  return (TRACKS as readonly string[]).includes(value);
}

export async function generateStaticParams() {
  return TRACKS.map((track) => ({ track }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { track } = await params;
  if (!isTrack(track)) return {};
  const meta = TRACK_META[track];
  return {
    title: meta.label,
    description: meta.description,
  };
}

export default async function TrackIndexPage({ params }: PageProps) {
  const { track } = await params;
  if (!isTrack(track)) notFound();

  const meta = TRACK_META[track];
  const all = await listProjects();
  const projects = all.filter((p) => p.track === track);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-16">
      <header className="border-b border-border pb-10">
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-[0.18em]",
            meta.eyebrowClass,
          )}
        >
          Track
        </p>
        <h1 className="mt-4 text-h1 font-medium text-foreground">
          {meta.label}
        </h1>
        <p className="mt-6 max-w-3xl text-body text-muted-foreground">
          {meta.description}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          {projects.length === 0
            ? "No projects published yet."
            : `${projects.length} project${projects.length === 1 ? "" : "s"} published.`}
        </p>
      </header>

      {projects.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-md border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          Projects in this track will appear here once their content folders
          land under <code className="font-mono">content/{track}/</code>.
        </div>
      )}
    </main>
  );
}
