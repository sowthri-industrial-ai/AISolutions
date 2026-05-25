"use client";

// 3-column control-plane shell. Wraps every /control/* page.
//
// Client-rendered because the chrome needs to know which project is
// currently active from URL segments — and that's a client hook
// (useSelectedLayoutSegments) in the app router. The children passed in
// are still server-rendered subtrees, so the heavy MDX/tab content keeps
// its SSR benefits; only the chrome itself runs in the client bundle.

import { useSelectedLayoutSegments } from "next/navigation";
import type { ReactNode } from "react";
import { TopBar } from "@/components/control-plane/top-bar";
import { Sidebar } from "@/components/control-plane/sidebar";
import { ObsPanel } from "@/components/control-plane/obs-panel";
import { projectByTrackAndSlug } from "@/lib/projects";

interface ControlPlaneShellProps {
  children: ReactNode;
}

export function ControlPlaneShell({ children }: ControlPlaneShellProps) {
  // Segments under /control: [track, slug, tab?]. Undefined for /control.
  const segments = useSelectedLayoutSegments();
  const track = segments[0];
  const slug = segments[1];
  const activeProject =
    track && slug ? (projectByTrackAndSlug(track, slug) ?? null) : null;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
        color: "var(--fg)",
      }}
    >
      <TopBar activeProject={activeProject} />
      <div
        style={{
          flex: 1,
          display: "flex",
          minHeight: 0,
        }}
      >
        <Sidebar activeId={activeProject?.id ?? null} />
        <main
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            background: "var(--bg)",
            overflow: "hidden",
          }}
        >
          {children}
        </main>
        <ObsPanel project={activeProject} />
      </div>
    </div>
  );
}
