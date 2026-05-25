// Anchor nav scroll-spy + smooth-scroll test.
// Under jsdom IntersectionObserver is stubbed (no-op), so we focus on
// what we can deterministically verify: the 4 anchor buttons render, the
// initial active highlight is Tables, and clicking another anchor calls
// scrollTo on the supplied scroll root.

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AnchorNav } from "@/components/tabs/agent-reaction/anchor-nav";

describe("AnchorNav", () => {
  it("renders all four section anchors with mono labels", () => {
    render(<AnchorNav scrollRoot={null} />);
    expect(screen.getByTestId("anchor-sec-tables").textContent).toBe("Tables");
    expect(screen.getByTestId("anchor-sec-compositions").textContent).toBe("Compositions");
    expect(screen.getByTestId("anchor-sec-reaction").textContent).toBe("Reaction");
    expect(screen.getByTestId("anchor-sec-result").textContent).toBe("Result");
  });

  it("marks Tables active on initial render", () => {
    render(<AnchorNav scrollRoot={null} />);
    expect(
      screen.getByTestId("anchor-sec-tables").getAttribute("aria-current"),
    ).toBe("true");
    expect(
      screen.getByTestId("anchor-sec-result").getAttribute("aria-current"),
    ).toBeNull();
  });

  it("calls scrollTo on the supplied root when an anchor is clicked", () => {
    // Provide a fake scroll root and target element.
    const target = document.createElement("div");
    target.id = "sec-reaction";
    // offsetTop is read-only on jsdom; spy on it.
    Object.defineProperty(target, "offsetTop", { value: 420 });
    document.body.appendChild(target);

    const fakeRoot = {
      scrollTo: vi.fn(),
    } as unknown as HTMLElement;

    render(<AnchorNav scrollRoot={fakeRoot} />);
    fireEvent.click(screen.getByTestId("anchor-sec-reaction"));

    expect(fakeRoot.scrollTo).toHaveBeenCalledWith({
      top: 416, // 420 - 4 (CD bundle's offset to keep anchor under the nav)
      behavior: "smooth",
    });

    target.remove();
  });

  it("does not crash when scrollRoot is null", () => {
    render(<AnchorNav scrollRoot={null} />);
    // Click should be a no-op; we just verify no throw.
    fireEvent.click(screen.getByTestId("anchor-sec-compositions"));
  });
});
