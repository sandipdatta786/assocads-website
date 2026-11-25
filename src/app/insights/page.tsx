import type { Metadata } from "next";
import { Newspaper, Rss } from "lucide-react";
import { InsightsBrowser } from "@/components/insights/InsightsBrowser";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import { builtAt } from "@/lib/clock";
import { getInsights } from "@/lib/content/loaders";
import { pageMetadata } from "@/lib/seo/metadata";
import { relatedWithContent } from "@/lib/related";

export const metadata: Metadata = pageMetadata({
  title: "Insights: news and announcements",
  description:
    "News, announcements and reports from ASSOCADS, the Association for AI and Data Science in Kolkata. Also available as an RSS feed.",
  path: "/insights",
});

export default async function Page() {
  const now = await builtAt();
  const items = getInsights({ now }).map((i) => ({
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
        lead={`News, announcements and reports from ${site.shortName}, the ${site.name}, are published here, newest first, each with the date it was published. They record what the trust has actually done; its plans are on the programme and roadmap pages.${items.length === 0 ? " Nothing has been published yet." : ""}`}
        breadcrumbs={[{ label: "Insights" }]}
      />

      <Section tone="paper" spacing="none" className="pb-16 lg:pb-28">
        <Container className="flex flex-col gap-10">
          {items.length > 0 ? (
            <InsightsBrowser items={items} />
          ) : (
            <EmptyState
              icon={Newspaper}
              title="News and announcements will appear here"
              actions={
                <>
                  <ButtonLink href="/guides" size="large">
                    Read the guides
                  </ButtonLink>
                  <TextLink href="/events">See events</TextLink>
                </>
              }
              related={relatedWithContent(
                ["guides", "glossary", "programmes"],
                now,
              )}
            >
              <p>
                Nothing has been published yet. Practical guides on careers,
                learning and AI policy, each reviewed by a named trustee, are
                published separately.
              </p>
            </EmptyState>
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
