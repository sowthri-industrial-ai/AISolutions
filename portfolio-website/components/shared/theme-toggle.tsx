"use client";

// components/shared/theme-toggle.tsx
// Theme toggle button — flips between light and dark explicitly. Hidden until
// next-themes has mounted on the client so the icon doesn't flash the wrong
// state during hydration.

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

/** Mount detector with no setState-in-effect — SSR returns false, client true. */
const subscribe = () => () => {};
function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();

  // Render an inert placeholder server-side and pre-mount to preserve layout.
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Toggle theme"
        disabled
        className="opacity-0"
      >
        <Sun />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
