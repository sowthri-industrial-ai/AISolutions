// app/[track]/[slug]/page.tsx
// Static long-form project page. One template, one source — the same MDX
// drives the workspace tabs in /control. See TECH-STACK.md §6.
//
// Generated at build time for every project the indexer finds.

import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ArrowRight, ExternalLink } from "lucide-react";

import { listProjects, loadProject, TRACKS } from "@/lib/content";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { ProjectSection } from "@/components/static-page/project-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TRACK_LABELS: Record<(typeof TRACKS)[number], string> = {
  agentic: "Agentic AI",
  assets: "Assets AI",
  physical: "Physical",
};

const TRACK_TEXT_CLASSES: Record<(typeof TRACKS)[number], string> = {
  agentic: "text-track-agentic",
  assets: "text-track-assets",
  physical: "text-track-physical",
};

const STATUS_CLASSES: Record<"live" | "in-dev" | "concept", string> = {
  live: "border-success/30 bg-success/10 text-success",
  "in-dev": "border-warning/30 bg-warning/10 text-warning",
  concept: "border-border bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<"live" | "in-dev" | "concept", string> = {
  live: "Live",
  "in-dev": "In dev",
  concept: "Concept",
};

const MDX_OPTIONS = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
};

interface PageProps {
  params: Promise<{ track: string; slug: string }>;
}

export async function generateStaticParams() {
  const projects = await listProjects();
  return projects.map((p) => ({ track: p.track, slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { track, slug } = await params;
  const project = await loadProject(track, slug);
  if (!project) return {};
  return {
    title: project.metadata.title,
    description: project.metadata.summary,
  };
}

export default async function StaticProjectPage({ params }: PageProps) {
  const { track, slug } = await params;
  const project = await loadProject(track, slug);
  if (!project) notFound();

  const { metadata, sections } = project;
  const trackSlug = metadata.track;
  const controlHref = `/control/${trackSlug}/${metadata.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      {/* Hero — eyebrow / title / meta / cross-link. */}
      <header className="border-b border-border pb-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/${trackSlug}`}
              className={cn(
                "text-xs font-medium uppercase tracking-[0.18em]",
                TRACK_TEXT_CLASSES[trackSlug],
              )}
            >
              {TRACK_LABELS[trackSlug]}
            </Link>
            <h1 className="mt-4 text-h1 font-medium text-foreground">
              {metadata.title}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={controlHref} />}
            className="shrink-0"
          >
            Open in control plane
            <ExternalLink />
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={cn("h-6 px-2", STATUS_CLASSES[metadata.status])}
          >
            {STATUS_LABELS[metadata.status]}
          </Badge>
          {metadata.capabilities.map((cap) => (
            <Badge key={cap} variant="outline" className="h-6 px-2">
              {cap}
            </Badge>
          ))}
        </div>

        <p className="mt-6 text-body text-muted-foreground">
          {metadata.summary}
        </p>
      </header>

      {/* Six collapsible sections. Only Overview is open by default. */}
      <div className="mt-4">
        <ProjectSection id="overview" title="Overview" defaultOpen>
          <MDXRemote
            source={sections.overview}
            components={mdxComponents}
            options={MDX_OPTIONS}
          />
        </ProjectSection>

        <ProjectSection id="architecture" title="Architecture">
          <MDXRemote
            source={sections.architecture}
            components={mdxComponents}
            options={MDX_OPTIONS}
          />
        </ProjectSection>

        <ProjectSection id="prompts" title="Prompts">
          <MDXRemote
            source={sections.prompts}
            components={mdxComponents}
            options={MDX_OPTIONS}
          />
        </ProjectSection>

        <ProjectSection id="results" title="Results">
          <MDXRemote
            source={sections.results}
            components={mdxComponents}
            options={MDX_OPTIONS}
          />
        </ProjectSection>

        <ProjectSection id="tradeoffs" title="Trade-offs">
          <MDXRemote
            source={sections.tradeoffs}
            components={mdxComponents}
            options={MDX_OPTIONS}
          />
        </ProjectSection>

        <ProjectSection id="demo" title="Demo preview">
          <div className="my-6 rounded-md border border-dashed border-border bg-muted/30 p-6">
            <p className="text-body text-foreground">
              The interactive demo for this project lives in the control plane.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Run it live, pick a model, watch the trace stream as the agents
              negotiate.
            </p>
            <Button
              className="mt-4"
              render={<Link href={controlHref} />}
            >
              Run this project live in the control plane
              <ArrowRight />
            </Button>
          </div>
        </ProjectSection>
      </div>
    </article>
  );
}
