/**
 * The single source of organisation facts. Every page reads from here.
 * Never type the name, legal status, contact details or links by hand in a page.
 * Facts come from docs/BLUEPRINT.md, section 7. No personal data from the deed belongs here.
 */

export type LegalStatus = "pending" | "registered";
export type ExemptionStatus = "not-applied" | "applied" | "granted";

export type NavLink = { label: string; href: string };
export type FooterGroup = { heading: string; links: NavLink[] };
export type MenuLink = NavLink & { description: string };
export type NavItem = NavLink & { menu?: MenuLink[] };

function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const site = {
  name: "Association for AI and Data Science",
  shortName: "ASSOCADS",
  description:
    "ASSOCADS is a not-for-profit public charitable trust building a collaborative ecosystem for AI, Data Science and Analytics professionals across India, beginning with West Bengal.",
  tagline: "Connecting talent, knowledge, innovation and opportunity.",
  url: siteUrl(),
  foundingYear: 2026,
  location: {
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
  },

  legal: {
    status: "pending" as LegalStatus,
    registrationNumber: "",
    registrationDate: "",
    registeredOffice: "[PLACEHOLDER: registered office address in West Bengal]",
    taxExemption: {
      twelveAB: "not-applied" as ExemptionStatus,
      eightyG: "not-applied" as ExemptionStatus,
    },
    /** Foreign contributions need registration or permission under the FCRA. */
    fcraRegistered: false,
  },

  governance: {
    /** The first office bearers are elected at the first Board meeting after registration. */
    officeBearersElected: false,
    /** Membership fees are set by bye-laws adopted after registration. */
    feesFixed: false,
  },

  contact: {
    email: "[PLACEHOLDER: public contact email address]",
    phone: "[PLACEHOLDER: public phone number, if any]",
    dataProtectionEmail:
      "[PLACEHOLDER: email address for data protection requests]",
  },

  social: {
    linkedin: "",
    youtube: "",
    x: "",
    instagram: "",
    github: "",
  },

  /** The six main navigation items. Items with a menu open a dropdown on desktop.
      The Programmes menu is filled from content/programmes and content/audiences. */
  navigation: [
    {
      label: "About",
      href: "/about",
      menu: [
        {
          label: "About ASSOCADS",
          href: "/about",
          description: "Who we are and why the trust was set up",
        },
        {
          label: "Aims and objects",
          href: "/about/objects",
          description:
            "The sixteen objects of the trust deed, in plain English",
        },
        {
          label: "Governance",
          href: "/about/governance",
          description: "How the trust is run, its principles and documents",
        },
        {
          label: "Founder Trustees",
          href: "/about/trustees",
          description: "The thirteen people on the first Board",
        },
        {
          label: "Roadmap",
          href: "/about/roadmap",
          description: "What we plan to do, and when",
        },
        {
          label: "At a glance",
          href: "/about/facts",
          description: "Short, dated facts about ASSOCADS",
        },
      ],
    },
    { label: "Programmes", href: "/programmes", menu: [] },
    { label: "Membership", href: "/membership" },
    { label: "Events", href: "/events" },
    { label: "Insights", href: "/insights" },
    {
      label: "Resources",
      href: "/resources",
      menu: [
        {
          label: "All resources",
          href: "/resources",
          description: "Guides, glossary, documents and the brand kit",
        },
        {
          label: "Guides",
          href: "/guides",
          description: "Careers, Kolkata and policy, reviewed by a trustee",
        },
        {
          label: "Glossary",
          href: "/glossary",
          description: "Plain definitions of AI and data terms",
        },
        {
          label: "Questions",
          href: "/faq",
          description: "Answers about ASSOCADS, membership and more",
        },
      ],
    },
  ] satisfies NavItem[] as NavItem[],

  /** Links shown in the mobile menu and the desktop header's extra slots. */
  moreLinks: [
    { label: "Communities", href: "/communities" },
    { label: "Partner with us", href: "/partner" },
    { label: "Support ASSOCADS", href: "/support" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavLink[],

  joinLink: { label: "Join", href: "/membership/apply" } satisfies NavLink,

  footer: [
    {
      heading: "About",
      links: [
        { label: "About ASSOCADS", href: "/about" },
        { label: "Aims and objects", href: "/about/objects" },
        { label: "Governance", href: "/about/governance" },
        { label: "Founder Trustees", href: "/about/trustees" },
        { label: "Roadmap", href: "/about/roadmap" },
        { label: "At a glance", href: "/about/facts" },
      ],
    },
    {
      heading: "Get involved",
      links: [
        { label: "Membership", href: "/membership" },
        { label: "Register your interest", href: "/membership/apply" },
        { label: "Events", href: "/events" },
        { label: "Communities", href: "/communities" },
        { label: "Partner with us", href: "/partner" },
        { label: "Support ASSOCADS", href: "/support" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Programmes", href: "/programmes" },
        { label: "Insights", href: "/insights" },
        { label: "Guides", href: "/guides" },
        { label: "Glossary", href: "/glossary" },
        { label: "All resources", href: "/resources" },
        { label: "Questions", href: "/faq" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "Privacy", href: "/legal/privacy" },
        { label: "Terms", href: "/legal/terms" },
        { label: "Disclaimer", href: "/legal/disclaimer" },
        { label: "Accessibility", href: "/accessibility" },
      ],
    },
  ] satisfies FooterGroup[],

  /** The audience pages, shown as a row in the footer. */
  audienceLinks: [
    { label: "Students", href: "/for/students" },
    { label: "Professionals", href: "/for/professionals" },
    { label: "Industry", href: "/for/industry" },
    { label: "Government bodies", href: "/for/government" },
  ] satisfies NavLink[],

  legalLinks: [
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Disclaimer", href: "/legal/disclaimer" },
    { label: "Accessibility", href: "/accessibility" },
  ] satisfies NavLink[],
};

export type Site = typeof site;

/** True only once the trust is registered and both the number and date are recorded. */
export function isRegistered(): boolean {
  const { status, registrationNumber, registrationDate } = site.legal;
  return (
    status === "registered" && Boolean(registrationNumber && registrationDate)
  );
}

/**
 * The one sentence the whole site uses to describe the legal status.
 * Never write "registered" or "registration in progress" by hand in a page.
 */
export function legalStatusLine(): string {
  const base = `${site.shortName} is a not-for-profit public charitable trust established in ${site.location.city} in ${site.foundingYear}.`;
  if (!isRegistered()) {
    return `${base} Its registration is in progress.`;
  }
  return `${base} It is registered under registration number ${site.legal.registrationNumber}, dated ${site.legal.registrationDate}.`;
}

/** A short label for badges and footers. */
export function legalStatusLabel(): string {
  return isRegistered()
    ? "Registered public charitable trust"
    : "Registration in progress";
}

/**
 * Whether a page may say that a tax exemption is available.
 * Only true once the setting says it has been granted.
 */
export function canMentionTaxExemption(kind: "twelveAB" | "eightyG"): boolean {
  return site.legal.taxExemption[kind] === "granted";
}

/** The site's answer to "are donations tax-deductible?". */
export function taxStatusLine(): string {
  if (canMentionTaxExemption("eightyG")) {
    return `Yes. ${site.shortName} holds approval under section 80G of the Income Tax Act, so eligible donations made in India qualify for a deduction. A receipt is issued for every donation.`;
  }
  return `Not at present. ${site.shortName} intends to apply for registration under sections 12AB and 80G of the Income Tax Act after the trust is registered. Until 80G approval is granted, donations do not qualify for a tax deduction.`;
}

/** The site's answer to "can you accept foreign donations?". */
export function foreignContributionLine(): string {
  if (site.legal.fcraRegistered) {
    return `${site.shortName} holds registration under the Foreign Contribution (Regulation) Act, 2010, and can accept foreign contributions within its terms.`;
  }
  return `No. ${site.shortName} cannot accept foreign contributions until it holds registration or prior permission under the Foreign Contribution (Regulation) Act, 2010.`;
}

/** Official profile links that have been filled in, for footers and structured data. */
export function socialLinks(): { network: string; url: string }[] {
  return Object.entries(site.social)
    .filter(([, url]) => url)
    .map(([network, url]) => ({ network, url }));
}

/**
 * The text of the slim banner under the header, or null when there should be
 * no banner. Driven only by the legal status.
 */
export function statusBannerText(): string | null {
  if (isRegistered()) return null;
  return `${site.shortName} is a public charitable trust in formation. Registration is in progress.`;
}

// Built from two parts so the content check does not mistake this code for a placeholder.
const PLACEHOLDER_START = "[PLACEHOLDER" + ": ";

/** True when a setting still holds a placeholder rather than a real value. */
export function isPlaceholderValue(value: string): boolean {
  return value.startsWith(PLACEHOLDER_START) && value.endsWith("]");
}

/** The text inside a placeholder, for the Placeholder component. */
export function placeholderNeed(value: string): string {
  return value.slice(PLACEHOLDER_START.length, -1);
}
