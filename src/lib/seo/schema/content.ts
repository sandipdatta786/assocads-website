import { site } from "@/config/site";
import type {
  ContentEvent,
  GlossaryTerm,
  Guide,
  Insight,
  Programme,
  Trustee,
} from "@/lib/content/schemas";
import { hasTrusteeProfile } from "@/lib/content/trustees";
import {
  enumValue,
  organisationRef,
  real,
  url,
  websiteRef,
  type SchemaNode,
} from "./core";

/* ---------------------------------------------------------------- people */

/** The stable @id of a trustee, whether or not they have their own page. */
export const trusteeId = (slug: string) => `${url("/about/trustees")}#${slug}`;

/** Only trustees who are published and have consented appear as a Person. */
export function canDescribeTrustee(t: Trustee): boolean {
  return t.published && t.consentToPublish;
}

/**
 * A Founder Trustee. Only what the trustee has supplied is included; the role,
 * organisation, expertise and profile link are left out while they are
 * placeholders. The role is their elected office if they hold one (titles are
 * set only once the Board has elected office bearers), otherwise their capacity.
 */
export function person(t: Trustee): SchemaNode | null {
  if (!canDescribeTrustee(t)) return null;
  const profile = hasTrusteeProfile(t)
    ? url(`/about/trustees/${t.slug}`)
    : undefined;
  return {
    "@type": "Person",
    "@id": trusteeId(t.slug),
    name: t.name,
    url: profile,
    image: t.photo ? url(t.photo) : undefined,
    jobTitle: real(t.role) ? t.role : undefined,
    worksFor: real(t.organisation)
      ? { "@type": "Organization", name: t.organisation }
      : undefined,
    knowsAbout: t.expertise.filter(real),
    sameAs: real(t.linkedin) ? [t.linkedin] : undefined,
    memberOf: {
      "@type": "OrganizationRole",
      roleName: t.officeTitle || t.capacity,
      memberOf: organisationRef,
    },
  };
}

/** A byline: a team such as "ASSOCADS editorial team", or a named person. */
function byline(name: string) {
  if (!real(name)) return undefined;
  return name.includes(site.shortName)
    ? {
        "@type": "Organization",
        name,
        parentOrganization: organisationRef,
      }
    : { "@type": "Person", name };
}

/* ---------------------------------------------------------------- programmes */

/**
 * A programme as a Service. Emitted only for programmes the Board has
 * started: a planned programme is not yet a service anyone can use.
 */
export function service(p: Programme): SchemaNode | null {
  if (p.status !== "active") return null;
  const path = `/programmes/${p.slug}`;
  return {
    "@type": "Service",
    "@id": `${url(path)}#service`,
    name: p.title,
    description: p.purpose,
    url: url(path),
    serviceType: p.title,
    provider: organisationRef,
    areaServed: { "@type": "Country", name: site.location.country },
  };
}

/* ---------------------------------------------------------------- events */

const attendance = {
  "in-person": "OfflineEventAttendanceMode",
  online: "OnlineEventAttendanceMode",
  hybrid: "MixedEventAttendanceMode",
} as const;

/**
 * An event. It has an offer only when there is a real registration link,
 * and never a price, since none is published.
 */
export function event(e: ContentEvent): SchemaNode {
  const path = `/events/${e.slug}`;
  const pageUrl = url(path);
  const registration = real(e.registrationUrl) ? e.registrationUrl : undefined;
  const inPerson = e.mode !== "online";
  const online = e.mode !== "in-person";
  const place = inPerson
    ? {
        "@type": "Place",
        name: e.venue,
        address: {
          "@type": "PostalAddress",
          addressLocality: e.city,
          addressCountry: "IN",
        },
      }
    : undefined;
  const virtual = online
    ? { "@type": "VirtualLocation", url: registration ?? pageUrl }
    : undefined;
  return {
    "@type": "Event",
    "@id": `${pageUrl}#event`,
    name: e.title,
    description: e.summary,
    url: pageUrl,
    image: `${pageUrl}/opengraph-image`,
    startDate: e.startDate,
    endDate: e.endDate,
    eventStatus: enumValue("EventScheduled"),
    eventAttendanceMode: enumValue(attendance[e.mode]),
    location: place && virtual ? [place, virtual] : (place ?? virtual),
    organizer: organisationRef,
    performer: e.speakers.map((s) => ({ "@type": "Person", name: s.name })),
    offers: registration
      ? {
          "@type": "Offer",
          url: registration,
          availability: enumValue("InStock"),
          validFrom: e.registrationOpens,
        }
      : undefined,
    inLanguage: "en-IN",
  };
}

/* ---------------------------------------------------------------- articles */

/**
 * A guide: the page, which carries the trustee review, and the Article on it.
 * schema.org defines reviewedBy and lastReviewed on the page, not the article,
 * so they sit on the WebPage, whose main subject is the Article.
 */
export function guideArticle(
  g: Guide,
  reviewer?: Trustee,
): [SchemaNode, SchemaNode] {
  const path = `/guides/${g.slug}`;
  const pageUrl = url(path);
  const articleId = `${pageUrl}#article`;
  return [
    {
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: g.title,
      isPartOf: websiteRef,
      publisher: organisationRef,
      lastReviewed: g.lastReviewed,
      dateModified: g.lastReviewed,
      reviewedBy: real(g.reviewedBy)
        ? {
            "@type": "Person",
            "@id":
              reviewer && canDescribeTrustee(reviewer)
                ? trusteeId(reviewer.slug)
                : undefined,
            name: g.reviewedBy,
          }
        : undefined,
      mainEntity: { "@id": articleId },
    },
    {
      "@type": "Article",
      "@id": articleId,
      headline: g.title,
      description: g.summary,
      abstract: g.directAnswer,
      image: `${pageUrl}/opengraph-image`,
      datePublished: g.publishedDate,
      dateModified: g.lastReviewed,
      author: byline(g.author),
      publisher: organisationRef,
      citation: g.sources.map((s) => s.url),
      inLanguage: "en-IN",
      mainEntityOfPage: { "@id": pageUrl },
    },
  ];
}

/** A news item or announcement. */
export function newsArticle(i: Insight): SchemaNode {
  const pageUrl = url(`/insights/${i.slug}`);
  return {
    "@type": "NewsArticle",
    "@id": `${pageUrl}#article`,
    headline: i.title,
    description: i.summary,
    image: i.image ? url(i.image) : `${pageUrl}/opengraph-image`,
    datePublished: i.publishedDate,
    dateModified: i.updatedDate ?? i.publishedDate,
    author: byline(i.author),
    publisher: organisationRef,
    inLanguage: "en-IN",
    mainEntityOfPage: pageUrl,
  };
}

/* ---------------------------------------------------------------- glossary */

export const GLOSSARY_NAME = `${site.shortName} glossary of AI and Data Science terms`;
const glossaryId = url("/glossary");

/** The glossary as a whole. */
export function definedTermSet(terms: GlossaryTerm[]): SchemaNode {
  return {
    "@type": "DefinedTermSet",
    "@id": glossaryId,
    name: GLOSSARY_NAME,
    url: glossaryId,
    publisher: organisationRef,
    inLanguage: "en-IN",
    hasDefinedTerm: terms.map((t) => ({ "@id": termId(t.slug) })),
  };
}

/** The @id of a glossary term. Its page is a separate WebPage node. */
export const termId = (slug: string) => `${url(`/glossary/${slug}`)}#term`;

/** One glossary term, inside the glossary. */
export function definedTerm(t: GlossaryTerm): SchemaNode {
  const pageUrl = url(`/glossary/${t.slug}`);
  return {
    "@type": "DefinedTerm",
    "@id": termId(t.slug),
    name: t.term,
    alternateName: t.aliases,
    description: t.shortDefinition,
    url: pageUrl,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      "@id": glossaryId,
      name: GLOSSARY_NAME,
      url: glossaryId,
      publisher: organisationRef,
    },
  };
}

/* ------------------------------------------------------------------ voices */

/** A YouTube video in ASSOCADS Voices. Recordings hosted elsewhere get none. */
export function videoObject(item: {
  title: string;
  summary: string;
  publishedDate: string;
  youtubeId: string | null;
  url: string;
}): SchemaNode | null {
  if (!item.youtubeId) return null;
  return {
    "@type": "VideoObject",
    name: item.title,
    description: item.summary || item.title,
    thumbnailUrl: `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`,
    uploadDate: item.publishedDate,
    contentUrl: item.url,
    embedUrl: `https://www.youtube-nocookie.com/embed/${item.youtubeId}`,
    publisher: organisationRef,
    inLanguage: "en-IN",
  };
}
