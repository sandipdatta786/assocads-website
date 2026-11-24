import type { MetadataRoute } from "next";
import { absoluteUrl, isPreviewDeployment } from "@/lib/seo/metadata";

/**
 * Search engines and AI assistants named explicitly, so that it is clear
 * they are welcome. Names checked against each operator's own documentation
 * in November 2026:
 *
 * - OpenAI: GPTBot (training), OAI-SearchBot (ChatGPT search), ChatGPT-User
 *   (fetches a page a user asked about)
 * - Anthropic: ClaudeBot (training), Claude-SearchBot (search), Claude-User
 *   (fetches a page a user asked about)
 * - Perplexity: PerplexityBot (search), Perplexity-User (user requests)
 * - Google-Extended and Applebot-Extended: not crawlers but control tokens
 *   for use in Gemini and Apple's models
 * - Bingbot (Bing search, which also feeds Copilot) and CCBot (Common Crawl)
 */
export const AI_AND_SEARCH_CRAWLERS = [
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

/** Only the internal style guide, the admin editor and its sign-in are kept out. */
const DISALLOW = ["/styleguide", "/admin", "/api/"];

/**
 * /robots.txt. A crawler that finds a group naming it ignores the "*" group,
 * so each group repeats the same rule. Preview deployments block everything,
 * so that only the real domain is indexed.
 */
export default function robots(): MetadataRoute.Robots {
  if (isPreviewDeployment()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: [
      { userAgent: AI_AND_SEARCH_CRAWLERS, allow: "/", disallow: DISALLOW },
      { userAgent: "*", allow: "/", disallow: DISALLOW },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
