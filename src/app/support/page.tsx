import type { Metadata } from "next";
import {
  ArrowRight,
  Building,
  FileCheck2,
  Globe,
  Handshake,
  HandHeart,
  Mic,
  Percent,
  ReceiptText,
  ShieldAlert,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
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
import {
  canMentionTaxExemption,
  donationStatusLine,
  site,
} from "@/config/site";
import { formIds, supportOffers } from "@/lib/enquiries";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Support ASSOCADS",
  description:
    "How you can help ASSOCADS now by volunteering, offering a venue, mentoring or pledging support, and what it can and cannot accept before registration.",
  path: "/support",
});

const FORM_ID = formIds.support;

type Way = {
  icon: LucideIcon;
  title: string;
  text: string;
  /** The offer to pre-fill in the form, or a page to go to instead. */
  offer?: (typeof supportOffers)[number]["value"];
  href?: string;
  action: string;
};

const ways: Way[] = [
  {
    icon: Users,
    title: "Volunteer",
    text: "Help us organise events, write and review guides, or build our community.",
    offer: "volunteer",
    action: "Offer to volunteer",
  },
  {
    icon: Building,
    title: "Offer a venue",
    text: "A room for a workshop, meetup or hackathon in Kolkata or elsewhere in West Bengal.",
    offer: "venue",
    action: "Offer a venue",
  },
  {
    icon: Mic,
    title: "Speak or mentor",
    text: "Share what you know at an event, or guide students and early-career professionals.",
    offer: "speak",
    action: "Offer to speak or mentor",
  },
  {
    icon: Handshake,
    title: "Introduce a partner",
    text: "Know a college, company or public body that should work with us? Point them to our partnership page.",
    href: "/partner",
    action: "How partnerships work",
  },
  {
    icon: HandHeart,
    title: "Pledge support",
    text: "Tell us what you would like to give or sponsor once giving opens. Nothing is paid now.",
    offer: "pledge",
    action: "Make a pledge",
  },
];

/* What funds would be used for: the programme areas drawn from the trust's objects. */
const uses = [
  "Training, workshops and events for students and professionals",
  "Research, publications and free public guides",
  "Responsible AI and AI for social good",
  "Special Interest Groups, chapters and campus groups",
  "Support for startups and innovation",
];

const actionClass =
  "inline-flex min-h-11 items-center gap-1.5 text-small font-medium text-indigo underline-offset-4 hover:underline";

export default function Page() {
  const status = donationStatusLine();
  const taxLine = canMentionTaxExemption("eightyG")
    ? `${site.shortName} holds approval under section 80G of the Income Tax Act, so eligible donations made in India qualify for a tax deduction.`
    : "Donations to ASSOCADS do not currently qualify for a tax deduction.";
  const foreignLine = site.legal.fcraRegistered
    ? `${site.shortName} holds registration under the Foreign Contribution (Regulation) Act, 2010, and can accept foreign contributions within its terms.`
    : `${site.shortName} cannot accept contributions from foreign sources until it holds registration or prior permission under the Foreign Contribution (Regulation) Act, 2010.`;

  const goodToKnow: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: Percent, title: "Tax", text: taxLine },
    { icon: Globe, title: "Foreign contributions", text: foreignLine },
    {
      icon: ReceiptText,
      title: "Receipts",
      text: "Every contribution will be acknowledged in writing.",
    },
    {
      icon: FileCheck2,
      title: "Accounts",
      text: "The trust's accounts are to be audited every year by a Chartered Accountant, and we will publish the audited accounts here every year.",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="Support ASSOCADS"
        lead={`${status ? `${status} ` : ""}You can help ${site.shortName}, the ${site.name}, now by volunteering, offering a venue, mentoring or pledging support for later. This page explains each way to help, and what the trust can and cannot accept.`}
        actions={
          <ButtonLink href={`#${FORM_ID}`} size="large">
            Pledge or sponsor
          </ButtonLink>
        }
        breadcrumbs={[{ label: "Support ASSOCADS" }]}
      />

      {status && (
        <Container className="pb-12 lg:pb-16">
          <Callout variant="status" title="Not accepting donations yet">
            <p>{status}</p>
          </Callout>
        </Container>
      )}

      {/* Why support matters */}
      <Section tone="cloud" aria-labelledby="why-heading">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-5 lg:col-span-6">
            <SectionIntro
              id="why-heading"
              eyebrow="Why support matters"
              title="Every rupee for the trust's objects"
              stacked
            />
            <p className="text-body text-slate-600">
              {site.shortName} is a not-for-profit public charitable trust. Its
              income and property may be used solely for the objects in its
              trust deed: building skills, research and good practice in AI and
              Data Science, for the benefit of the public.
            </p>
            <p className="text-body text-slate-600">
              Trustees are honorary and receive no payment for acting as
              trustees. If the trust were ever dissolved, its assets would pass
              to a similar charitable institution, never to trustees or members.
            </p>
            <TextLink href="/about/governance" className="w-fit">
              How the trust is run
            </TextLink>
          </div>
          <div className="flex flex-col gap-4 rounded-l bg-paper p-6 sm:p-8 lg:col-span-6">
            <h3 className="font-display text-h3 font-semibold text-ink">
              What funds would be used for
            </h3>
            <p className="text-body text-slate-600">
              Once giving opens, support would go to the programmes we plan,
              such as:
            </p>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-body text-ink marker:text-indigo">
              {uses.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
            <TextLink href="/programmes" className="w-fit">
              See the programmes
            </TextLink>
          </div>
        </Container>
      </Section>

      {/* Ways to help now */}
      <Section tone="paper" aria-labelledby="ways-heading">
        <Container>
          <SectionIntro
            id="ways-heading"
            eyebrow="Ways to help now"
            title="You can help before giving opens"
            lead="Time, space and knowledge matter as much as money while a new trust gets started."
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {ways.map((w) => (
              <li key={w.title}>
                <article className="flex h-full flex-col gap-3 rounded-l border border-line bg-paper p-6">
                  <Icon icon={w.icon} size={28} className="text-indigo" />
                  <h3 className="font-display text-h3 font-semibold text-ink">
                    {w.title}
                  </h3>
                  <p className="text-body text-slate-600">{w.text}</p>
                  <div className="mt-auto pt-2">
                    {w.offer ? (
                      <PrefillLink
                        formId={FORM_ID}
                        field="offer"
                        value={w.offer}
                        className={actionClass}
                      >
                        {w.action}
                        <ArrowRight
                          aria-hidden="true"
                          size={16}
                          strokeWidth={1.5}
                        />
                      </PrefillLink>
                    ) : (
                      <Link href={w.href ?? "/"} className={actionClass}>
                        {w.action}
                        <ArrowRight
                          aria-hidden="true"
                          size={16}
                          strokeWidth={1.5}
                        />
                      </Link>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Pledge or sponsor form */}
      <Section
        tone="cloud"
        id={FORM_ID}
        aria-labelledby="pledge-heading"
        className="scroll-mt-20"
      >
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionIntro
              id="pledge-heading"
              eyebrow="Tell us"
              title="Pledge or sponsor"
              lead="Tell us how you would like to help. A pledge is not a payment: nothing is paid and no payment details are asked for."
              stacked
            />
          </div>
          <div
            data-theme="light"
            className="rounded-l bg-paper p-6 sm:p-10 lg:col-span-8"
          >
            <EnquiryForm
              formId={FORM_ID}
              kind="support"
              consent="reply to me about my offer and tell me when giving opens"
              submitLabel="Send my offer"
              successText="Thank you. We have noted your offer and will be in touch."
              successSteps={[
                "We have emailed you a short acknowledgement. If it has not arrived, look in your spam folder.",
                "A pledge is not a payment. Nothing is paid now, and no payment details are needed.",
                "We will write to you when giving opens, and you decide then.",
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
                  kind: "text",
                  name: "organisation",
                  label: "Organisation",
                  autoComplete: "organization",
                  width: "half",
                  optional: true,
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
                  kind: "choice",
                  name: "offer",
                  label: "How would you like to help?",
                  options: [...supportOffers],
                  queryKey: "offer",
                  notes: {
                    pledge: {
                      text: "Tell us roughly what you would like to give. We will write to you when giving opens, and you decide then.",
                    },
                    sponsor: {
                      text: "Sponsorship is accepted only once giving opens. Tell us what you would like to sponsor and we will be in touch.",
                    },
                  },
                },
                {
                  kind: "textarea",
                  name: "message",
                  label: "Tell us more",
                  hint: "For a venue, say where it is and how many people it holds.",
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      {/* Good to know */}
      <Section tone="paper" aria-labelledby="know-heading">
        <Container>
          <SectionIntro
            id="know-heading"
            eyebrow="Before you give"
            title="Good to know"
          />
          <dl className="grid gap-x-12 gap-y-8 md:grid-cols-2">
            {goodToKnow.map((g) => (
              <div key={g.title} className="flex flex-col gap-1">
                <dt className="flex gap-4 font-display text-h3 font-semibold text-ink">
                  <Icon
                    icon={g.icon}
                    size={24}
                    className="mt-1 shrink-0 text-indigo"
                  />
                  {g.title}
                </dt>
                <dd className="pl-10 text-body text-slate-600">{g.text}</dd>
              </div>
            ))}
          </dl>
          {status && (
            <div className="mt-10 flex gap-4 rounded-l bg-cloud p-6">
              <Icon
                icon={ShieldAlert}
                size={24}
                className="mt-0.5 shrink-0 text-indigo"
              />
              <p className="text-body text-ink">
                {site.shortName} has no bank account for donations, payment link
                or QR code yet. If anyone asks you to pay money to{" "}
                {site.shortName}, please{" "}
                <Link
                  href="/contact"
                  className="font-medium text-indigo underline underline-offset-4"
                >
                  tell us
                </Link>
                .
              </p>
            </div>
          )}
        </Container>
      </Section>

      <Questions page="/support" title="Questions about support" />
    </>
  );
}
