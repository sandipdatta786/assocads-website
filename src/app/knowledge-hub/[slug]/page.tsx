import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubCard } from "@/components/hub/HubCard";
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
import { bySlug, getHub } from "@/lib/content/loaders";
import { loadMdxBody } from "@/lib/content/mdx";
import { hubKindLabels } from "@/lib/hub";
import { formatLongDate } from "@/lib/publishing";
import { pageMetadata } from "@/lib/seo/metadata";

/* Every entry, drafts and future-dated ones included, is listed so the route
   always has a path to prerender. Anything not published returns "not found". */
export function generateStaticParams() {
  return getHub({ includeDrafts: true, includeFuture: true }).map((e) => ({
    slug: e.slug,
  }));
}

async function published(slug: string) {
  return bySlug(getHub({ now: await builtAt() }), slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/knowledge-hub/[slug]">): Promise<Metadata> {
  const entry = await published((await params).slug);
  if (!entry) return {};
  return pageMetadata({
    title: entry.title,
    description: entry.summary,
    path: `/knowledge-hub/${entry.slug}`,
    type: "article",
    noindex: entry.draft,
  });
}

export default async function HubEntryPage({
  params,
}: PageProps<"/knowledge-hub/[slug]">) {
  const { slug } = await params;
  const all = getHub({ now: await builtAt() });
  const entry = bySlug(all, slug);
  if (!entry) notFound();

  const Body = entry.body.trim() ? await loadMdxBody("hub", entry.slug) : null;
  const updated =
    entry.updatedDate && entry.updatedDate !== entry.publishedDate
      ? entry.updatedDate
      : null;
  const related = all
    .filter((e) => e.slug !== entry.slug)
    .filter((e) => e.kind === entry.kind)
    .slice(0, 3);

  return (
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
              { label: "Knowledge Hub", href: "/knowledge-hub" },
              { label: entry.title },
            ]}
            className="mb-2 lg:mb-6"
          />
          {entry.draft && (
            <Callout variant="status" title="Draft">
              <p>
                This entry is a draft. It is visible only on a local copy of the
                site and never on the live site.
              </p>
            </Callout>
          )}
          <Tag className="w-fit">{hubKindLabels[entry.kind]}</Tag>
          <h1 className="font-display text-display-l font-bold text-ink">
            {entry.title}
          </h1>
          <p className="text-lead text-slate-600">{entry.summary}</p>
          <dl className="flex flex-wrap gap-x-8 gap-y-3 border-y border-line py-4 text-small">
            <div className="flex gap-2">
              <dt className="text-slate-600">Published</dt>
              <dd className="font-medium text-ink">
                <time dateTime={entry.publishedDate}>
                  {formatLongDate(entry.publishedDate)}
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
            {entry.asOf && (
              <div className="flex gap-2">
                <dt className="text-slate-600">Information as of</dt>
                <dd className="font-medium text-ink">
                  <time dateTime={entry.asOf}>
                    {formatLongDate(entry.asOf)}
                  </time>
                </dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="text-slate-600">By</dt>
              <dd className="font-medium text-ink">{entry.author}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-600">Reviewed by</dt>
              <dd className="font-medium text-ink">{entry.reviewedBy}</dd>
            </div>
          </dl>
        </Container>
      </Section>

      <Section tone="paper" spacing="none" className="pb-16 lg:pb-24">
        <Container width="reading" className="flex flex-col gap-12">
          {Body ? (
            <Prose>
              <Body />
            </Prose>
          ) : (
            <p className="text-body text-slate-600">{entry.summary}</p>
          )}

          <section
            aria-labelledby="sources-heading"
            className="flex flex-col gap-4"
          >
            <h2
              id="sources-heading"
              className="font-display text-h3 font-semibold text-ink"
            >
              Sources
            </h2>
            <ul className="flex flex-col gap-3 text-body text-slate-600">
              {entry.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-tone-link underline-offset-4 hover:underline"
                  >
                    {s.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>{" "}
                  · {s.publisher}
                </li>
              ))}
            </ul>
            {entry.externalUrl && (
              <p className="text-body text-slate-600">
                Official page:{" "}
                <a
                  href={entry.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-tone-link underline-offset-4 hover:underline"
                >
                  {entry.externalUrl
                    .replace(/^https:\/\//, "")
                    .replace(/\/$/, "")}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
            )}
          </section>

          <div className="border-t border-line pt-8">
            <ShareLinks
              url={`${site.url}/knowledge-hub/${entry.slug}`}
              title={entry.title}
              text={entry.summary}
              label="Share this entry"
            />
          </div>
        </Container>
      </Section>

      <Section tone="cloud" aria-labelledby="related-heading">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="related-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              {related.length > 0
                ? "More of this kind"
                : "More in the Knowledge Hub"}
            </h2>
            <TextLink href="/knowledge-hub">All of the Knowledge Hub</TextLink>
          </div>
          {related.length > 0 && (
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {related.map((r) => (
                <li key={r.slug}>
                  <HubCard entry={r} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </article>
  );
}
