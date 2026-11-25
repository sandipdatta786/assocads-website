import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/Decor";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { registrationLine, site } from "@/config/site";

/** Who ASSOCADS is, in a split layout. Every sentence is a fact or a plan. */
export function AboutSplit() {
  return (
    <Section tone="paper" aria-labelledby="about-heading">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
        <div className="relative">
          <div className="relative overflow-hidden rounded-l border border-tone-line bg-indigo-tint p-8 sm:p-10">
            <DotGrid className="absolute inset-0 text-indigo opacity-30" />
            <p className="relative font-mono text-eyebrow font-medium text-ink uppercase">
              {site.shortName} · {site.location.city}
            </p>
            <p className="relative mt-16 font-display text-h3 font-semibold text-ink">
              {site.tagline}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <SectionIntro
            id="about-heading"
            eyebrow="About ASSOCADS"
            title="An association for a connected AI community."
            action={<TextLink href="/about">About ASSOCADS</TextLink>}
          />
          <p className="max-w-[720px] text-lead text-slate-600">
            {site.shortName} is a not-for-profit professional association. It
            brings together students, professionals, academia, industry,
            startups and government to advance Artificial Intelligence and Data
            Science in India, beginning in West Bengal.
          </p>
          <p className="max-w-[720px] text-body text-slate-600">
            Our purpose is to make talent, knowledge, innovation and opportunity
            meet in one place. We plan to do this through training, events,
            research, industry collaboration and support for startups, each one
            open to people from every background.
          </p>
          {/* That trustees are unpaid and the assets can never be shared is
              said under "Why ASSOCADS", so it is not repeated here. */}
          <p className="max-w-[720px] text-body text-slate-600">
            {registrationLine()}
          </p>
        </div>
      </Container>
    </Section>
  );
}
