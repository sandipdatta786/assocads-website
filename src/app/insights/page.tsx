import type { Metadata } from "next";
import { Newspaper, Rss } from "lucide-react";
import { InsightsBrowser } from "@/components/insights/InsightsBrowser";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import { builtAt } from "@/lib/clock";
import { getInsights } from "@/lib/content/loaders";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Insights: news and announcements",
  description:
    "News, announcements and reports from ASSOCADS, the Association for AI and Data Science in Kolkata. Also available as an RSS feed.",
  path: "/insights",
});

export default async function Page() {
  const items = getInsights({ now: await builtAt() }).map((i) => ({
    slug: i.slug,
    title: i.title,
    summary: i.summary,
    category: i.category,
    publishedDate: i.publishedDate,
    readingMinutes: i.readingMinutes,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Insights"
        lead={`News, announcements and reports from ${site.shortName}.`}
        breadcrumbs={[{ label: "Insights" }]}
      />

      <Section tone="paper" spacing="none" className="pb-16 lg:pb-28">
        <Container className="flex flex-col gap-10">
          {items.length > 0 ? (
            <InsightsBrowser items={items} />
          ) : (
            <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-l border border-line bg-cloud p-8 sm:p-10 lg:p-14">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 -z-10 w-1/2 [mask-image:linear-gradient(to_right,transparent,black)] opacity-60"
              >
                <DotGrid />
              </div>
              <Icon icon={Newspaper} size={32} className="text-indigo" />
              <div className="flex max-w-2xl flex-col gap-4">
                <h2 className="font-display text-h2 font-semibold text-ink">
                  News and announcements will appear here
                </h2>
                <p className="text-body text-slate-600">
                  Nothing has been published yet. Practical guides on careers,
                  learning and AI policy, each reviewed by a named trustee, are
                  published separately.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <ButtonLink href="/guides" size="large">
                  Read the guides
                </ButtonLink>
                <TextLink href="/events">See events</TextLink>
              </div>
            </div>
          )}

          <p className="flex items-center gap-2 text-small text-slate-600">
            <Rss aria-hidden="true" size={16} strokeWidth={1.5} />
            <span>
              Follow new items in a feed reader:{" "}
              <a
                href="/feed.xml"
                className="font-medium text-indigo underline underline-offset-4"
              >
                RSS feed
              </a>
            </span>
          </p>
        </Container>
      </Section>
    </>
  );
}
