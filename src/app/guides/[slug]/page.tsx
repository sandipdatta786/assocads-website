import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Scale } from "lucide-react";
import { GuideCard } from "@/components/guides/GuideCard";
import { CallToAction } from "@/components/sections/CallToAction";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ShareLinks } from "@/components/ui/ShareLinks";
import { Tag } from "@/components/ui/Tag";
import { Prose } from "@/components/ui/Typography";
import { site } from "@/config/site";
import { builtAt } from "@/lib/clock";
import {
  bySlug,
  getGlossary,
  getGuides,
  getTrustees,
} from "@/lib/content/loaders";
import { loadMdxBody } from "@/lib/content/mdx";
import { clip, guideCtas, themeLabels } from "@/lib/guides";
import { outline } from "@/lib/headings";
import { formatLongDate } from "@/lib/publishing";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { faqPage, guideArticle } from "@/lib/seo/schema";

/* Every guide, drafts and future-dated ones included, is listed so the route
   always has a path to prerender. The page returns "not found" for anything
   not published: a draft on the live site, or a date still to come. */
export function generateStaticParams() {
  return getGuides({ includeDrafts: true, includeFuture: true }).map((g) => ({
    slug: g.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const guide = bySlug(
    getGuides({ now: await builtAt() }),
    (await params).slug,
  );
  if (!guide) return {};
  const base = pageMetadata({
    title: guide.seoTitle ?? guide.title,
    description: clip(guide.summary),
    path: `/guides/${guide.slug}`,
    type: "article",
    noindex: guide.draft,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: guide.publishedDate,
      modifiedTime: guide.lastReviewed,
      authors: [guide.author],
    },
  };
}

const sectionHeading =
  "scroll-mt-24 font-display text-h2 font-semibold text-ink";

export default async function GuidePage({
  params,
}: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const all = getGuides({ now: await builtAt() });
  const guide = bySlug(all, slug);
  if (!guide) notFound();

  const Body = guide.body.trim()
    ? await loadMdxBody("guides", guide.slug)
    : null;
  const pageUrl = `${site.url}/guides/${guide.slug}`;
  const glossary = getGlossary();
  const terms = guide.glossaryTerms
    .map((t) => bySlug(glossary, t))
    .filter((t) => t !== undefined);
  const related = guide.relatedGuides
    .map((r) => bySlug(all, r))
    .filter((g) => g !== undefined);
  const cta = guideCtas[guide.cta];

  const contents = [
    ...outline(guide.body),
    { id: "key-facts", text: "Key facts" },
    ...(guide.faqs.length > 0 ? [{ id: "questions", text: "Questions" }] : []),
    { id: "sources", text: "Sources" },
  ];

  // Built only from this guide's own fields: the page with its trustee
  // review, the article, and the questions exactly as shown below.
  const reviewer = getTrustees().find((t) => t.name === guide.reviewedBy);
  const jsonLd = [
    ...guideArticle(guide, reviewer),
    guide.faqs.length > 0 ? faqPage(`/guides/${guide.slug}`, guide.faqs) : null,
  ];

  const facts: [string, ReactNode][] = [
    ["Written by", guide.author],
    ["Reviewed by", guide.reviewedBy || "Not yet reviewed"],
    ["Published", formatLongDate(guide.publishedDate)],
    [
      "Last reviewed",
      <time key="reviewed" dateTime={guide.lastReviewed} data-page-date="">
        {formatLongDate(guide.lastReviewed)}
      </time>,
    ],
    ...(guide.dataAsOf
      ? ([["Data as of", formatLongDate(guide.dataAsOf)]] as [
          string,
          ReactNode,
        ][])
      : []),
  ];

  return (
    <>
      <JsonLd items={jsonLd} />

      <article>
        <Section
          tone="paper"
          spacing="none"
          className="pt-6 pb-16 lg:pt-8 lg:pb-24"
        >
          <Container className="grid gap-10 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-12">
            {/* Title, short answer and credits */}
            <header className="flex flex-col gap-6 lg:col-span-8 lg:col-start-5">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Resources", href: "/resources" },
                  { label: "Guides", href: "/guides" },
                  { label: guide.title },
                ]}
                className="mb-2 lg:mb-6"
              />
              {guide.draft && (
                <Callout
                  variant="status"
                  title="Draft, awaiting a trustee's review"
                >
                  <p>
                    This guide is a draft. It is visible only on a local copy of
                    the site and never on the live site. It may contain
                    unchecked statements marked for verification.
                  </p>
                </Callout>
              )}
              <Tag className="w-fit">{themeLabels[guide.theme]}</Tag>
              <h1 className="font-display text-display-l font-bold text-ink">
                {guide.title}
              </h1>
              <section
                aria-labelledby="short-answer"
                className="flex flex-col gap-2 rounded-l border-l-4 border-indigo bg-indigo-tint p-6 sm:p-8"
              >
                <h2
                  id="short-answer"
                  className="font-mono text-eyebrow font-medium text-indigo-deep uppercase"
                >
                  Short answer
                </h2>
                <p className="text-lead text-ink">{guide.directAnswer}</p>
              </section>
              <dl className="grid grid-cols-1 gap-x-8 gap-y-3 border-y border-line py-5 text-small sm:grid-cols-2">
                {facts.map(([term, detail]) => (
                  <div key={term} className="flex flex-col gap-0.5">
                    <dt className="text-slate-600">{term}</dt>
                    <dd className="font-medium text-ink">{detail}</dd>
                  </div>
                ))}
              </dl>
              {guide.legalNotice && (
                <div className="flex gap-3 rounded-s bg-cloud p-4 text-small text-ink sm:p-5">
                  <Scale
                    aria-hidden="true"
                    size={20}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-slate-600"
                  />
                  <p>
                    <span className="font-semibold">
                      General information, not legal advice.
                    </span>{" "}
                    This guide explains the law and official policy in general
                    terms, linking to the official sources. For decisions about
                    your own situation, read the official text and take advice
                    from a qualified professional.
                  </p>
                </div>
              )}
            </header>

            {/* On this page */}
            <nav
              aria-labelledby="contents-heading"
              className="lg:col-span-3 lg:col-start-1 lg:row-span-2 lg:row-start-1"
            >
              <div className="rounded-l bg-cloud p-5 lg:sticky lg:top-24 lg:mt-24 lg:bg-transparent lg:p-0">
                <h2
                  id="contents-heading"
                  className="mb-3 font-mono text-eyebrow font-medium text-slate-600 uppercase"
                >
                  On this page
                </h2>
                <ol className="flex flex-col gap-1 border-l border-line">
                  {contents.map((c) => (
                    <li key={c.id}>
                      <a
                        href={`#${c.id}`}
                        className="-ml-px flex min-h-11 items-center border-l-2 border-transparent py-1 pl-4 text-small text-slate-600 hover:border-indigo hover:text-ink lg:min-h-0 lg:py-1.5"
                      >
                        {c.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            {/* Body and reference sections */}
            <div className="flex min-w-0 flex-col gap-14 lg:col-span-8 lg:col-start-5">
              {Body && (
                <Prose>
                  <Body />
                </Prose>
              )}

              <section
                aria-labelledby="key-facts"
                className="flex flex-col gap-5"
              >
                <h2 id="key-facts" className={sectionHeading}>
                  Key facts
                </h2>
                <ul className="flex flex-col gap-3 rounded-l border border-line p-6 sm:p-8">
                  {guide.keyFacts.map((fact) => (
                    <li key={fact} className="flex gap-3 text-body text-ink">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-1.5 shrink-0 rounded-pill bg-indigo"
                      />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {guide.faqs.length > 0 && (
                <section
                  aria-labelledby="questions"
                  className="flex flex-col gap-5"
                >
                  <h2 id="questions" className={sectionHeading}>
                    Questions
                  </h2>
                  <dl className="flex flex-col divide-y divide-line border-y border-line">
                    {guide.faqs.map((f) => (
                      <div
                        key={f.question}
                        className="flex flex-col gap-2 py-5"
                      >
                        <dt className="font-display text-body font-semibold text-ink">
                          {f.question}
                        </dt>
                        <dd className="text-body text-slate-600">{f.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <section
                aria-labelledby="sources"
                className="flex flex-col gap-5"
              >
                <h2 id="sources" className={sectionHeading}>
                  Sources
                </h2>
                <ol className="flex max-w-[40em] list-decimal flex-col gap-3 pl-6 text-small text-slate-600 marker:text-slate-500">
                  {guide.sources.map((s) => (
                    <li key={s.url} className="pl-1">
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
                </ol>
              </section>

              <div className="border-t border-line pt-8">
                <ShareLinks
                  url={pageUrl}
                  title={guide.title}
                  text={guide.summary}
                  label="Share this guide"
                />
              </div>
            </div>
          </Container>
        </Section>
      </article>

      <CallToAction
        title={cta.title}
        text={cta.text}
        primary={cta.primary}
        secondary={cta.secondary}
      />

      {(related.length > 0 || terms.length > 0) && (
        <Section tone="cloud" aria-labelledby="related-heading">
          <Container className="flex flex-col gap-10">
            <h2
              id="related-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              Read next
            </h2>
            {related.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {related.map((r) => (
                  <li key={r.slug}>
                    <GuideCard guide={r} showTheme />
                  </li>
                ))}
              </ul>
            )}
            {terms.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-h3 font-semibold text-ink">
                  Terms in this guide
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {terms.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/glossary/${t.slug}`}
                        className="inline-flex min-h-11 items-center rounded-pill border border-line bg-paper px-4 text-small font-medium text-ink transition-colors duration-150 hover:border-indigo hover:text-indigo"
                      >
                        {t.term}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Container>
        </Section>
      )}
    </>
  );
}
