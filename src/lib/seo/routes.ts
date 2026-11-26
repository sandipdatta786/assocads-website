import { execFileSync } from "node:child_process";
import { site } from "@/config/site";
import {
  getAudiences,
  getCommunities,
  getEvents,
  getGlossary,
  getGuides,
  getHub,
  getInsights,
  getProgrammes,
  getFounderMembers,
  getTrustees,
  hasTrusteeProfile,
} from "@/lib/content/loaders";
import { legalDates } from "@/lib/legal";

/**
 * Every public, indexable address on the site, with the date it last
 * changed. The sitemap is built from this list, and "pnpm seo:check"
 * confirms that it matches the pages the site actually links to.
 * Drafts, the style guide and anything set to noindex are left out.
 */

export type SiteRoute = { path: string; lastModified?: string };

/** Pages that are not generated from content files. */
const STATIC_PAGES = [
  "/",
  "/about",
  "/about/approach",
  "/about/facts",
  "/about/governance",
  "/about/objects",
  "/about/roadmap",
  "/about/trustees",
  "/programmes",
  "/membership",
  "/membership/apply",
  "/communities",
  "/events",
  "/insights",
  "/innovation",
  "/mentorship",
  "/achievements",
  "/digest",
  "/collaborate",
  "/knowledge-hub",
  "/voices",
  "/resources",
  "/guides",
  "/glossary",
  "/partner",
  "/support",
  "/contact",
  "/faq",
  "/membership/code-of-conduct",
  "/legal/privacy",
  "/legal/terms",
  "/legal/disclaimer",
  "/accessibility",
];

/** Dates for pages whose content has its own "last changed" setting. */
const KNOWN_DATES: Record<string, string> = {
  "/about/facts": site.updated.facts,
  "/about/governance": site.updated.governance,
  "/membership": site.updated.membership,
  "/membership/code-of-conduct": legalDates.codeOfConduct,
  "/legal/privacy": legalDates.privacy,
  "/legal/terms": legalDates.terms,
  "/legal/disclaimer": legalDates.disclaimer,
  "/accessibility": legalDates.accessibility,
};

/** The date of the last commit that changed a file, when Git history is
    available at build time. Otherwise no date is given, rather than a
    wrong one. */
function lastCommitDate(file: string): string | undefined {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

function pageFile(path: string): string {
  return path === "/" ? "src/app/page.tsx" : `src/app${path}/page.tsx`;
}

export function siteRoutes(now: number): SiteRoute[] {
  const pages: SiteRoute[] = STATIC_PAGES.map((path) => ({
    path,
    lastModified: KNOWN_DATES[path] ?? lastCommitDate(pageFile(path)),
  }));

  const content: SiteRoute[] = [
    ...getProgrammes().map((p) => ({
      path: `/programmes/${p.slug}`,
      lastModified: lastCommitDate(p.file),
    })),
    ...getAudiences().map((a) => ({
      path: `/for/${a.slug}`,
      lastModified: lastCommitDate(a.file),
    })),
    ...[...getTrustees(), ...getFounderMembers()]
      .filter(hasTrusteeProfile)
      .map((t) => ({
        path: `/about/trustees/${t.slug}`,
        lastModified: lastCommitDate("content/trustees.json"),
      })),
    ...getCommunities()
      .filter((c) => c.status === "active")
      .map((c) => ({
        path: `/communities/${c.slug}`,
        lastModified: lastCommitDate(c.file),
      })),
    ...getEvents().map((e) => ({
      path: `/events/${e.slug}`,
      lastModified: lastCommitDate(e.file),
    })),
    ...getInsights({ now }).map((i) => ({
      path: `/insights/${i.slug}`,
      lastModified: i.updatedDate ?? i.publishedDate,
    })),
    ...getHub({ now }).map((e) => ({
      path: `/knowledge-hub/${e.slug}`,
      lastModified: e.updatedDate ?? e.publishedDate,
    })),
    ...getGuides({ now }).map((g) => ({
      path: `/guides/${g.slug}`,
      lastModified: g.lastReviewed,
    })),
    ...getGlossary()
      .filter((t) => !t.draft)
      .map((t) => ({
        path: `/glossary/${t.slug}`,
        lastModified: t.lastReviewed,
      })),
  ];

  return [...pages, ...content];
}
