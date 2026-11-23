import { isRegistered, site, socialLinks } from "@/config/site";
import {
  ORGANISATION_ID,
  WEBSITE_ID,
  organisationRef,
  real,
  url,
  type SchemaNode,
} from "./core";

/** The subjects ASSOCADS works on, for knowsAbout. */
export const KNOWS_ABOUT = [
  "Artificial intelligence",
  "Data science",
  "Machine learning",
  "Analytics",
  "Responsible AI",
];

/** The organisation's logo, from the brand kit (docs/logo). */
export const LOGO = {
  path: "/brand/kit/png/assocads-logo-stacked-colour.png",
  width: 2000,
  height: 1402,
};

/** How to reach ASSOCADS. Email and phone appear only once they are filled in. */
export function contactPoint(): SchemaNode {
  return {
    "@type": "ContactPoint",
    contactType: "general enquiries",
    url: url("/contact"),
    email: real(site.contact.email) ? site.contact.email : undefined,
    telephone: real(site.contact.phone) ? site.contact.phone : undefined,
    areaServed: "IN",
    availableLanguage: ["English"],
  };
}

/**
 * The organisation, emitted on every page as an NGO.
 *
 * - foundingDate is the year only, until the registration date is recorded.
 * - The street address appears only once the registered office is filled in.
 * - sameAs lists only the social profiles that exist.
 * - schema.org's nonprofitStatus has values only for the Netherlands, the
 *   United Kingdom and the United States, none of which fits an Indian public
 *   charitable trust. Once the trust is registered, its registration number is
 *   given as an identifier instead. Nothing here says "registered" before then.
 */
export function organisation(): SchemaNode {
  const registered = isRegistered();
  return {
    "@type": "NGO",
    "@id": ORGANISATION_ID,
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    slogan: site.tagline,
    url: url("/"),
    logo: {
      "@type": "ImageObject",
      "@id": `${site.url}/#logo`,
      url: url(LOGO.path),
      contentUrl: url(LOGO.path),
      width: LOGO.width,
      height: LOGO.height,
      caption: site.shortName,
    },
    foundingDate:
      registered && site.legal.registrationDate
        ? site.legal.registrationDate
        : String(site.foundingYear),
    foundingLocation: {
      "@type": "Place",
      name: `${site.location.city}, ${site.location.state}, ${site.location.country}`,
    },
    areaServed: { "@type": "Country", name: site.location.country },
    address: {
      "@type": "PostalAddress",
      streetAddress: real(site.legal.registeredOffice)
        ? site.legal.registeredOffice
        : undefined,
      addressLocality: site.location.city,
      addressRegion: site.location.state,
      addressCountry: "IN",
    },
    email: real(site.contact.email) ? site.contact.email : undefined,
    contactPoint: contactPoint(),
    knowsAbout: KNOWS_ABOUT,
    identifier: registered
      ? {
          "@type": "PropertyValue",
          name: "Trust registration number",
          value: site.legal.registrationNumber,
        }
      : undefined,
    sameAs: socialLinks().map((l) => l.url),
  };
}

/** The website, emitted on every page. */
export function website(): SchemaNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    alternateName: site.shortName,
    url: url("/"),
    inLanguage: "en-IN",
    publisher: organisationRef,
  };
}
