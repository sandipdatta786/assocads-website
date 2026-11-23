import { Landmark, ShieldCheck, Users } from "lucide-react";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";

/* Three commitments taken from the trust deed (blueprint sections 7.3 and 7.4).
   Worded as what the deed requires, because the trust has not yet operated. */
const points = [
  {
    icon: Users,
    title: "Open to all",
    text: "Membership and programmes are open to everyone, without discrimination. Students, professionals, institutions and companies all have a place.",
  },
  {
    icon: Landmark,
    title: "A not-for-profit public trust",
    text: "ASSOCADS is a public charitable trust. Its trustees are unpaid, its accounts are to be audited every year by a Chartered Accountant, and its assets can never be shared among trustees or members.",
  },
  {
    icon: ShieldCheck,
    title: "Committed to responsible AI",
    text: "Responsible, ethical and trustworthy AI is one of the principles written into our trust deed, alongside data protection and academic integrity.",
  },
];

export function WhyAssocads() {
  return (
    <Section tone="ink" aria-labelledby="why-heading">
      <Container>
        <SectionIntro
          id="why-heading"
          eyebrow="Why ASSOCADS"
          title="A public trust, run for public benefit"
          action={
            <TextLink href="/about/governance">How the trust is run</TextLink>
          }
        />
        <ul className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {points.map((point) => (
            <li
              key={point.title}
              className="flex flex-col gap-4 border-t border-tone-line pt-8"
            >
              <Icon
                icon={point.icon}
                size={28}
                className="text-indigo-bright"
              />
              <h3 className="font-display text-h3 font-semibold text-paper">
                {point.title}
              </h3>
              <p className="text-body text-slate-400">{point.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
