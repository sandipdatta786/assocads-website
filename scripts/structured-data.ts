/**
 * Structured data checks, run by scripts/seo-check.ts on every page it crawls.
 *
 * For each page it extracts the JSON-LD, checks that it parses, that each item
 * has the properties its type needs, that every item refers to the one
 * organisation, that nothing describes what is not yet true, and that the
 * values match what the page shows.
 */
import fs from "node:fs";
import path from "node:path";
import { isRegistered, site, socialLinks } from "../src/config/site.ts";

type Node = Record<string, unknown> & { "@type"?: string | string[] };
type Fail = (where: string, message: string) => void;

/** Properties each type must have, with a value. */
const REQUIRED: Record<string, string[]> = {
  NGO: ["name", "alternateName", "url", "logo", "address", "description"],
  WebSite: ["name", "url", "publisher"],
  BreadcrumbList: ["itemListElement"],
  WebPage: ["name", "url"],
  AboutPage: ["name", "url", "about"],
  ContactPage: ["name", "url", "mainEntity"],
  FAQPage: ["mainEntity"],
  Person: ["name", "memberOf"],
  Service: ["name", "description", "provider"],
  Event: [
    "name",
    "startDate",
    "eventStatus",
    "eventAttendanceMode",
    "location",
    "organizer",
  ],
  Article: ["headline", "author", "datePublished", "dateModified", "publisher"],
  NewsArticle: [
    "headline",
    "author",
    "datePublished",
    "dateModified",
    "publisher",
  ],
  DefinedTerm: ["name", "description", "inDefinedTermSet"],
  DefinedTermSet: ["name", "hasDefinedTerm"],
};

/** Claims the site must never make: ratings, awards, counts and prices. */
const FORBIDDEN = [
  "aggregateRating",
  "review",
  "award",
  "awards",
  "numberOfEmployees",
  "memberCount",
  "price",
  "priceSpecification",
];

const typesOf = (n: Node) => [n["@type"] ?? []].flat() as string[];
const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const has = (v: unknown) =>
  v !== undefined &&
  v !== null &&
  v !== "" &&
  !(Array.isArray(v) && v.length === 0);

/** "2027-03-20" or "2027-03-20T10:00:00+05:30" as the page writes it: "20 March 2027". */
function longDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`));
}

/** Every value in a tree, with the property it sits under. */
function* walk(
  value: unknown,
  key = "",
): Generator<[string, unknown, Node | null]> {
  if (Array.isArray(value)) {
    for (const v of value) yield* walk(v, key);
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      yield [k, v, value as Node];
      yield* walk(v, k);
    }
  }
}

/** Trustees who may be described: published, with consent. */
function describableTrustees(): Set<string> {
  const file = path.join(process.cwd(), "content/trustees.json");
  const trustees = JSON.parse(fs.readFileSync(file, "utf8")) as {
    name: string;
    published?: boolean;
    consentToPublish?: boolean;
  }[];
  return new Set(
    trustees
      .filter((t) => t.published !== false && t.consentToPublish === true)
      .map((t) => t.name),
  );
}

/** A programme's status, from its front matter. */
function programmeStatus(slug: string): string | undefined {
  const file = path.join(process.cwd(), "content/programmes", `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  return fs.readFileSync(file, "utf8").match(/^status:\s*(\w+)/m)?.[1];
}

export type PageInput = {
  path: string;
  /** The full HTML. */
  html: string;
  /** The page's visible text, scripts and styles removed. */
  text: string;
  /** The h1's text. */
  h1: string;
  /** The visible breadcrumb trail: label and href (none for the last). */
  crumbs: { label: string; href?: string }[];
  /** Links on the page, as written in href attributes. */
  hrefs: string[];
};

const trustees = describableTrustees();

/** Checks one page's JSON-LD. Returns the types found, for the report. */
export function checkStructuredData(
  page: PageInput,
  origin: string,
  fail: Fail,
): string[] {
  const where = `${page.path} (structured data)`;
  const ORG = `${origin}/#organization`;
  const SITE = `${origin}/#website`;
  const text = norm(page.text);
  const shows = (value: string) => text.includes(norm(value));

  // Extract and parse
  const nodes: Node[] = [];
  for (const m of page.html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      const doc = JSON.parse(m[1]) as Node & { "@graph"?: Node[] };
      if (doc["@context"] !== "https://schema.org")
        fail(where, "a block has no schema.org @context");
      nodes.push(...(doc["@graph"] ?? [doc]));
    } catch (e) {
      fail(where, `a block does not parse: ${(e as Error).message}`);
    }
  }
  const ofType = (t: string) => nodes.filter((n) => typesOf(n).includes(t));

  // The organisation and website, on every page
  const orgs = ofType("NGO");
  if (orgs.length !== 1 || orgs[0]["@id"] !== ORG)
    fail(where, `needs exactly one NGO with @id ${ORG}`);
  const sites = ofType("WebSite");
  if (sites.length !== 1 || sites[0]["@id"] !== SITE)
    fail(where, `needs exactly one WebSite with @id ${SITE}`);

  const org = orgs[0];
  if (org) {
    if (org.name !== site.name)
      fail(where, `organisation name is "${org.name}"`);
    if (org.alternateName !== site.shortName)
      fail(where, `alternateName should be "${site.shortName}"`);
    const founded = String(org.foundingDate ?? "");
    if (!isRegistered() && founded !== String(site.foundingYear))
      fail(where, `foundingDate should be the year only, ${site.foundingYear}`);
    if (!isRegistered() && ("nonprofitStatus" in org || "identifier" in org))
      fail(where, "describes a registration that has not happened");
    const address = org.address as Node | undefined;
    if (address?.addressLocality !== site.location.city)
      fail(where, "address is not in the configured city");
    const sameAs = [org.sameAs ?? []].flat();
    const social = socialLinks().map((l) => l.url);
    if (
      sameAs.length !== social.length ||
      sameAs.some((u) => !social.includes(String(u)))
    )
      fail(where, "sameAs must list exactly the social links filled in");
    const knows = [org.knowsAbout ?? []].flat().map(String);
    for (const subject of [
      "Artificial intelligence",
      "Data science",
      "Machine learning",
      "Analytics",
      "Responsible AI",
    ])
      if (!knows.includes(subject)) fail(where, `knowsAbout lacks ${subject}`);
  }

  // Required properties, references and forbidden claims
  for (const n of nodes) {
    for (const t of typesOf(n)) {
      for (const prop of REQUIRED[t] ?? [])
        if (!has(n[prop])) fail(where, `${t} is missing ${prop}`);
    }
    const isOrg = typesOf(n).includes("NGO");
    const isTrail = typesOf(n).includes("BreadcrumbList");
    if (!isOrg && !isTrail && !JSON.stringify(n).includes(`"@id":"${ORG}"`))
      fail(where, `${typesOf(n).join("/")} does not refer to the organisation`);
  }
  for (const [key, value, parent] of walk(nodes)) {
    if (FORBIDDEN.includes(key))
      fail(where, `"${key}" describes something not yet true`);
    if (key === "offers" && !(parent && typesOf(parent).includes("Event")))
      fail(where, "an offer appears outside an event");
    if (typeof value === "string" && value.includes("[PLACEHOLDER"))
      fail(where, `${key} holds a placeholder`);
    if (
      typeof value === "string" &&
      key === "@id" &&
      value.includes("#organization") &&
      value !== ORG
    )
      fail(where, `refers to another organisation id ${value}`);
    const id = parent?.["@id"];
    if (
      (key === "@type" && value === "NGO" && id !== ORG) ||
      (key === "name" && value === site.name && id !== ORG && id !== SITE)
    )
      fail(
        where,
        "describes the organisation again instead of referring to it",
      );
    // Identifiers and breadcrumb links point to this site's own addresses.
    if (
      (key === "@id" || key === "item") &&
      typeof value === "string" &&
      new URL(value, origin).origin !== origin
    )
      fail(where, `${key} ${value} is not on ${origin}`);
  }

  // Breadcrumbs match the visible trail
  const trails = ofType("BreadcrumbList");
  if (page.crumbs.length > 0) {
    if (trails.length !== 1) fail(where, "needs one BreadcrumbList");
    const items = (trails[0]?.itemListElement ?? []) as Node[];
    const names = items.map((i) => String(i.name));
    const labels = page.crumbs.map((c) => c.label);
    if (names.join(" › ") !== labels.join(" › "))
      fail(
        where,
        `breadcrumbs "${names.join(" › ")}" differ from the page's "${labels.join(" › ")}"`,
      );
    items.forEach((item, i) => {
      if (item.position !== i + 1)
        fail(where, `breadcrumb ${i + 1} has position ${item.position}`);
      const href = page.crumbs[i]?.href;
      if (href && i < items.length - 1) {
        const expected = href === "/" ? `${origin}/` : `${origin}${href}`;
        if (item.item !== expected)
          fail(where, `breadcrumb "${item.name}" points to ${item.item}`);
      }
    });
  } else if (trails.length > 0) {
    fail(where, "has a BreadcrumbList but shows no breadcrumbs");
  }

  // Questions: only those shown, word for word
  const faqPages = ofType("FAQPage");
  if (faqPages.length > 1) fail(where, "has more than one FAQPage");
  for (const q of (faqPages[0]?.mainEntity ?? []) as Node[]) {
    const answer = String((q.acceptedAnswer as Node)?.text ?? "");
    if (!shows(String(q.name)))
      fail(where, `question "${q.name}" is not shown on the page`);
    if (!shows(answer))
      fail(where, `the answer to "${q.name}" differs from the page`);
  }

  // Pages, articles and events: names and dates as shown
  const h1 = norm(page.h1);
  for (const t of ["AboutPage", "ContactPage", "WebPage"]) {
    for (const n of ofType(t))
      if (norm(String(n.name)) !== h1)
        fail(where, `${t} name "${n.name}" differs from the h1 "${h1}"`);
  }
  for (const n of [...ofType("Article"), ...ofType("NewsArticle")]) {
    if (norm(String(n.headline)) !== h1)
      fail(where, `headline "${n.headline}" differs from the h1`);
    for (const key of ["datePublished", "dateModified"]) {
      if (n[key] && !shows(longDate(String(n[key]))))
        fail(where, `${key} ${n[key]} is not shown on the page`);
    }
    const author = n.author as Node | undefined;
    if (author?.name && !shows(String(author.name)))
      fail(where, `author "${author.name}" is not shown`);
  }
  for (const n of ofType("WebPage")) {
    const reviewer = n.reviewedBy as Node | undefined;
    if (reviewer?.name && !shows(String(reviewer.name)))
      fail(where, `reviewer "${reviewer.name}" is not shown`);
  }
  for (const n of ofType("Event")) {
    if (norm(String(n.name)) !== h1)
      fail(where, `event name "${n.name}" differs from the h1`);
    if (!shows(longDate(String(n.startDate))))
      fail(where, `event date ${n.startDate} is not shown`);
    const offer = n.offers as Node | undefined;
    if (offer && !page.hrefs.includes(String(offer.url)))
      fail(where, "the event's offer links somewhere the page does not");
    for (const loc of [n.location ?? []].flat() as Node[])
      if (typesOf(loc).includes("Place") && !shows(String(loc.name)))
        fail(where, `venue "${loc.name}" is not shown`);
  }

  // People: only trustees who are published and have consented
  for (const n of ofType("Person")) {
    const name = String(n.name);
    if (!trustees.has(name))
      fail(where, `Person "${name}" has not consented to publication`);
    if (!shows(name)) fail(where, `Person "${name}" is not shown`);
    const role = (n.memberOf as Node | undefined)?.roleName;
    if (role && !shows(String(role)))
      fail(where, `role "${role}" for ${name} is not shown`);
    for (const key of ["jobTitle"])
      if (n[key] && !shows(String(n[key])))
        fail(where, `${key} "${n[key]}" for ${name} is not shown`);
  }

  // Services only for programmes the Board has started
  for (const n of ofType("Service")) {
    const slug = String(n.url ?? "").split("/programmes/")[1];
    if (programmeStatus(slug) !== "active")
      fail(where, `Service for ${slug}, which is not an active programme`);
    if (!shows(String(n.name))) fail(where, `service "${n.name}" is not shown`);
  }

  // Glossary terms as shown
  for (const n of ofType("DefinedTerm")) {
    if (!shows(String(n.name))) fail(where, `term "${n.name}" is not shown`);
    if (!shows(String(n.description)))
      fail(where, `the definition of "${n.name}" differs from the page`);
  }

  return [...new Set(nodes.flatMap(typesOf))];
}
