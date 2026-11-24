import type { ReactNode } from "react";
import { AboutLinks } from "@/components/sections/AboutLinks";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { TrusteeCard } from "@/components/sections/trustees/TrusteeCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";
import {
  getFounderMembers,
  getTrustees,
  hasTrusteeProfile,
} from "@/lib/content/loaders";
import type { Trustee } from "@/lib/content/schemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { person } from "@/lib/seo/schema";
import { numberWord } from "@/lib/words";

const capitalise = (s: string) => `${s[0].toUpperCase()}${s.slice(1)}`;

export const metadata = pageMetadata({
  title: "Founder Trustees and founder members",
  description: `The ${numberWord(getTrustees().length)} Founder Trustees on the first Board of ASSOCADS, its elected office bearers, and ${numberWord(getFounderMembers().length)} founder members who serve on its sub-committees.`,
  path: "/about/trustees",
});

function PeopleGrid({ people }: { people: Trustee[] }): ReactNode {
  return (
    <ul className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1280px]:grid-cols-4 lg:gap-6">
      {people.map((person) => (
        <li key={person.slug}>
          <TrusteeCard
            trustee={person}
            href={
              hasTrusteeProfile(person)
                ? `/about/trustees/${person.slug}`
                : undefined
            }
          />
        </li>
      ))}
    </ul>
  );
}

export default function TrusteesPage() {
  // In the order the Board has set. Name, capacity, office and sub-committees
  // come from the Board; everything else on a card is supplied by the person.
  const trustees = getTrustees();
  const founderMembers = getFounderMembers();
  const count = numberWord(trustees.length);
  const settlors = trustees.filter(
    (t) => t.capacity === "Settlor and Founder Trustee",
  ).length;

  return (
    <>
      {/* A Person only for trustees who are published and have consented. */}
      <JsonLd items={[...trustees, ...founderMembers].map(person)} />
      <PageHeader
        eyebrow="About"
        title="Founder Trustees and founder members"
        lead={
          <>
            The first Board of Trustees of {site.shortName} has {count} Founder
            Trustees.{" "}
            {settlors > 0 &&
              `${capitalise(numberWord(settlors))} of them are also Settlors, the people who created the trust. `}
            They serve in an honorary capacity, without payment.{" "}
            {site.governance.officeBearersElected
              ? "The Board has elected its office bearers, shown on each card with the sub-committees each person serves on."
              : "Office bearers will be elected at the Board's first meeting after registration, so no trustee holds a title yet."}
          </>
        }
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Founder Trustees" },
        ]}
      />

      <Section
        tone="paper"
        spacing="none"
        className="pb-16 lg:pb-28"
        aria-label="Founder Trustees"
      >
        <Container>
          <PeopleGrid people={trustees} />
        </Container>
      </Section>

      {founderMembers.length > 0 && (
        <Section tone="cloud" aria-labelledby="founder-members-heading">
          <Container>
            <SectionIntro
              id="founder-members-heading"
              eyebrow="Founder members"
              title={`${capitalise(numberWord(founderMembers.length))} founder members`}
              lead="Founder members work with the trustees on the sub-committees shown on each card. They are not members of the Board of Trustees."
            />
            <PeopleGrid people={founderMembers} />
          </Container>
        </Section>
      )}

      <Questions page="/about/trustees" />
      <AboutLinks current="/about/trustees" />
      <CallToAction />
    </>
  );
}
