import type { Metadata } from "next";
import { GlossaryIndex } from "@/components/glossary/GlossaryIndex";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import { getGlossary } from "@/lib/content/loaders";
import { pageMetadata } from "@/lib/seo/metadata";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${site.url}/glossary`,
    name: `${site.shortName} glossary of AI and Data Science terms`,
    url: `${site.url}/glossary`,
    hasDefinedTerm: terms
      .filter((t) => !t.draft)
      .map((t) => ({
        "@type": "DefinedTerm",
        name: t.term,
        description: t.shortDefinition,
        url: `${site.url}/glossary/${t.slug}`,
      })),
  };

  return (
    <>
      {jsonLd.hasDefinedTerm.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <PageHeader
        eyebrow="Resources"
        title="Glossary"
        lead="Plain-English definitions of terms in artificial intelligence and data science, each with an example and sources."
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
