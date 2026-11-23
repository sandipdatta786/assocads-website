import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { Section, type Tone } from "@/components/ui/Section";

export type RelatedLink = { label: string; href: string; description: string };

/** A "Related" block: cards linking to other pages on the same subject. */
export function RelatedLinks({
  id,
  eyebrow = "Related",
  title,
  links,
  tone = "paper",
}: {
  /** Unique on the page; used for the heading id. */
  id: string;
  eyebrow?: string;
  title: string;
  links: RelatedLink[];
  tone?: Tone;
}) {
  if (links.length === 0) return null;
  return (
    <Section tone={tone} aria-labelledby={`${id}-heading`}>
      <Container>
        <SectionIntro id={`${id}-heading`} eyebrow={eyebrow} title={title} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group card-link flex h-full flex-col gap-2 rounded-m border border-tone-line bg-tone-card p-6"
              >
                <span className="flex items-center justify-between gap-3 font-display text-h3 font-semibold text-tone-fg">
                  {link.label}
                  <ArrowRight
                    aria-hidden="true"
                    size={20}
                    strokeWidth={1.5}
                    className="shrink-0 text-indigo transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </span>
                <span className="text-body text-tone-muted">
                  {link.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
