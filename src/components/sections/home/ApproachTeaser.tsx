import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { getInitiatives } from "@/lib/content/loaders";
import { initiativeGroups } from "@/lib/content/schemas";

/** The four groups of proposed initiatives, linking to /about/approach. */
export function ApproachTeaser() {
  const initiatives = getInitiatives();

  return (
    <Section tone="cloud" aria-labelledby="approach-heading">
      <Container>
        <SectionIntro
          id="approach-heading"
          eyebrow="Our approach"
          title="Building with AI, not just talking about it"
          lead="Conferences have their place, but we want ASSOCADS to be known for what people learn, build and achieve through it. These are the ideas we plan to start from."
          action={<TextLink href="/about/approach">Our approach</TextLink>}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {initiativeGroups.map((group) => {
            const items = initiatives.filter((i) => i.group === group.slug);
            return (
              <li key={group.slug}>
                <Link
                  href="/about/approach#initiatives-heading"
                  className="group card-link flex h-full flex-col gap-4 rounded-m border border-line bg-paper p-6"
                >
                  <span className="flex items-center justify-between gap-3 font-display text-h3 font-semibold text-ink">
                    {group.title}
                    <ArrowRight
                      aria-hidden="true"
                      size={20}
                      strokeWidth={1.5}
                      className="shrink-0 text-indigo transition-transform duration-150 group-hover:translate-x-0.5"
                    />
                  </span>
                  <span className="flex flex-col gap-1.5">
                    {items.map((item) => (
                      <span
                        key={item.slug}
                        className="flex gap-2.5 text-small text-slate-600"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.55em] size-1.5 shrink-0 rounded-pill bg-indigo"
                        />
                        {item.title}
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
