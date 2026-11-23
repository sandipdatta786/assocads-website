import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { NodeLines } from "@/components/ui/Decor";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";
import { registrationLine, site } from "@/config/site";

export function Hero() {
  return (
    <Section
      tone="paper"
      spacing="none"
      className="relative isolate overflow-hidden pt-16 pb-20 sm:pt-24 lg:pt-32 lg:pb-36"
    >
      {/* Decorative network, faded towards the text so it never competes with it. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-2/5 [mask-image:linear-gradient(to_bottom,transparent,black_60%)] opacity-50 lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:w-1/2 lg:[mask-image:linear-gradient(to_right,transparent,black_70%)] lg:opacity-80"
      >
        <NodeLines />
      </div>

      <Container>
        <div className="flex max-w-[54rem] flex-col gap-6">
          <Eyebrow>{site.name}</Eyebrow>
          <Heading level={1} size="display-xl">
            Connecting talent, knowledge, innovation and opportunity in AI
          </Heading>
          <Lead>
            {site.description} {site.mission} {registrationLine()}
          </Lead>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href="/membership" size="large">
              Become a member
            </ButtonLink>
            <ButtonLink href="/programmes" size="large" variant="secondary">
              See what we do
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
