import type { Metadata } from "next";
import type { ReactNode } from "react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import {
  isPlaceholderValue,
  placeholderNeed,
  site,
  socialLinks,
} from "@/config/site";
import { contactTopicNotes, contactTopics, formIds } from "@/lib/enquiries";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { contactPage } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata({
  title: "Contact ASSOCADS",
  description:
    "Contact ASSOCADS, the Association for AI and Data Science in Kolkata, about membership, partnerships, events or media. We route each message by topic.",
  path: "/contact",
});

const FORM_ID = formIds.contact;

const linkClass =
  "font-medium break-words text-indigo underline underline-offset-4";

/** A setting shown as a link, or as a visible placeholder while it is missing. */
function setting(value: string, href?: (v: string) => string): ReactNode {
  if (isPlaceholderValue(value))
    return <Placeholder needed={placeholderNeed(value)} />;
  return href ? (
    <a href={href(value)} className={linkClass}>
      {value}
    </a>
  ) : (
    value
  );
}

const networkNames: Record<string, string> = {
  linkedin: "LinkedIn",
  youtube: "YouTube",
  x: "X",
  instagram: "Instagram",
  github: "GitHub",
};

export default function Page() {
  const { contact, location, legal } = site;
  const social = socialLinks();

  const details: { term: string; value: ReactNode }[] = [
    { term: "Email", value: setting(contact.email, (v) => `mailto:${v}`) },
    {
      term: "Phone",
      value: setting(contact.phone, (v) => `tel:${v.replace(/\s/g, "")}`),
    },
    { term: "We aim to reply", value: setting(contact.replyTime) },
    { term: "Based in", value: `${location.city}, ${location.state}` },
    { term: "Registered office", value: setting(legal.registeredOffice) },
    {
      term: "Requests about your personal data",
      value: setting(contact.dataProtectionEmail, (v) => `mailto:${v}`),
    },
  ];

  return (
    <>
      {/* The ContactPoint is on the organisation, emitted on every page. */}
      <JsonLd
        items={[
          contactPage({
            path: "/contact",
            name: "Contact us",
            description: String(metadata.description),
          }),
        ]}
      />
      <PageHeader
        eyebrow="Contact"
        title="Contact us"
        lead={`The quickest way to reach ${site.shortName}, the ${site.name}, is the form on this page. Choose what your message is about, such as membership, partnerships, events or the media, and it will go to the people who can answer it. The privacy notice explains how the details you send are used.`}
        breadcrumbs={[{ label: "Contact" }]}
      />

      <Section
        tone="cloud"
        aria-labelledby="contact-form-heading"
        id={FORM_ID}
        className="scroll-mt-20"
      >
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-8 lg:col-span-4">
            <section aria-labelledby="details-heading">
              <h2
                id="details-heading"
                className="mb-6 font-display text-h2 font-semibold text-ink"
              >
                Contact details
              </h2>
              <dl className="flex flex-col gap-5">
                {details.map((d) => (
                  <div key={d.term} className="flex flex-col gap-1">
                    <dt className="text-small font-medium text-slate-600">
                      {d.term}
                    </dt>
                    <dd className="text-body text-ink">{d.value}</dd>
                  </div>
                ))}
                {social.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-small font-medium text-slate-600">
                      Follow us
                    </dt>
                    <dd>
                      <ul className="flex flex-wrap gap-x-4 gap-y-1">
                        {social.map((s) => (
                          <li key={s.network}>
                            <a
                              href={s.url}
                              rel="me noopener"
                              className={linkClass}
                            >
                              {networkNames[s.network] ?? s.network}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </section>
            <p className="text-small text-slate-600">
              For an organisation that would like to work with us, the{" "}
              <TextLink href="/partner" className="text-small">
                partnership enquiry
              </TextLink>{" "}
              asks the questions we need to reply well.
            </p>
          </div>

          <div className="flex flex-col gap-6 rounded-l bg-paper p-6 sm:p-10 lg:col-span-8">
            <h2
              id="contact-form-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              Send us a message
            </h2>
            <EnquiryForm
              formId={FORM_ID}
              kind="contact"
              consent="reply to my message"
              submitLabel="Send message"
              successText="We have received your message and will reply by email."
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
                  name: "topic",
                  label: "What is it about?",
                  width: "half",
                  hint: "This decides who receives your message.",
                  options: [...contactTopics],
                  queryKey: "topic",
                  notes: contactTopicNotes,
                },
                {
                  kind: "textarea",
                  name: "message",
                  label: "Message",
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      <Questions
        page="/contact"
        title="Questions about contacting us"
        tone="paper"
      />
    </>
  );
}
