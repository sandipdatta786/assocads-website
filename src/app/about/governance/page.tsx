import { FileText } from "lucide-react";
import { AboutLinks } from "@/components/sections/AboutLinks";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { Heading } from "@/components/ui/Typography";
import {
  canMentionTaxExemption,
  foreignContributionLine,
  isRegistered,
  legalStatusLabel,
  legalStatusLine,
  site,
  taxStatusLine,
} from "@/config/site";
import { getDocuments, getTrustees } from "@/lib/content/loaders";
import { pageMetadata } from "@/lib/seo/metadata";
import { numberWord } from "@/lib/words";

export const metadata = pageMetadata({
  title: "Governance",
  description:
    "How ASSOCADS is run: a public charitable trust with an honorary Board of Trustees, ten binding principles, yearly audited accounts and an annual report.",
  path: "/about/governance",
});

/* Office bearers under the trust deed (docs/BLUEPRINT.md, section 7.4). */
const officeBearers = [
  "One President",
  "Up to two Vice-Presidents",
  "One General Secretary",
  "Up to two Joint Secretaries",
  "One Treasurer",
];

/* The ten principles in docs/BLUEPRINT.md, section 7.3. The last one follows
   the tax-exemption settings, so it never claims an approval not yet granted. */
function principles() {
  const taxGranted =
    canMentionTaxExemption("twelveAB") && canMentionTaxExemption("eightyG");
  return [
    {
      title: "Compliance with the law",
      text: "The trust acts within the law at all times.",
    },
    {
      title: "Open to all",
      text: "Its programmes and membership are open to everyone, without discrimination.",
    },
    {
      title: "Not for profit",
      text: "It works on a not-for-profit basis. Its assets can never be shared among trustees or members.",
    },
    {
      title: "Responsible AI",
      text: "It promotes AI that is responsible, ethical, transparent and trustworthy.",
    },
    {
      title: "Data protection",
      text: "It protects the personal data it holds.",
    },
    {
      title: "Conflicts of interest",
      text: "Trustees follow the conflict-of-interest rules set in the trust deed.",
    },
    {
      title: "Academic integrity",
      text: "Its research, training and publications uphold academic integrity.",
    },
    {
      title: "Proper approvals",
      text: "It obtains the approvals and permissions its activities need.",
    },
    {
      title: "A focus on society",
      text: "Its work is aimed at public benefit.",
    },
    {
      title: "Tax registration",
      text: taxGranted
        ? "It holds registration under sections 12AB and 80G of the Income Tax Act."
        : "It intends to apply for registration under sections 12AB and 80G of the Income Tax Act.",
    },
  ];
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(
    new Date(`${iso}T00:00:00+05:30`),
  );

export default function GovernancePage() {
  const trusteeCount = numberWord(getTrustees().length);
  const documents = getDocuments();
  const elected = site.governance.officeBearersElected;

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Governance"
        lead="How the trust is run: who is responsible, the principles that bind it, how its money is accounted for, and the documents it will publish."
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Governance" },
        ]}
      />

      {/* Legal status, generated only from the settings in src/config/site.ts */}
      <Section tone="paper" spacing="none" className="pb-16 lg:pb-24">
        <Container>
          <section
            aria-labelledby="status-heading"
            className="grid gap-6 rounded-l bg-indigo-tint p-6 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-12"
          >
            <div className="flex flex-col items-start gap-4 lg:col-span-4">
              <Tag variant={isRegistered() ? "indigo" : "marigold"}>
                {legalStatusLabel()}
              </Tag>
              <Heading level={2} id="status-heading">
                Legal status
              </Heading>
            </div>
            <dl className="flex flex-col gap-6 lg:col-span-8">
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-ink">Status</dt>
                <dd className="text-body text-slate-600">
                  {legalStatusLine()}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-ink">Tax deductions</dt>
                <dd className="text-body text-slate-600">{taxStatusLine()}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-semibold text-ink">
                  Foreign contributions
                </dt>
                <dd className="text-body text-slate-600">
                  {foreignContributionLine()}
                </dd>
              </div>
            </dl>
          </section>
        </Container>
      </Section>

      {/* How the trust is run */}
      <Section tone="cloud" aria-labelledby="run-heading">
        <Container>
          <SectionIntro
            id="run-heading"
            eyebrow="How it works"
            title="How the trust is run"
            lead="These rules come from the trust deed. Because the trust is new, they describe what the deed requires rather than a record of past practice."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
            <article className="flex flex-col gap-3 rounded-l border border-line bg-paper p-6 sm:p-8">
              <h3 className="font-display text-h3 font-semibold text-ink">
                A public charitable trust
              </h3>
              <p className="text-body text-slate-600">
                {site.shortName} is a public charitable trust. It is
                non-political, non-religious, not-for-profit and irrevocable:
                once made, the trust cannot be taken back by the people who set
                it up.
              </p>
            </article>

            <article className="flex flex-col gap-3 rounded-l border border-line bg-paper p-6 sm:p-8">
              <h3 className="font-display text-h3 font-semibold text-ink">
                The Board of Trustees
              </h3>
              <p className="text-body text-slate-600">
                The trust is managed by a Board of between seven and fifteen
                trustees. The first Board has {trusteeCount} Founder Trustees.
              </p>
              <TextLink href="/about/trustees">Meet the trustees</TextLink>
            </article>

            <article className="flex flex-col gap-3 rounded-l border border-line bg-paper p-6 sm:p-8">
              <h3 className="font-display text-h3 font-semibold text-ink">
                Office bearers
              </h3>
              <p className="text-body text-slate-600">
                The Board elects its office bearers from among the trustees, for
                terms of two years:
              </p>
              <ul className="flex flex-col gap-1.5 text-body text-slate-600">
                {officeBearers.map((role) => (
                  <li key={role} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] size-1.5 shrink-0 rounded-pill bg-indigo"
                    />
                    {role}
                  </li>
                ))}
              </ul>
              {!elected && (
                <p className="text-body text-slate-600">
                  The first office bearers will be elected at the first Board
                  meeting after registration. Until then, no trustee holds a
                  title.
                </p>
              )}
            </article>

            <article className="flex flex-col gap-3 rounded-l border border-line bg-paper p-6 sm:p-8">
              <h3 className="font-display text-h3 font-semibold text-ink">
                Honorary trustees
              </h3>
              <p className="text-body text-slate-600">
                Trustees are honorary. They receive no payment for acting as
                trustees.
              </p>
            </article>

            <article className="flex flex-col gap-3 rounded-l border border-line bg-paper p-6 sm:p-8">
              <h3 className="font-display text-h3 font-semibold text-ink">
                Meetings
              </h3>
              <p className="text-body text-slate-600">
                The Board meets at least once every quarter.
              </p>
            </article>

            <article className="flex flex-col gap-3 rounded-l border border-line bg-paper p-6 sm:p-8">
              <h3 className="font-display text-h3 font-semibold text-ink">
                Audit and annual report
              </h3>
              <p className="text-body text-slate-600">
                The accounts must be audited every year by a Chartered
                Accountant, and the Board adopts an annual report. The financial
                year runs from 1 April to 31 March.
              </p>
            </article>

            <article className="flex flex-col gap-3 rounded-l border border-line bg-paper p-6 sm:p-8">
              <h3 className="font-display text-h3 font-semibold text-ink">
                Members and the Board
              </h3>
              <p className="text-body text-slate-600">
                Membership gives no share in the trust&apos;s funds and no right
                to manage the trust or to vote, unless bye-laws later provide
                otherwise. The Board may set up chapters in other states and
                cities, Special Interest Groups and advisory councils.
              </p>
            </article>

            <article className="flex flex-col gap-3 rounded-l border border-line bg-paper p-6 sm:p-8">
              <h3 className="font-display text-h3 font-semibold text-ink">
                If the trust is dissolved
              </h3>
              <p className="text-body text-slate-600">
                Its assets pass to a similar charitable institution. They can
                never go to the trustees or the members.
              </p>
            </article>
          </div>
        </Container>
      </Section>

      {/* Principles */}
      <Section tone="ink" aria-labelledby="principles-heading">
        <Container>
          <SectionIntro
            id="principles-heading"
            eyebrow="Principles"
            title="Ten principles that bind the trust"
            lead="The trust deed commits ASSOCADS to these principles in everything it does."
          />
          <ol className="grid gap-x-12 gap-y-8 md:grid-cols-2">
            {principles().map((principle, index) => (
              <li
                key={principle.title}
                className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-t border-tone-line pt-6"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-body font-medium text-indigo-bright"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display text-h3 font-semibold text-paper">
                    {principle.title}
                  </h3>
                  <p className="text-body text-slate-400">{principle.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Documents */}
      <Section tone="paper" aria-labelledby="documents-heading">
        <Container>
          <SectionIntro
            id="documents-heading"
            eyebrow="Documents"
            title="Documents"
            lead="We will publish these documents here as they become available."
          />
          <ul className="border-t border-line">
            {documents.map((doc) => (
              <li
                key={doc.file}
                className="flex flex-col gap-3 border-b border-line py-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
              >
                <div className="flex gap-4">
                  <Icon
                    icon={FileText}
                    size={24}
                    className="mt-0.5 text-slate-500"
                  />
                  <div className="flex flex-col gap-1">
                    {doc.available ? (
                      <a
                        href={doc.file}
                        className="font-display text-h3 font-semibold text-indigo underline-offset-4 hover:underline"
                      >
                        {doc.title}
                        <span className="sr-only"> (PDF)</span>
                      </a>
                    ) : (
                      <h3 className="font-display text-h3 font-semibold text-ink">
                        {doc.title}
                      </h3>
                    )}
                    <p className="text-body text-slate-600">
                      {doc.description}
                    </p>
                  </div>
                </div>
                <div className="pl-10 sm:shrink-0 sm:pl-0">
                  {doc.available && doc.date ? (
                    <span className="text-small text-slate-600">
                      {formatDate(doc.date)}
                    </span>
                  ) : (
                    <Tag variant="neutral">To be published</Tag>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Questions page="/about/governance" />
      <AboutLinks current="/about/governance" />
      <CallToAction />
    </>
  );
}
