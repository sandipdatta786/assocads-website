import type { Metadata } from "next";
import {
  CalendarClock,
  Handshake,
  Lightbulb,
  Mic,
  Network,
  Users,
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
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import {
  formIds,
  innovationAreas,
  innovationHelp,
  innovationStages,
  innovatorRoles,
} from "@/lib/enquiries";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Showcase your idea",
  description:
    "Submit an idea, innovation or prototype to ASSOCADS. We plan to offer mentoring, industry introductions and Pitch Days. ASSOCADS does not invest.",
  path: "/innovation",
});

const FORM_ID = formIds.innovation;

const plans: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Users,
    title: "Mentoring",
    text: "We plan to connect innovators with experienced practitioners, including trustees and members, who give their time to help an idea become a working prototype.",
  },
  {
    icon: Network,
    title: "Industry connections",
    text: "We plan to introduce innovators to organisations that work on similar problems, but only with the agreement of both sides.",
  },
  {
    icon: Handshake,
    title: "Introductions to investors",
    text: "We plan to introduce ready ideas to investors who have agreed to hear pitches. An introduction is not an investment, and we cannot promise one.",
  },
  {
    icon: Mic,
    title: "Pitch days",
    text: "We plan to hold ASSOCADS Innovation Pitch Days from time to time, where selected ideas are presented to a panel and an audience.",
  },
];

const steps = [
  "Send us a short description of your idea, with a link if you have one.",
  "Our secretariat reads each submission and replies to you.",
  "If there is a good fit for what we can offer, we talk with you about the next steps.",
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="Showcase your idea"
        lead={`Students, researchers, startups and entrepreneurs can bring their ideas, innovations and prototypes to ${site.shortName}, the ${site.name}. Tell us what you are building. We plan to help with mentoring, industry connections and introductions, and to hold ASSOCADS Innovation Pitch Days from time to time.`}
        actions={
          <ButtonLink href={`#${FORM_ID}`} size="large">
            Submit your idea
          </ButtonLink>
        }
        breadcrumbs={[{ label: "Showcase your idea" }]}
      />

      <Section tone="paper" spacing="none" className="pb-12 lg:pb-16">
        <Container className="flex flex-col gap-10">
          <Callout title="What this is, and what it is not">
            <p>
              {site.shortName} does not invest, does not fund ideas, and cannot
              promise an introduction to anyone. Sending an idea costs nothing,
              and we will not share the details publicly without asking you
              first. Everything described here is a plan, and some of it may
              change.
            </p>
          </Callout>
        </Container>
      </Section>

      <Section tone="cloud" aria-labelledby="plans-heading">
        <Container>
          <SectionIntro
            id="plans-heading"
            eyebrow="What we plan to offer"
            title="Help to take an idea further"
            lead="Each of these is something we plan to build. We will say on the page when one is running."
          />
          <ul className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {plans.map((plan) => (
              <li
                key={plan.title}
                className="flex flex-col gap-4 rounded-m border border-line bg-paper p-6 sm:p-8"
              >
                <Icon icon={plan.icon} size={28} className="text-indigo" />
                <h3 className="font-display text-h3 font-semibold text-ink">
                  {plan.title}
                </h3>
                <p className="text-body text-slate-600">{plan.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="pitch-heading">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Icon icon={CalendarClock} size={28} className="text-indigo" />
            <h2
              id="pitch-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              ASSOCADS Innovation Pitch Days
            </h2>
            <p className="text-body text-slate-600">
              We plan to hold these pitch days periodically. Each one would give
              a few selected innovators a few minutes to present, followed by
              questions from a panel. No date has been set yet. When a pitch day
              is confirmed, it will be listed on the events page with its date,
              place and how to apply.
            </p>
            <TextLink href="/events">See announced events</TextLink>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-h2 font-semibold text-ink">
              How a submission is handled
            </h2>
            <ol className="flex list-decimal flex-col gap-3 pl-5 text-body text-slate-600">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="text-small text-slate-600">
              Your details are used only to reply to you and to discuss your
              idea. Read the{" "}
              <Link href="/legal/privacy" className="underline">
                privacy notice
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="cloud" aria-labelledby="submit-heading">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <Icon icon={Lightbulb} size={28} className="text-indigo" />
            <h2
              id="submit-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              Submit your idea
            </h2>
            <p className="text-body text-slate-600">
              Tell us about the idea in a few sentences. You do not need a
              company, a prototype or a plan to send one. Fields marked optional
              can be left blank.
            </p>
          </div>

          <div id={FORM_ID} className="scroll-mt-24">
            <EnquiryForm
              formId={FORM_ID}
              kind="innovation"
              consent="reply to me about my idea and, only if I ask for them, discuss introductions and a pitch day"
              submitLabel="Send my idea"
              successText="Thank you. We have received your idea and will reply. Nothing has been shared publicly."
              successSteps={[
                "We have emailed you a short acknowledgement. If it has not arrived, look in your spam folder.",
                "We read your idea and reply by email, perhaps with a few questions about it.",
                "We will not share the details publicly without asking you first.",
                "Introductions and a pitch day are discussed only if you asked for them.",
              ]}
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
                  kind: "select",
                  name: "role",
                  label: "I am",
                  options: [...innovatorRoles],
                  width: "half",
                },
                {
                  kind: "text",
                  name: "organisation",
                  label: "Organisation or college",
                  autoComplete: "organization",
                  width: "half",
                  optional: true,
                },
                {
                  kind: "text",
                  name: "title",
                  label: "A short name for the idea",
                  hint: "For example, a tool that helps farmers plan irrigation.",
                },
                {
                  kind: "select",
                  name: "area",
                  label: "The area it is closest to",
                  options: [...innovationAreas],
                  width: "half",
                },
                {
                  kind: "select",
                  name: "stage",
                  label: "How far it has got",
                  options: [...innovationStages],
                  width: "half",
                },
                {
                  kind: "textarea",
                  name: "summary",
                  label: "Describe the idea",
                  hint: "What problem it solves, who it is for, and what you have done so far.",
                  rows: 6,
                },
                {
                  kind: "text",
                  name: "link",
                  label: "A link to more about it",
                  hint: "Optional. A website, demo, video or document, starting with https://",
                  optional: true,
                  autoComplete: "url",
                },
                {
                  kind: "checks",
                  name: "help",
                  label: "What would help you most?",
                  hint: "Choose all that apply. These are requests, not promises.",
                  options: [...innovationHelp],
                  optional: true,
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CallToAction
        title="Not ready to submit yet?"
        text="Our events and programmes cover the skills an idea needs. Register your interest and we will tell you when the first pitch day is announced."
        primary={{ label: "Register your interest", href: "/membership/apply" }}
        secondary={{ label: "See events", href: "/events" }}
      />
    </>
  );
}
