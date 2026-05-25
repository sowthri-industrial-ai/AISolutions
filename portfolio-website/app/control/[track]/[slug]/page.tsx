// /control/[track]/[slug] — redirects to the default tab so every project
// URL lands somewhere meaningful. Server-side redirect — no flash.

import { redirect, notFound } from "next/navigation";
import { DEFAULT_TAB, projectByTrackAndSlug } from "@/lib/projects";

export default async function ProjectIndexPage({
  params,
}: {
  params: Promise<{ track: string; slug: string }>;
}) {
  const { track, slug } = await params;
  const project = projectByTrackAndSlug(track, slug);
  if (!project) notFound();
  redirect(`/control/${track}/${slug}/${DEFAULT_TAB}`);
}
