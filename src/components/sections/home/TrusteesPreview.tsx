import { SectionIntro } from "@/components/sections/SectionIntro";
import { Avatar } from "@/components/ui/Avatar";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { filled } from "@/components/sections/trustees/TrusteeCard";
import { site } from "@/config/site";
import { getFounderMembers, getTrustees } from "@/lib/content/loaders";
import { hasTrusteeProfile } from "@/lib/content/trustees";
import { numberWord } from "@/lib/words";
import { PersonPeek } from "./PersonPeek";

export function TrusteesPreview() {
  const trustees = getTrustees();
  const founderMembers = getFounderMembers();
  const count = numberWord(trustees.length);
  const others = numberWord(founderMembers.length);
  const people = [...trustees, ...founderMembers];

  return (
    <Section tone="paper" aria-labelledby="trustees-heading">
      <Container>
        <SectionIntro
          id="trustees-heading"
          eyebrow="Founder Trustees"
          title={`The people behind ${site.shortName}`}
          lead={`${count[0].toUpperCase()}${count.slice(1)} Founder Trustees form the first Board of Trustees and serve without payment.${site.governance.officeBearersElected ? " The Board has elected its office bearers." : " Office bearers will be elected at the Board's first meeting after registration."}${founderMembers.length > 0 ? ` ${others[0].toUpperCase()}${others.slice(1)} founder members work with them on its sub-committees.` : ""}`}
          action={<TextLink href="/about/trustees">Meet the trustees</TextLink>}
        />
        {/* Phones: small tiles, three to a row (two below 360px, where a long
            surname would not fit). Wider: larger tiles. */}
        <ul className="grid grid-cols-2 gap-x-3 gap-y-6 min-[22.5rem]:grid-cols-3 sm:gap-x-4 sm:gap-y-8 md:grid-cols-4 lg:grid-cols-6 lg:gap-x-6">
          {people.map((trustee) => {
            const capacity =
              trustee.capacity === "Founder Member"
                ? "Founder Member"
                : "Founder Trustee";
            const title = trustee.officeTitle || capacity;
            return (
              <li key={trustee.slug} className="min-w-0">
                <PersonPeek
                  person={{
                    name: trustee.name,
                    title,
                    capacity: trustee.officeTitle ? capacity : undefined,
                    committees: trustee.committees,
                    work:
                      filled([trustee.role, trustee.organisation]).join(", ") ||
                      undefined,
                    bio: filled([trustee.bio])[0],
                    linkedin: filled([trustee.linkedin])[0],
                    href: hasTrusteeProfile(trustee)
                      ? `/about/trustees/${trustee.slug}`
                      : undefined,
                  }}
                  tile={
                    <>
                      {/* Photographs appear only with consent; until then, initials. */}
                      <span className="block w-12 shrink-0 sm:w-20">
                        <Avatar
                          name={trustee.name}
                          photo={
                            trustee.consentToPublish ? trustee.photo : null
                          }
                          size="fill"
                          sizes="(min-width: 640px) 80px, 48px"
                          decorative
                        />
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-small font-medium text-ink group-hover:text-indigo group-hover:underline sm:text-body">
                          {trustee.name}
                        </span>
                        <span className="text-small text-slate-600">
                          {title}
                        </span>
                      </span>
                    </>
                  }
                />
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
