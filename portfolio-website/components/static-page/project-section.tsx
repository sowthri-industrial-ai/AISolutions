// components/static-page/project-section.tsx
// Collapsible section for the static project page. Uses native
// <details>/<summary> so it works without JavaScript and stays
// accessible by default. Pass `defaultOpen` to expand on first paint.

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProjectSectionProps {
  id: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function ProjectSection({
  id,
  title,
  defaultOpen = false,
  children,
}: ProjectSectionProps) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="group/section border-b border-border py-6 [&_summary::-webkit-details-marker]:hidden"
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-4",
          "select-none transition-colors hover:text-foreground/80",
        )}
      >
        <h2 className="text-h2 font-medium text-foreground">{title}</h2>
        <ChevronDown
          aria-hidden
          className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open/section:rotate-180"
        />
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}
