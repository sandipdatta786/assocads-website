/**
 * Typed loaders for content/. Used by pages at build time and by scripts/content-check.ts.
 *
 * Every loader:
 * - stops the build with a clear message when a file is invalid,
 * - hides anything marked draft: true in production,
 * - returns items in a sensible order.
 *
 * Relative imports with .ts extensions keep this file runnable by Node directly.
 */
import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { isPast } from "../events.ts";
import { isPublished, readingMinutes } from "../publishing.ts";
import type { z } from "zod";

import {
  donationStatusLine,
  foreignContributionLine,
  legalStatusLine,
  site,
  taxStatusLine,
} from "../../config/site.ts";
import {
  audienceSchema,
  deedObjectSchema,
  documentSchema,
  eventSchema,
  faqSchema,
  glossarySchema,
  guideSchema,
  insightSchema,
  membershipCategorySchema,
  programmeSchema,
  roadmapSchema,
  communitySchema,
  initiativeSchema,
  successMeasureSchema,
  trusteeSchema,
} from "./schemas.ts";

export const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export type LoadOptions = {
  /** Include drafts even in production. Used by the content check. */
  includeDrafts?: boolean;
};

export type MdxEntry<T> = T & {
  /** The MDX body, without front matter. */
  body: string;
  /** Path relative to the project, for error messages and reports. */
  file: string;
};

export class ContentError extends Error {
  constructor(file: string, problems: string[]) {
    super(
      `Invalid content in ${file}:\n${problems.map((p) => `  - ${p}`).join("\n")}`,
    );
    this.name = "ContentError";
  }
}

const relative = (absolute: string) => path.relative(process.cwd(), absolute);

function showDrafts(options?: LoadOptions): boolean {
  return (
    Boolean(options?.includeDrafts) || process.env.NODE_ENV !== "production"
  );
}

function formatIssues(error: z.ZodError, prefix = ""): string[] {
  return error.issues.map((issue) => {
    const where = [prefix, ...issue.path.map(String)].filter(Boolean).join(".");
    return where ? `${where}: ${issue.message}` : issue.message;
  });
}

function check(file: string, problems: string[]) {
  if (problems.length > 0) throw new ContentError(file, problems);
}

/* ---------- Low-level readers ---------- */

function readJsonArray<S extends z.ZodType>(
  name: string,
  schema: S,
): z.output<S>[] {
  const absolute = path.join(CONTENT_DIR, `${name}.json`);
  const file = relative(absolute);
  if (!fs.existsSync(absolute)) return [];

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(absolute, "utf8"));
  } catch (error) {
    throw new ContentError(file, [
      `not valid JSON: ${(error as Error).message}`,
    ]);
  }
  if (!Array.isArray(raw))
    throw new ContentError(file, ["must contain a list ([ ... ])"]);

  const problems: string[] = [];
  const items: z.output<S>[] = [];
  raw.forEach((entry, index) => {
    const result = schema.safeParse(entry);
    if (result.success) items.push(result.data);
    else problems.push(...formatIssues(result.error, `item ${index + 1}`));
  });
  check(file, problems);
  return items;
}

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function readMdxCollection<S extends z.ZodType>(
  name: string,
  schema: S,
): MdxEntry<z.output<S>>[] {
  const dir = path.join(CONTENT_DIR, name);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map((filename) => {
      const absolute = path.join(dir, filename);
      const file = relative(absolute);
      const source = fs.readFileSync(absolute, "utf8");
      const match = source.match(FRONT_MATTER);
      if (!match) {
        throw new ContentError(file, [
          "must start with front matter between --- lines",
        ]);
      }

      let data: unknown;
      try {
        data = parseYaml(match[1]);
      } catch (error) {
        throw new ContentError(file, [
          `front matter is not valid YAML: ${(error as Error).message}`,
        ]);
      }

      const result = schema.safeParse(data);
      if (!result.success)
        throw new ContentError(file, formatIssues(result.error));

      const parsed = result.data as z.output<S> & { slug?: string };
      const expected = filename.replace(/\.mdx$/, "");
      if (parsed.slug !== undefined && parsed.slug !== expected) {
        throw new ContentError(file, [
          `slug "${parsed.slug}" must match the file name "${expected}"`,
        ]);
      }
      return { ...parsed, body: match[2], file };
    });
}

function uniqueSlugs(file: string, items: { slug: string }[]) {
  const seen = new Set<string>();
  const problems: string[] = [];
  for (const { slug } of items) {
    if (seen.has(slug)) problems.push(`slug "${slug}" is used more than once`);
    seen.add(slug);
  }
  check(file, problems);
}

function withoutDrafts<T extends { draft: boolean }>(
  items: T[],
  options?: LoadOptions,
): T[] {
  return showDrafts(options) ? items : items.filter((item) => !item.draft);
}

/* ---------- Collections ---------- */

/** Everyone in content/trustees.json: the Board and the founder members. */
function getPeople(options?: LoadOptions) {
  const file = "content/trustees.json";
  const items = readJsonArray("trustees", trusteeSchema);
  uniqueSlugs(file, items);

  const problems: string[] = [];
  for (const t of items) {
    if (t.officeTitle && !site.governance.officeBearersElected) {
      problems.push(
        `${t.name}: officeTitle must stay empty until the Board elects office bearers (site.governance.officeBearersElected)`,
      );
    }
    if (t.photo && !t.consentToPublish) {
      problems.push(`${t.name}: a photo needs consentToPublish: true`);
    }
    if (t.photo && !fs.existsSync(path.join(PUBLIC_DIR, t.photo))) {
      problems.push(`${t.name}: photo ${t.photo} does not exist in public/`);
    }
  }
  check(file, problems);

  const visible = options?.includeDrafts
    ? items
    : items.filter((t) => t.published);
  return visible.sort((a, b) => a.order - b.order);
}

/** The Board of Trustees, in the order the Board has set. */
export function getTrustees(options?: LoadOptions) {
  return getPeople(options).filter((t) => t.capacity !== "Founder Member");
}

/** Founder members: they serve on sub-committees but are not on the Board. */
export function getFounderMembers(options?: LoadOptions) {
  return getPeople(options).filter((t) => t.capacity === "Founder Member");
}

export { hasTrusteeProfile } from "./trustees.ts";

export function getMembershipCategories() {
  const file = "content/membership.json";
  const items = readJsonArray("membership", membershipCategorySchema);
  uniqueSlugs(file, items);
  check(
    file,
    items
      .filter((c) => c.fee !== null && !site.governance.feesFixed)
      .map(
        (c) =>
          `${c.name}: fee must stay null until the Board fixes fees (site.governance.feesFixed)`,
      ),
  );
  return items;
}

const FAQ_TOKENS: Record<string, () => string> = {
  legalStatus: legalStatusLine,
  taxStatus: taxStatusLine,
  foreignContributions: foreignContributionLine,
  donationStatus: () =>
    donationStatusLine() ??
    `Yes. Giving is open, and every contribution is acknowledged in writing.`,
};

/**
 * Questions and answers. Answers may contain {{legalStatus}}, {{taxStatus}} or
 * {{foreignContributions}}, which are replaced from src/config/site.ts so that
 * wording about registration and tax is never typed by hand.
 */
export function getFaqs(filter?: { page?: string; category?: string }) {
  const file = "content/faqs.json";
  const items = readJsonArray("faqs", faqSchema);
  const problems: string[] = [];

  const resolved = items.map((faq) => ({
    ...faq,
    answer: faq.answer.replace(/\{\{(\w+)\}\}/g, (token, key: string) => {
      const fill = FAQ_TOKENS[key];
      if (!fill) {
        problems.push(`"${faq.question}": unknown token ${token}`);
        return token;
      }
      return fill();
    }),
  }));
  check(file, problems);

  return resolved.filter(
    (faq) =>
      (!filter?.page || faq.pages.includes(filter.page)) &&
      (!filter?.category || faq.category === filter.category),
  );
}

export function getDocuments() {
  const file = "content/documents.json";
  const items = readJsonArray("documents", documentSchema);
  check(
    file,
    items
      .filter(
        (d) => d.available && !fs.existsSync(path.join(PUBLIC_DIR, d.file)),
      )
      .map(
        (d) =>
          `${d.title}: marked available but ${d.file} does not exist in public/`,
      ),
  );
  // Published documents first, newest first; the rest keep their order in the file.
  return items.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export function getRoadmap() {
  const order = { near: 0, mid: 1, long: 2 } as const;
  return readJsonArray("roadmap", roadmapSchema).sort(
    (a, b) => order[a.horizon] - order[b.horizon],
  );
}

export function getInitiatives() {
  const file = "content/initiatives.json";
  const items = readJsonArray("initiatives", initiativeSchema);
  uniqueSlugs(file, items);
  const programmes = new Set(
    readMdxCollection("programmes", programmeSchema).map((p) => p.slug),
  );
  check(
    file,
    items
      .filter((i) => !programmes.has(i.programme))
      .map((i) => `${i.slug}: programme "${i.programme}" not found`),
  );
  return items;
}

export function getSuccessMeasures() {
  return readJsonArray("success-measures", successMeasureSchema);
}

export function getDeedObjects() {
  const file = "content/objects.json";
  const items = readJsonArray("objects", deedObjectSchema).sort(
    (a, b) => a.number - b.number,
  );
  const numbers = items.map((o) => o.number).join(",");
  const expected = Array.from({ length: 16 }, (_, i) => i + 1).join(",");
  check(
    file,
    numbers === expected
      ? []
      : [
          `must list each of the sixteen objects exactly once (found ${numbers})`,
        ],
  );
  return items;
}

export function getProgrammes() {
  const items = readMdxCollection("programmes", programmeSchema);
  uniqueSlugs("content/programmes", items);

  // Cross-references must point at real audiences and programmes.
  const programmeSlugs = new Set(items.map((p) => p.slug));
  const audienceSlugs = new Set(
    readMdxCollection("audiences", audienceSchema).map((a) => a.slug),
  );
  const problems: string[] = [];
  for (const p of items) {
    for (const a of p.audiences) {
      if (!audienceSlugs.has(a))
        problems.push(`${p.file}: unknown audience "${a}"`);
    }
    for (const r of p.related) {
      if (!programmeSlugs.has(r) || r === p.slug) {
        problems.push(
          `${p.file}: related programme "${r}" is not another programme`,
        );
      }
    }
  }
  check("content/programmes", problems);

  return items.sort((a, b) => a.order - b.order);
}

export function getAudiences() {
  const items = readMdxCollection("audiences", audienceSchema);
  uniqueSlugs("content/audiences", items);

  // Every programme an audience page links to must exist.
  const programmeSlugs = new Set(
    readMdxCollection("programmes", programmeSchema).map((p) => p.slug),
  );
  const problems: string[] = [];
  for (const a of items) {
    const linked = [...a.programmes, ...a.benefits.map((b) => b.programme)];
    for (const slug of linked) {
      if (!programmeSlugs.has(slug)) {
        problems.push(`${a.file}: unknown programme "${slug}"`);
      }
    }
  }
  check("content/audiences", problems);

  return items.sort((a, b) => a.order - b.order);
}

export function getEvents(options?: LoadOptions) {
  const items = readMdxCollection("events", eventSchema);
  uniqueSlugs("content/events", items);
  return withoutDrafts(items, options).sort((a, b) =>
    a.startDate.localeCompare(b.startDate),
  );
}

/** Upcoming events, soonest first, and past events, most recent first.
    An event counts as past once it has ended in Indian Standard Time. */
export function getEventsByTime(now = new Date(), options?: LoadOptions) {
  const all = getEvents(options);
  const ms = now.getTime();
  return {
    upcoming: all.filter((e) => !isPast(e, ms)),
    past: all.filter((e) => isPast(e, ms)).reverse(),
  };
}

export function getCommunities(options?: LoadOptions) {
  const items = readMdxCollection("communities", communitySchema);
  uniqueSlugs("content/communities", items);
  return withoutDrafts(items, options).sort((a, b) => a.order - b.order);
}

/** Options for dated collections. Pages pass the build time as "now" (from
    builtAt) so that the rule below is applied; the content check passes
    includeFuture to validate everything. */
export type PublishedOptions = LoadOptions &
  ({ now: number; includeFuture?: never } | { includeFuture: true });

/** The rule for every dated collection: an item whose publishedDate is after
    today in Kolkata is not shown, so news dated in the future by mistake
    cannot appear early. It appears on its date, when the site next rebuilds. */
function withoutFuture<T extends { publishedDate: string }>(
  items: T[],
  options: PublishedOptions,
): T[] {
  if (options.includeFuture) return items;
  return items.filter((item) => isPublished(item, options.now));
}

export function getInsights(options: PublishedOptions) {
  const items = readMdxCollection("insights", insightSchema);
  uniqueSlugs("content/insights", items);
  return withoutFuture(withoutDrafts(items, options), options)
    .map((i) => ({ ...i, readingMinutes: readingMinutes(i.body) }))
    .sort(
      (a, b) =>
        b.publishedDate.localeCompare(a.publishedDate) ||
        a.title.localeCompare(b.title),
    );
}

export function getGuides(options: PublishedOptions) {
  const items = readMdxCollection("guides", guideSchema);
  uniqueSlugs("content/guides", items);

  // Truthfulness rule 10: a guide is published only after a named trustee has reviewed it.
  const trusteeNames = new Set(
    getTrustees({ includeDrafts: true }).map((t) => t.name),
  );
  const guideSlugs = new Set(items.map((g) => g.slug));
  const termSlugs = new Set(
    readMdxCollection("glossary", glossarySchema).map((t) => t.slug),
  );
  const placeholder = /^\[PLACEHOLDER: [^\]]+\]$/;
  for (const g of items) {
    const problems: string[] = [];
    if (g.reviewedBy && !trusteeNames.has(g.reviewedBy)) {
      if (!(g.draft && placeholder.test(g.reviewedBy))) {
        problems.push(
          `reviewedBy "${g.reviewedBy}" must be a Founder Trustee's name exactly as in content/trustees.json` +
            (g.draft ? " (or a [PLACEHOLDER: ...] while it is a draft)" : ""),
        );
      }
    }
    if (!g.draft && !g.reviewedBy) {
      problems.push(
        "a guide that is not a draft needs reviewedBy, the trustee who reviewed it",
      );
    }
    if (
      ["kolkata", "careers"].includes(g.theme) &&
      !g.dataAsOf &&
      /salary|course|compan|employer|event|hackathon|internship/i.test(g.title)
    ) {
      problems.push(
        "a guide built on lists or figures that go out of date needs dataAsOf",
      );
    }
    const missingGuides = g.relatedGuides.filter((r) => !guideSlugs.has(r));
    if (missingGuides.length > 0) {
      problems.push(`relatedGuides not found: ${missingGuides.join(", ")}`);
    }
    const missingTerms = g.glossaryTerms.filter((t) => !termSlugs.has(t));
    if (missingTerms.length > 0) {
      problems.push(`glossaryTerms not found: ${missingTerms.join(", ")}`);
    }
    if (problems.length > 0) throw new ContentError(g.file, problems);
  }

  return withoutFuture(withoutDrafts(items, options), options).sort((a, b) =>
    b.publishedDate.localeCompare(a.publishedDate),
  );
}

export function getGlossary(options?: LoadOptions) {
  const items = readMdxCollection("glossary", glossarySchema);
  uniqueSlugs("content/glossary", items);
  const slugs = new Set(items.map((t) => t.slug));
  const trusteeNames = new Set(
    getTrustees({ includeDrafts: true }).map((t) => t.name),
  );
  for (const t of items) {
    const problems: string[] = [];
    const missing = t.related.filter((r) => !slugs.has(r));
    if (missing.length > 0) {
      problems.push(`related terms not found: ${missing.join(", ")}`);
    }
    // Truthfulness rule 10: published only after a named trustee's review.
    if (!t.draft && !trusteeNames.has(t.reviewedBy)) {
      problems.push(
        "an entry that is not a draft needs reviewedBy, a Founder Trustee's name exactly as in content/trustees.json",
      );
    }
    if (problems.length > 0) throw new ContentError(t.file, problems);
  }
  return withoutDrafts(items, options).sort((a, b) =>
    a.term.localeCompare(b.term),
  );
}

/** Find one item by slug, or undefined. */
export function bySlug<T extends { slug: string }>(
  items: T[],
  slug: string,
): T | undefined {
  return items.find((item) => item.slug === slug);
}
