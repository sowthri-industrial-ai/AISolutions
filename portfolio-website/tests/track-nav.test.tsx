// Sidebar track-group expand/collapse test.
// Verifies the Zustand-backed expanded state flips a track's panel in
// and out of the DOM and that the aria-expanded attribute follows.

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "@/components/control-plane/sidebar";
import { useControlPlaneStore } from "@/lib/store";

// next/navigation isn't used by Sidebar directly, but Next's <Link> is.
// Under jsdom it renders as a plain anchor.

describe("Sidebar track-group expand/collapse", () => {
  beforeEach(() => {
    // Reset store between tests — CD default: Agentic open, others closed.
    useControlPlaneStore.setState({
      theme: "dark",
      expanded: { agentic: true, assets: false, physical: false },
    });
  });

  it("renders TRACKS heading and three track toggles", () => {
    render(<Sidebar activeId={null} />);
    expect(screen.getByText(/TRACKS/i)).toBeTruthy();
    expect(screen.getByTestId("track-toggle-agentic")).toBeTruthy();
    expect(screen.getByTestId("track-toggle-assets")).toBeTruthy();
    expect(screen.getByTestId("track-toggle-physical")).toBeTruthy();
  });

  it("starts with Agentic open and Assets/Physical collapsed", () => {
    render(<Sidebar activeId={null} />);
    expect(
      screen.getByTestId("track-toggle-agentic").getAttribute("aria-expanded"),
    ).toBe("true");
    expect(
      screen.getByTestId("track-toggle-assets").getAttribute("aria-expanded"),
    ).toBe("false");

    // Agentic projects are visible; Assets projects are not.
    expect(screen.queryByTestId("project-row-supply-chain-copilot")).toBeTruthy();
    expect(screen.queryByTestId("project-row-prompt-ops")).toBeNull();
  });

  it("expands Assets on click and reveals its projects", () => {
    render(<Sidebar activeId={null} />);
    fireEvent.click(screen.getByTestId("track-toggle-assets"));
    expect(
      screen.getByTestId("track-toggle-assets").getAttribute("aria-expanded"),
    ).toBe("true");
    expect(screen.queryByTestId("project-row-prompt-ops")).toBeTruthy();
    expect(screen.queryByTestId("project-row-rag-foundry")).toBeTruthy();
  });

  it("collapses Agentic on click and hides its projects", () => {
    render(<Sidebar activeId={null} />);
    fireEvent.click(screen.getByTestId("track-toggle-agentic"));
    expect(
      screen.getByTestId("track-toggle-agentic").getAttribute("aria-expanded"),
    ).toBe("false");
    expect(screen.queryByTestId("project-row-supply-chain-copilot")).toBeNull();
  });

  it("links projects to /control/<track>/<slug>/overview", () => {
    render(<Sidebar activeId={null} />);
    const row = screen.getByTestId("project-row-supply-chain-copilot");
    expect(row.getAttribute("href")).toBe(
      "/control/agentic/supply-chain-copilot/overview",
    );
  });

  it("marks the active project with aria-current", () => {
    render(<Sidebar activeId="supply-chain-copilot" />);
    const row = screen.getByTestId("project-row-supply-chain-copilot");
    expect(row.getAttribute("aria-current")).toBe("page");

    const otherRow = screen.getByTestId("project-row-research-agent");
    expect(otherRow.getAttribute("aria-current")).toBeNull();
  });

  it("survives the toggle across re-renders via Zustand persistence", () => {
    const { rerender } = render(<Sidebar activeId={null} />);
    fireEvent.click(screen.getByTestId("track-toggle-assets"));
    rerender(<Sidebar activeId={null} />);
    // The Assets group should still be open after the rerender — the
    // toggle wrote through Zustand, not local component state.
    expect(
      screen.getByTestId("track-toggle-assets").getAttribute("aria-expanded"),
    ).toBe("true");
    expect(screen.queryByTestId("project-row-prompt-ops")).toBeTruthy();
  });
});
