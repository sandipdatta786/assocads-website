/**
 * pnpm indexnow
 *
 * Tells search engines that take part in IndexNow (Bing, Yandex, Naver, Seznam
 * and others, which share submissions) which addresses are new or changed.
 * Run by .github/workflows/indexnow.yml after each successful production
 * deployment. See docs/INDEXNOW.md.
 *
 * Environment:
 *   INDEXNOW_KEY  the key, also served at /indexnow-key.txt. If it is not set,
 *                 the script does nothing and exits cleanly.
 *   SITE_URL      the production origin, for example https://assocads.org
 *   SINCE         YYYY-MM-DD. Addresses whose sitemap <lastmod> is on or after
 *                 this date are submitted. Without it, every address is.
 *   DRY_RUN       "1" to list the addresses without submitting them.
 */

const ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_PATH = "/indexnow-key.txt";
const MAX_URLS = 10_000;

export type SitemapEntry = { loc: string; lastmod?: string };

/** The <url> entries of a sitemap. */
export function parseSitemap(xml: string): SitemapEntry[] {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    loc: block.match(/<loc>([^<]+)<\/loc>/)?.[1].trim() ?? "",
    lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1].trim(),
  }));
}

/** Addresses on this host changed on or after `since` (all of them when it is empty). */
export function changedSince(
  entries: SitemapEntry[],
  host: string,
  since?: string,
): string[] {
  return entries
    .filter((e) => {
      try {
        return new URL(e.loc).host === host;
      } catch {
        return false;
      }
    })
    .filter(
      (e) =>
        !since || (e.lastmod !== undefined && e.lastmod.slice(0, 10) >= since),
    )
    .map((e) => e.loc);
}

const MESSAGES: Record<number, string> = {
  200: "accepted",
  202: "received; the key is still being checked",
  400: "bad request: the submission was not in the right format",
  403: "forbidden: the key was not valid, or the key file could not be found",
  422: "unprocessable: an address is not on this host, or the key does not match",
  429: "too many requests: try again later",
};

async function main() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    console.log("INDEXNOW_KEY is not set, so nothing was submitted.");
    return;
  }
  const origin = (process.env.SITE_URL ?? "").replace(/\/+$/, "");
  if (!/^https:\/\//.test(origin)) {
    throw new Error("SITE_URL must be the https production origin.");
  }
  const host = new URL(origin).host;
  const since = process.env.SINCE?.trim() || undefined;

  // The engines fetch the key file, so check it is live before submitting.
  const served = await fetch(`${origin}${KEY_PATH}`).then((r) =>
    r.ok ? r.text() : "",
  );
  if (served.trim() !== key) {
    throw new Error(
      `${origin}${KEY_PATH} does not serve the key. Add INDEXNOW_KEY in Vercel (Production) and redeploy.`,
    );
  }

  const xml = await fetch(`${origin}/sitemap.xml`).then((r) => r.text());
  const urls = changedSince(parseSitemap(xml), host, since).slice(0, MAX_URLS);
  console.log(
    `${urls.length} address${urls.length === 1 ? "" : "es"} ${since ? `changed since ${since}` : "in the sitemap"}.`,
  );
  if (urls.length === 0) return;
  urls.forEach((u) => console.log(`  ${u}`));
  if (process.env.DRY_RUN === "1") {
    console.log("DRY_RUN is set, so nothing was submitted.");
    return;
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${origin}${KEY_PATH}`,
      urlList: urls,
    }),
  });
  const message = MESSAGES[response.status] ?? response.statusText;
  console.log(`IndexNow answered ${response.status}: ${message}.`);
  if (response.status >= 400) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
