"use client";

// components/shared/theme-provider.tsx
// Thin wrapper around next-themes so app/layout.tsx stays a Server Component.
// Sets attribute="class" so the `.dark` selector in globals.css activates.

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
