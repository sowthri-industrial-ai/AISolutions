// Tests the Graph/Sequence toggle's non-trivial behaviour: default is
// Graph (Graph answers "what is this system?" before Sequence answers
// "how does it run?"); clicking Sequence flips the aria-selected state.
//
// Mounted at the ModeToggle level (not the full ReactionSection) so the
// test avoids depending on the heavy SVG/sequence-layout code paths.

import { describe, it, expect } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModeToggle } from "@/components/tabs/agent-reaction/reaction";

function Harness() {
  const [mode, setMode] = useState<"graph" | "sequence">("graph");
  return (
    <>
      <ModeToggle mode={mode} onChange={setMode} />
      <div data-testid="mode-value">{mode}</div>
    </>
  );
}

describe("Reaction mode toggle", () => {
  it("renders both options and defaults to Graph", () => {
    render(<Harness />);
    const toggle = screen.getByTestId("reaction-mode-toggle");
    expect(toggle).toBeTruthy();

    const graph = screen.getByTestId("reaction-mode-graph");
    const sequence = screen.getByTestId("reaction-mode-sequence");

    expect(graph.getAttribute("aria-selected")).toBe("true");
    expect(sequence.getAttribute("aria-selected")).toBe("false");
    expect(screen.getByTestId("mode-value").textContent).toBe("graph");
  });

  it("flips to Sequence on click and toggles aria-selected", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("reaction-mode-sequence"));

    expect(screen.getByTestId("reaction-mode-graph").getAttribute("aria-selected")).toBe("false");
    expect(screen.getByTestId("reaction-mode-sequence").getAttribute("aria-selected")).toBe("true");
    expect(screen.getByTestId("mode-value").textContent).toBe("sequence");
  });

  it("returns to Graph when Graph is clicked again", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("reaction-mode-sequence"));
    fireEvent.click(screen.getByTestId("reaction-mode-graph"));
    expect(screen.getByTestId("mode-value").textContent).toBe("graph");
  });
});
