/**
 * Helpers for dated articles (insights and guides), shared by the loaders,
 * pages and the RSS feed. Relative-import safe, so Node can run it directly.
 */

/** Today's date in Kolkata, as YYYY-MM-DD. */
export function todayInKolkata(now: number): string {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(now));
}

/** False for an item dated after today in Kolkata. */
export function isPublished(item: { publishedDate: string }, now: number) {
  return item.publishedDate <= todayInKolkata(now);
}

/** "5 March 2027". */
export function formatLongDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

/** Reading time in whole minutes at 200 words a minute, never less than one.
    MDX comments, imports and markup are not counted. */
export function readingMinutes(body: string): number {
  const text = body
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/^\s*(import|export)\s.*$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`[\]()-]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const insightCategoryLabels = {
  announcement: "Announcement",
  news: "News",
  report: "Report",
} as const;
