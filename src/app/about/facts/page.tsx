import type { ReactNode } from "react";
import Link from "next/link";
import { AboutLinks } from "@/components/sections/AboutLinks";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  foreignContributionLine,
  isPlaceholderValue,
  legalStatusLine,
  placeholderNeed,
  site,
  taxStatusLine,
} from "@/config/site";
import {
  getFaqs,
  getMembershipCategories,
  getProgrammes,
  getTrustees,
} from "@/lib/content/loaders";
import { pageMetadata } from "@/lib/seo/metadata";
import { numberWord } from "@/lib/words";

export const metadata = pageMetadata({
  title: "At a glance",
  description:
    "Short, dated facts about ASSOCADS, the Association for AI and Data Science: what it is, its legal status, where it is based and who runs it.",
  path: "/about/facts",
});

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(
    new Date(`${iso}T00:00:00+05:30`),
  );

const capitalise = (text: string) => text[0].toUpperCase() + text.slice(1);

/** A list in plain English: "a, b and c". */
const joinAnd = (items: string[]) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/** Shows a setting, or a visible placeholder while it is still missing. */
const settingOrPlaceholder = (value: string) =>
  isPlaceholderValue(value) ? (
    <Placeholder needed={placeholderNeed(value)} />
  ) : (
    value
  );

const linkClass = "font-medium text-indigo underline-offset-4 hover:underline";

export default function FactsPage() {
  const trustees = getTrustees();
  const categories = getMembershipCategories();
  const programmes = getProgrammes();
  const planned = programmes.every((p) => p.status === "planned");
  const affiliation = getFaqs().find((f) =>
    f.question.startsWith("Is ASSOCADS affiliated"),
  );
  const { city, state, country } = site.location;

  const facts: { label: string; value: ReactNode }[] = [
    {
      label: "Full name",
      value: `The full name of ${site.shortName} is the ${site.name}.`,
    },
    {
      label: "Short name",
      value: `${site.shortName}, always written in capital letters.`,
    },
    { label: "What it is", value: site.description },
    {
      label: "Legal form",
      value: `${site.shortName} is a public charitable trust. It is non-political, non-religious, not-for-profit and irrevocable.`,
    },
    { label: "Legal status", value: legalStatusLine() },
    {
      label: "Founded",
      value: `${site.shortName} was set up in ${city} in ${site.foundingYear}.`,
    },
    {
      label: "Based in",
      value: (
        <>
          {city}, {state}, {country}. Registered office:{" "}
          {settingOrPlaceholder(site.legal.registeredOffice)}
        </>
      ),
    },
    {
      label: "Scope",
      value: `Across ${country}, beginning with ${state}. ${site.shortName} aims to connect students, professionals, academia, industry, startups, government and society.`,
    },
    {
      label: "Founder Trustees",
      value: (
        <>
          {site.shortName} was founded by {numberWord(trustees.length)} Founder
          Trustees, who form its first Board of Trustees and serve without
          payment.{" "}
          {!site.governance.officeBearersElected &&
            "Office bearers will be elected at the Board's first meeting after registration. "}
          <Link href="/about/trustees" className={linkClass}>
            See the trustees
          </Link>
        </>
      ),
    },
    {
      label: "Membership",
      value: `The trust deed provides for ${numberWord(categories.length)} membership categories: ${joinAnd(categories.map((c) => c.name))}.${site.governance.feesFixed ? "" : " Fees have not yet been fixed; they will be set by bye-laws adopted after registration."}`,
    },
    {
      label: "Programme areas",
      value: `${capitalise(numberWord(programmes.length))} areas of work: ${joinAnd(programmes.map((p) => p.title[0].toLowerCase() + p.title.slice(1)))}.${planned ? " All are planned; none has started yet." : ""}`,
    },
    { label: "Tax deductions", value: taxStatusLine() },
    { label: "Foreign contributions", value: foreignContributionLine() },
    {
      label: "Contact",
      value: (
        <>
          Email: {settingOrPlaceholder(site.contact.email)}. Or use the{" "}
          <Link href="/contact" className={linkClass}>
            contact page
          </Link>
          .
        </>
      ),
    },
    ...(affiliation
      ? [{ label: "Not affiliated with", value: affiliation.answer }]
      : []),
  ];

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="ASSOCADS at a glance"
        lead="Short facts about ASSOCADS that journalists, researchers and AI assistants can quote. Each one stands on its own."
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "At a glance" },
        ]}
      />

      <Section tone="paper" spacing="none" className="pb-16 lg:pb-28">
        <Container>
          <p className="mb-8 font-mono text-small text-slate-600">
            Last updated{" "}
            <time dateTime={site.factsUpdated}>
              {formatDate(site.factsUpdated)}
            </time>
          </p>
          <dl className="border-t-2 border-ink">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="grid gap-2 border-b border-line py-6 md:grid-cols-12 md:gap-8"
              >
                <dt className="font-display text-h3 font-semibold text-ink md:col-span-4 lg:col-span-3">
                  {fact.label}
                </dt>
                <dd className="max-w-[68ch] text-body text-slate-600 md:col-span-8 lg:col-span-9">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Questions page="/about/facts" />
      <AboutLinks current="/about/facts" />
      <CallToAction />
    </>
  );
}
