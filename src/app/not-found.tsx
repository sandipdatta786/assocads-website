import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { NodeLines } from "@/components/ui/Decor";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const helpful = [
  {
    label: "About ASSOCADS",
    href: "/about",
    note: "Who we are and why the trust was set up",
  },
  {
    label: "Programmes",
    href: "/programmes",
    note: "The eight planned areas of work",
  },
  {
    label: "Membership",
    href: "/membership",
    note: "Who can join, and how",
  },
  {
    label: "Guides",
    href: "/guides",
    note: "Sourced, trustee-reviewed guides",
  },
  {
    label: "Questions",
    href: "/faq",
    note: "Short answers to common questions",
  },
  {
    label: "Contact",
    href: "/contact",
    note: "Tell us what you were looking for",
  },
];

export default function NotFound() {
  return (
    <>
      <Section
        tone="paper"
        spacing="none"
        className="relative isolate overflow-hidden pt-16 pb-16 sm:pt-24 lg:pt-32 lg:pb-24"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-1/3 [mask-image:linear-gradient(to_bottom,transparent,black_60%)] opacity-40 lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:w-1/2 lg:[mask-image:linear-gradient(to_right,transparent,black_70%)] lg:opacity-70"
        >
          <NodeLines />
        </div>
        <Container>
          <div className="flex max-w-[44rem] flex-col gap-6">
            <Eyebrow>Error 404</Eyebrow>
            <Heading level={1} size="display-xl">
              This page is not here
            </Heading>
            <Lead>
              The address may be mistyped, or the page may have moved. Start
              again from the home page, or pick one of the pages below.
            </Lead>
            <div className="mt-2 flex flex-wrap gap-3">
              <ButtonLink href="/" size="large">
                Go to the home page
              </ButtonLink>
              <ButtonLink href="/contact" size="large" variant="secondary">
                Contact us
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
      <Section tone="cloud" spacing="tight">
        <Container>
          <h2 className="mb-6 font-display text-h3 font-semibold text-ink">
            Pages people look for
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {helpful.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group card-link flex h-full flex-col gap-1 rounded-m border border-line bg-paper p-6"
                >
                  <span className="flex items-center justify-between gap-3 font-display text-body font-semibold text-ink">
                    {link.label}
                    <ArrowRight
                      aria-hidden="true"
                      size={16}
                      strokeWidth={1.5}
                      className="shrink-0 text-indigo transition-transform duration-150 group-hover:translate-x-0.5"
                    />
                  </span>
                  <span className="text-small text-slate-600">{link.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
