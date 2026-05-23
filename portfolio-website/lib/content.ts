// lib/content.ts
// Reads content/ and builds the project manifest.
// See TECH-STACK.md Sections 4, 5, 11.

import type { ProjectMetadata, ProjectTrack } from "@/types/project";
import type { DemoHandler } from "@/types/demo";

/** List every project across all tracks, ordered for navigation. */
export async function listProjects(): Promise<ProjectMetadata[]> {
  // TODO: walk content/{track}/{slug}/project.json, validate, return the array.
  return [];
}

/** Load a single project's metadata by track + slug. */
export async function loadProject(
  _track: string,
  _slug: string,
): Promise<ProjectMetadata | null> {
  // TODO: read content/{track}/{slug}/project.json, validate against the
  // ProjectMetadata schema (zod in lib/), and return null when missing.
  return null;
}

/** Dynamically import the per-project demo.ts handler. */
export async function loadDemoHandler(
  _track: ProjectTrack | string,
  _slug: string,
): Promise<DemoHandler | null> {
  // TODO: dynamic import of content/{track}/{slug}/demo.ts; return the
  // default export. Returning null when the handler is absent lets the API
  // route respond with 404.
  return null;
}
