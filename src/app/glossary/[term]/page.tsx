import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { Prose } from "@/components/ui/Typography";
import { site } from "@/config/site";
import { builtAt } from "@/lib/clock";
import { bySlug, getGlossary, getGuides } from "@/lib/content/loaders";
import { loadMdxBody } from "@/lib/content/mdx";
import { clip } from "@/lib/guides";
import { formatLongDate } from "@/lib/publishing";
import { pageMetadata } from "@/lib/seo/metadata";

/* Drafts are listed so the route always has a path to prerender; the page
   returns "not found" for a draft on the live site. */
export function generateStaticParams() {
  return getGlossary({ includeDrafts: true }).map((t) => ({ term: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/glossary/[term]">): Promise<Metadata> {
  const term = bySlug(getGlossary(), (await params).term);
  if (!term) return {};
  return pageMetadata({
    title: `${term.term}: meaning and example`,
    description: clip(term.shortDefinition),
    path: `/glossary/${term.slug}`,
    noindex: term.draft,
  });
}

export default async function TermPage({
  params,
}: PageProps<"/glossary/[term]">) {
  const { term: slug } = await params;
  const glossary = getGlossary();
  const term = bySlug(glossary, slug);
  if (!term) notFound();

  const Body = term.body.trim()
    ? await loadMdxBody("glossary", term.slug)
    : null;
  const related = term.related
    .map((r) => bySlug(glossary, r))
    .filter((t) => t !== undefined);
  const guides = getGuides({ now: await builtAt() }).filter((g) =>
    g.glossaryTerms.includes(term.slug),
  );
  const pageUrl = `${site.url}/glossary/${term.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": pageUrl,
    name: term.term,
    ...(term.aliases.length > 0 ? { alternateName: term.aliases } : {}),
    description: term.shortDefinition,
    url: pageUrl,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      "@id": `${site.url}/glossary`,
      name: `${site.shortName} glossary of AI and Data Science terms`,
    },
  };

  return (
    <>
      {!term.draft && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <article>
        <Section
          tone="paper"
          spacing="none"
          className="pt-6 pb-16 lg:pt-8 lg:pb-24"
        >
          <Container width="reading" className="flex flex-col gap-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Resources", href: "/resources" },
                { label: "Glossary", href: "/glossary" },
                { label: term.term },
              ]}
              className="mb-2 lg:mb-6"
            />
            {term.draft && (
              <Callout
                variant="status"
                title="Draft, awaiting a trustee's review"
              >
                <p>
                  This definition is a draft. It is visible only on a local copy
                  of the site and never on the live site.
                </p>
              </Callout>
            )}
            <p className="font-mono text-eyebrow font-medium text-slate-600 uppercase">
              Glossary
            </p>
            <h1 className="font-display text-display-l font-bold text-ink">
              {term.term}
            </h1>
            {term.aliases.length > 0 && (
              <p className="-mt-2 text-body text-slate-600">
                Also called {term.aliases.join(", ")}
              </p>
            )}
            <section
              aria-labelledby="definition"
              className="flex flex-col gap-2 rounded-l border-l-4 border-indigo bg-indigo-tint p-6 sm:p-8"
            >
              <h2
                id="definition"
                className="font-mono text-eyebrow font-medium text-indigo-deep uppercase"
              >
                Definition
              </h2>
              <p className="text-lead text-ink">{term.shortDefinition}</p>
            </section>

            {Body && (
              <Prose className="mt-6">
                <Body />
              </Prose>
            )}

            {related.length > 0 && (
              <section
                aria-labelledby="related-terms"
                className="mt-8 flex flex-col gap-4"
              >
                <h2
                  id="related-terms"
                  className="font-display text-h2 font-semibold text-ink"
                >
                  Related terms
                </h2>
                <ul className="flex flex-col border-t border-line">
                  {related.map((r) => (
                    <li key={r.slug} className="border-b border-line">
                      <Link
                        href={`/glossary/${r.slug}`}
                        className="group flex flex-col gap-1 py-4"
                      >
                        <span className="font-display text-body font-semibold text-ink group-hover:text-indigo group-hover:underline">
                          {r.term}
                        </span>
                        <span className="text-small text-slate-600">
                          {r.shortDefinition}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {term.furtherReading.length > 0 && (
              <section
                aria-labelledby="further-reading"
                className="mt-8 flex flex-col gap-4"
              >
                <h2
                  id="further-reading"
                  className="font-display text-h2 font-semibold text-ink"
                >
                  Further reading
                </h2>
                <ul className="flex flex-col gap-3 text-small text-slate-600">
                  {term.furtherReading.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium break-words text-indigo underline underline-offset-4"
                      >
                        {s.title}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                      . {s.publisher}. Checked{" "}
                      <time dateTime={s.accessed}>
                        {formatLongDate(s.accessed)}
                      </time>
                      .
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {guides.length > 0 && (
              <section
                aria-labelledby="in-guides"
                className="mt-8 flex flex-col gap-4"
              >
                <h2
                  id="in-guides"
                  className="font-display text-h2 font-semibold text-ink"
                >
                  Guides that use this term
                </h2>
                <ul className="flex flex-col gap-1">
                  {guides.map((g) => (
                    <li key={g.slug}>
                      <TextLink href={`/guides/${g.slug}`}>{g.title}</TextLink>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <p className="mt-8 border-t border-line pt-6 text-small text-slate-600">
              Last reviewed{" "}
              <time dateTime={term.lastReviewed}>
                {formatLongDate(term.lastReviewed)}
              </time>
              .{" "}
              <Link
                href="/glossary"
                className="font-medium text-indigo underline underline-offset-4"
              >
                All terms
              </Link>
            </p>
          </Container>
        </Section>
      </article>
    </>
  );
}
