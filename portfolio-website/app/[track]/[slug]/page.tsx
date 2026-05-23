// app/[track]/[slug]/page.tsx
//
// Project workspace. The shell lives in app/layout.tsx; this route loads the
// project from the content tree, normalises the tab search param, and hands
// both to <Workspace />. Next.js 16's async params + searchParams are awaited
// before use.
//
// generateStaticParams pre-bakes a route for every project the manifest
// validates — visitors hitting a deep link see a static HTML response, then
// the React tree hydrates with the same data. Unknown projects return 404
// via notFound().

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Workspace, normalizeTab } from "@/components/workspace/workspace";
import { listProjects, loadProject } from "@/lib/content";

export async function generateStaticParams() {
  const projects = await listProjects();
  return projects.map((p) => ({ track: p.track, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string; slug: string }>;
}): Promise<Metadata> {
  const { track, slug } = await params;
  const project = await loadProject(track, slug);
  if (!project) return {};
  return {
    title: `${project.metadata.title} · Sowthri AI Solutions`,
    description: project.metadata.summary,
  };
}

export default async function ProjectWorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ track: string; slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { track, slug } = await params;
  const { tab } = await searchParams;

  const project = await loadProject(track, slug);
  if (!project) notFound();

  return <Workspace project={project} tab={normalizeTab(tab)} />;
}
