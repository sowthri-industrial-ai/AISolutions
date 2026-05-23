// app/page.tsx
// Home page — visitor's first surface. Three jobs:
//   1. Establish who I am (hero).
//   2. Offer the two-route choice (control plane vs case studies).
//   3. Surface the three tracks with the track accents.
//
// See TECH-STACK.md §6 (routing) and §14 (Figma brief).

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TRACKS: Array<{
  slug: "agentic" | "assets" | "physical";
  title: string;
  blurb: string;
  borderClass: string;
}> = [
  {
    slug: "agentic",
    title: "Agentic AI",
    blurb: "Multi-agent systems, tool use, autonomous workflows.",
    borderClass: "border-l-track-agentic",
  },
  {
    slug: "assets",
    title: "Assets AI",
    blurb:
      "Reusable AI building blocks — RAG pipelines, eval harnesses, prompt versioning.",
    borderClass: "border-l-track-assets",
  },
  {
    slug: "physical",
    title: "Physical",
    blurb: "Edge inference, embodied AI, on-device intelligence.",
    borderClass: "border-l-track-physical",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero — fills the viewport below the sticky 3.5rem header. */}
      <section className="flex h-[calc(100vh-3.5rem)] items-center">
        <div className="mx-auto w-full max-w-6xl px-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            GenAI architect portfolio
          </p>
          <h1 className="mt-6 text-display font-medium text-foreground">
            Sowthri Somasundaram
          </h1>
          <p className="mt-6 max-w-2xl text-h2 font-normal text-muted-foreground">
            Designing and building AI systems for industrial problems.
          </p>
        </div>
      </section>

      {/* Two-route CTA — the architectural promise made concrete. */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-h2 font-medium text-foreground">
          Two ways to explore
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="p-6">
            <CardContent className="flex h-full flex-col gap-4 p-0">
              <h3 className="text-h3 font-medium">
                Open the control plane
              </h3>
              <p className="text-body text-muted-foreground">
                Operate the systems. Run live demos, switch models, watch
                traces stream in real time.
              </p>
              <p className="text-sm text-muted-foreground/80">
                Interactive — built for engineers and senior tech leaders.
              </p>
              <div className="mt-auto pt-2">
                <Button render={<Link href="/control" />}>
                  Enter control plane <ArrowRight />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6">
            <CardContent className="flex h-full flex-col gap-4 p-0">
              <h3 className="text-h3 font-medium">
                Read the case studies
              </h3>
              <p className="text-body text-muted-foreground">
                Architecture, decisions, trade-offs. Long-form writeups you
                can scan or share.
              </p>
              <p className="text-sm text-muted-foreground/80">
                Static — designed for depth.
              </p>
              <div className="mt-auto pt-2">
                <Button variant="outline" render={<Link href="/agentic" />}>
                  Browse case studies <ArrowRight />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Three tracks — each card carries its track accent on the left border. */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TRACKS.map((track) => (
            <Card
              key={track.slug}
              className={`border-l-4 ${track.borderClass} p-6`}
            >
              <CardContent className="flex h-full flex-col gap-3 p-0">
                <h3 className="text-h3 font-medium">{track.title}</h3>
                <p className="text-body text-muted-foreground">{track.blurb}</p>
                <Link
                  href={`/${track.slug}`}
                  className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
                >
                  Explore <ArrowRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Philosophy — a single paragraph that frames the case studies. */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-3xl">
          <h3 className="text-h3 font-medium text-foreground">
            How I think about GenAI
          </h3>
          <p className="mt-6 text-body text-muted-foreground">
            Most GenAI failures are systems failures, not model failures.
            The interesting work lives in the seams — eval design, retrieval
            grounding, tool orchestration, and the trade-offs you accept
            when those things meet a real constraint. The projects here
            are documented with that in mind: not just what was built, but
            what was chosen against.
          </p>
          <Link
            href="/approach"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
          >
            Read more <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
