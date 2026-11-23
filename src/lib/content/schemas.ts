/**
 * Zod schemas for every content collection in content/.
 * The loaders validate each file against these and stop the build on any error.
 */
import { z } from "zod";

export const PLACEHOLDER_PATTERN = /\[PLACEHOLDER: [^\]]+\]/g;
const isPlaceholder = (value: string) =>
  /^\[PLACEHOLDER: [^\]]+\]$/.test(value);

const slug = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "must be lower-case words joined by hyphens",
  );

const isoDate = z.iso.date({ message: "must be a date written as YYYY-MM-DD" });
const isoDateOrDateTime = z.union([isoDate, z.iso.datetime({ offset: true })], {
  message: "must be YYYY-MM-DD or a full date and time with a time zone",
});

/** A web address, an empty string, or a visible placeholder. */
const urlOrPlaceholder = z.union(
  [z.literal(""), z.url(), z.string().refine(isPlaceholder)],
  {
    message: "must be a full web address, empty, or a [PLACEHOLDER: ...]",
  },
);

const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
const wordRange = (min: number, max: number) => (text: string) =>
  isPlaceholder(text) || (words(text) >= min && words(text) <= max);

/* ---------- JSON collections ---------- */

export const trusteeSchema = z.object({
  order: z.number().int().positive(),
  name: z.string().min(1),
  slug,
  capacity: z.enum(["Settlor and Founder Trustee", "Founder Trustee"]),
  /** Stays empty until the Board elects office bearers. */
  officeTitle: z.string().default(""),
  role: z.string().min(1),
  organisation: z.string().min(1),
  bio: z.string().min(1),
  expertise: z.array(z.string().min(1)),
  /** Path under public/, for example /images/trustees/name.jpg. Only with consent. */
  photo: z.string().startsWith("/images/trustees/").nullable().default(null),
  linkedin: urlOrPlaceholder,
  consentToPublish: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const membershipCategorySchema = z.object({
  slug,
  name: z.string().min(1),
  who: z.string().min(1),
  eligibility: z.string().min(1),
  terms: z.array(z.string().min(1)).min(1),
  /** Null until the Board fixes fees. */
  fee: z
    .object({
      amount: z.number().nonnegative(),
      currency: z.literal("INR"),
      period: z.enum(["annual", "one-time", "none"]),
    })
    .nullable(),
  benefits: z.array(z.string().min(1)),
});

export const faqSchema = z.object({
  question: z.string().min(1).endsWith("?", "must end with a question mark"),
  answer: z.string().min(1),
  category: z.enum([
    "about",
    "governance",
    "membership",
    "money",
    "disambiguation",
  ]),
  /** Paths of the pages that should show this question, for example "/membership". */
  pages: z.array(z.string().startsWith("/")),
});

/** A document. Until it is available it is listed as "To be published" and is not a link. */
export const documentSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    /** Path under public/, for example /documents/annual-report-2027.pdf. */
    file: z.string().startsWith("/documents/"),
    category: z.enum(["governance", "policy", "report", "brand", "other"]),
    /** The document's date. Required once it is available. */
    date: isoDate.optional(),
    available: z.boolean(),
  })
  .refine((d) => !d.available || d.date, {
    message: "an available document needs a date",
    path: ["date"],
  });

/** The roadmap. Every item is a plan, never a claim that something has happened. */
export const roadmapSchema = z.object({
  horizon: z.enum(["near", "mid", "long"]),
  label: z.string().min(1),
  /** The time span, for example "First 12 months". */
  period: z.string().min(1),
  title: z.string().min(1),
  /** The first three are shown on the home page. */
  items: z.array(z.string().min(1)).min(1),
});

/** The sixteen objects of the trust deed, in plain English, grouped for reading. */
export const objectGroups = [
  { slug: "community", title: "Community and learning" },
  { slug: "knowledge", title: "Research and knowledge" },
  { slug: "collaboration", title: "Collaboration and policy" },
  { slug: "innovation", title: "Innovation and recognition" },
  { slug: "public-good", title: "Responsibility and public good" },
  { slug: "foundations", title: "Institutions and support" },
] as const;

export const deedObjectSchema = z.object({
  /** The object's number in the trust deed, 1 to 16. */
  number: z.number().int().min(1).max(16),
  group: z.enum(objectGroups.map((g) => g.slug) as [string, ...string[]]),
  title: z.string().min(1).max(60),
  text: z.string().min(1),
});

/* ---------- MDX collections (front matter) ---------- */

const draft = z.boolean().default(false);

export const programmeSchema = z.object({
  slug,
  title: z.string().min(1),
  /** One line for menus and cards, under 60 characters. */
  tagline: z.string().min(1).max(60),
  summary: z.string().refine(wordRange(60, 90), "must be 60 to 90 words"),
  deedObjects: z.array(z.number().int().min(1).max(16)).min(1),
  status: z.enum(["active", "planned"]),
  /** A Lucide icon name, for example "graduation-cap". */
  icon: z.string().min(1),
  order: z.number().int().positive(),
});

export const audienceSchema = z.object({
  slug,
  title: z.string().min(1),
  summary: z.string().min(1),
  order: z.number().int().positive(),
});

export const eventSchema = z.object({
  slug,
  title: z.string().min(1),
  summary: z.string().min(1),
  type: z.enum([
    "conference",
    "seminar",
    "workshop",
    "meetup",
    "hackathon",
    "webinar",
    "other",
  ]),
  startDate: isoDateOrDateTime,
  endDate: isoDateOrDateTime.optional(),
  mode: z.enum(["in-person", "online", "hybrid"]),
  venue: z.string().default(""),
  city: z.string().default(""),
  registrationUrl: urlOrPlaceholder.default(""),
  registrationStatus: z.enum(["open", "upcoming", "closed"]),
  speakers: z
    .array(z.object({ name: z.string().min(1), role: z.string().optional() }))
    .default([]),
  draft,
});

export const insightSchema = z.object({
  slug,
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.enum(["announcement", "news", "report"]),
  publishedDate: isoDate,
  author: z.string().min(1),
  image: z.string().startsWith("/").optional(),
  draft,
});

export const guideSchema = z.object({
  slug,
  title: z.string().min(1),
  summary: z.string().min(1),
  directAnswer: z.string().refine(wordRange(40, 60), "must be 40 to 60 words"),
  author: z.string().min(1),
  /** A Founder Trustee's name, exactly as in content/trustees.json. */
  reviewedBy: z.string().default(""),
  publishedDate: isoDate,
  lastReviewed: isoDate,
  targetQuery: z.string().min(1),
  faqs: z
    .array(z.object({ question: z.string().min(1), answer: z.string().min(1) }))
    .default([]),
  draft,
});

export const glossarySchema = z.object({
  term: z.string().min(1),
  slug,
  shortDefinition: z
    .string()
    .refine((t) => words(t) < 40, "must be under 40 words"),
  related: z.array(slug).default([]),
  lastReviewed: isoDate,
  draft,
});

export type Trustee = z.infer<typeof trusteeSchema>;
export type MembershipCategory = z.infer<typeof membershipCategorySchema>;
export type Faq = z.infer<typeof faqSchema>;
export type ContentDocument = z.infer<typeof documentSchema>;
export type RoadmapStage = z.infer<typeof roadmapSchema>;
export type Programme = z.infer<typeof programmeSchema>;
export type Audience = z.infer<typeof audienceSchema>;
export type ContentEvent = z.infer<typeof eventSchema>;
export type Insight = z.infer<typeof insightSchema>;
export type Guide = z.infer<typeof guideSchema>;
export type GlossaryTerm = z.infer<typeof glossarySchema>;
export type DeedObject = z.infer<typeof deedObjectSchema>;
