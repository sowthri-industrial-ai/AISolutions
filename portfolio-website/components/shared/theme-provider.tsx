"use client";

// Thin wrapper around next-themes' provider. Locked to:
//   - attribute="class" so the .dark selector in globals.css picks the mode up
//   - defaultTheme="dark" — the operator console is built dark-first
//   - enableSystem={false} — we want dark as an explicit default, not OS-driven
//   - disableTransitionOnChange so toggling doesn't briefly flash transitions
//
// The actual toggle button lives in components/control-plane/top-bar.tsx and
// reads/writes via useTheme() from next-themes.

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
