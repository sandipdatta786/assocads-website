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
  /** Trustees form the Board. Founder Members are not on the Board. */
  capacity: z.enum([
    "Settlor and Founder Trustee",
    "Founder Trustee",
    "Founder Member",
  ]),
  /** The office the Board elected them to. Stays empty until the Board
      elects office bearers (site.governance.officeBearersElected). */
  officeTitle: z.string().default(""),
  /** The sub-committees they serve on, as the Board assigned them. */
  committees: z.array(z.string().min(1)).default([]),
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
  /** One line for the comparison table: how someone is admitted. */
  admission: z.string().min(1),
  /** One line for the comparison table: what it costs. Never a figure until the Board fixes fees. */
  payment: z.string().min(1),
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
  /** The group on /faq. Labels are in faqCategories in src/lib/content/faqs.ts. */
  category: z.enum([
    "about",
    "membership",
    "programmes",
    "partnership",
    "support",
    "website",
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

/** The groups on /about/approach, in reading order. */
export const initiativeGroups = [
  { slug: "learn", title: "Learn by doing" },
  { slug: "build", title: "Build real solutions" },
  { slug: "share", title: "Share knowledge openly" },
  { slug: "serve", title: "Serve industry and society" },
] as const;

/** A proposed initiative, from the founders' thinking on what ASSOCADS should stand for.
    Every one is a proposal; the Board decides which to start, and when. */
export const initiativeSchema = z.object({
  slug,
  group: z.enum(["learn", "build", "share", "serve"]),
  title: z.string().min(1).max(50),
  summary: z.string().min(1),
  /** One sentence on what a participant or the field gains. */
  outcome: z.string().min(1).max(110),
  /** The programme this belongs to, from content/programmes. */
  programme: slug,
});

/** A question ASSOCADS aims to judge its success by. Never a number until there is real data. */
export const successMeasureSchema = z.string().min(1).endsWith("?");

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

/** A link to a page on this site. */
const internalLink = z.object({
  label: z.string().min(1).max(32),
  href: z.string().startsWith("/"),
});

export const programmeSchema = z
  .object({
    slug,
    title: z.string().min(1),
    /** One line for menus and cards, under 60 characters. */
    tagline: z.string().min(1).max(60),
    summary: z.string().refine(wordRange(60, 90), "must be 60 to 90 words"),
    /** One sentence: what the programme is for. */
    purpose: z.string().min(1).max(220),
    /** Search title and description for the page's metadata. */
    seo: z.object({
      title: z.string().min(1).max(60),
      description: z.string().min(110).max(160),
    }),
    deedObjects: z.array(z.number().int().min(1).max(16)).min(1),
    /** "What this will include": activities drawn only from the mapped deed objects.
        Most programmes have one untitled group; a programme with two halves has two titled groups. */
    includes: z
      .array(
        z.object({
          title: z.string().min(1).optional(),
          intro: z.string().min(1).optional(),
          items: z.array(z.string().min(1)).min(2),
        }),
      )
      .min(1),
    /** Slugs from content/audiences. */
    audiences: z.array(slug).min(1),
    involvement: z.object({
      text: z.string().min(1),
      actions: z.array(internalLink).min(1).max(2),
    }),
    faqs: z
      .array(
        z.object({
          question: z.string().min(1).endsWith("?"),
          answer: z.string().min(1),
        }),
      )
      .min(3)
      .max(4),
    /** Slugs of related programmes. */
    related: z.array(slug).min(1).max(3),
    status: z.enum(["active", "planned"]),
    /** A Lucide icon name, for example "graduation-cap". */
    icon: z.string().min(1),
    order: z.number().int().positive(),
  })
  .refine(
    (p) => {
      const total = p.includes.reduce((n, g) => n + g.items.length, 0);
      return total >= 4 && total <= 10;
    },
    {
      message: "includes must list four to ten activities in all",
      path: ["includes"],
    },
  );

export const audienceSchema = z.object({
  slug,
  /** Short title for menus and cards, for example "For students". */
  title: z.string().min(1),
  summary: z.string().min(1),
  /** The page's h1, written for this reader. */
  headline: z.string().min(1).max(80),
  /** One or two sentences under the headline, in the second person. */
  lead: z.string().min(1),
  primaryAction: internalLink,
  seo: z.object({
    title: z.string().min(1).max(60),
    description: z.string().min(110).max(160),
  }),
  /** "What you can expect": each benefit is tied to a programme. */
  benefits: z
    .array(
      z.object({
        title: z.string().min(1).max(60),
        text: z.string().min(1),
        /** Slug of the programme that delivers it. */
        programme: slug,
      }),
    )
    .min(4)
    .max(6),
  /** An important note for this reader, such as who can join. */
  notice: z
    .object({ title: z.string().min(1), text: z.string().min(1) })
    .optional(),
  /** "How to take part": exactly three steps. */
  steps: z
    .array(z.object({ title: z.string().min(1), text: z.string().min(1) }))
    .length(3),
  /** Slugs of the programmes most relevant to this reader. */
  programmes: z.array(slug).min(2).max(4),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1).endsWith("?"),
        answer: z.string().min(1),
      }),
    )
    .min(3)
    .max(5),
  order: z.number().int().positive(),
});

const eventSpeakerSchema = z
  .object({
    name: z.string().min(1),
    role: z.string().optional(),
    organisation: z.string().optional(),
    /** Path under public/. Only with the speaker's written consent (truthfulness rule 9). */
    photo: z.string().startsWith("/").optional(),
    photoConsent: z.boolean().default(false),
  })
  .refine((s) => !s.photo || s.photoConsent, {
    message: "a speaker photo needs photoConsent: true",
    path: ["photoConsent"],
  });

export const eventSchema = z
  .object({
    slug,
    title: z.string().min(1).max(90),
    summary: z.string().min(1).max(220),
    type: z.enum([
      "conference",
      "seminar",
      "workshop",
      "masterclass",
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
    /** A map link for the venue. If empty, one is made from the venue and city. */
    mapUrl: urlOrPlaceholder.default(""),
    /** Where people register. If empty, the button goes to the contact page. */
    registrationUrl: urlOrPlaceholder.default(""),
    /** When registration opens. If empty, it is open as soon as the event is published. */
    registrationOpens: isoDateOrDateTime.optional(),
    /** When registration closes. If empty, it closes when the event starts. */
    registrationCloses: isoDateOrDateTime.optional(),
    speakers: z.array(eventSpeakerSchema).default([]),
    agenda: z
      .array(
        z.object({
          /** For example "10:00" or "10:00 to 11:30", in Indian Standard Time. */
          time: z.string().min(1),
          title: z.string().min(1),
          detail: z.string().optional(),
        }),
      )
      .default([]),
    /** Added after the event: a short summary, photographs (with consent) and slides. */
    recap: z
      .object({
        summary: z.string().optional(),
        photos: z
          .array(
            z.object({
              src: z.string().startsWith("/"),
              alt: z.string().min(1),
            }),
          )
          .default([]),
        slidesUrl: urlOrPlaceholder.optional(),
      })
      .optional(),
    draft,
  })
  .refine(
    (e) => !e.endDate || e.endDate.slice(0, 10) >= e.startDate.slice(0, 10),
    {
      message: "endDate must not be before startDate",
      path: ["endDate"],
    },
  )
  .refine((e) => e.mode === "online" || (e.venue && e.city), {
    message: "an in-person or hybrid event needs a venue and a city",
    path: ["venue"],
  })
  .refine(
    (e) =>
      !e.registrationOpens ||
      !e.registrationCloses ||
      e.registrationOpens.slice(0, 10) <= e.registrationCloses.slice(0, 10),
    {
      message: "registrationOpens must not be after registrationCloses",
      path: ["registrationOpens"],
    },
  );

/** A Special Interest Group or a chapter. The Board sets each one up under the
    trust deed. Until then it is "proposed" and has no page of its own. */
export const communitySchema = z
  .object({
    slug,
    kind: z.enum(["sig", "chapter"]),
    name: z.string().min(1).max(60),
    /** One sentence. For a proposed group, worded as a plan. */
    summary: z.string().min(1).max(200),
    /** "active" only once the Board has set it up. Active ones get their own page. */
    status: z.enum(["proposed", "active"]),
    /** For chapters. */
    city: z.string().optional(),
    state: z.string().optional(),
    order: z.number().int().positive(),
    draft,
  })
  .refine((c) => c.kind === "sig" || Boolean(c.city || c.state), {
    message: "a chapter needs a city or a state",
    path: ["city"],
  });

export const insightCategories = ["announcement", "news", "report"] as const;

export const insightSchema = z
  .object({
    slug,
    title: z.string().min(1).max(100),
    /** One or two sentences, shown on cards, in search results and in the feed. */
    summary: z.string().min(1).max(240),
    category: z.enum(insightCategories),
    /** An item dated in the future stays hidden until that day (Indian Standard Time). */
    publishedDate: isoDate,
    /** Only when the article was changed after publication. */
    updatedDate: isoDate.optional(),
    author: z.string().min(1),
    image: z.string().startsWith("/").optional(),
    /** Describes the image for people who cannot see it. Required with an image. */
    imageAlt: z.string().optional(),
    draft,
  })
  .refine((i) => !i.updatedDate || i.updatedDate >= i.publishedDate, {
    message: "must be on or after publishedDate",
    path: ["updatedDate"],
  })
  .refine((i) => !i.image || Boolean(i.imageAlt?.trim()), {
    message: "an image needs imageAlt, a short description of it",
    path: ["imageAlt"],
  });

/** A source for a guide or glossary entry. Prefer primary sources: the law
    itself, the ministry, the university or the organisation concerned. */
const source = z.object({
  title: z.string().min(1),
  /** Who published it, for example "Ministry of Electronics and IT". */
  publisher: z.string().min(1),
  url: z.url(),
  /** When the link was last opened and checked, as YYYY-MM-DD. */
  accessed: isoDate,
});

export const guideThemes = [
  "careers",
  "kolkata",
  "policy",
  "fundamentals",
] as const;

export const guideCtas = [
  "membership",
  "events",
  "communities",
  "contact",
] as const;

/** A name, or a visible placeholder while the guide is a draft. */
const personOrPlaceholder = z.string().min(1);

export const guideSchema = z
  .object({
    slug,
    /** A question or a clear statement. Up to 90 characters. */
    title: z.string().min(1).max(90),
    /** One or two sentences for cards, search results and the feed. */
    summary: z.string().min(1).max(240),
    /** Search title, if the title is longer than 60 characters. */
    seoTitle: z.string().max(60).optional(),
    theme: z.enum(guideThemes),
    /** The "Short answer" under the title: 40 to 60 words. */
    directAnswer: z
      .string()
      .refine(wordRange(40, 60), "must be 40 to 60 words"),
    author: personOrPlaceholder,
    /** A Founder Trustee's name, exactly as in content/trustees.json.
        A placeholder is allowed only while the guide is a draft. */
    reviewedBy: z.string().default(""),
    publishedDate: isoDate,
    lastReviewed: isoDate,
    /** For guides built on figures or lists that go out of date. */
    dataAsOf: isoDate.optional(),
    targetQuery: z.string().min(1),
    /** Slugs from content/audiences, so audience pages can list this guide. */
    audiences: z.array(slug).default([]),
    /** Three to six short statements, each supported by a listed source. */
    keyFacts: z.array(z.string().min(1)).min(3).max(6),
    sources: z.array(source).min(1),
    faqs: z
      .array(
        z.object({ question: z.string().min(1), answer: z.string().min(1) }),
      )
      .default([]),
    relatedGuides: z.array(slug).default([]),
    glossaryTerms: z.array(slug).default([]),
    /** Which soft call to action closes the guide. */
    cta: z.enum(guideCtas).default("membership"),
    /** Shows "general information, not legal advice". */
    legalNotice: z.boolean().default(false),
    draft,
  })
  .refine((g) => g.lastReviewed >= g.publishedDate, {
    message: "must be on or after publishedDate",
    path: ["lastReviewed"],
  })
  .refine((g) => g.draft || !isPlaceholder(g.author), {
    message: "a published guide needs a real author",
    path: ["author"],
  });

export const glossarySchema = z.object({
  term: z.string().min(1),
  slug,
  /** One sentence in the form "X is ...". Under 40 words. */
  shortDefinition: z
    .string()
    .refine((t) => words(t) < 40, "must be under 40 words"),
  /** Other forms people search for, for example "AI" or "ML". */
  aliases: z.array(z.string().min(1)).default([]),
  related: z.array(slug).default([]),
  /** Slugs from content/audiences, so audience pages can list this term. */
  audiences: z.array(slug).default([]),
  furtherReading: z.array(source).default([]),
  lastReviewed: isoDate,
  /** The Founder Trustee who reviewed the entry, exactly as in
      content/trustees.json (truthfulness rule 10). */
  reviewedBy: z.string().default(""),
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
export type Community = z.infer<typeof communitySchema>;
export type Insight = z.infer<typeof insightSchema>;
export type Guide = z.infer<typeof guideSchema>;
export type GlossaryTerm = z.infer<typeof glossarySchema>;
export type Initiative = z.infer<typeof initiativeSchema>;
export type DeedObject = z.infer<typeof deedObjectSchema>;
