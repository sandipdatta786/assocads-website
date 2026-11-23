import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { InsightCard } from "@/components/insights/InsightsBrowser";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ShareLinks } from "@/components/ui/ShareLinks";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { Prose } from "@/components/ui/Typography";
import { site } from "@/config/site";
import { builtAt } from "@/lib/clock";
import { bySlug, getInsights } from "@/lib/content/loaders";
import { loadMdxBody } from "@/lib/content/mdx";
import { formatLongDate, insightCategoryLabels } from "@/lib/publishing";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { newsArticle } from "@/lib/seo/schema";

/* Every item, drafts and future-dated ones included, is listed so the route
   always has a path to prerender. The page returns "not found" for anything
   that is not published: a draft on the live site, or a date still to come. */
export function generateStaticParams() {
  return getInsights({ includeDrafts: true, includeFuture: true }).map((i) => ({
    slug: i.slug,
  }));
}

async function published(slug: string) {
  return bySlug(getInsights({ now: await builtAt() }), slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const item = await published((await params).slug);
  if (!item) return {};
  const base = pageMetadata({
    title: item.title,
    description: item.summary,
    path: `/insights/${item.slug}`,
    type: "article",
    noindex: item.draft,
  });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: item.publishedDate,
      ...(item.updatedDate ? { modifiedTime: item.updatedDate } : {}),
      authors: [item.author],
      ...(item.image
        ? { images: [{ url: item.image, alt: item.imageAlt }] }
        : {}),
    },
  };
}

export default async function InsightPage({
  params,
}: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const all = getInsights({ now: await builtAt() });
  const item = bySlug(all, slug);
  if (!item) notFound();

  const Body = item.body.trim()
    ? await loadMdxBody("insights", item.slug)
    : null;
  const pageUrl = `${site.url}/insights/${item.slug}`;
  const updated =
    item.updatedDate && item.updatedDate !== item.publishedDate
      ? item.updatedDate
      : null;

  // Related: the same category first, then the most recent of the rest.
  const others = all.filter((i) => i.slug !== item.slug);
  const related = [
    ...others.filter((i) => i.category === item.category),
    ...others.filter((i) => i.category !== item.category),
  ].slice(0, 3);

  return (
    <>
      {/* Built only from this item's own fields. Drafts never reach the live site. */}
      <JsonLd items={[newsArticle(item)]} />

      <article>
        <Section
          tone="paper"
          spacing="none"
          className="pt-6 pb-12 lg:pt-8 lg:pb-16"
        >
          <Container width="reading" className="flex flex-col gap-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Insights", href: "/insights" },
                { label: item.title },
              ]}
              className="mb-2 lg:mb-6"
            />
            {item.draft && (
              <Callout variant="status" title="Draft">
                <p>
                  This article is a draft. It is visible only on a local copy of
                  the site and never on the live site.
                </p>
              </Callout>
            )}
            <Tag className="w-fit">{insightCategoryLabels[item.category]}</Tag>
            <h1 className="font-display text-display-l font-bold text-ink">
              {item.title}
            </h1>
            <p className="text-lead text-slate-600">{item.summary}</p>
            <dl className="flex flex-wrap gap-x-8 gap-y-3 border-y border-line py-4 text-small">
              <div className="flex gap-2">
                <dt className="text-slate-600">Published</dt>
                <dd className="font-medium text-ink">
                  <time dateTime={item.publishedDate}>
                    {formatLongDate(item.publishedDate)}
                  </time>
                </dd>
              </div>
              {updated && (
                <div className="flex gap-2">
                  <dt className="text-slate-600">Updated</dt>
                  <dd className="font-medium text-ink">
                    <time dateTime={updated}>{formatLongDate(updated)}</time>
                  </dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt className="text-slate-600">By</dt>
                <dd className="font-medium text-ink">{item.author}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="sr-only">Reading time</dt>
                <dd className="text-slate-600">
                  {item.readingMinutes} min read
                </dd>
              </div>
            </dl>
          </Container>
        </Section>

        {item.image && (
          <Container className="pb-12 lg:pb-16">
            <div className="relative mx-auto aspect-[16/9] max-w-[960px] overflow-hidden rounded-l bg-cloud">
              <Image
                src={item.image}
                alt={item.imageAlt ?? ""}
                fill
                priority
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover"
              />
            </div>
          </Container>
        )}

        <Section tone="paper" spacing="none" className="pb-16 lg:pb-24">
          <Container width="reading" className="flex flex-col gap-12">
            {Body ? (
              <Prose>
                <Body />
              </Prose>
            ) : (
              <p className="text-body text-slate-600">{item.summary}</p>
            )}
            <div className="border-t border-line pt-8">
              <ShareLinks
                url={pageUrl}
                title={item.title}
                text={item.summary}
                label="Share this article"
              />
            </div>
          </Container>
        </Section>
      </article>

      <Section tone="cloud" aria-labelledby="related-heading">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="related-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              {related.length > 0 ? "Related" : "More from ASSOCADS"}
            </h2>
            <TextLink href="/insights">All insights</TextLink>
          </div>
          {related.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {related.map((r) => (
                <li key={r.slug}>
                  <InsightCard
                    item={{
                      slug: r.slug,
                      title: r.title,
                      summary: r.summary,
                      category: r.category,
                      publishedDate: r.publishedDate,
                      readingMinutes: r.readingMinutes,
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-body text-slate-600">
                Nothing else has been published yet.
              </p>
              <div className="flex flex-wrap gap-x-6">
                <TextLink href="/events">Events</TextLink>
                <TextLink href="/guides">Guides</TextLink>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
