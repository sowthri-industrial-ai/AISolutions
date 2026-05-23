// components/shared/footer.tsx
// Site footer — three columns on desktop, stacked on mobile. Pure Server
// Component; all links static. Connect column hrefs are intentional
// placeholders (#) until real socials land.

import Link from "next/link";

const COLUMNS: Array<{
  heading: string;
  links: Array<{ label: string; href: string }>;
}> = [
  {
    heading: "Tracks",
    links: [
      { label: "Agentic", href: "/agentic" },
      { label: "Assets", href: "/assets" },
      { label: "Physical", href: "/physical" },
    ],
  },
  {
    heading: "Pages",
    links: [
      { label: "Approach", href: "/approach" },
      { label: "Stack", href: "/stack" },
      { label: "About", href: "/about" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Email", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {col.heading}
              </h4>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© 2026 Sowthri Somasundaram</span>
          <span>Built with Claude</span>
        </div>
      </div>
    </footer>
  );
}
