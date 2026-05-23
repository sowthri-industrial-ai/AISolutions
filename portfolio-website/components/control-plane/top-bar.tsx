"use client";

// Top bar of the control plane. Sticky, h-12, contains: the logo block on
// the left, a centered breadcrumb that reflects the active project, and a
// right cluster with the model picker chip, temp chip, ⌘K button, theme
// toggle, and profile dot.
//
// Slice 3 scope:
//   - Theme toggle is wired through next-themes and is the one functional
//     control here.
//   - Everything else (model picker, temp, ⌘K, profile) is visual only —
//     they exist so the shell looks right and the underlying handlers can
//     be wired in later slices without re-layout.

import { ChevronDown, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import type { ProjectMetadata } from "@/types/project";

interface TopBarProps {
  projects: ProjectMetadata[];
}

export function TopBar({ projects }: TopBarProps) {
  const pathname = usePathname();
  const active = matchActiveProject(pathname, projects);

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b-hairline border-border bg-background-elevated px-3">
      <Logo />

      <div className="flex flex-1 items-center justify-center text-sm">
        {active ? (
          <Breadcrumb track={active.track} title={active.title} />
        ) : (
          <span className="text-foreground-subtle">control plane</span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <ModelChip label="Claude Opus 4.7" />
        <TempChip value="0.7" />
        <IconButton icon={<Search className="size-3.5" />} hint="⌘K" />
        <ThemeToggle />
        <ProfileDot initial="S" />
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid size-6 place-items-center rounded-md bg-foreground/10">
        <span className="font-mono text-2xs font-medium tracking-wider text-foreground">
          AI
        </span>
      </div>
      <span className="text-sm font-medium text-foreground">
        Sowthri{" "}
        <span className="text-foreground-subtle">·</span>{" "}
        <span className="text-foreground-muted">AI Solutions</span>
      </span>
    </div>
  );
}

function Breadcrumb({ track, title }: { track: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="capitalize text-foreground-muted">{track}</span>
      <span className="text-foreground-subtle">›</span>
      <span className="text-foreground">{title}</span>
    </div>
  );
}

function ModelChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-7 items-center gap-1.5 rounded-md border-hairline border-border bg-background px-3 text-xs text-foreground hover:bg-background-hover"
      aria-label="Model picker (visual only — wires in slice 4)"
    >
      {label}
      <ChevronDown className="size-3 text-foreground-subtle" />
    </button>
  );
}

function TempChip({ value }: { value: string }) {
  return (
    <button
      type="button"
      className="flex h-7 items-center gap-1.5 rounded-md border-hairline border-border bg-background px-3 text-xs hover:bg-background-hover"
      aria-label="Temperature (visual only — wires in slice 4)"
    >
      <span className="text-foreground-muted">temp</span>
      <span className="text-foreground">{value}</span>
    </button>
  );
}

function IconButton({
  icon,
  hint,
}: {
  icon: React.ReactNode;
  hint?: string;
}) {
  return (
    <button
      type="button"
      className="grid size-7 place-items-center rounded-md border-hairline border-border bg-background text-foreground-muted hover:bg-background-hover hover:text-foreground"
      aria-label={hint ?? "icon button"}
    >
      {icon}
    </button>
  );
}

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes resolves the theme client-side; render the icon only after
  // mount so SSR + first hydration don't disagree about which one to show.
  useEffect(() => {
    setMounted(true);
  }, []);

  const current = mounted ? (resolvedTheme ?? theme ?? "dark") : "dark";
  const isDark = current === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "grid size-7 place-items-center rounded-md border-hairline border-border",
        "bg-background text-foreground-muted hover:bg-background-hover hover:text-foreground",
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Sun className="size-3.5" />
      ) : (
        <Moon className="size-3.5" />
      )}
    </button>
  );
}

function ProfileDot({ initial }: { initial: string }) {
  return (
    <div
      className="grid size-7 place-items-center rounded-full bg-info-bg text-xs font-medium text-info"
      aria-hidden
    >
      {initial}
    </div>
  );
}

function matchActiveProject(
  pathname: string,
  projects: ProjectMetadata[],
): ProjectMetadata | null {
  const m = pathname.match(/^\/([^/]+)\/([^/]+)/);
  if (!m) return null;
  const [, track, slug] = m;
  return projects.find((p) => p.track === track && p.slug === slug) ?? null;
}
