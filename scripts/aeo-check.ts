/**
 * Checks for the answer-engine and generative-search layer (blueprint 4.4 and
 * 4.5), run by "pnpm seo:check" against the production build:
 *
 * 1. answer first: the first paragraph under each page's h1 is 40 to 60 words;
 * 2. freshness: the page's own "Last updated" or "Last reviewed" date
 *    (marked data-page-date) matches its sitemap <lastmod> and its
 *    structured data dateModified;
 * 3. entity: the one-sentence description from src/config/site.ts appears,
 *    word for word, in the footer of every page, the opening of the home,
 *    About and facts pages, the home page's meta description and llms.txt;
 * 4. /llms.txt links only to live, indexable pages;
 * 5. /llms-full.txt matches a fresh extraction of the pages it covers;
 * 6. robots.txt names each AI and search crawler from blueprint 4.5.
 */
import fs from "node:fs";
import { site } from "../src/config/site.ts";
import { buildLlmsFull, LLMS_FULL_FILE } from "./llms-full.ts";

type Fail = (where: string, message: string) => void;

export type AeoPage = {
  path: string;
  html: string;
  noindex: boolean;
};

export const LEAD_MIN = 40;
export const LEAD_MAX = 60;

/**
 * Pages whose opening is shorter by design:
 * - glossary terms open with the trustee-reviewed definition, which the
 *   content schema keeps under 40 words so it can be quoted whole;
 * - error pages are not indexed.
 */
function leadRange(path: string): [number, number] {
  if (/^\/glossary\/[^/]+$/.test(path)) return [8, LEAD_MAX];
  return [LEAD_MIN, LEAD_MAX];
}

/** Named in robots.txt so it is clear they are welcome (blueprint 4.5 and Prompt 20). */
export const REQUIRED_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
];

export const words = (text: string) =>
  text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

/** The first paragraph after the h1, as text. */
export function leadText(
  html: string,
  textOf: (h: string) => string,
): string | undefined {
  const after = html.split(/<\/h1>/i)[1];
  const p = after?.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1];
  return p === undefined ? undefined : textOf(p);
}

function jsonLdNodes(html: string): Record<string, unknown>[] {
  return [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].flatMap((m) => {
    try {
      const data = JSON.parse(m[1]) as { "@graph"?: Record<string, unknown>[] };
      return data["@graph"] ?? [];
    } catch {
      return [];
    }
  });
}

export function checkAnswerFirst(
  page: AeoPage,
  textOf: (h: string) => string,
  fail: Fail,
): number | undefined {
  if (page.noindex) return undefined;
  const lead = leadText(page.html, textOf);
  if (!lead) {
    fail(page.path, "no paragraph under the h1 to answer the page's question");
    return undefined;
  }
  const n = words(lead);
  const [min, max] = leadRange(page.path);
  if (n < min || n > max)
    fail(
      page.path,
      `the first paragraph under the h1 is ${n} words (${min} to ${max}): "${lead.slice(0, 80)}…"`,
    );
  return n;
}

export function checkFreshness(
  page: AeoPage,
  origin: string,
  lastmod: string | undefined,
  fail: Fail,
) {
  const shown = page.html.match(
    /<time\b(?=[^>]*\sdata-page-date)[^>]*\sdateTime="(\d{4}-\d{2}-\d{2})"/,
  )?.[1];
  if (!shown) return;
  if (lastmod?.slice(0, 10) !== shown)
    fail(
      page.path,
      `shows the date ${shown}, but the sitemap says ${lastmod ?? "nothing"}`,
    );
  const pageUrl = `${origin}${page.path === "/" ? "" : page.path}`;
  const modified = jsonLdNodes(page.html)
    .filter((n) => n.url === pageUrl || n["@id"] === pageUrl)
    .map((n) => n.dateModified)
    .find(Boolean);
  if (modified !== shown)
    fail(
      page.path,
      `shows the date ${shown}, but its structured data dateModified is ${String(modified ?? "missing")}`,
    );
}

export function checkEntity(
  pages: Map<string, AeoPage>,
  textOf: (h: string) => string,
  homeDescription: string | undefined,
  fail: Fail,
) {
  const sentence = site.description;
  for (const page of pages.values()) {
    const footer = page.html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] ?? "";
    if (!textOf(footer).includes(sentence))
      fail(page.path, "the footer does not give the canonical description");
  }
  for (const p of ["/", "/about", "/about/facts"]) {
    const page = pages.get(p);
    if (page && !leadText(page.html, textOf)?.includes(sentence))
      fail(p, "the opening paragraph does not give the canonical description");
  }
  if (homeDescription !== sentence)
    fail("/", "the meta description is not the canonical description");
}

export async function checkLlms(
  get: (p: string) => Promise<{ status: number; text: string; type: string }>,
  pages: Map<string, AeoPage>,
  fail: Fail,
) {
  const txt = await get("/llms.txt");
  if (txt.status !== 200 || !txt.type.startsWith("text/plain")) {
    fail("/llms.txt", `answers ${txt.status} ${txt.type}`);
  } else {
    if (!txt.text.startsWith(`# ${site.shortName}`))
      fail(
        "/llms.txt",
        "does not start with the organisation's name as a title",
      );
    if (!txt.text.includes(site.description))
      fail("/llms.txt", "does not give the canonical description");
    if (!/^## Key facts$/m.test(txt.text))
      fail("/llms.txt", "has no Key facts section");
    if (txt.text.includes("[PLACEHOLDER"))
      fail("/llms.txt", "contains a placeholder");
    for (const [, href] of txt.text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) {
      const p = new URL(href).pathname;
      if (p === "/llms-full.txt") continue;
      const page = pages.get(p);
      if (!page) fail("/llms.txt", `links to ${p}, which does not answer 200`);
      else if (page.noindex)
        fail("/llms.txt", `links to ${p}, which is a draft or not indexed`);
    }
  }

  const full = await get("/llms-full.txt");
  if (full.status !== 200 || !full.type.startsWith("text/plain")) {
    fail("/llms-full.txt", `answers ${full.status} ${full.type}`);
    return;
  }
  const stored = fs.readFileSync(LLMS_FULL_FILE, "utf8");
  if (full.text !== stored.replaceAll("{{SITE_URL}}", site.url))
    fail("/llms-full.txt", `does not serve ${LLMS_FULL_FILE}`);
  const fresh = await buildLlmsFull(async (p) => (await get(p)).text);
  if (fresh !== stored)
    fail(
      "/llms-full.txt",
      `${LLMS_FULL_FILE} is out of date: run "pnpm build" then "pnpm llms:full"`,
    );
}

export function checkCrawlers(robots: string, fail: Fail) {
  const named = new Set(
    [...robots.matchAll(/^User-Agent:\s*(\S+)/gim)].map((m) =>
      m[1].toLowerCase(),
    ),
  );
  for (const bot of REQUIRED_CRAWLERS)
    if (!named.has(bot.toLowerCase()))
      fail("robots.txt", `does not name ${bot}`);
}
