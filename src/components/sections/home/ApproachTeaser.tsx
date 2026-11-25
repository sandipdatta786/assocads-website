import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";

/* The four stages, in the order of the brand guide. Each stage is a plan
   that ASSOCADS aims to meet, so the copy says so. */
const stages = [
  {
    word: "Learn",
    text: "Knowledge and capability development.",
    plan: "We plan to run workshops, training and certification.",
  },
  {
    word: "Build",
    text: "Practical innovation and collaboration.",
    plan: "We plan to support projects and ideas with mentors and partners.",
  },
  {
    word: "Share",
    text: "Research, insights and open knowledge.",
    plan: "We plan to publish reviewed research and guides.",
  },
  {
    word: "Transform",
    text: "Responsible adoption and societal impact.",
    plan: "We aim to help AI reach public good, with responsibility at its centre.",
  },
];

export function ApproachTeaser() {
  return (
    <Section tone="cloud" aria-labelledby="approach-heading">
      <Container>
        <SectionIntro
          id="approach-heading"
          eyebrow="Our approach"
          title="Learn. Build. Share. Transform."
          lead="Four stages, each one building on the last. Each is something we plan to do, and we say on the site when it has begun."
          action={<TextLink href="/about/approach">Our approach</TextLink>}
        />
        <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
          {/* A single rule joins the stages on desktop only. */}
          <span
            aria-hidden="true"
            className="absolute top-[18px] left-[18px] hidden h-px w-[calc(100%-36px)] bg-indigo/30 lg:block"
          />
          {stages.map((stage, index) => (
            <li
              key={stage.word}
              className="relative flex gap-5 lg:flex-col lg:gap-4 lg:pr-4"
            >
              <span
                aria-hidden="true"
                className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-pill border border-indigo bg-paper font-mono text-caption font-medium text-indigo"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-h3 font-semibold text-ink">
                  {stage.word}
                </h3>
                <p className="text-body text-slate-600">{stage.text}</p>
                <p className="text-small text-slate-600">{stage.plan}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
