"use client";

// Agent Reaction tab — the signature tab.
// Single long scroll: Tables → Compositions → Reaction → Result, all
// anchored by the sticky sub-tab nav.
//
// The scroll root is the workspace's overflow:auto content div. We walk
// up the DOM from a self-mounted ref to find it, then pass it to the
// anchor nav so IntersectionObserver and smooth-scroll use the right
// container (the window scroll is the wrong one inside the panel).

import { useEffect, useRef, useState } from "react";
import {
  AnchorNav,
  SectionDivider,
} from "@/components/tabs/agent-reaction/anchor-nav";
import { TablesSection } from "@/components/tabs/agent-reaction/tables";
import { Matrix1, Matrix2 } from "@/components/tabs/agent-reaction/matrices";
import { ReactionSection } from "@/components/tabs/agent-reaction/reaction";
import { ResultSection } from "@/components/tabs/agent-reaction/result";
import {
  getAgentReaction,
} from "@/lib/agent-reaction-data";
import type { PortfolioProject } from "@/lib/projects";
import { trackById } from "@/lib/tracks";

interface AgentReactionTabProps {
  project: PortfolioProject;
}

export function AgentReactionTab({ project }: AgentReactionTabProps) {
  const reaction = getAgentReaction(project.id);
  const track = trackById(project.track);
  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const [scrollRoot, setScrollRoot] = useState<HTMLElement | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);

  // Walk up to find the nearest overflow:auto ancestor. The workspace's
  // tab content div is that ancestor (set in app/control/.../layout.tsx).
  useEffect(() => {
    if (!scrollRootRef.current) return;
    let n: HTMLElement | null = scrollRootRef.current.parentElement;
    while (n) {
      const oy = getComputedStyle(n).overflowY;
      if (oy === "auto" || oy === "scroll") {
        setScrollRoot(n);
        return;
      }
      n = n.parentElement;
    }
  }, []);

  if (!reaction || !track) {
    return (
      <div className="prose fade-up">
        <h2>Agent Reaction</h2>
        <p className="muted">
          No reaction profile authored for {project.name} yet.
        </p>
        <div className="callout">
          The chemistry view is bespoke per project: lit cells across the three
          tables, the compound roster, the topology, and the canonical run
          trace. Wire it once the project has a documented multi-agent topology.
        </div>
      </div>
    );
  }

  const jumpToResult = (name: string) => {
    setHighlight(name);
    const el = document.getElementById("sec-result");
    if (el && scrollRoot) {
      scrollRoot.scrollTo({ top: el.offsetTop - 4, behavior: "smooth" });
    }
    setTimeout(() => setHighlight(null), 4000);
  };

  return (
    <div
      ref={scrollRootRef}
      className="fade-up"
      // -20px overshoots the workspace content div's 20px top padding so
      // the sticky AnchorNav lands flush against the tab strip instead of
      // floating 20px below it. The intro paragraph and section dividers
      // below the nav still have plenty of breathing room.
      style={{ marginTop: -20 }}
    >
      <AnchorNav scrollRoot={scrollRoot} />

      <p
        style={{
          fontSize: 13,
          color: "var(--fg-muted)",
          maxWidth: "58ch",
          margin: "0 0 8px",
          lineHeight: 1.6,
        }}
      >
        A multi-agent system built as a chemistry: universal building blocks
        combine into element types, knowledge bonds them into deployed
        compounds, and the compounds react together to produce the result.
      </p>

      <SectionDivider id="sec-tables" label="Tables" />
      <TablesSection reaction={reaction} track={track} />

      <SectionDivider id="sec-compositions" label="Compositions" />
      <p
        style={{
          fontSize: 13,
          color: "var(--fg-muted)",
          maxWidth: "60ch",
          margin: "0 0 18px",
          lineHeight: 1.6,
        }}
      >
        Picks from the tables above intersect to define element types.
        Knowledge then bonds with elements to form compounds — the deployable
        agents.
      </p>
      <Matrix1 reaction={reaction} track={track} />
      <Matrix2
        reaction={reaction}
        track={track}
        onCompoundClick={jumpToResult}
      />

      <SectionDivider id="sec-reaction" label="Reaction" />
      <ReactionSection
        reaction={reaction}
        track={track}
        onCompoundClick={jumpToResult}
      />

      <SectionDivider id="sec-result" label="Result" />
      <ResultSection reaction={reaction} highlight={highlight} />

      <div style={{ height: 40 }} />
    </div>
  );
}
