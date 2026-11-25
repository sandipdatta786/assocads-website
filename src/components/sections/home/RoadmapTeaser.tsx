import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Typography";
import { TextLink } from "@/components/ui/TextLink";
import { getRoadmap } from "@/lib/content/loaders";

export function RoadmapTeaser() {
  const stages = getRoadmap();

  return (
    <Section tone="paper" aria-labelledby="roadmap-heading">
      <Container>
        <SectionIntro
          id="roadmap-heading"
          eyebrow="Roadmap"
          title="Where we plan to go"
          lead="These are plans, not achievements. We will mark each step on the roadmap page as it happens."
          action={
            <TextLink href="/about/roadmap">See the full roadmap</TextLink>
          }
        />
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {stages.map((stage, index) => (
            <li
              key={stage.horizon}
              className="flex flex-col gap-4 border-t-2 border-ink pt-6"
            >
              <Eyebrow>
                {String(index + 1).padStart(2, "0")} · {stage.label}
              </Eyebrow>
              <h3 className="font-display text-h3 font-semibold text-ink">
                {stage.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {/* The first two of each stage; the roadmap page has them all. */}
                {stage.items.slice(0, 2).map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-body text-slate-600"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] size-1.5 shrink-0 rounded-pill bg-indigo"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
