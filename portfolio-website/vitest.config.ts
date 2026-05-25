// vitest.config.ts
// Minimal vitest setup for component tests against React 19 + Next 16.
// @vitejs/plugin-react gives us JSX transforms + Fast Refresh-compatible
// reconciliation under jsdom; the path alias mirrors tsconfig.json so
// imports like "@/components/..." resolve in tests the same as in the app.

import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    // Tests live under tests/ — kept out of the main tree so they don't
    // ship to the Next.js build.
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
