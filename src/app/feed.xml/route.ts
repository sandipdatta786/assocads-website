import { site } from "@/config/site";
import { builtAt } from "@/lib/clock";
import { getGuides, getInsights } from "@/lib/content/loaders";
import { insightCategoryLabels } from "@/lib/publishing";

/**
 * /feed.xml: an RSS 2.0 feed of published insights and guides, newest first.
 * Built with the site and refreshed daily, so an item dated in the future
 * joins the feed on its date. Linked from the head of every page.
 */

const LIMIT = 50;

function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RFC 822 date, at midnight in Kolkata on the given day. */
function rssDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00+05:30`).toUTCString();
}

export async function GET() {
  const now = await builtAt();
  const items = [
    ...getInsights({ now }).map((i) => ({
      title: i.title,
      summary: i.summary,
      path: `/insights/${i.slug}`,
      date: i.publishedDate,
      category: insightCategoryLabels[i.category],
      author: i.author,
    })),
    ...getGuides({ now }).map((g) => ({
      title: g.title,
      summary: g.summary,
      path: `/guides/${g.slug}`,
      date: g.publishedDate,
      category: "Guide",
      author: g.author,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, LIMIT);

  const self = `${site.url}/feed.xml`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escape(`${site.shortName}: insights and guides`)}</title>
    <link>${escape(site.url)}</link>
    <description>${escape(`News, announcements and guides from ${site.shortName}, the ${site.name}.`)}</description>
    <language>en-IN</language>
    <atom:link href="${escape(self)}" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date(now).toUTCString()}</lastBuildDate>
${items
  .map(
    (item) => `    <item>
      <title>${escape(item.title)}</title>
      <link>${escape(site.url + item.path)}</link>
      <guid isPermaLink="true">${escape(site.url + item.path)}</guid>
      <description>${escape(item.summary)}</description>
      <category>${escape(item.category)}</category>
      <dc:creator>${escape(item.author)}</dc:creator>
      <pubDate>${rssDate(item.date)}</pubDate>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
