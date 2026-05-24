"use client";

// Tab strip below the workspace header. Tabs are <Link>s so each tab
// is its own URL (/control/[track]/[slug]/[tab]) — server-rendered per
// tab, deep-linkable, browser-back-friendly.
//
// `disabled` is used when the project has no full-fidelity content
// (StubProject). The CD bundle paints disabled tabs in fg-subtle and
// gives them not-allowed cursor; we mirror that, but still render them
// as anchors so the URL space stays explorable.

import Link from "next/link";
import { useMemo } from "react";
import { TABS, type TabDef } from "@/lib/projects";

interface TabStripProps {
  projectBase: string; // e.g. "/control/agentic/supply-chain-copilot"
  active: string;      // active tab slug, e.g. "architecture"
  disabled?: boolean;
}

export function TabStrip({ projectBase, active, disabled = false }: TabStripProps) {
  const tabs = useMemo(() => TABS, []);
  return (
    <div
      role="tablist"
      aria-label="Workspace tabs"
      style={{
        padding: "8px 28px 0",
        display: "flex",
        gap: 0,
        borderBottom: "0.5px solid var(--border-token)",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}
    >
      {tabs.map((tab) => (
        <TabLink
          key={tab.slug}
          tab={tab}
          href={`${projectBase}/${tab.slug}`}
          active={tab.slug === active}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

function TabLink({
  tab,
  href,
  active,
  disabled,
}: {
  tab: TabDef;
  href: string;
  active: boolean;
  disabled: boolean;
}) {
  const color = active
    ? "var(--fg)"
    : disabled
      ? "var(--fg-subtle)"
      : "var(--fg-muted)";

  const content = (
    <span style={{ position: "relative", whiteSpace: "nowrap" }}>
      {tab.label}
      {active && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -10.5,
            height: 2,
            background: "var(--fg)",
            borderRadius: 1,
          }}
        />
      )}
    </span>
  );

  const style = {
    position: "relative" as const,
    padding: "8px 14px 10px",
    fontSize: 14,
    fontWeight: active ? 500 : 400,
    color,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "color .12s",
    textDecoration: "none",
  };

  if (disabled) {
    return (
      <span role="tab" aria-disabled aria-selected={active} style={style}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      role="tab"
      aria-selected={active}
      style={style}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = "var(--fg)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.color = "var(--fg-muted)";
      }}
    >
      {content}
    </Link>
  );
}
