import { Lightbulb } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";
import { formIds } from "@/lib/enquiries";

/** A prominent invitation to send an idea, innovation or prototype. */
export function ShowcaseIdea() {
  return (
    <Section tone="paper" aria-labelledby="showcase-heading">
      <Container>
        <div className="relative isolate flex flex-col gap-8 overflow-hidden rounded-l border border-line bg-paper p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 -z-10 w-1/2 [mask-image:linear-gradient(to_right,transparent,black)] opacity-60"
          >
            <DotGrid />
          </div>
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="font-mono text-eyebrow font-medium text-slate-600 uppercase">
              Showcase your idea
            </p>
            <Icon icon={Lightbulb} size={32} className="text-indigo" />
            <h2
              id="showcase-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              Have an idea, innovation or prototype?
            </h2>
            <p className="text-body text-slate-600">
              Students, researchers, startups and entrepreneurs can send their
              ideas to {site.shortName}. We plan to offer mentoring, industry
              connections, introductions to investors and ASSOCADS Innovation
              Pitch Days. {site.shortName} does not invest.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <ButtonLink href={`/innovation#${formIds.innovation}`} size="large">
              Submit your idea
            </ButtonLink>
            <ButtonLink href="/innovation" variant="secondary" size="large">
              How it works
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
