// components/shared/header.tsx
// Site header — sticky top, hosts nav and the three top-right controls
// (search / AI guide / theme toggle). Server Component; the only piece of
// state lives in <ThemeToggle />.

import Link from "next/link";
import { Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const NAV_LINKS = [
  { href: "/agentic", label: "Agentic" },
  { href: "/assets", label: "Assets" },
  { href: "/physical", label: "Physical" },
  { href: "/approach", label: "Approach" },
  { href: "/stack", label: "Stack" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-full max-w-6xl items-center gap-6 px-6">
        <Link
          href="/"
          className="text-base font-medium tracking-tight text-foreground transition-colors hover:text-foreground/80"
        >
          Sowthri
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {/* Search stub — Cmd-K will wire up in a later slice. */}
          <Button
            variant="ghost"
            size="sm"
            aria-label="Search (coming soon)"
            disabled
            className="hidden gap-2 text-muted-foreground sm:inline-flex"
          >
            <Search />
            <kbd className="rounded border border-border bg-muted px-1 font-mono text-xs">
              ⌘K
            </kbd>
          </Button>
          {/* AI guide stub. */}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="AI guide (coming soon)"
            disabled
          >
            <Sparkles />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
