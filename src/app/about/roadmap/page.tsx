import { AboutLinks } from "@/components/sections/AboutLinks";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { getRoadmap } from "@/lib/content/loaders";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Roadmap",
  description:
    "What ASSOCADS plans to do in its first twelve months, in the following year and beyond: registration, first programmes, chapters and Centres of Excellence.",
  path: "/about/roadmap",
});

export default function RoadmapPage() {
  const stages = getRoadmap();

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Roadmap"
        lead="What we plan to do, in three stages. Every item here is a plan, not something that has already happened."
        breadcrumbs={[{ label: "About", href: "/about" }, { label: "Roadmap" }]}
      />

      <Section tone="paper" spacing="none" className="pb-16 lg:pb-28">
        <Container>
          <Callout variant="status" className="mb-12 max-w-3xl lg:mb-16">
            This roadmap sets out intentions. Dates and details will be
            confirmed by the Board.
          </Callout>

          <ol className="flex flex-col">
            {stages.map((stage, index) => (
              <li
                key={stage.horizon}
                aria-labelledby={`stage-${stage.horizon}`}
                className="grid gap-6 border-t-2 border-ink py-10 lg:grid-cols-12 lg:gap-12 lg:py-14"
              >
                <div className="flex flex-col gap-3 lg:col-span-4">
                  <Eyebrow>
                    {String(index + 1).padStart(2, "0")} · {stage.label} ·{" "}
                    {stage.period}
                  </Eyebrow>
                  <Heading level={2} id={`stage-${stage.horizon}`}>
                    {stage.title}
                  </Heading>
                </div>
                <ul className="flex flex-col gap-4 lg:col-span-8">
                  {stage.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-4 rounded-m border border-line bg-paper p-5 text-body text-slate-600"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.45em] size-2.5 shrink-0 rounded-pill border-2 border-indigo"
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

      <Questions page="/about/roadmap" />
      <AboutLinks current="/about/roadmap" />
      <CallToAction />
    </>
  );
}
