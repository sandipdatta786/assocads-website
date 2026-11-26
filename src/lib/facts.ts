/**
 * The key facts about ASSOCADS, as plain sentences. The facts page shows them
 * and /llms.txt lists them, so the two always say the same thing. Every value
 * comes from src/config/site.ts or the content collections.
 */
import {
  foreignContributionLine,
  legalStatusLine,
  site,
  taxStatusLine,
} from "@/config/site";
import {
  getFaqs,
  getMembership,
  getProgrammes,
  getFounderMembers,
  getTrustees,
} from "@/lib/content/loaders";
import { numberWord } from "@/lib/words";

export type Fact = {
  label: string;
  /** Plain sentences. May contain a [PLACEHOLDER: ...] while a setting is missing. */
  text: string;
  /** A page that says more. */
  link?: { href: string; label: string };
};

const capitalise = (text: string) => text[0].toUpperCase() + text.slice(1);

/** A list in plain English: "a, b and c". */
export const joinAnd = (items: string[]) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/** The question in content/faqs.json that names the similar organisations. */
/** The deed's order of offices, for listing office bearers. */
const OFFICE_ORDER = [
  "President",
  "Vice-President",
  "General Secretary",
  "Joint Secretary",
  "Treasurer",
];
const officeRank = (title: string) => {
  const i = OFFICE_ORDER.indexOf(title);
  return i === -1 ? OFFICE_ORDER.length : i;
};

export function affiliationFaq() {
  return getFaqs().find((f) => f.question.startsWith("Is ASSOCADS affiliated"));
}

export function keyFacts(): Fact[] {
  const trustees = getTrustees();
  const founderMembers = getFounderMembers();
  // "Rahul Bhattacharya (President), Abhijit Pal (Vice-President), ..."
  const officeLine = [...trustees, ...founderMembers]
    .filter((t) => t.officeTitle)
    .sort((a, b) => officeRank(a.officeTitle) - officeRank(b.officeTitle))
    .map((t) => `${t.name} (${t.officeTitle})`)
    .join(", ");
  const membership = getMembership();
  const programmes = getProgrammes();
  const planned = programmes.every((p) => p.status === "planned");
  const affiliation = affiliationFaq();
  const { city, state, country, full } = site.location;

  return [
    {
      label: "Full name",
      text: `The full name of ${site.shortName} is the ${site.name}.`,
    },
    {
      label: "Short name",
      text: `${site.shortName}, always written in capital letters.`,
    },
    { label: "What it is", text: site.description },
    {
      label: "Legal form",
      text: `${site.shortName} is a public charitable trust. It is non-political, non-religious, not-for-profit and irrevocable.`,
    },
    { label: "Legal status", text: legalStatusLine() },
    {
      label: "Founded",
      text: `${site.shortName} was established in ${full}, in ${site.foundingYear}.`,
    },
    {
      label: "Based in",
      text: `${city}, ${state}, ${country}. Registered office: ${site.legal.registeredOffice}`,
    },
    {
      label: "Scope",
      text: `Across ${country}, beginning with ${state}. ${site.mission}`,
    },
    {
      label: "Founder Trustees",
      text: `The first Board of Trustees of ${site.shortName} has ${numberWord(trustees.length)} Founder Trustees, who serve without payment.${site.governance.officeBearersElected ? ` The Board has elected its office bearers: ${officeLine}.` : " Office bearers will be elected at the Board's first meeting after registration."}${founderMembers.length > 0 ? ` ${numberWord(founderMembers.length)[0].toUpperCase()}${numberWord(founderMembers.length).slice(1)} founder members serve on its sub-committees but are not on the Board.` : ""}`,
      link: { href: "/about/trustees", label: "See the trustees" },
    },
    {
      label: "Membership",
      text: `${capitalise(numberWord(membership.individual.length))} individual and ${numberWord(membership.organisation.length)} organisational membership categories, approved by the Board in ${membership.approved}, from free Community membership upwards. Membership opens after registration. Honorary recognition, such as Fellow, is by invitation of the Board and is never bought.`,
      link: { href: "/membership", label: "Categories and fees" },
    },
    {
      label: "Programme areas",
      text: `${capitalise(numberWord(programmes.length))} areas of work: ${joinAnd(programmes.map((p) => p.title[0].toLowerCase() + p.title.slice(1)))}.${planned ? " All are planned; none has started yet." : ""}`,
    },
    { label: "Tax deductions", text: taxStatusLine() },
    { label: "Foreign contributions", text: foreignContributionLine() },
    {
      label: "Contact",
      text: `Email: ${site.contact.email}.`,
      link: { href: "/contact", label: "Use the contact page" },
    },
    ...(affiliation
      ? [{ label: "Not affiliated with", text: affiliation.answer }]
      : []),
  ];
}

/** A fact's text with any sentence that still holds a placeholder removed. */
export function withoutPlaceholders(text: string): string {
  return text
    .split(/(?<=[.?!])\s+/)
    .filter((sentence) => !sentence.includes("[PLACEHOLDER"))
    .join(" ")
    .trim();
}
