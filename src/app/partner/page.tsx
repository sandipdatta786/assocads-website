import type { Metadata } from "next";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  HeartHandshake,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { EnquiryForm, PrefillLink } from "@/components/forms/EnquiryForm";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import { formIds, organisationTypes, partnershipAreas } from "@/lib/enquiries";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Partner with us",
  description:
    "How universities, companies, startups, government bodies and non-profits could work with ASSOCADS on AI and Data Science skills, research and public good.",
  path: "/partner",
});

const FORM_ID = formIds.partner;

type PartnerType = {
  type: (typeof organisationTypes)[number]["value"];
  icon: LucideIcon;
  title: string;
  lead: string;
  could: string[];
  /** Numbers of the trust deed's objects this draws on, in /about/objects. */
  objects: number[];
};

/* What a partnership could involve, drawn from the objects of the trust deed
   (docs/BLUEPRINT.md, section 7.2). Worded as possibilities, not offers. */
const partnerTypes: PartnerType[] = [
  {
    type: "academic",
    icon: GraduationCap,
    title: "Academic institutions",
    lead: "Universities, colleges and research institutes that teach or research AI and Data Science.",
    could: [
      "Workshops, guest sessions and faculty development programmes",
      "Internships, mentoring and career guidance for students",
      "Joint research, case studies and publications",
      "A campus group for students and faculty",
      "Shared labs, libraries or a Centre of Excellence",
    ],
    objects: [2, 3, 4, 5],
  },
  {
    type: "company",
    icon: Building2,
    title: "Companies and startups",
    lead: "Employers, technology firms and new ventures that build or use AI and data.",
    could: [
      "Industry-led training and certification",
      "Hackathons, meetups and other events",
      "Internships and apprenticeships",
      "Mentoring, investor engagement and market access for startups",
      "Training and advice through Special Interest Groups by industry",
    ],
    objects: [2, 4, 7, 14],
  },
  {
    type: "government",
    icon: Landmark,
    title: "Government bodies",
    lead: "Departments, agencies and public institutions at state and national level.",
    could: [
      "Capacity building in AI and data for public servants",
      "Input on policies, standards and frameworks",
      "AI for social good in healthcare, agriculture, education and governance",
      "Promoting responsible and trustworthy AI",
    ],
    objects: [2, 6, 10, 12],
  },
  {
    type: "community",
    icon: HeartHandshake,
    title: "Community and non-profit organisations",
    lead: "Charities, foundations, societies and open communities working for public good.",
    could: [
      "AI for social good projects, such as in accessibility, rural development or climate resilience",
      "Open-source and community-driven initiatives",
      "Co-hosted meetups, workshops and learning programmes",
      "Bringing more people into AI and Data Science, without discrimination",
    ],
    objects: [1, 11, 12],
  },
];

const steps = [
  {
    title: "Conversation",
    text: "Tell us what you have in mind. We talk about what each side hopes for, and whether it fits the trust's objects.",
  },
  {
    title: "Proposal",
    text: "We put the scope, responsibilities, timing and any costs in writing, so that both sides can review them.",
  },
  {
    title: "Written agreement",
    text: "The partnership begins when a written agreement has been approved by the Board of Trustees and signed.",
  },
];

/* From the principles that bind the trust (docs/BLUEPRINT.md, section 7.3). */
const principles = [
  "Not-for-profit, and only for the trust's objects",
  "Conflict-of-interest rules",
  "Responsible AI",
  "Data protection",
  "Proper approvals",
];

function objectsText(numbers: number[]): string {
  const list =
    numbers.length > 1
      ? `${numbers.slice(0, -1).join(", ")} and ${numbers.at(-1)}`
      : String(numbers[0]);
  return `Based on ${numbers.length > 1 ? "objects" : "object"} ${list} of the trust deed`;
}

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="Partner with us"
        lead={`${site.shortName}, the ${site.name}, wants to work with universities, companies, government bodies and community organisations to build skills, research and good practice in AI and Data Science, beginning in West Bengal. No partnership has been agreed yet. Each one will be shaped with the partner, and no organisation is named here without its written permission.`}
        actions={
          <ButtonLink href={`#${FORM_ID}`} size="large">
            Start a conversation
          </ButtonLink>
        }
        breadcrumbs={[{ label: "Partner with us" }]}
      />

      {/* Who we would like to work with */}
      <Section tone="cloud" aria-labelledby="types-heading">
        <Container>
          <SectionIntro
            id="types-heading"
            eyebrow="Who we would like to work with"
            title="What a partnership could involve"
            lead="These are the kinds of work the trust deed sets out. Each partnership is shaped with the partner, so treat them as starting points."
          />
          <ul className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {partnerTypes.map((p) => (
              <li key={p.type}>
                <article
                  aria-labelledby={`type-${p.type}`}
                  className="flex h-full flex-col gap-4 rounded-l border border-line bg-paper p-6 sm:p-8"
                >
                  <Icon icon={p.icon} size={32} className="text-indigo" />
                  <div className="flex flex-col gap-2">
                    <h3
                      id={`type-${p.type}`}
                      className="font-display text-h3 font-semibold text-ink"
                    >
                      {p.title}
                    </h3>
                    <p className="text-body text-slate-600">{p.lead}</p>
                  </div>
                  <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body text-ink marker:text-indigo">
                    {p.could.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <p className="text-small text-slate-600">
                    {objectsText(p.objects)}.{" "}
                    <TextLink href="/about/objects" className="text-small">
                      Read the objects
                    </TextLink>
                  </p>
                  <div className="mt-auto pt-2">
                    <PrefillLink
                      formId={FORM_ID}
                      field="type"
                      value={p.type}
                      className="inline-flex min-h-11 items-center gap-1.5 text-small font-medium text-indigo underline-offset-4 hover:underline"
                    >
                      Start a conversation
                      <span className="sr-only">
                        {" "}
                        as {p.title.toLowerCase()}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        size={16}
                        strokeWidth={1.5}
                      />
                    </PrefillLink>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* How partnerships work */}
      <Section tone="paper" aria-labelledby="how-heading">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <SectionIntro
              id="how-heading"
              eyebrow="Step by step"
              title="How partnerships work"
              stacked
            />
            <ol className="flex flex-col gap-6">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-5">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-indigo-tint font-mono text-body font-medium text-indigo-deep"
                  >
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1 pt-1.5">
                    <h3 className="font-display text-h3 font-semibold text-ink">
                      {s.title}
                    </h3>
                    <p className="text-body text-slate-600">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Callout title="We name partners only with a written agreement">
              <p>
                {site.shortName} lists an organisation as a partner on this site
                only after a written agreement approved by the Board is in
                place. We do not name, or show the logo of, any organisation we
                are only talking to.
              </p>
            </Callout>
            <div className="flex flex-col gap-3 rounded-l border border-line p-6">
              <h3 className="font-display text-h3 font-semibold text-ink">
                The principles every partnership follows
              </h3>
              <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body text-slate-600 marker:text-indigo">
                {principles.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <TextLink href="/about/governance" className="w-fit">
                How the trust is run
              </TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* Enquiry form */}
      <Section
        tone="cloud"
        id={FORM_ID}
        aria-labelledby="enquiry-heading"
        className="scroll-mt-20"
      >
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionIntro
              id="enquiry-heading"
              eyebrow="Start a conversation"
              title="Partnership enquiry"
              lead="Tell us who you are and what you would like to explore. We will reply to arrange a first conversation."
              stacked
            />
          </div>
          <div
            data-theme="light"
            className="rounded-l bg-paper p-6 sm:p-10 lg:col-span-8"
          >
            <EnquiryForm
              formId={FORM_ID}
              kind="partner"
              consent="reply to my enquiry and discuss a partnership"
              submitLabel="Send enquiry"
              successText="We have received your enquiry and will reply to arrange a first conversation."
              fields={[
                {
                  kind: "text",
                  name: "name",
                  label: "Full name",
                  autoComplete: "name",
                  width: "half",
                },
                {
                  kind: "text",
                  name: "role",
                  label: "Your role",
                  autoComplete: "organization-title",
                  width: "half",
                },
                {
                  kind: "text",
                  name: "organisation",
                  label: "Organisation",
                  autoComplete: "organization",
                },
                {
                  kind: "select",
                  name: "type",
                  label: "Type of organisation",
                  options: [...organisationTypes],
                  queryKey: "type",
                },
                {
                  kind: "email",
                  name: "email",
                  label: "Email address",
                  autoComplete: "email",
                  width: "half",
                },
                {
                  kind: "tel",
                  name: "phone",
                  label: "Phone number",
                  autoComplete: "tel",
                  width: "half",
                  optional: true,
                },
                {
                  kind: "checks",
                  name: "areas",
                  label: "What would you like to explore?",
                  hint: "Choose all that apply.",
                  options: partnershipAreas,
                },
                {
                  kind: "textarea",
                  name: "message",
                  label: "Message",
                  hint: "What you have in mind, and any timing that matters.",
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      <Questions
        page="/partner"
        title="Questions about partnerships"
        tone="paper"
      />

      <Section tone="tint" spacing="tight">
        <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body text-ink">
            Institutions and companies can also become organisational members.
          </p>
          <TextLink href="/membership#organisations">
            Organisational membership
          </TextLink>
        </Container>
      </Section>
    </>
  );
}
