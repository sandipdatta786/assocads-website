import { SectionIntro } from "@/components/sections/SectionIntro";
import { Avatar } from "@/components/ui/Avatar";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { getTrustees } from "@/lib/content/loaders";

const numberWords = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
];

export function TrusteesPreview() {
  const trustees = getTrustees();
  const count = numberWords[trustees.length] ?? String(trustees.length);

  return (
    <Section tone="paper" aria-labelledby="trustees-heading">
      <Container>
        <SectionIntro
          id="trustees-heading"
          eyebrow="Founder Trustees"
          title={`Set up by ${count} Founder Trustees`}
          lead="Together they form the first Board of Trustees and serve without payment. Office bearers will be elected at the Board's first meeting after registration."
          action={<TextLink href="/about/trustees">Meet the trustees</TextLink>}
        />
        <ul className="grid grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-7 lg:gap-x-6">
          {trustees.map((trustee) => (
            <li key={trustee.slug} className="flex flex-col items-start gap-3">
              {/* Photographs appear only with consent; until then, initials. */}
              <Avatar
                name={trustee.name}
                photo={trustee.consentToPublish ? trustee.photo : null}
                size={80}
                decorative
              />
              <span className="text-body font-medium text-ink">
                {trustee.name}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
