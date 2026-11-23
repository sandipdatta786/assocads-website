import type { Metadata } from "next";
import { site } from "@/config/site";
import { GlossaryIndex } from "@/components/glossary/GlossaryIndex";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { getGlossary } from "@/lib/content/loaders";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { definedTerm, definedTermSet } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata({
  title: "Glossary of AI and Data Science terms",
  description:
    "Plain-English definitions of terms in artificial intelligence and data science, from AI agents to unsupervised learning, with examples and sources.",
  path: "/glossary",
});

export default function Page() {
  const terms = getGlossary();
  const items = terms.map((t) => ({
    slug: t.slug,
    term: t.term,
    shortDefinition: t.shortDefinition,
    aliases: t.aliases,
    draft: t.draft,
  }));

  // The glossary, with each published term as shown in the list below.
  const published = terms.filter((t) => !t.draft);

  return (
    <>
      <JsonLd
        items={
          published.length > 0
            ? [definedTermSet(published), ...published.map(definedTerm)]
            : []
        }
      />
      <PageHeader
        eyebrow="Resources"
        title="Glossary"
        lead={`The ${site.shortName} glossary gives plain-English definitions of terms used in artificial intelligence and data science. Each entry opens with a one-sentence definition, then gives an example and its sources. Every entry is reviewed by a named trustee before it is published, and shows the date it was last reviewed.`}
        breadcrumbs={[
          { label: "Resources", href: "/resources" },
          { label: "Glossary" },
        ]}
      />
      <Section tone="paper" spacing="none" className="pb-16 lg:pb-28">
        <Container>
          {items.length > 0 ? (
            <GlossaryIndex terms={items} />
          ) : (
            <div className="flex flex-col gap-4 rounded-l border border-line bg-cloud p-8 sm:p-10">
              <h2 className="font-display text-h2 font-semibold text-ink">
                Definitions will appear here
              </h2>
              <p className="max-w-2xl text-body text-slate-600">
                Each definition is published after a trustee has reviewed it. In
                the meantime, see the guides.
              </p>
              <div>
                <TextLink href="/guides">Guides</TextLink>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
