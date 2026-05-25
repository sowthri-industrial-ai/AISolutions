// vitest.setup.ts
// Per-test setup: silences React 18's act() warning under React 19 (no-op
// in this setup) and provides a no-op IntersectionObserver so the
// Agent Reaction anchor nav doesn't blow up under jsdom.

import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// jsdom doesn't ship IntersectionObserver. The anchor nav constructs one
// at mount; a no-op stub keeps the tests from crashing without changing
// the observable behaviour (scroll-spy is exercised via its callback in
// the test that needs it).
class StubIntersectionObserver {
  observe(): void {}
  disconnect(): void {}
  unobserve(): void {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}
vi.stubGlobal("IntersectionObserver", StubIntersectionObserver);

// jsdom Element.scrollTo is a stub; tests that exercise smooth-scroll
// don't assert on layout effects, only that the call was made.
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function () { /* no-op for tests */ };
}
