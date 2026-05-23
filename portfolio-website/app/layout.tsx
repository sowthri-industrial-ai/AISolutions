import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/shared/theme-provider";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
