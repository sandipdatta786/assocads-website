import { site } from "@/config/site";
import {
  getAudiences,
  getEvents,
  getFaqs,
  getFounderMembers,
  getGlossary,
  getGuides,
  getHub,
  getInsights,
  getProgrammes,
  getTrustees,
  hasTrusteeProfile,
} from "@/lib/content/loaders";
import { faqAnchor } from "@/lib/content/faqs";
import type { SearchEntry } from "@/lib/search-groups";

const clip = (text: string, max = 140) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

/**
 * Every published page and content item, for the site search. Pages come
 * from the navigation and footer settings in src/config/site.ts; everything
 * else from the content loaders, which already leave out drafts and items
 * not yet due to be published. Nothing here is typed by hand.
 */
export function searchIndex(now: number): SearchEntry[] {
  const pages = new Map<string, SearchEntry>();
  const addPage = (label: string, href: string, description = "") => {
    const existing = pages.get(href);
    if (existing) {
      if (!existing.d && description) existing.d = description;
      return;
    }
    pages.set(href, { g: "Pages", t: label, d: description, h: href });
  };
  addPage("Home", "/", site.description);
  for (const item of site.navigation) {
    addPage(item.label, item.href);
    for (const link of item.menu ?? [])
      addPage(link.label, link.href, link.description);
  }
  for (const link of site.moreLinks) addPage(link.label, link.href);
  for (const group of site.footer)
    for (const link of group.links) addPage(link.label, link.href);
  addPage(site.joinLink.label, site.joinLink.href);

  return [
    ...pages.values(),
    ...getProgrammes().map((p) => ({
      g: "Programmes",
      t: p.title,
      d: p.tagline,
      k: p.purpose,
      h: `/programmes/${p.slug}`,
    })),
    ...getAudiences().map((a) => ({
      g: "Who it is for",
      t: a.title,
      d: clip(a.summary),
      h: `/for/${a.slug}`,
    })),
    ...getEvents().map((e) => ({
      g: "Events",
      t: e.title,
      d: clip(e.summary),
      h: `/events/${e.slug}`,
    })),
    ...getInsights({ now }).map((i) => ({
      g: "Insights",
      t: i.title,
      d: clip(i.summary),
      h: `/insights/${i.slug}`,
    })),
    ...getGuides({ now }).map((g) => ({
      g: "Guides",
      t: g.title,
      d: clip(g.summary),
      h: `/guides/${g.slug}`,
    })),
    ...getHub({ now }).map((e) => ({
      g: "Knowledge Hub",
      t: e.title,
      d: clip(e.summary),
      h: `/knowledge-hub/${e.slug}`,
    })),
    ...getGlossary()
      .filter((t) => !t.draft)
      .map((t) => ({
        g: "Glossary",
        t: t.term,
        d: clip(t.shortDefinition),
        k: t.aliases.join(" "),
        h: `/glossary/${t.slug}`,
      })),
    ...getFaqs().map((f) => ({
      g: "Questions",
      t: f.question,
      d: clip(f.answer),
      h: `/faq#${faqAnchor(f.question)}`,
    })),
    ...[...getTrustees(), ...getFounderMembers()]
      .filter(hasTrusteeProfile)
      .map((p) => ({
        g: "People",
        t: p.name,
        d: p.capacity,
        h: `/about/trustees/${p.slug}`,
      })),
  ];
}
