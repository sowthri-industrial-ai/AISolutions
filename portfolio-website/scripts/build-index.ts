#!/usr/bin/env tsx
// scripts/build-index.ts
// Prebuild: walk content/{track}/{slug}/, validate every project.json with
// the same Zod schema lib/content.ts uses at runtime, and write
// content/_manifest.json — a single JSON file listing every valid project,
// consumed by lib/content.ts on cold start (and useful for ad-hoc tooling).
//
// Runs as `pnpm build-index` (wired into `pnpm dev` and `pnpm build`).
// See TECH-STACK.md §11.

import { promises as fs } from "node:fs";
import path from "node:path";

import { CONTENT_ROOT, listProjects } from "@/lib/content";

const MANIFEST_PATH = path.join(CONTENT_ROOT, "_manifest.json");

interface Manifest {
  generatedAt: string;
  projects: Awaited<ReturnType<typeof listProjects>>;
}

async function main() {
  const start = Date.now();
  let projects: Manifest["projects"];
  try {
    projects = await listProjects();
  } catch (err) {
    console.error("✗ build-index: content validation failed");
    console.error((err as Error).message);
    process.exit(1);
  }

  const manifest: Manifest = {
    generatedAt: new Date().toISOString(),
    projects,
  };

  await fs.mkdir(CONTENT_ROOT, { recursive: true });
  await fs.writeFile(
    MANIFEST_PATH,
    JSON.stringify(manifest, null, 2) + "\n",
    "utf8",
  );

  const ms = Date.now() - start;
  console.log(
    `✓ build-index: wrote ${path.relative(process.cwd(), MANIFEST_PATH)} ` +
      `(${projects.length} project${projects.length === 1 ? "" : "s"}, ${ms}ms)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
