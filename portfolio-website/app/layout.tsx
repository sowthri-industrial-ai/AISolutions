import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ObservabilityPanel } from "@/components/control-plane/observability-panel";
import { Sidebar } from "@/components/control-plane/sidebar";
import { TopBar } from "@/components/control-plane/top-bar";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { listProjects } from "@/lib/content";

import "./globals.css";

// next/font writes --font-sans / --font-mono onto <html style="…">. globals.css
// then has @theme inline reading var(--font-sans) and var(--font-mono), which
// means font-sans / font-mono utilities resolve to Geist at every element.
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sowthri · AI Solutions",
  description:
    "Operator console for the AI Solutions portfolio. Operate the systems, watch the traces, read the case studies.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side: read the project manifest once and hand it to every panel
  // that needs to navigate or annotate against it. listProjects is wrapped in
  // React's cache() so the three consumers below share a single fs walk.
  const projects = await listProjects();

  // className="dark" is set server-side so the very first paint is dark. After
  // hydration, next-themes (inside ThemeProvider) may switch this to "light"
  // if the visitor has explicitly chosen light. suppressHydrationWarning is
  // required so React doesn't whine about that intentional mismatch.
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="bg-background text-foreground font-sans antialiased">
        <ThemeProvider>
          <div className="flex h-screen flex-col">
            <TopBar projects={projects} />
            <div className="grid min-h-0 flex-1 grid-cols-[200px_1fr_220px] overflow-hidden">
              <Sidebar projects={projects} />
              <main className="overflow-y-auto bg-background">{children}</main>
              <ObservabilityPanel projects={projects} />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
