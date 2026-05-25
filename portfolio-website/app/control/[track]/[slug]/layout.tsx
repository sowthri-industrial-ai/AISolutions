// /control/[track]/[slug]/* layout — workspace shell (header + tab strip
// + content slot + ask bar) for a single project. The tab content slot
// is filled by app/control/[track]/[slug]/[tab]/page.tsx.

import { notFound } from "next/navigation";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { isDocumented } from "@/components/workspace/tab-content";
import { projectByTrackAndSlug, DEFAULT_TAB } from "@/lib/projects";
import { trackById } from "@/lib/tracks";

interface Params {
  track: string;
  slug: string;
}

export default async function ProjectWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { track: trackId, slug } = await params;
  const project = projectByTrackAndSlug(trackId, slug);
  const track = trackById(trackId);
  if (!project || !track) notFound();

  // Layouts in App Router can't see their descendant [tab] segment, so
  // we pass DEFAULT_TAB as the SSR fallback. <TabStrip> is a client
  // component that derives the true active tab from usePathname() at
  // hydration and ignores this prop once it has the real segment.
  return (
    <WorkspaceShell
      project={project}
      track={track}
      activeTab={DEFAULT_TAB}
      disabled={!isDocumented(project)}
    >
      {children}
    </WorkspaceShell>
  );
}
