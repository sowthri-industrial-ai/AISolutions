"use client";

// Sticky anchor nav at the top of the Agent Reaction tab: Tables /
// Compositions / Reaction / Result. Scroll-spy auto-highlights the
// section currently in view, clicks smooth-scroll to each section,
// and the nav stays glued to the workspace's scroll root.

import { useEffect, useState } from "react";

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: "sec-tables",       label: "Tables" },
  { id: "sec-compositions", label: "Compositions" },
  { id: "sec-reaction",     label: "Reaction" },
  { id: "sec-result",       label: "Result" },
];

interface AnchorNavProps {
  scrollRoot: HTMLElement | null;
}

export function AnchorNav({ scrollRoot }: AnchorNavProps) {
  const [active, setActive] = useState<string>("sec-tables");

  useEffect(() => {
    if (!scrollRoot) return;
    const els = SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // The topmost visible section wins — keeps the highlight stable
        // even when multiple sections are intersecting near a boundary.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { root: scrollRoot, rootMargin: "-10px 0px -65% 0px", threshold: [0, 0.1, 1] },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [scrollRoot]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el && scrollRoot) {
      const top = el.offsetTop - 4;
      scrollRoot.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Agent Reaction sections"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        height: 36,
        display: "flex",
        alignItems: "center",
        gap: 2,
        // Opaque backdrop so content scrolling underneath doesn't bleed
        // through (per CD bundle's "Sticky sub-tab nav clipping fix").
        background: "var(--bg)",
        borderBottom: "1px solid var(--border-token)",
        marginBottom: 14,
        marginLeft: -28,
        marginRight: -28,
        paddingLeft: 28,
        paddingRight: 28,
      }}
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            data-testid={`anchor-${s.id}`}
            onClick={() => jump(s.id)}
            aria-current={isActive ? "true" : undefined}
            style={{
              padding: "4px 10px",
              fontSize: 11.5,
              fontFamily: "var(--font-mono)",
              color: isActive ? "var(--fg)" : "var(--fg-muted)",
              background: isActive ? "var(--bg-subtle)" : "transparent",
              border: "0.5px solid",
              borderColor: isActive ? "var(--border-token)" : "transparent",
              borderRadius: 4,
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = "var(--fg)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = "var(--fg-muted)";
            }}
          >
            {s.label}
          </button>
        );
      })}
      <span style={{ flex: 1 }} />
      <span
        style={{
          fontSize: 10.5,
          fontFamily: "var(--font-mono)",
          color: "var(--fg-subtle)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        lab notebook
      </span>
    </nav>
  );
}

export function SectionDivider({ id, label }: { id: string; label: string }) {
  return (
    <div
      id={id}
      data-section={id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "36px 0 22px",
        // 36px nav height + 28px breathing room — matches the CD bundle
        // anchor-jump fix so titles never land under the sticky nav.
        scrollMarginTop: 64,
      }}
    >
      <span
        style={{
          fontSize: 10.5,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--fg-subtle)",
          fontWeight: 500,
          fontFamily: "var(--font-mono)",
        }}
      >
        § {label}
      </span>
      <span style={{ flex: 1, height: 0, borderTop: "0.5px solid var(--border-token)" }} />
    </div>
  );
}

export function SubHeading({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <div style={{ margin: "0 0 10px" }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg)" }}>
        {children}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 12,
            color: "var(--fg-muted)",
            marginTop: 2,
            maxWidth: "60ch",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
