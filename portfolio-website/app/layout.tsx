import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Sowthri — Control Plane",
  description:
    "An operator console for Sowthri Somasundaram's AI portfolio: live traces, evals, and architecture for each project.",
};

// Runs before React hydrates — reads the persisted theme slot and stamps
// data-theme + .dark on <html> so the first paint already matches the user's
// preference. Without this, dark-mode users would see a light flash.
const themeBootstrap = `(function(){try{
  var t='dark';
  var raw=localStorage.getItem('ctrl-plane:v1');
  if(raw){var s=JSON.parse(raw);if(s&&s.theme==='light')t='light';}
  document.documentElement.dataset.theme=t;
  document.documentElement.classList.toggle('dark',t==='dark');
}catch(e){
  document.documentElement.dataset.theme='dark';
  document.documentElement.classList.add('dark');
}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          // The script is small, runs before paint, and is XSS-safe — it
          // only reads localStorage and sets attributes on <html>.
          dangerouslySetInnerHTML={{ __html: themeBootstrap }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
