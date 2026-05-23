// lib/content.ts
// Reads content/ and builds the project manifest. The schema below is the
// runtime mirror of types/project.ts and is re-used by scripts/build-index.ts
// so validation rules live in exactly one place.
//
// See TECH-STACK.md §4 (folder layout) and §5 (project.json schema).

import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { z } from "zod";

import type { DemoHandler } from "@/types/demo";
import type { ProjectMetadata, ProjectTrack } from "@/types/project";

/** Three fixed tracks, in display order. */
export const TRACKS = ["agentic", "assets", "physical"] as const;

/** Absolute filesystem root of the content tree. */
export const CONTENT_ROOT = path.join(process.cwd(), "content");

/** The five required long-form MDX sections, in render order. */
export const REQUIRED_SECTIONS = [
  "overview",
  "architecture",
  "prompts",
  "results",
  "tradeoffs",
] as const;

export type SectionName = (typeof REQUIRED_SECTIONS)[number];

/** project.json schema — must stay structurally identical to ProjectMetadata. */
export const projectMetadataSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, {
    message: "slug must be lowercase kebab-case (a-z, 0-9, -)",
  }),
  title: z.string().min(1),
  track: z.enum(TRACKS),
  status: z.enum(["live", "in-dev", "concept"]),
  summary: z.string().min(1).max(160),
  capabilities: z.array(
    z.enum([
      "rag",
      "fine-tuning",
      "multi-agent",
      "tool-use",
      "eval",
      "edge-inference",
      "streaming",
      "prompt-engineering",
      "vector-search",
    ]),
  ),
  modelsUsed: z.array(
    z.enum(["claude", "gpt", "llama", "open-weights", "custom"]),
  ),
  hero: z.string().optional(),
  publishedAt: z.string(),
  featured: z.boolean().optional(),
  defaultModel: z.string(),
  evalScore: z.number().min(0).max(100).optional(),
  averageRunCost: z
    .object({ tokens: z.number(), usd: z.number() })
    .optional(),
  relatedProjects: z.array(z.string()).optional(),
}) satisfies z.ZodType<ProjectMetadata>;

/** A fully loaded project: metadata + raw MDX source for each section. */
export interface LoadedProject {
  metadata: ProjectMetadata;
  sections: Record<SectionName, string> & { demo?: string };
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

async function readProjectMetadata(
  track: string,
  slug: string,
): Promise<ProjectMetadata> {
  const file = path.join(CONTENT_ROOT, track, slug, "project.json");
  const raw = await fs.readFile(file, "utf8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`${file}: invalid JSON — ${(err as Error).message}`);
  }
  const result = projectMetadataSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `${file}: project.json failed schema validation — ` +
        result.error.issues
          .map((i) => `${i.path.join(".") || "<root>"}: ${i.message}`)
          .join("; "),
    );
  }
  if (result.data.slug !== slug) {
    throw new Error(
      `${file}: project.json slug ("${result.data.slug}") must match folder name ("${slug}")`,
    );
  }
  if (result.data.track !== track) {
    throw new Error(
      `${file}: project.json track ("${result.data.track}") must match parent folder ("${track}")`,
    );
  }
  return result.data;
}

async function readSection(
  track: string,
  slug: string,
  name: string,
): Promise<string> {
  const file = path.join(CONTENT_ROOT, track, slug, `${name}.mdx`);
  return fs.readFile(file, "utf8");
}

async function tryReadSection(
  track: string,
  slug: string,
  name: string,
): Promise<string | undefined> {
  try {
    return await readSection(track, slug, name);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * List every project across all tracks, ordered by track then slug.
 *
 * Walks content/{track}/{slug}/project.json. Folders without a project.json
 * (placeholders, .gitkeep stubs, drafts) are skipped silently. Folders that
 * do have a project.json but fail validation throw — bad metadata should
 * fail loudly at build time.
 */
export const listProjects = cache(async (): Promise<ProjectMetadata[]> => {
  const out: ProjectMetadata[] = [];
  for (const track of TRACKS) {
    const trackDir = path.join(CONTENT_ROOT, track);
    let entries: string[];
    try {
      entries = await fs.readdir(trackDir);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw err;
    }
    for (const entry of entries.sort()) {
      const projectDir = path.join(trackDir, entry);
      const stat = await fs.stat(projectDir);
      if (!stat.isDirectory()) continue;
      const metaPath = path.join(projectDir, "project.json");
      try {
        await fs.access(metaPath);
      } catch {
        continue; // no project.json — skip
      }
      out.push(await readProjectMetadata(track, entry));
    }
  }
  return out;
});

/**
 * Load a single project's metadata and the raw MDX source for each section.
 * Returns null when the project folder or project.json is missing; throws
 * when project.json is present but malformed, or when a required section
 * MDX file is missing.
 */
export const loadProject = cache(
  async (track: string, slug: string): Promise<LoadedProject | null> => {
    if (!(TRACKS as readonly string[]).includes(track)) return null;
    const dir = path.join(CONTENT_ROOT, track, slug);
    try {
      await fs.access(path.join(dir, "project.json"));
    } catch {
      return null;
    }
    const metadata = await readProjectMetadata(track, slug);
    const sectionEntries = await Promise.all(
      REQUIRED_SECTIONS.map(
        async (name) => [name, await readSection(track, slug, name)] as const,
      ),
    );
    const demo = await tryReadSection(track, slug, "demo");
    const sections = Object.fromEntries(sectionEntries) as Record<
      SectionName,
      string
    > & { demo?: string };
    if (demo !== undefined) sections.demo = demo;
    return { metadata, sections };
  },
);

/**
 * Dynamically import the per-project demo.ts handler. Returns null when the
 * file is absent — callers (api/demo route, workspace tab) treat that as
 * "no live demo yet" rather than an error.
 */
export async function loadDemoHandler(
  track: ProjectTrack | string,
  slug: string,
): Promise<DemoHandler | null> {
  // Stub — wired in a later slice. Keeping the contract so the API route
  // and the static project page can already reference it.
  void track;
  void slug;
  return null;
}
