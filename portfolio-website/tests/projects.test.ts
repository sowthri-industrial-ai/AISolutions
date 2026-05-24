// Unit tests for the in-memory project registry and tab helpers.
// Pure-function tests — no DOM needed.

import { describe, it, expect } from "vitest";
import {
  PROJECTS,
  TABS,
  DEFAULT_TAB,
  projectById,
  projectsByTrack,
  projectByTrackAndSlug,
  tabBySlug,
  isValidTab,
  toMetadata,
  STATUS_STYLES,
} from "@/lib/projects";

describe("project registry", () => {
  it("includes the six CD-bundle projects", () => {
    expect(PROJECTS.map((p) => p.id)).toEqual([
      "supply-chain-copilot",
      "research-agent",
      "prompt-ops",
      "rag-foundry",
      "edge-vision",
      "robo-instruct",
    ]);
  });

  it("looks up by id and by track+slug", () => {
    expect(projectById("supply-chain-copilot")?.name).toBe("SupplyChainCopilot");
    expect(projectByTrackAndSlug("agentic", "supply-chain-copilot")?.status).toBe("live");
    expect(projectByTrackAndSlug("assets", "supply-chain-copilot")).toBeUndefined();
  });

  it("groups projects by track in declared order", () => {
    expect(projectsByTrack("agentic").map((p) => p.id)).toEqual([
      "supply-chain-copilot",
      "research-agent",
    ]);
    expect(projectsByTrack("assets")).toHaveLength(2);
    expect(projectsByTrack("physical")).toHaveLength(2);
  });

  it("toMetadata collapses display statuses to ProjectMetadata's contract", () => {
    const live = PROJECTS.find((p) => p.id === "supply-chain-copilot")!;
    expect(toMetadata(live).status).toBe("live");
    const beta = PROJECTS.find((p) => p.id === "edge-vision")!;
    expect(toMetadata(beta).status).toBe("in-dev");
    const draft = PROJECTS.find((p) => p.id === "robo-instruct")!;
    expect(toMetadata(draft).status).toBe("concept");
  });

  it("STATUS_STYLES covers every status used by display projects", () => {
    PROJECTS.forEach((p) => {
      expect(STATUS_STYLES).toHaveProperty(p.status);
    });
  });
});

describe("tab registry", () => {
  it("locks the 7-tab order from the CD bundle", () => {
    expect(TABS.map((t) => t.slug)).toEqual([
      "overview",
      "architecture",
      "agent-reaction",
      "demo",
      "prompts",
      "results",
      "tradeoffs",
    ]);
  });

  it("defaults to overview", () => {
    expect(DEFAULT_TAB).toBe("overview");
  });

  it("isValidTab accepts known slugs and rejects others", () => {
    expect(isValidTab("agent-reaction")).toBe(true);
    expect(isValidTab("tradeoffs")).toBe(true);
    expect(isValidTab("agent_reaction")).toBe(false);
    expect(isValidTab("")).toBe(false);
  });

  it("tabBySlug returns label for the signature tab", () => {
    expect(tabBySlug("agent-reaction")?.label).toBe("Agent Reaction");
  });
});
