// components/mdx/mdx-components.tsx
// Element overrides for MDX rendering. Keeps the static project page
// readable without pulling in @tailwindcss/typography — every override is
// deliberate so the type scale and the prose match the rest of the site.

import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const heading = (extra: string) =>
  cn("scroll-mt-24 font-medium text-foreground", extra);

export const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className={heading("text-h1 mt-10 mb-4")} {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className={heading("text-h2 mt-10 mb-3")} {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className={heading("text-h3 mt-8 mb-2")} {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="my-4 text-body text-foreground/90" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="my-4 list-disc space-y-2 pl-6 text-body text-foreground/90 marker:text-muted-foreground"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="my-4 list-decimal space-y-2 pl-6 text-body text-foreground/90 marker:text-muted-foreground"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-medium text-foreground" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-6 border-l-2 border-border pl-4 italic text-muted-foreground"
      {...props}
    />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-8 border-border" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="border-b border-border bg-muted/40" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="border-b border-border px-3 py-2 text-left font-medium"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="border-b border-border px-3 py-2 align-top" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="my-4 overflow-x-auto rounded-md border border-border bg-muted/50 p-4 font-mono text-sm leading-relaxed"
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) => {
    const isBlock = typeof className === "string" && className.startsWith("language-");
    if (isBlock) {
      return <code className={cn("font-mono text-sm", className)} {...props} />;
    }
    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        {...props}
      />
    );
  },
};
