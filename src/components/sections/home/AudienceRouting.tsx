import Link from "next/link";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Landmark,
  UserRound,
} from "lucide-react";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { getAudiences } from "@/lib/content/loaders";

const icons = {
  students: GraduationCap,
  professionals: UserRound,
  industry: Building2,
  government: Landmark,
} as const;

export function AudienceRouting() {
  const audiences = getAudiences();

  return (
    <Section tone="cloud" aria-labelledby="audiences-heading">
      <Container>
        <SectionIntro
          id="audiences-heading"
          eyebrow="Who it is for"
          title="Find your way in"
          lead="ASSOCADS is open to everyone, without discrimination. Start with the page written for you."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:gap-6">
          {audiences.map((audience) => (
            <li key={audience.slug}>
              <Link
                href={`/for/${audience.slug}`}
                className="group card-link flex h-full flex-col gap-6 rounded-m border border-tone-line bg-paper p-6 sm:p-8 lg:p-10"
              >
                <Icon
                  icon={icons[audience.slug as keyof typeof icons] ?? UserRound}
                  size={32}
                  className="text-indigo"
                />
                <div className="flex flex-1 flex-col gap-3">
                  <h3 className="font-display text-h3 font-semibold text-ink">
                    {audience.title}
                  </h3>
                  <p className="text-body text-slate-600">{audience.summary}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 font-medium text-indigo">
                  Read more
                  <span className="sr-only">
                    {" "}
                    {audience.title.toLowerCase()}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.5}
                    className="transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
