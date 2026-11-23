/**
 * pnpm llms:full
 *
 * Writes src/generated/llms-full.txt: the plain text of the About pages, the
 * facts page, the programme pages, the membership page and the FAQ, taken
 * from the built site (run "pnpm build" first). The site's address is written
 * as {{SITE_URL}}; /llms-full.txt fills it in.
 *
 * "pnpm seo:check" runs the same extraction and fails if the file is out of
 * date, so run this after changing any of those pages.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const LLMS_FULL_FILE = "src/generated/llms-full.txt";

/** The pages included, in reading order. Programme pages are added from content. */
export function llmsFullPaths(): string[] {
  const programmes = fs
    .readdirSync(path.join(process.cwd(), "content/programmes"))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const text = fs.readFileSync(
        path.join(process.cwd(), "content/programmes", f),
        "utf8",
      );
      return {
        slug: f.replace(/\.mdx$/, ""),
        order: Number(text.match(/^order:\s*(\d+)/m)?.[1] ?? 99),
      };
    })
    .sort((a, b) => a.order - b.order)
    .map((p) => `/programmes/${p.slug}`);
  return [
    "/about",
    "/about/facts",
    "/about/approach",
    "/about/objects",
    "/about/governance",
    "/about/trustees",
    "/about/roadmap",
    "/programmes",
    ...programmes,
    "/membership",
    "/faq",
  ];
}

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

/** The readable text of a page's main content, as light Markdown. */
export function pageText(html: string): string {
  let main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? "";
  main = main
    .replace(
      /<(script|style|svg|noscript|template|nav|form|button)\b[\s\S]*?<\/\1>/gi,
      "",
    )
    .replace(/<span class="sr-only">[\s\S]*?<\/span>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<h([1-4])\b[^>]*>/gi,
      (_, n: string) => `\n\n${"#".repeat(Number(n))} `,
    )
    .replace(/<\/h[1-4]>/gi, "\n\n")
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<dt\b[^>]*>/gi, "\n\n")
    .replace(/<\/dt>/gi, ": ")
    .replace(/<summary\b[^>]*>/gi, "\n\n**")
    .replace(/<\/summary>/gi, "**\n\n")
    .replace(/<t[hd]\b[^>]*>/gi, " | ")
    .replace(/<\/tr>/gi, " |\n")
    .replace(/<tr\b[^>]*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(
      /<\/(p|div|section|details|dd|ul|ol|table|header|article)>/gi,
      "\n\n",
    )
    .replace(/<[^>]+>/g, "");
  return decode(main)
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .filter((l) => !l.includes("[PLACEHOLDER"))
    .filter((l) => l !== "-" && l !== "|")
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** The whole file, with {{SITE_URL}} in place of the site's address. */
export async function buildLlmsFull(
  fetchHtml: (p: string) => Promise<string>,
): Promise<string> {
  const pages = await Promise.all(
    llmsFullPaths().map(async (p) => {
      const text = pageText(await fetchHtml(p));
      return `Source: {{SITE_URL}}${p}\n\n${text}`;
    }),
  );
  return `${[
    "# ASSOCADS: the main pages in plain text",
    "This file holds the text of the About pages, the facts page, the programme pages, the membership page and the frequently asked questions, as published at {{SITE_URL}}. Each page starts with its address.",
    ...pages,
  ].join("\n\n---\n\n")}\n`;
}

// ---------------------------------------------------------------- command line

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = 3302;
  const server = spawn(
    "node_modules/.bin/next",
    ["start", "-p", String(port)],
    {
      detached: true,
      stdio: "ignore",
    },
  );
  try {
    const origin = `http://localhost:${port}`;
    for (let i = 0; i < 60; i++) {
      try {
        if ((await fetch(origin)).ok) break;
      } catch {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    const text = await buildLlmsFull((p) =>
      fetch(`${origin}${p}`).then((r) => r.text()),
    );
    fs.mkdirSync(path.dirname(LLMS_FULL_FILE), { recursive: true });
    fs.writeFileSync(LLMS_FULL_FILE, text);
    console.log(
      `Wrote ${LLMS_FULL_FILE}: ${llmsFullPaths().length} pages, ${text.split(/\s+/).length} words.`,
    );
  } finally {
    process.kill(-server.pid!);
  }
}
