// /control/[track]/[slug]/[tab] — renders a single tab for a project.
// Server component: validates params, then dispatches to the right tab
// component. Invalid track / slug / tab → 404.

import { notFound } from "next/navigation";
import {
  isValidTab,
  projectByTrackAndSlug,
  tabBySlug,
} from "@/lib/projects";
import { trackById } from "@/lib/tracks";
import { TabContent } from "@/components/workspace/tab-content";

interface PageProps {
  params: Promise<{ track: string; slug: string; tab: string }>;
}

export default async function ProjectTabPage({ params }: PageProps) {
  const { track, slug, tab } = await params;
  const project = projectByTrackAndSlug(track, slug);
  if (!project) notFound();
  if (!trackById(track)) notFound();
  if (!isValidTab(tab)) notFound();
  const tabDef = tabBySlug(tab)!;
  return <TabContent project={project} tab={tabDef} />;
}
