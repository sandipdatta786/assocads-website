import { AboutLinks } from "@/components/sections/AboutLinks";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { TrusteeCard } from "@/components/sections/trustees/TrusteeCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";
import { getTrustees, hasTrusteeProfile } from "@/lib/content/loaders";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { person } from "@/lib/seo/schema";
import { numberWord } from "@/lib/words";

export const metadata = pageMetadata({
  title: "Founder Trustees",
  description:
    "The twelve Founder Trustees who set up ASSOCADS and form its first Board. They serve without pay; office bearers are elected after registration.",
  path: "/about/trustees",
});

export default function TrusteesPage() {
  // Deed order. Only the name and capacity come from the deed; everything
  // else on a card is supplied by the trustee.
  const trustees = getTrustees();
  const count = numberWord(trustees.length);
  const settlors = trustees.filter(
    (t) => t.capacity === "Settlor and Founder Trustee",
  ).length;

  return (
    <>
      {/* A Person only for trustees who are published and have consented. */}
      <JsonLd items={trustees.map(person)} />
      <PageHeader
        eyebrow="About"
        title="Founder Trustees"
        lead={
          <>
            The first Board of Trustees of {site.shortName} has {count} Founder
            Trustees, listed here in the order of the trust deed.{" "}
            {settlors > 0 &&
              `${numberWord(settlors)[0].toUpperCase()}${numberWord(settlors).slice(1)} of them are also Settlors, the people who created the trust. `}
            They serve in an honorary capacity, without payment.{" "}
            {site.governance.officeBearersElected
              ? "The Board has elected its office bearers from among them."
              : "Office bearers will be elected at the Board's first meeting after registration, so no trustee holds a title yet."}
          </>
        }
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Founder Trustees" },
        ]}
      />

      <Section tone="paper" spacing="none" className="pb-16 lg:pb-28">
        <Container>
          <ul className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 min-[900px]:grid-cols-3 min-[1280px]:grid-cols-4 lg:gap-6">
            {trustees.map((trustee) => (
              <li key={trustee.slug}>
                <TrusteeCard
                  trustee={trustee}
                  href={
                    hasTrusteeProfile(trustee)
                      ? `/about/trustees/${trustee.slug}`
                      : undefined
                  }
                />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Questions page="/about/trustees" />
      <AboutLinks current="/about/trustees" />
      <CallToAction />
    </>
  );
}
