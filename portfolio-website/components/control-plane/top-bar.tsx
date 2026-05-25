"use client";

// Top bar: brand · breadcrumb · model chip · temp chip · search · theme toggle.
// 44px tall, elevated surface, single 0.5px bottom border. Matches the CD
// bundle's <TopBar> in src/chrome.jsx.
//
// NOTE — chrome components in this folder use inline `style={{}}` with
// `var(--token)` references throughout (e.g. background: 'var(--bg-elevated)').
// This is intentional. The CD bundle drives all surface and accent colors
// off CSS variables that flip on `.dark`-class toggle, so inline `var()`
// gives us a 1:1 mapping of the source design with zero abstraction layer
// and zero broken styles when the theme switches.
//
// Resist the urge to "modernize" these into Tailwind utility classes like
// `bg-[var(--bg-elevated)]` or a custom `bg-cd-elevated` mapped through
// @theme inline. The arbitrary-value approach loses the var() chain on
// theme switching, and the custom mapping adds 30+ lines of @theme glue
// for zero ergonomic gain. Layout primitives (flex, grid, sizing) DO use
// Tailwind utilities — only color/typography that needs to track the
// theme stays inline.

import type { ReactNode } from "react";
import {
  IconButton as IconButtonShell,
  Chip,
} from "@/components/control-plane/chrome-bits";
import {
  IconChevronDown,
  IconChevronRight,
  IconMoon,
  IconSearch,
  IconSparkle,
  IconSun,
} from "@/components/control-plane/icons";
import { useControlPlaneStore } from "@/lib/store";
import type { PortfolioProject } from "@/lib/projects";
import { trackById } from "@/lib/tracks";

interface TopBarProps {
  activeProject: PortfolioProject | null;
}

export function TopBar({ activeProject }: TopBarProps) {
  const theme = useControlPlaneStore((s) => s.theme);
  const toggleTheme = useControlPlaneStore((s) => s.toggleTheme);
  const track = activeProject ? trackById(activeProject.track) : null;

  return (
    <header
      style={{
        height: 44,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 12px",
        background: "var(--bg-elevated)",
        borderBottom: "0.5px solid var(--border-token)",
        flexShrink: 0,
      }}
    >
      {/* Brand / identity */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 200 }}>
        <div
          aria-hidden
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            background: "var(--fg)",
            color: "var(--bg)",
            display: "grid",
            placeItems: "center",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          s
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 13 }}>
          <span style={{ fontWeight: 600, color: "var(--fg)" }}>Sowthri</span>
          <span style={{ color: "var(--fg-subtle)" }}>·</span>
          <span style={{ color: "var(--fg-muted)" }}>AI Solutions</span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "var(--fg-muted)",
          fontSize: 12.5,
          minHeight: 28,
        }}
      >
        {activeProject && track ? (
          <BreadcrumbItems trackLabel={track.label} projectName={activeProject.name} />
        ) : (
          <span style={{ color: "var(--fg-subtle)", fontStyle: "italic" }}>
            No project selected
          </span>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Right chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Chip>
          <IconSparkle size={12} style={{ color: "var(--agentic)" }} />
          <span style={{ color: "var(--fg)" }}>Claude Opus 4.7</span>
          <IconChevronDown size={12} style={{ color: "var(--fg-subtle)" }} />
        </Chip>
        <Chip>
          <span style={{ color: "var(--fg-muted)" }}>temp</span>
          <span style={{ color: "var(--fg)", fontFamily: "var(--font-mono)" }}>0.7</span>
        </Chip>
        <IconButtonShell title="Search (⌘K)">
          <IconSearch size={14} />
        </IconButtonShell>
        <IconButtonShell
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          onClick={toggleTheme}
        >
          {theme === "dark" ? <IconSun size={14} /> : <IconMoon size={14} />}
        </IconButtonShell>
      </div>
    </header>
  );
}

function BreadcrumbItems({
  trackLabel,
  projectName,
}: {
  trackLabel: string;
  projectName: string;
}): ReactNode {
  return (
    <>
      <span>{trackLabel}</span>
      <IconChevronRight size={12} style={{ color: "var(--fg-subtle)" }} />
      <span style={{ color: "var(--fg)" }}>{projectName}</span>
    </>
  );
}
