/**
 * pnpm content:check
 *
 * Validates every content collection and lists every remaining
 * [PLACEHOLDER: ...] with its file and line.
 *
 * - Invalid content always fails (exit code 1).
 * - Placeholders are a warning for now. Run with --strict to make them fail,
 *   which the pre-launch audit will do.
 */
import fs from "node:fs";
import path from "node:path";

import {
  CONTENT_DIR,
  getAudiences,
  getDocuments,
  getEvents,
  getFaqs,
  getGlossary,
  getGuides,
  getInsights,
  getMembershipCategories,
  getProgrammes,
  getTrustees,
} from "../src/lib/content/loaders.ts";
import { PLACEHOLDER_PATTERN } from "../src/lib/content/schemas.ts";

const strict = process.argv.includes("--strict");
const all = { includeDrafts: true };

const collections: [string, () => unknown[]][] = [
  ["trustees", () => getTrustees(all)],
  ["programmes", () => getProgrammes()],
  ["audiences", () => getAudiences()],
  ["membership categories", () => getMembershipCategories()],
  ["events", () => getEvents(all)],
  ["insights", () => getInsights(all)],
  ["guides", () => getGuides(all)],
  ["glossary", () => getGlossary(all)],
  ["faqs", () => getFaqs()],
  ["documents", () => getDocuments()],
];

let failed = false;

console.log("\nContent collections\n");
for (const [name, load] of collections) {
  try {
    const count = load().length;
    console.log(`  ${name.padEnd(24)} ${String(count).padStart(3)}`);
  } catch (error) {
    failed = true;
    console.error(
      `  ${name.padEnd(24)} INVALID\n\n${(error as Error).message}\n`,
    );
  }
}

/* Placeholders: in content files and in the site configuration. */
function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(mdx|json|ts)$/.test(entry.name) ? [full] : [];
  });
}

const files = [
  ...walk(CONTENT_DIR),
  path.join(process.cwd(), "src/config/site.ts"),
];
const found: { file: string; line: number; text: string }[] = [];
for (const file of files) {
  fs.readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      for (const match of line.matchAll(PLACEHOLDER_PATTERN)) {
        found.push({
          file: path.relative(process.cwd(), file),
          line: index + 1,
          text: match[0],
        });
      }
    });
}

console.log(`\nPlaceholders remaining: ${found.length}\n`);
const byFile = Map.groupBy(found, (p) => p.file);
for (const [file, items] of byFile) {
  console.log(`  ${file} (${items.length})`);
  const distinct = Map.groupBy(items, (p) => p.text);
  for (const [text, uses] of distinct) {
    const lines = uses.map((u) => u.line).join(", ");
    console.log(
      `    ${text}${uses.length > 1 ? ` ×${uses.length}` : ""}  (line ${lines})`,
    );
  }
}

if (failed) {
  console.error("\nContent check failed: fix the invalid files above.\n");
  process.exit(1);
}
if (strict && found.length > 0) {
  console.error("\nContent check failed: placeholders remain (strict mode).\n");
  process.exit(1);
}
console.log(
  found.length > 0
    ? "\nContent is valid. Placeholders remain (warning only for now).\n"
    : "\nContent is valid. No placeholders remain.\n",
);
