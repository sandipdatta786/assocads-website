import type { Metadata } from "next";
import {
  BookOpen,
  Briefcase,
  FlaskConical,
  Handshake,
  Lightbulb,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Callout } from "@/components/ui/Callout";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";
import {
  collaborationAreas,
  collaboratorTypes,
  formIds,
} from "@/lib/enquiries";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Industry and academic collaboration",
  description:
    "ASSOCADS invites companies, universities and research organisations to plan workshops, research, training and industry projects together.",
  path: "/collaborate",
});

const FORM_ID = formIds.collaboration;

const types: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Presentation,
    title: "Workshops and seminars",
    text: "We plan to run workshops and seminars with companies and academic institutions on topics such as applied machine learning, analytics and responsible AI.",
  },
  {
    icon: BookOpen,
    title: "Training and certification",
    text: "We plan to design training with industry and faculty, so that students and professionals build the skills that employers ask for.",
  },
  {
    icon: FlaskConical,
    title: "Research and publications",
    text: "We plan to invite joint research, white papers and case studies. Every contributor is credited, and how results are shared is agreed in advance.",
  },
  {
    icon: Lightbulb,
    title: "Innovation and pitch days",
    text: "We plan to bring industry problem statements to innovators, and to invite industry judges to ASSOCADS Innovation Pitch Days.",
  },
  {
    icon: Briefcase,
    title: "Industry projects",
    text: "We plan to offer students and researchers real problems from industry, with a clear scope, supervision and a defined end.",
  },
];

const steps = [
  "You send us a short outline of what you have in mind, using the form on this page.",
  "Our secretariat reads it and replies, and we agree whether it fits what ASSOCADS can offer.",
  "We agree the scope, the people involved, the timing and who covers what, in a written agreement.",
  "Only after both sides have signed off do we name the organisations involved or publish anything about the collaboration.",
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="Industry and academic collaboration"
        lead={`${site.shortName}, the ${site.name}, invites companies, technology firms, academic institutions and research organisations to work with us on workshops, research, innovation, training and industry projects. Our secretariat reads each proposal and replies to it. Every collaboration is agreed in writing before it starts.`}
        actions={
          <ButtonLink href={`#${FORM_ID}`} size="large">
            Propose a collaboration
          </ButtonLink>
        }
        breadcrumbs={[{ label: "Industry and academic collaboration" }]}
      />

      <Section tone="paper" spacing="none" className="pb-12 lg:pb-16">
        <Container>
          <Callout title="What this page is, and what it is not">
            <p>
              This page invites collaboration. It does not mean that any
              collaboration exists. No organisation is named as a partner,
              sponsor or supporter until it has given written permission, and no
              funding or payment is offered or implied here. Everything
              described on this page is a plan, and some of it may change.
            </p>
          </Callout>
        </Container>
      </Section>

      <Section tone="cloud" aria-labelledby="types-heading">
        <Container>
          <SectionIntro
            id="types-heading"
            eyebrow="What we plan to work on"
            title="Five ways to collaborate"
            lead="Each of these is an area we plan to build with partners. We will say on the page when one is running."
          />
          <ul className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {types.map((type) => (
              <li
                key={type.title}
                className="flex flex-col gap-4 rounded-m border border-line bg-paper p-6 sm:p-8"
              >
                <Icon icon={type.icon} size={28} className="text-indigo" />
                <h3 className="font-display text-h3 font-semibold text-ink">
                  {type.title}
                </h3>
                <p className="text-body text-slate-600">{type.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="steps-heading">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Icon icon={Handshake} size={28} className="text-indigo" />
            <h2
              id="steps-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              How a collaboration would be set up
            </h2>
            <p className="text-body text-slate-600">
              We plan to keep each collaboration small and clear. Nothing is
              final until a written agreement is signed by both sides.
            </p>
            <p className="text-small text-slate-600">
              Your details are used only to reply to you and to discuss your
              proposal. Read the{" "}
              <Link href="/legal/privacy" className="underline">
                privacy notice
              </Link>
              .
            </p>
          </div>
          <ol className="flex list-decimal flex-col gap-3 pl-5 text-body text-slate-600">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="cloud" aria-labelledby="propose-heading">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <Icon icon={Handshake} size={28} className="text-indigo" />
            <h2
              id="propose-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              Propose a collaboration
            </h2>
            <p className="text-body text-slate-600">
              Tell us who you are and what you have in mind. A few sentences are
              enough to start. Fields marked optional can be left blank.
            </p>
          </div>
          <div
            id={FORM_ID}
            data-theme="light"
            className="light-island scroll-mt-24"
          >
            <EnquiryForm
              formId={FORM_ID}
              kind="collaboration"
              consent="reply to me about a possible collaboration, and discuss it with me only if we both agree to take it further"
              submitLabel="Send my proposal"
              successText="Thank you. We have received your proposal and will reply. Nothing has been announced or agreed."
              fields={[
                {
                  kind: "text",
                  name: "name",
                  label: "Full name",
                  autoComplete: "name",
                  width: "half",
                },
                {
                  kind: "email",
                  name: "email",
                  label: "Work email address",
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
                  kind: "text",
                  name: "role",
                  label: "Your role or title",
                  autoComplete: "organization-title",
                  width: "half",
                },
                {
                  kind: "text",
                  name: "organisation",
                  label: "Organisation",
                  autoComplete: "organization",
                  width: "half",
                },
                {
                  kind: "select",
                  name: "type",
                  label: "Type of organisation",
                  options: [...collaboratorTypes],
                  width: "half",
                },
                {
                  kind: "checks",
                  name: "areas",
                  label: "What would you like to explore?",
                  hint: "Choose all that apply. These are starting points for a conversation, not commitments.",
                  options: [...collaborationAreas],
                },
                {
                  kind: "textarea",
                  name: "summary",
                  label: "Describe what you have in mind",
                  hint: "What you would like to do together, who it would reach and what you hope it would achieve.",
                  rows: 6,
                },
                {
                  kind: "text",
                  name: "link",
                  label: "A link to more about your organisation or the idea",
                  hint: "Optional. A website or document, starting with https://",
                  optional: true,
                  autoComplete: "url",
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CallToAction
        title="Looking for another way to take part?"
        text="Organisations can also offer internships and career opportunities, or join the community as members."
        primary={{ label: "Partner with us", href: "/partner" }}
        secondary={{
          label: "Mentorship and careers",
          href: "/mentorship",
        }}
      />
    </>
  );
}
