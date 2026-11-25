/**
 * pnpm content:check
 *
 * Validates every content collection and lists every remaining
 * [PLACEHOLDER: ...] with its file and line.
 *
 * - Invalid content always fails (exit code 1).
 * - Placeholders fall into two groups:
 *   - "Must fill": everything except the trustee and founder member
 *     profiles: contact details, the registered office, privacy details and
 *     the legal-review notes. A launch build fails while any remain.
 *   - "Can wait": trustee and founder member profiles in
 *     content/trustees.json, which the site shows as "Profile to be added".
 * - A launch build is a production build on Vercel whose address is not a
 *   vercel.app one (that is, once the custom domain is connected), or any
 *   run with LAUNCH_CHECK=1. Otherwise placeholders are a warning.
 * - --strict makes every placeholder fail, in either group.
 *
 * "pnpm build" runs this first, so the gate also applies on Vercel.
 */
import fs from "node:fs";
import path from "node:path";

import {
  CONTENT_DIR,
  getAudiences,
  getDeedObjects,
  getDocuments,
  getEvents,
  getFaqs,
  getGlossary,
  getGuides,
  getInsights,
  getOpportunities,
  getHub,
  getMembershipCategories,
  getProgrammes,
  getRoadmap,
  getInitiatives,
  getCommunities,
  getSuccessMeasures,
  getImpactFigures,
  getMilestones,
  getTrustees,
  getFounderMembers,
} from "../src/lib/content/loaders.ts";
import { PLACEHOLDER_PATTERN } from "../src/lib/content/schemas.ts";
import { site } from "../src/config/site.ts";

const strict = process.argv.includes("--strict");
const launch =
  process.env.LAUNCH_CHECK === "1" ||
  (process.env.VERCEL_ENV === "production" &&
    !new URL(site.url).hostname.endsWith(".vercel.app"));
/** Placeholders that may stay at launch: profiles still to be supplied. */
const CAN_WAIT = ["content/trustees.json"];
const all = { includeDrafts: true };

const collections: [string, () => unknown[]][] = [
  ["trustees", () => getTrustees(all)],
  ["founder members", () => getFounderMembers(all)],
  ["programmes", () => getProgrammes()],
  ["audiences", () => getAudiences()],
  ["membership categories", () => getMembershipCategories()],
  ["events", () => getEvents(all)],
  ["insights", () => getInsights({ ...all, includeFuture: true })],
  ["guides", () => getGuides({ ...all, includeFuture: true })],
  ["opportunities", () => getOpportunities({ ...all, includeFuture: true })],
  ["knowledge hub", () => getHub({ ...all, includeFuture: true })],
  ["glossary", () => getGlossary(all)],
  ["faqs", () => getFaqs()],
  ["roadmap stages", () => getRoadmap()],
  ["initiatives", () => getInitiatives()],
  ["communities", () => getCommunities()],
  ["success measures", () => getSuccessMeasures()],
  ["impact figures", () => getImpactFigures()],
  ["milestones", () => getMilestones()],
  ["documents", () => getDocuments()],
  ["deed objects", () => getDeedObjects()],
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
    return /\.(mdx|json|tsx?)$/.test(entry.name) ? [full] : [];
  });
}

const files = [
  ...walk(CONTENT_DIR),
  path.join(process.cwd(), "src/config/site.ts"),
  // Pages and components that render <Placeholder needed="..." />.
  ...walk(path.join(process.cwd(), "src/app")).filter(
    (f) => !f.includes("styleguide"),
  ),
];
const PLACEHOLDER_PROP = /<Placeholder\s+needed="([^"]+)"/g;
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
      for (const match of line.matchAll(PLACEHOLDER_PROP)) {
        found.push({
          file: path.relative(process.cwd(), file),
          line: index + 1,
          text: `[PLACEHOLDER: ${match[1]}]`,
        });
      }
    });
}

const mustFill = found.filter((p) => !CAN_WAIT.includes(p.file));
console.log(
  `\nPlaceholders remaining: ${found.length} (${mustFill.length} must be filled before launch)\n`,
);
const byFile = Map.groupBy(found, (p) => p.file);
for (const [file, items] of byFile) {
  const group = CAN_WAIT.includes(file) ? "can wait" : "must fill";
  console.log(`  ${file} (${items.length}, ${group})`);
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
if (launch && mustFill.length > 0) {
  console.error(
    `\nContent check failed: this is a launch build (${site.url}) and ${mustFill.length} "must fill" placeholders remain. Fill them in, or see docs/LAUNCH_CHECKLIST.md.\n`,
  );
  process.exit(1);
}
if (strict && found.length > 0) {
  console.error("\nContent check failed: placeholders remain (strict mode).\n");
  process.exit(1);
}
console.log(
  found.length > 0
    ? `\nContent is valid. Placeholders remain (a warning until the launch build${launch ? "; none of them must be filled" : ""}).\n`
    : "\nContent is valid. No placeholders remain.\n",
);
