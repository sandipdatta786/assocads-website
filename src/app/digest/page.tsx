import type { Metadata } from "next";
import {
  Award,
  CalendarDays,
  Mail,
  Newspaper,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import { digestInterests, formIds } from "@/lib/enquiries";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "ASSOCADS AI Digest",
  description:
    "Subscribe to the ASSOCADS AI Digest, a monthly email with industry developments, upcoming events, member achievements and opportunities.",
  path: "/digest",
});

const FORM_ID = formIds.newsletter;

const sections: {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
  link: string;
}[] = [
  {
    icon: Newspaper,
    title: "Industry developments",
    text: "We plan to summarise recent developments in AI, data science and analytics, with links to the original sources and a note on what each means for our readers.",
    href: "/knowledge-hub",
    link: "Knowledge Hub",
  },
  {
    icon: CalendarDays,
    title: "Upcoming events",
    text: "We plan to list the confirmed events for the coming weeks, with their dates, places and how to register. Only announced events appear.",
    href: "/events",
    link: "Events",
  },
  {
    icon: Award,
    title: "Member achievements",
    text: "We plan to share achievements that members have agreed to have published. Nothing is included without the member's permission.",
    href: "/achievements",
    link: "Achievements and impact",
  },
  {
    icon: Briefcase,
    title: "Opportunities",
    text: "We plan to list internships, jobs, fellowships and volunteering that organisations have agreed to share with us, each with its deadline.",
    href: "/mentorship",
    link: "Mentorship and careers",
  },
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="ASSOCADS AI Digest"
        lead={`${site.shortName}, the ${site.name}, plans to send a monthly email digest with industry developments, upcoming events, member achievements and opportunities. Subscribing costs nothing, and you can ask to stop at any time. Each digest will explain how.`}
        actions={
          <ButtonLink href={`#${FORM_ID}`} size="large">
            Subscribe to the digest
          </ButtonLink>
        }
        breadcrumbs={[{ label: "AI Digest" }]}
      />

      <Section tone="paper" spacing="none" className="pb-12 lg:pb-16">
        <Container>
          <Callout title="What we will and will not send">
            <p>
              The digest will contain only confirmed facts, with sources where
              there are any. It will not carry advertising, and we will not
              share your address with anyone outside {site.shortName} without
              your written permission. We have not sent a digest yet. Every
              digest will explain how to stop receiving it.
            </p>
          </Callout>
        </Container>
      </Section>

      <Section tone="cloud" aria-labelledby="sections-heading">
        <Container>
          <SectionIntro
            id="sections-heading"
            eyebrow="What we plan to include"
            title="Four sections each month"
            lead="Each section draws on pages that already exist on this site, so you can read more about anything in the digest."
          />
          <ul className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {sections.map((s) => (
              <li
                key={s.title}
                className="flex flex-col gap-4 rounded-m border border-line bg-paper p-6 sm:p-8"
              >
                <Icon icon={s.icon} size={28} className="text-indigo" />
                <h3 className="font-display text-h3 font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="text-body text-slate-600">{s.text}</p>
                <TextLink href={s.href}>{s.link}</TextLink>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="subscribe-heading">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <Icon icon={Mail} size={28} className="text-indigo" />
            <h2
              id="subscribe-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              Subscribe
            </h2>
            <p className="text-body text-slate-600">
              Give us your email address and tell us which sections interest
              you. Your name is optional. Subscriptions are handled by our
              secretariat until we choose a mailing service, and we will tell
              you when that happens.
            </p>
          </div>
          <div id={FORM_ID} className="scroll-mt-24">
            <EnquiryForm
              formId={FORM_ID}
              kind="newsletter"
              consent="send me the ASSOCADS AI Digest by email, and I understand I can ask to stop at any time"
              submitLabel="Subscribe"
              successText="Thank you. You are subscribed. We will confirm by email when the first digest is ready."
              fields={[
                {
                  kind: "text",
                  name: "name",
                  label: "Name",
                  autoComplete: "name",
                  optional: true,
                },
                {
                  kind: "email",
                  name: "email",
                  label: "Email address",
                  autoComplete: "email",
                },
                {
                  kind: "checks",
                  name: "interests",
                  label: "What would you like to read about?",
                  hint: "Choose all that apply. You can leave this blank.",
                  options: [...digestInterests],
                  optional: true,
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CallToAction
        title="Want to take part more closely?"
        text="You can register your interest in membership, or get in touch about working with us."
        primary={{ label: "Register your interest", href: "/membership/apply" }}
        secondary={{ label: "Partner with us", href: "/partner" }}
      />
    </>
  );
}
