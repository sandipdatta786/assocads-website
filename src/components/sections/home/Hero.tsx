import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeroNetwork } from "@/components/sections/home/HeroNetwork";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";
import { site } from "@/config/site";

const HEADLINE = [
  "Connecting talent,",
  "knowledge, innovation",
  "and opportunity.",
];

const SUPPORT =
  "ASSOCADS brings together students, professionals, academia and industry to advance Artificial Intelligence and Data Science in India, beginning in West Bengal.";

export function Hero() {
  return (
    <Section
      tone="paper"
      spacing="none"
      className="relative isolate overflow-hidden pt-16 pb-20 sm:pt-24 lg:pt-32 lg:pb-36"
    >
      {/* Decorative network, faded towards the text so it never competes with
          it. It draws in once and, with a mouse, leans towards the pointer. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-2/5 [mask-image:linear-gradient(to_bottom,transparent,black_60%)] opacity-50 lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:w-1/2 lg:[mask-image:linear-gradient(to_right,transparent,black_70%)] lg:opacity-80"
      >
        <HeroNetwork />
      </div>

      <Container>
        <div className="flex max-w-[54rem] flex-col gap-6">
          <Eyebrow className="hero-follow">{site.name}</Eyebrow>
          {/* Each span is one line on wide screens and reveals in turn. */}
          <Heading level={1} size="display-xl">
            {HEADLINE.map((line, i) => (
              <span key={line} className="hero-line">
                {line}
                {i < HEADLINE.length - 1 && " "}
              </span>
            ))}
          </Heading>
          <Lead className="hero-follow">
            {site.description} {SUPPORT}
          </Lead>
          <div className="hero-follow-late mt-4 flex flex-wrap gap-3">
            <ButtonLink href="/membership" size="large">
              Become a member
            </ButtonLink>
            <ButtonLink href="/about" size="large" variant="secondary">
              Explore ASSOCADS
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
