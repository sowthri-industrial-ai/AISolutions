"use client";

// "Ask about this project" input — sticky at the bottom of every workspace.
// Visual-only stub for slice 3 (no AI wiring); types into local state.

import { useState } from "react";
import { IconArrowSm, IconSparkle } from "@/components/control-plane/icons";

interface AskBarProps {
  projectName: string;
  /** Custom placeholder; otherwise built from the project name. */
  placeholder?: string;
}

export function AskBar({ projectName, placeholder }: AskBarProps) {
  const [value, setValue] = useState("");
  const ph =
    placeholder ??
    (projectName === "SupplyChainCopilot"
      ? "Why pgvector instead of Pinecone here?"
      : `Ask about ${projectName}…`);
  return (
    <div
      style={{
        borderTop: "0.5px solid var(--border-token)",
        padding: "12px 28px 16px",
        background: "var(--bg)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
          color: "var(--agentic)",
          fontSize: 12.5,
        }}
      >
        <IconSparkle size={13} />
        <span>Ask about this project</span>
      </div>
      <form
        style={{ display: "flex", gap: 8, alignItems: "stretch" }}
        onSubmit={(e) => {
          e.preventDefault();
          // TODO(api): POST to /api/copilot/[track]/[slug] once the
          // per-project copilot endpoint is wired (TECH-STACK.md §7).
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={ph}
          aria-label={`Ask about ${projectName}`}
          style={{
            flex: 1,
            background: "var(--bg-subtle)",
            border: "0.5px solid var(--border-token)",
            color: "var(--fg)",
            borderRadius: 5,
            padding: "10px 12px",
            fontSize: 13,
            outline: "none",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--border-strong)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--border-token)")
          }
        />
        <button
          type="submit"
          aria-label="Send"
          style={{
            width: 36,
            background: "var(--bg-subtle)",
            color: "var(--fg-muted)",
            border: "0.5px solid var(--border-token)",
            borderRadius: 5,
            display: "inline-grid",
            placeItems: "center",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-hover)";
            e.currentTarget.style.color = "var(--fg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--bg-subtle)";
            e.currentTarget.style.color = "var(--fg-muted)";
          }}
        >
          <IconArrowSm size={14} />
        </button>
      </form>
    </div>
  );
}
