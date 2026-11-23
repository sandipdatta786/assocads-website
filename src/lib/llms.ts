/**
 * /llms.txt: a plain-text summary of ASSOCADS and a map of its most important
 * pages, for AI assistants and answer engines (format: https://llmstxt.org).
 * Built from the site configuration and content, so it says what the site
 * says. Drafts and anything not yet published are left out.
 */
import { registrationLine, site } from "@/config/site";
import {
  getAudiences,
  getGlossary,
  getGuides,
  getProgrammes,
} from "@/lib/content/loaders";
import { keyFacts, withoutPlaceholders } from "@/lib/facts";
import { numberWord } from "@/lib/words";

type Link = { title: string; path: string; note: string };

const line = (l: Link) => `- [${l.title}](${site.url}${l.path}): ${l.note}`;

function section(title: string, links: Link[]): string {
  return links.length === 0
    ? ""
    : `## ${title}\n\n${links.map(line).join("\n")}`;
}

export function llmsTxt(now: number): string {
  const about =
    site.navigation.find((item) => item.href === "/about")?.menu ?? [];
  const facts = keyFacts()
    .map((f) => ({ ...f, text: withoutPlaceholders(f.text) }))
    .filter((f) => f.text);

  const parts = [
    `# ${site.shortName}: ${site.name}`,
    `> ${site.description} ${site.mission} ${registrationLine()}`,
    `This file lists the pages that describe ${site.shortName} best. Everything on the site is in English. Plans are described as plans: unless a page says otherwise, programmes, events and membership have not started yet. A longer plain-text version of the main pages is at ${site.url}/llms-full.txt.`,
    `## Key facts\n\n${facts.map((f) => `- ${f.label}: ${f.text}`).join("\n")}`,
    section(
      "About and governance",
      about.map((m) => ({
        title: m.label,
        path: m.href,
        note: `${m.description}.`,
      })),
    ),
    section("Programmes", [
      {
        title: "Programmes",
        path: "/programmes",
        note: `The ${numberWord(getProgrammes().length)} planned areas of work.`,
      },
      ...getProgrammes().map((p) => ({
        title: p.title,
        path: `/programmes/${p.slug}`,
        note: `${p.tagline}.`,
      })),
    ]),
    section("Membership", [
      {
        title: "Membership",
        path: "/membership",
        note: "The four membership categories in the trust deed, who can join and how.",
      },
      {
        title: "Register your interest",
        path: "/membership/apply",
        note: "A form to hear when membership opens.",
      },
    ]),
    section(
      "For each audience",
      getAudiences().map((a) => ({
        title: a.title,
        path: `/for/${a.slug}`,
        note: a.summary,
      })),
    ),
    section(
      "Guides",
      getGuides({ now }).map((g) => ({
        title: g.title,
        path: `/guides/${g.slug}`,
        note: g.summary,
      })),
    ),
    section("Glossary", [
      {
        title: "Glossary",
        path: "/glossary",
        note: "Plain-English definitions of AI and Data Science terms.",
      },
      ...getGlossary()
        .filter((t) => !t.draft)
        .map((t) => ({
          title: t.term,
          path: `/glossary/${t.slug}`,
          note: t.shortDefinition,
        })),
    ]),
    section("Contact", [
      {
        title: "Contact",
        path: "/contact",
        note: "How to reach ASSOCADS, by topic.",
      },
      {
        title: "Frequently asked questions",
        path: "/faq",
        note: "Short answers about the trust, membership, programmes, partnerships and support.",
      },
      {
        title: "Partner with us",
        path: "/partner",
        note: "How institutions, companies and government bodies can work with ASSOCADS.",
      },
    ]),
  ];

  return `${parts.filter(Boolean).join("\n\n")}\n`;
}
