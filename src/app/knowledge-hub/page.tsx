import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { HubCard } from "@/components/hub/HubCard";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import { builtAt } from "@/lib/clock";
import {
  getGlossary,
  getGuides,
  getHub,
  getInsights,
} from "@/lib/content/loaders";
import { hubKindDescriptions, hubKindLabels, hubKindOrder } from "@/lib/hub";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Knowledge Hub",
  description:
    "Articles, white papers, research, case studies, AI tools, frameworks and updates on AI and data regulation, from ASSOCADS, each reviewed by a trustee.",
  path: "/knowledge-hub",
});

export default async function Page() {
  const now = await builtAt();
  const entries = getHub({ now });
  const present = hubKindOrder.filter((kind) =>
    entries.some((e) => e.kind === kind),
  );

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Knowledge Hub"
        lead={`Articles, white papers, research publications, case studies, AI tools and frameworks, and updates on emerging AI technologies and regulations, from ${site.shortName}, the ${site.name}. Each entry names its sources and the trustee who reviewed it, and no entry is published before that review.`}
        breadcrumbs={[{ label: "Knowledge Hub" }]}
      />

      {present.length > 0 && (
        <Section tone="paper" spacing="none" className="pb-8">
          <Container>
            <nav
              aria-label="Kinds of entry"
              className="flex flex-wrap gap-x-6 gap-y-3"
            >
              {present.map((kind) => (
                <TextLink key={kind} href={`#${kind}`} arrow={false}>
                  {hubKindLabels[kind]}
                </TextLink>
              ))}
            </nav>
          </Container>
        </Section>
      )}

      {present.length > 0 ? (
        present.map((kind) => (
          <Section
            key={kind}
            id={kind}
            tone="paper"
            aria-labelledby={`${kind}-heading`}
            className="scroll-mt-24"
          >
            <Container className="flex flex-col gap-8">
              <SectionIntro
                id={`${kind}-heading`}
                eyebrow={hubKindLabels[kind]}
                title={`${hubKindLabels[kind]}s`}
                lead={hubKindDescriptions[kind]}
              />
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {entries
                  .filter((e) => e.kind === kind)
                  .map((entry) => (
                    <li key={entry.slug}>
                      <HubCard entry={entry} />
                    </li>
                  ))}
              </ul>
            </Container>
          </Section>
        ))
      ) : (
        <Section tone="paper" spacing="none" className="pb-16 lg:pb-24">
          <Container className="flex flex-col gap-8">
            <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-l border border-line bg-cloud p-8 sm:p-10 lg:p-14">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 -z-10 w-1/2 [mask-image:linear-gradient(to_right,transparent,black)] opacity-60"
              >
                <DotGrid />
              </div>
              <Icon icon={BookOpen} size={32} className="text-indigo" />
              <div className="flex max-w-2xl flex-col gap-4">
                <h2 className="font-display text-h2 font-semibold text-ink">
                  The first entries are being reviewed
                </h2>
                <p className="text-body text-slate-600">
                  Nothing has been published here yet. Each entry is published
                  only after a trustee has reviewed it and its sources have been
                  checked. In the meantime, the material below is already
                  available.
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
              <AlsoRead
                href="/guides"
                title="Guides"
                text={`${getGuides({ now }).length} practical guides on careers, Kolkata and AI policy, each reviewed by a trustee.`}
              />
              <AlsoRead
                href="/insights"
                title="Insights"
                text={`${getInsights({ now }).length} announcements and news from ${site.shortName}.`}
              />
              <AlsoRead
                href="/glossary"
                title="Glossary"
                text={`${getGlossary().length} plain definitions of AI and data terms.`}
              />
            </div>
          </Container>
        </Section>
      )}

      <CallToAction
        title="Suggest a topic or share your research"
        text="If you have a case study, a tool or research you think the Hub should cover, tell us. We check every entry before it is published."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Showcase your idea", href: "/innovation" }}
      />
    </>
  );
}

function AlsoRead({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="card-link flex h-full flex-col gap-3 rounded-m border border-line bg-paper p-6 sm:p-8"
    >
      <h3 className="font-display text-h3 font-semibold text-ink">{title}</h3>
      <p className="text-body text-slate-600">{text}</p>
    </Link>
  );
}
