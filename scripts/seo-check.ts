/**
 * pnpm seo:check
 *
 * Starts the production build (run "pnpm build" first), crawls the site from
 * the home page, and checks every page for:
 *
 * 1. metadata: a unique title under 60 characters in the pattern
 *    "Page | ASSOCADS", a unique description under 155 characters, a canonical
 *    address that matches the page, Open Graph and X card tags, a 1200 by 630
 *    share image that loads, and a robots directive;
 * 2. the sitemap: it lists every indexable page and nothing set to noindex;
 * 3. redirects: old paths redirect permanently, old #anchors are handled;
 * 4. headings and links: exactly one h1, no skipped heading levels, no vague
 *    link text, alt text on every image, no broken internal links or anchors;
 * 5. internal linking: every page is within three clicks of the home page,
 *    and links to at least two other pages from its main content;
 * 6. addresses: lower case, hyphenated, no trailing slash, one per page;
 * 7. structured data: the JSON-LD parses, has the required properties, refers
 *    to the one organisation, claims nothing not yet true, and matches the
 *    visible page (see scripts/structured-data.ts).
 *
 * It writes a table of every route to test-results/seo-report.md and exits
 * with code 1 if anything fails.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { checkStructuredData } from "./structured-data.ts";

const PORT = Number(process.env.SEO_CHECK_PORT ?? 3300);
const ORIGIN = `http://localhost:${PORT}`;
const MAX_TITLE = 60;
const MAX_DESCRIPTION = 155;
const MAX_DEPTH = 3;
const MIN_RELATED = 2;
const SUFFIX = " | ASSOCADS";

/** Old addresses that must redirect permanently. Keep in step with next.config.ts. */
const OLD_PATHS: Record<string, string> = {
  "/index.html": "/",
  "/programs": "/programmes",
  "/leaders": "/about/trustees",
  "/news": "/insights",
};
const OLD_ANCHORS = [
  "about",
  "leaders",
  "programs",
  "plan",
  "goals",
  "membership",
  "events",
  "news",
  "contact",
  "faq",
];
const VAGUE_LINK_TEXT = new Set([
  "click here",
  "here",
  "read more",
  "more",
  "learn more",
  "link",
  "this page",
  "this link",
  "continue",
]);

type Page = {
  path: string;
  depth: number;
  status: number;
  html: string;
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  noindex: boolean;
  ogImage?: string;
  h1: number;
  mainLinks: Set<string>;
  /** Structured data types found, for the report. */
  schemaTypes?: string[];
};

const problems: string[] = [];
const fail = (where: string, message: string) =>
  problems.push(`${where}: ${message}`);

// ---------------------------------------------------------------- HTML helpers

function decode(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) =>
      String.fromCodePoint(parseInt(h, 16)),
    )
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)));
}

/** The page without scripts, styles and comments, which hold no visible content. */
function visible(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function attr(tag: string, name: string): string | undefined {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
  return m ? decode(m[1]) : undefined;
}

function meta(head: string, key: string): string | undefined {
  for (const tag of head.match(/<meta\b[^>]*>/gi) ?? []) {
    if (attr(tag, "name") === key || attr(tag, "property") === key)
      return attr(tag, "content");
  }
  return undefined;
}

function textOf(html: string): string {
  return decode(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** Internal page paths linked from a piece of HTML, without # or query. */
type Anchor = { href: string; tag: string; inner: string; text: string };

function internalLinks(html: string): Anchor[] {
  const out: Anchor[] = [];
  for (const m of html.matchAll(/(<a\b[^>]*>)([\s\S]*?)<\/a>/gi)) {
    const href = attr(m[1], "href");
    if (!href) continue;
    out.push({ href, tag: m[1], inner: m[2], text: textOf(m[2]) });
  }
  return out;
}

function pagePath(href: string, from: string): string | null {
  if (/^(mailto:|tel:|javascript:)/i.test(href)) return null;
  const url = new URL(href, `${ORIGIN}${from}`);
  if (url.origin !== ORIGIN) return null;
  return url.pathname;
}

const isAsset = (p: string) =>
  p.startsWith("/_next/") ||
  /\.[a-z0-9]{2,5}$/i.test(p) ||
  p.endsWith("/opengraph-image");

// ---------------------------------------------------------------- server

async function startServer() {
  const child = spawn(
    path.join(process.cwd(), "node_modules/.bin/next"),
    ["start", "-p", String(PORT)],
    { stdio: "ignore", detached: true, env: process.env },
  );
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch(ORIGIN, { redirect: "manual" });
      if (r.status < 500) return child;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  process.kill(-child.pid!);
  throw new Error(
    `The site did not start on port ${PORT}. Run "pnpm build" first.`,
  );
}

// ---------------------------------------------------------------- crawl

const pages = new Map<string, Page>();
const statusCache = new Map<
  string,
  Promise<{ status: number; location?: string; html?: string; type?: string }>
>();

function get(p: string) {
  if (!statusCache.has(p)) {
    statusCache.set(
      p,
      fetch(`${ORIGIN}${p}`, { redirect: "manual" }).then(async (r) => {
        const type = r.headers.get("content-type") ?? "";
        return {
          status: r.status,
          location: r.headers.get("location") ?? undefined,
          type,
          html: type.includes("text/html")
            ? await r.text()
            : (await r.arrayBuffer(), undefined),
        };
      }),
    );
  }
  return statusCache.get(p)!;
}

function analyse(p: string, depth: number, status: number, html: string): Page {
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const body = visible(html);
  // The main content, without breadcrumbs, which only point upwards.
  const main = (body.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? "").replace(
    /<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/i,
    "",
  );
  const robots = meta(head, "robots");
  const mainLinks = new Set<string>();
  for (const l of internalLinks(main)) {
    const target = pagePath(l.href, p);
    if (target && !isAsset(target) && target !== p && target !== "/")
      mainLinks.add(target);
  }
  return {
    path: p,
    depth,
    status,
    html,
    title: head.match(/<title>([\s\S]*?)<\/title>/i)?.[1]
      ? decode(head.match(/<title>([\s\S]*?)<\/title>/i)![1])
      : undefined,
    description: meta(head, "description"),
    canonical: head.match(/<link\b[^>]*rel="canonical"[^>]*>/i)
      ? attr(head.match(/<link\b[^>]*rel="canonical"[^>]*>/i)![0], "href")
      : undefined,
    robots,
    noindex: /noindex/i.test(robots ?? ""),
    ogImage: meta(head, "og:image"),
    h1: (body.match(/<h1\b/gi) ?? []).length,
    mainLinks,
  };
}

async function crawl(extra: string[]) {
  let frontier = ["/"];
  const seen = new Set(frontier);
  for (let depth = 0; frontier.length > 0; depth++) {
    const next: string[] = [];
    await Promise.all(
      frontier.map(async (p) => {
        const r = await get(p);
        if (r.status !== 200 || !r.html) return;
        const page = analyse(p, depth, r.status, r.html);
        pages.set(p, page);
        for (const l of internalLinks(visible(r.html))) {
          const target = pagePath(l.href, p);
          if (!target || isAsset(target) || seen.has(target)) continue;
          seen.add(target);
          next.push(target);
        }
      }),
    );
    frontier = next;
  }
  // Pages in the sitemap that no link reaches still get checked.
  await Promise.all(
    extra
      .filter((p) => !pages.has(p))
      .map(async (p) => {
        const r = await get(p);
        if (r.status === 200 && r.html)
          pages.set(p, analyse(p, Infinity, r.status, r.html));
      }),
  );
}

// ---------------------------------------------------------------- checks

async function checkPage(page: Page, origin: string) {
  const where = page.path;
  const head = page.html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const body = visible(page.html);

  // Addresses
  if (page.path !== "/" && page.path.endsWith("/"))
    fail(where, "address has a trailing slash");
  if (!/^\/[a-z0-9/-]*$/.test(page.path))
    fail(where, "address must be lower case letters, digits and hyphens only");
  if (page.path !== "/") {
    const slash = await fetch(`${ORIGIN}${page.path}/`, { redirect: "manual" });
    if (![301, 308].includes(slash.status))
      fail(
        where,
        `the address with a trailing slash answers ${slash.status}, not a permanent redirect`,
      );
  }

  // Metadata
  if (!page.title) fail(where, "missing title");
  else {
    if (
      page.path === "/"
        ? !page.title.startsWith("ASSOCADS")
        : !page.title.endsWith(SUFFIX)
    )
      fail(where, `title "${page.title}" does not follow "Page${SUFFIX}"`);
    if (page.title.length >= MAX_TITLE)
      fail(
        where,
        `title is ${page.title.length} characters (under ${MAX_TITLE})`,
      );
  }
  if (!page.description) fail(where, "missing description");
  else if (page.description.length >= MAX_DESCRIPTION)
    fail(
      where,
      `description is ${page.description.length} characters (under ${MAX_DESCRIPTION})`,
    );
  if (!page.robots) fail(where, "missing robots directive");
  if (!page.canonical) fail(where, "missing canonical address");
  else {
    const c = new URL(page.canonical);
    if (c.origin !== origin)
      fail(where, `canonical origin ${c.origin} differs from ${origin}`);
    if (c.pathname !== page.path)
      fail(where, `canonical ${c.pathname} does not match the page`);
  }
  for (const key of [
    "og:title",
    "og:description",
    "og:url",
    "og:image",
    "og:image:alt",
    "twitter:card",
    "twitter:title",
    "twitter:description",
  ]) {
    if (!meta(head, key)) fail(where, `missing ${key}`);
  }
  if (
    meta(head, "twitter:card") &&
    meta(head, "twitter:card") !== "summary_large_image"
  )
    fail(where, "twitter:card should be summary_large_image");
  if (
    meta(head, "og:image:width") !== "1200" ||
    meta(head, "og:image:height") !== "630"
  )
    fail(where, "share image is not 1200 by 630");
  if (page.ogImage) {
    const img = await get(new URL(page.ogImage).pathname);
    if (img.status !== 200 || !img.type?.startsWith("image/"))
      fail(where, `share image does not load (${img.status})`);
  }
  // The share image shows the page's own title.
  const alt = meta(head, "og:image:alt");
  if (page.title && alt && alt !== "Share image" && page.path !== "/") {
    if (`${alt}${SUFFIX}` !== page.title)
      fail(where, `share image title "${alt}" does not match the page title`);
  }

  // Headings
  if (page.h1 !== 1) fail(where, `has ${page.h1} h1 elements, not exactly one`);
  let previous = 0;
  for (const m of body.matchAll(/<h([1-6])\b/gi)) {
    const level = Number(m[1]);
    if (previous && level > previous + 1)
      fail(where, `heading level skips from h${previous} to h${level}`);
    previous = level;
  }

  // Links
  for (const l of internalLinks(body)) {
    const label = (attr(l.tag, "aria-label") ?? "").trim();
    if (!label && VAGUE_LINK_TEXT.has(l.text.toLowerCase()))
      fail(where, `link text "${l.text}" says nothing about where it goes`);
    const innerName =
      /\saria-label="[^"]+"/.test(l.inner) ||
      /<img\b[^>]*\salt="[^"]+"/.test(l.inner);
    if (!label && !l.text && !innerName)
      fail(where, `link to ${l.href} has no text`);
    const target = pagePath(l.href, page.path);
    if (!target || target.endsWith("/opengraph-image")) continue;
    const r = await get(target);
    if (r.status !== 200)
      fail(
        where,
        `link to ${target} answers ${r.status}${r.location ? ` (to ${r.location})` : ""}`,
      );
    const hash = new URL(l.href, `${ORIGIN}${page.path}`).hash.slice(1);
    if (hash && r.html && !new RegExp(`\\sid="${hash}"`).test(r.html))
      fail(where, `link to ${target}#${hash}: no element with that id`);
  }

  // Images and drawings
  for (const tag of body.match(/<img\b[^>]*>/gi) ?? []) {
    const alt = attr(tag, "alt");
    if (alt === undefined)
      fail(where, `image ${attr(tag, "src")} has no alt attribute`);
    else if (
      /\.(png|jpe?g|webp|avif|svg|gif)$/i.test(alt) ||
      /^(image|photo|picture|logo)$/i.test(alt.trim())
    )
      fail(where, `image alt text "${alt}" does not describe the image`);
  }
  for (const tag of body.match(/<svg\b[^>]*>/gi) ?? []) {
    const hidden = attr(tag, "aria-hidden") === "true";
    const named = attr(tag, "aria-label") || attr(tag, "aria-labelledby");
    if (!hidden && !named)
      fail(
        where,
        "a drawing (svg) is neither hidden from screen readers nor labelled",
      );
  }

  // Structured data
  const nav =
    body.match(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/i)?.[0] ?? "";
  page.schemaTypes = checkStructuredData(
    {
      path: page.path,
      html: page.html,
      text: textOf(body),
      h1: textOf(body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? ""),
      crumbs: [...nav.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => ({
        label: textOf(m[1]),
        href: m[1].match(/<a\b[^>]*\shref="([^"]*)"/i)?.[1],
      })),
      hrefs: [...body.matchAll(/\shref="([^"]*)"/gi)].map((m) => decode(m[1])),
    },
    origin,
    fail,
  );

  // Internal linking
  if (!page.noindex) {
    if (page.depth > MAX_DEPTH)
      fail(
        where,
        page.depth === Infinity
          ? "no link leads to this page"
          : `is ${page.depth} clicks from the home page (at most ${MAX_DEPTH})`,
      );
    if (page.path !== "/" && page.mainLinks.size < MIN_RELATED)
      fail(
        where,
        `links to ${page.mainLinks.size} other page(s) from its main content (at least ${MIN_RELATED})`,
      );
  }
}

// ---------------------------------------------------------------- run

const server = await startServer();
try {
  const sitemapXml = await fetch(`${ORIGIN}/sitemap.xml`).then((r) => r.text());
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1],
  );
  const origin = sitemapUrls[0] ? new URL(sitemapUrls[0]).origin : ORIGIN;
  const sitemapPaths = sitemapUrls.map((u) => new URL(u).pathname);
  if (sitemapUrls.some((u) => new URL(u).origin !== origin))
    fail("sitemap.xml", "addresses use more than one origin");
  for (const loc of sitemapXml.split("<url>").slice(1)) {
    if (!/<lastmod>/.test(loc))
      fail(
        "sitemap.xml",
        `no last-modified date for ${loc.match(/<loc>([^<]+)/)?.[1]}`,
      );
  }

  await crawl(sitemapPaths);

  const robots = await fetch(`${ORIGIN}/robots.txt`).then((r) => r.text());
  if (!/Sitemap: \S+\/sitemap\.xml/.test(robots))
    fail("robots.txt", "does not point to the sitemap");
  if (!/Disallow: \/styleguide/.test(robots))
    fail("robots.txt", "does not block /styleguide");
  if (/Disallow: \/\s*$/m.test(robots))
    fail("robots.txt", "blocks the whole site");

  for (const page of pages.values()) await checkPage(page, origin);

  // Sitemap against the pages found
  const inSitemap = new Set(sitemapPaths);
  for (const page of pages.values()) {
    if (page.noindex && inSitemap.has(page.path))
      fail("sitemap.xml", `lists ${page.path}, which is noindex`);
    if (!page.noindex && !inSitemap.has(page.path))
      fail("sitemap.xml", `does not list ${page.path}`);
  }
  for (const p of sitemapPaths)
    if (!pages.has(p))
      fail("sitemap.xml", `lists ${p}, which does not answer 200`);

  // Unique titles and descriptions
  for (const key of ["title", "description"] as const) {
    const byValue = new Map<string, string[]>();
    for (const page of pages.values()) {
      if (page.noindex || !page[key]) continue;
      byValue.set(page[key]!, [...(byValue.get(page[key]!) ?? []), page.path]);
    }
    for (const [value, paths] of byValue)
      if (paths.length > 1)
        fail(paths.join(", "), `share the same ${key} "${value}"`);
  }

  // The organisation's logo loads
  const logo = await get("/brand/kit/png/assocads-logo-stacked-colour.png");
  if (logo.status !== 200 || !logo.type?.startsWith("image/"))
    fail(
      "structured data",
      `the organisation's logo does not load (${logo.status})`,
    );

  // Redirects
  for (const [from, to] of Object.entries(OLD_PATHS)) {
    const r = await fetch(`${ORIGIN}${from}`, { redirect: "manual" });
    const location = r.headers.get("location");
    if (
      ![301, 308].includes(r.status) ||
      !location ||
      new URL(location, ORIGIN).pathname !== to
    )
      fail(
        from,
        `should redirect permanently to ${to} (answers ${r.status} ${location ?? ""})`,
      );
  }
  const home = pages.get("/")?.html ?? "";
  for (const anchor of OLD_ANCHORS) {
    if (!new RegExp(`"${anchor}":"/`).test(home))
      fail("/", `old anchor #${anchor} is not redirected`);
  }

  // Report
  const rows = [...pages.values()].sort((a, b) => a.path.localeCompare(b.path));
  const report = [
    "| Route | Title | Chars | Description chars | Clicks from home | Related links | Indexed | Structured data |",
    "| --- | --- | --: | --: | --: | --: | --- | --- |",
    ...rows.map(
      (p) =>
        `| ${p.path} | ${(p.title ?? "").replace(/\|/g, "\\|")} | ${p.title?.length ?? 0} | ${p.description?.length ?? 0} | ${p.depth === Infinity ? "none" : p.depth} | ${p.mainLinks.size} | ${p.noindex ? "no" : "yes"} | ${(p.schemaTypes ?? []).join(", ")} |`,
    ),
  ].join("\n");
  fs.mkdirSync("test-results", { recursive: true });
  fs.writeFileSync("test-results/seo-report.md", `${report}\n`);

  console.log(
    `Checked ${pages.size} pages and ${sitemapPaths.length} sitemap addresses.`,
  );
  console.log("Route report: test-results/seo-report.md");
  if (problems.length > 0) {
    console.log(`\n${problems.length} problem(s):`);
    for (const p of [...new Set(problems)]) console.log(`  ✗ ${p}`);
    process.exitCode = 1;
  } else {
    console.log("No problems found.");
  }
} finally {
  process.kill(-server.pid!);
}
