import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { HubCard } from "@/components/hub/HubCard";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import { builtAt } from "@/lib/clock";
import { getHub } from "@/lib/content/loaders";
import { hubKindDescriptions, hubKindLabels, hubKindOrder } from "@/lib/hub";
import { relatedWithContent } from "@/lib/related";
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
          <Container>
            <EmptyState
              icon={BookOpen}
              title="The first entries are being reviewed"
              related={relatedWithContent(
                ["guides", "insights", "glossary", "programmes"],
                now,
              ).slice(0, 3)}
            >
              <p>
                Nothing has been published here yet. Each entry is published
                only after a trustee has reviewed it and its sources have been
                checked. In the meantime, the material below is already
                available.
              </p>
            </EmptyState>
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
