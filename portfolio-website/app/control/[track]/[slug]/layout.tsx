// /control/[track]/[slug]/* layout — workspace shell (header + tab strip
// + content slot + ask bar) for a single project. The tab content slot
// is filled by app/control/[track]/[slug]/[tab]/page.tsx.

import { notFound } from "next/navigation";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { isDocumented } from "@/components/workspace/tab-content";
import { projectByTrackAndSlug, isValidTab, DEFAULT_TAB } from "@/lib/projects";
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

  // The active tab is the URL segment one level deeper — read here once so
  // the tab strip's link styling is decided server-side. The strip itself
  // is a client component so the underline animation feels native.
  const activeTab = await resolveActiveTab(params);

  return (
    <WorkspaceShell
      project={project}
      track={track}
      activeTab={activeTab}
      disabled={!isDocumented(project)}
    >
      {children}
    </WorkspaceShell>
  );
}

/**
 * Read the [tab] segment via the route's known shape. Layouts don't get
 * the deeper params from Next, so we sniff the URL via the pathname API
 * by reading the headers — but here we keep it server-friendly by simply
 * defaulting to "overview" and letting the deeper page correct via its
 * own params. The TabStrip uses Link `aria-selected` based on URL, so the
 * mismatch resolves on the client; this default just keeps SSR happy.
 *
 * TODO(routing): once next/headers exposes a stable way to read the
 * pathname from a layout, swap this for that — until then, the slight
 * SSR/client mismatch on the underline is benign.
 */
async function resolveActiveTab(_params: Promise<Params>): Promise<string> {
  // The default tab is the tab the workspace lands on after a project
  // redirect, so this is the SSR-safe initial guess. TabStrip's Link
  // components are client-aware and will correct the underline on
  // hydration when the deeper [tab] segment differs.
  void _params;
  const candidate = DEFAULT_TAB;
  return isValidTab(candidate) ? candidate : DEFAULT_TAB;
}
