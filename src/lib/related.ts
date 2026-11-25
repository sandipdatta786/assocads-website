import { site } from "@/config/site";
import {
  getGlossary,
  getGuides,
  getInsights,
  getProgrammes,
} from "@/lib/content/loaders";

export type RelatedLink = { href: string; title: string; text: string };

type Key = "guides" | "glossary" | "insights" | "programmes";

/**
 * Links to sections that already have published content, for pages that do
 * not have any yet. A section with nothing published is left out, so an
 * empty page never points to another empty page. Counts are real counts.
 */
export function relatedWithContent(keys: Key[], now: number): RelatedLink[] {
  const plural = (n: number, one: string, many: string) =>
    `${n} ${n === 1 ? one : many}`;
  const build: Record<Key, () => RelatedLink | null> = {
    guides: () => {
      const n = getGuides({ now }).length;
      return n
        ? {
            href: "/guides",
            title: "Guides",
            text: `${plural(n, "practical guide", "practical guides")} on careers, Kolkata and AI policy, each reviewed by a trustee.`,
          }
        : null;
    },
    glossary: () => {
      const n = getGlossary().length;
      return n
        ? {
            href: "/glossary",
            title: "Glossary",
            text: `${plural(n, "plain definition", "plain definitions")} of AI and data terms.`,
          }
        : null;
    },
    insights: () => {
      const n = getInsights({ now }).length;
      return n
        ? {
            href: "/insights",
            title: "Insights",
            text: `${plural(n, "announcement", "announcements")} and news from ${site.shortName}.`,
          }
        : null;
    },
    programmes: () => {
      const n = getProgrammes().length;
      return n
        ? {
            href: "/programmes",
            title: "Programmes",
            text: `The ${n} areas of work ${site.shortName} plans to run, and who each is for.`,
          }
        : null;
    },
  };
  return keys.map((k) => build[k]()).filter((l): l is RelatedLink => !!l);
}
