import fs from "node:fs";
import path from "node:path";
import { site } from "@/config/site";

/**
 * /llms-full.txt: the plain text of the About pages, the facts page, the
 * programme pages, the membership page and the FAQ.
 *
 * "pnpm llms:full" extracts the text from the built pages into
 * src/generated/llms-full.txt, with the site's address written as
 * {{SITE_URL}}. This route fills in the real address. "pnpm seo:check"
 * fails if the file no longer matches the pages, so it cannot go stale.
 */
export function GET() {
  const file = path.join(process.cwd(), "src/generated/llms-full.txt");
  const text = fs
    .readFileSync(file, "utf8")
    .replaceAll("{{SITE_URL}}", site.url);
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
