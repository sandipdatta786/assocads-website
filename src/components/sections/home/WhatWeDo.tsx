import { SectionIntro } from "@/components/sections/SectionIntro";
import { ProgrammeGrid } from "@/components/sections/programmes/ProgrammeGrid";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";

export function WhatWeDo() {
  return (
    <Section tone="paper" aria-labelledby="programmes-heading">
      <Container>
        <SectionIntro
          id="programmes-heading"
          eyebrow="What we do"
          title="Eight areas of work"
          lead="Each programme comes from the objects in our trust deed. All eight are planned, and each page will say when work begins."
          action={<TextLink href="/programmes">All programmes</TextLink>}
        />
        <ProgrammeGrid />
      </Container>
    </Section>
  );
}
