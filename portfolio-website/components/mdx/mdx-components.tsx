// MDX component overrides for next-mdx-remote/rsc.
//
// Designed to match the locked type scale in app/globals.css. We deliberately
// don't reach for @tailwindcss/typography — it ships an opinionated palette
// that fights the operator console aesthetic, and at the workspace's narrow
// width we want tight, slightly mechanical prose, not magazine columns.
//
// Sizes:
//   - p / li / ul / ol     →  text-base   (13 px body)
//   - h2                   →  text-lg     (16 px) — section heading inside a tab
//   - h3                   →  text-md     (14 px)
//   - inline code          →  text-[0.9em] in font-mono on background-subtle
//   - pre / code blocks    →  text-xs in font-mono on background-subtle
//   - blockquote           →  border-l-2 border-border-strong, italic, muted
//   - table                →  hairline rules, monospace metric columns

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props<T extends keyof React.JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<T>;

export const mdxComponents = {
  h1: ({ className, ...rest }: Props<"h1">) => (
    <h1
      className={cn(
        "mt-6 mb-3 text-xl font-medium tracking-tight text-foreground",
        className,
      )}
      {...rest}
    />
  ),
  h2: ({ className, ...rest }: Props<"h2">) => (
    <h2
      className={cn(
        "mt-6 mb-2 text-lg font-medium tracking-tight text-foreground first:mt-0",
        className,
      )}
      {...rest}
    />
  ),
  h3: ({ className, ...rest }: Props<"h3">) => (
    <h3
      className={cn(
        "mt-4 mb-2 text-md font-medium text-foreground",
        className,
      )}
      {...rest}
    />
  ),
  p: ({ className, ...rest }: Props<"p">) => (
    <p
      className={cn(
        "mb-3 text-base leading-relaxed text-foreground last:mb-0",
        className,
      )}
      {...rest}
    />
  ),
  ul: ({ className, ...rest }: Props<"ul">) => (
    <ul
      className={cn(
        "mb-3 list-disc space-y-1 pl-5 text-base text-foreground last:mb-0",
        className,
      )}
      {...rest}
    />
  ),
  ol: ({ className, ...rest }: Props<"ol">) => (
    <ol
      className={cn(
        "mb-3 list-decimal space-y-1 pl-5 text-base text-foreground last:mb-0",
        className,
      )}
      {...rest}
    />
  ),
  li: ({ className, ...rest }: Props<"li">) => (
    <li className={cn("leading-relaxed", className)} {...rest} />
  ),
  a: ({ className, ...rest }: Props<"a">) => (
    <a
      className={cn(
        "text-info underline decoration-info/40 underline-offset-2 hover:decoration-info",
        className,
      )}
      {...rest}
    />
  ),
  strong: ({ className, ...rest }: Props<"strong">) => (
    <strong
      className={cn("font-medium text-foreground", className)}
      {...rest}
    />
  ),
  em: ({ className, ...rest }: Props<"em">) => (
    <em className={cn("italic", className)} {...rest} />
  ),
  hr: ({ className, ...rest }: Props<"hr">) => (
    <hr
      className={cn("my-6 border-t-hairline border-border", className)}
      {...rest}
    />
  ),

  // Inline `code` and code blocks both come through the `code` component.
  // Code blocks get a `className` like `language-text`; inline code does not.
  code: ({ className, children, ...rest }: Props<"code">) => {
    const isBlock = typeof className === "string" && className.startsWith("language-");
    if (isBlock) {
      return (
        <code className={cn("font-mono text-xs leading-relaxed", className)} {...rest}>
          {children}
        </code>
      );
    }
    return (
      <code
        className={cn(
          "rounded-sm bg-background-subtle px-1 py-0.5 font-mono text-[0.9em] text-foreground",
          className,
        )}
        {...rest}
      >
        {children}
      </code>
    );
  },

  pre: ({ className, children, ...rest }: Props<"pre">) => (
    <pre
      className={cn(
        "mb-3 overflow-x-auto rounded-md border-hairline border-border bg-background-subtle p-3 font-mono text-xs leading-relaxed text-foreground last:mb-0",
        className,
      )}
      {...rest}
    >
      {children as ReactNode}
    </pre>
  ),

  blockquote: ({ className, ...rest }: Props<"blockquote">) => (
    <blockquote
      className={cn(
        "my-3 border-l-2 border-border-strong pl-3 text-base italic text-foreground-muted",
        className,
      )}
      {...rest}
    />
  ),

  table: ({ className, ...rest }: Props<"table">) => (
    <div className="my-4 overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-sm", className)}
        {...rest}
      />
    </div>
  ),
  thead: (props: Props<"thead">) => <thead {...props} />,
  tbody: (props: Props<"tbody">) => <tbody {...props} />,
  tr: (props: Props<"tr">) => <tr {...props} />,
  th: ({ className, ...rest }: Props<"th">) => (
    <th
      className={cn(
        "border-b-hairline border-border-strong pb-2 pr-4 text-left text-xs font-medium uppercase tracking-wider text-foreground-muted last:pr-0",
        className,
      )}
      {...rest}
    />
  ),
  td: ({ className, ...rest }: Props<"td">) => (
    <td
      className={cn(
        "border-b-hairline border-border py-1.5 pr-4 text-base text-foreground last:pr-0",
        className,
      )}
      {...rest}
    />
  ),
};
