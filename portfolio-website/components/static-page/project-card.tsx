// components/static-page/project-card.tsx
// Compact project card used on track index pages (and reusable on the
// home page / search results later). Title links to the static project
// page; status + capability pills surface at a glance.

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProjectMetadata } from "@/types/project";

const STATUS_CLASSES: Record<ProjectMetadata["status"], string> = {
  live: "border-success/30 bg-success/10 text-success",
  "in-dev": "border-warning/30 bg-warning/10 text-warning",
  concept: "border-border bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<ProjectMetadata["status"], string> = {
  live: "Live",
  "in-dev": "In dev",
  concept: "Concept",
};

export function ProjectCard({ project }: { project: ProjectMetadata }) {
  const href = `/${project.track}/${project.slug}`;
  return (
    <Card className="p-6">
      <CardContent className="flex h-full flex-col gap-3 p-0">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={href}
            className="text-h3 font-medium text-foreground transition-colors hover:text-foreground/80"
          >
            {project.title}
          </Link>
          <Badge
            variant="outline"
            className={cn("shrink-0 h-6 px-2", STATUS_CLASSES[project.status])}
          >
            {STATUS_LABELS[project.status]}
          </Badge>
        </div>
        <p className="text-body text-muted-foreground">{project.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.capabilities.map((cap) => (
            <Badge key={cap} variant="outline" className="h-5 px-1.5 text-xs">
              {cap}
            </Badge>
          ))}
        </div>
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
        >
          Read case study <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
