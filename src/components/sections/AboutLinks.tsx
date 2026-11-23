import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { Section, type Tone } from "@/components/ui/Section";
import { site } from "@/config/site";

/** Links to the other About pages, taken from the About menu in site settings. */
export function AboutLinks({
  current,
  tone = "paper",
}: {
  /** The path of the page showing this, which is left out. */
  current: string;
  tone?: Tone;
}) {
  const about = site.navigation.find((item) => item.href === "/about");
  const links = (about?.menu ?? []).filter((link) => link.href !== current);

  return (
    <Section tone={tone} aria-labelledby="more-about-heading">
      <Container>
        <SectionIntro
          id="more-about-heading"
          eyebrow="About"
          title="More about ASSOCADS"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full flex-col gap-2 rounded-m border border-tone-line bg-tone-card p-6 transition-colors duration-150 hover:border-indigo"
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
