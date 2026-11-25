import type { Metadata } from "next";
import { Briefcase, GraduationCap, Handshake, Users } from "lucide-react";
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
import { getOpportunities } from "@/lib/content/loaders";
import {
  careerHelp,
  formIds,
  mentoringAreas,
  mentorshipRoles,
} from "@/lib/enquiries";
import { builtAt } from "@/lib/clock";
import { pageMetadata } from "@/lib/seo/metadata";
import { formatLongDate } from "@/lib/publishing";

export const metadata: Metadata = pageMetadata({
  title: "Mentorship and career opportunities",
  description:
    "ASSOCADS plans to connect experienced professionals with students and early-career people for mentoring, career guidance, internships and jobs.",
  path: "/mentorship",
});

const FORM_ID = formIds.mentorship;

const typeNames: Record<string, string> = {
  internship: "Internship",
  job: "Job",
  fellowship: "Fellowship",
  volunteering: "Volunteering",
  "industry-interaction": "Industry interaction",
};

const steps = [
  "Mentors and mentees each sign up, using the form on this page.",
  "Our secretariat reviews each sign-up and suggests a match by hand, based on the areas and what each person asked for.",
  "Both sides agree before any contact details are shared.",
  "Mentoring is voluntary and unpaid. ASSOCADS does not take part in the conversations between mentors and mentees.",
];

const interactions =
  "We plan to arrange talks, panel discussions and visits, where students can meet people working in AI, data science and analytics. None has been scheduled yet. Confirmed ones will appear on the events page.";

export default async function Page() {
  const now = await builtAt();
  const opportunities = getOpportunities({ now });

  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="Mentorship and career opportunities"
        lead={`${site.shortName}, the ${site.name}, plans to connect experienced professionals with students and early-career people for mentoring, career guidance, internships, jobs and industry interactions. ${site.shortName} does not hire people or place them in jobs, and cannot promise any match or opportunity.`}
        actions={
          <ButtonLink href={`#${FORM_ID}`} size="large">
            Sign up
          </ButtonLink>
        }
        breadcrumbs={[{ label: "Mentorship and careers" }]}
      />

      <Section tone="paper" spacing="none" className="pb-12 lg:pb-16">
        <Container>
          <Callout title="Please read before signing up">
            <p>
              Mentoring and careers advice on this page come from people who
              give their time. Use your own judgement about any offer, check
              every opportunity with the organisation that lists it, and keep
              contact on professional channels. If you are under 18, please ask
              a parent or guardian to send the form with you.
            </p>
          </Callout>
        </Container>
      </Section>

      <Section tone="cloud" aria-labelledby="how-heading">
        <Container>
          <SectionIntro
            id="how-heading"
            eyebrow="What we plan to do"
            title="How we plan to connect people"
          />
          <ol className="grid list-decimal gap-4 pl-5 text-body text-slate-600 md:grid-cols-2 lg:gap-6">
            {steps.map((step) => (
              <li
                key={step}
                className="rounded-m border border-line bg-paper p-6 pl-2"
              >
                {step}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="opportunities-heading">
        <Container className="flex flex-col gap-8">
          <SectionIntro
            id="opportunities-heading"
            eyebrow="Open opportunities"
            title="Internships, jobs and fellowships"
            lead="Each opportunity is listed with the permission of the organisation that offers it, and is removed after its deadline."
          />
          {opportunities.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2 lg:gap-6">
              {opportunities.map((o) => (
                <li
                  key={o.slug}
                  className="flex flex-col gap-3 rounded-m border border-line bg-paper p-6 sm:p-8"
                >
                  <p className="font-mono text-eyebrow font-medium text-slate-600 uppercase">
                    {typeNames[o.type]} · {o.organisation}
                  </p>
                  <h3 className="font-display text-h3 font-semibold text-ink">
                    {o.title}
                  </h3>
                  <p className="text-body text-slate-600">{o.summary}</p>
                  <p className="text-small text-slate-600">
                    {o.location} ·{" "}
                    {o.mode === "in-person"
                      ? "In person"
                      : o.mode === "online"
                        ? "Online"
                        : "Hybrid"}
                    {o.deadline
                      ? ` · Apply by ${formatLongDate(o.deadline)}`
                      : ""}
                  </p>
                  <a
                    href={o.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex min-h-11 w-fit items-center font-medium text-tone-link underline-offset-4 hover:underline"
                  >
                    Apply with {o.organisation}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-4 rounded-l border border-line bg-cloud p-8 sm:p-10">
              <Icon icon={Briefcase} size={28} className="text-indigo" />
              <h3 className="font-display text-h3 font-semibold text-ink">
                No opportunities have been listed yet
              </h3>
              <p className="max-w-2xl text-body text-slate-600">
                Organisations that would like to offer an internship, job,
                fellowship or industry interaction can contact us. Each listing
                is published only with the organisation&rsquo;s written
                permission.
              </p>
              <TextLink href="/contact">
                Contact us about an opportunity
              </TextLink>
            </div>
          )}
        </Container>
      </Section>

      <Section tone="cloud" aria-labelledby="interactions-heading">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Icon icon={Users} size={28} className="text-indigo" />
            <h2
              id="interactions-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              Industry interactions
            </h2>
            <p className="text-body text-slate-600">{interactions}</p>
            <TextLink href="/events">See announced events</TextLink>
          </div>
          <div className="flex flex-col gap-4">
            <Icon icon={Handshake} size={28} className="text-indigo" />
            <h2 className="font-display text-h2 font-semibold text-ink">
              Mentors and organisations
            </h2>
            <p className="text-body text-slate-600">
              If you would like to mentor, or your organisation would like to
              offer an internship or an industry interaction, sign up below or
              write to us through the contact page.
            </p>
            <TextLink href="/partner">Partner with us</TextLink>
          </div>
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="signup-heading">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <Icon icon={GraduationCap} size={28} className="text-indigo" />
            <h2
              id="signup-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              Sign up for mentoring
            </h2>
            <p className="text-body text-slate-600">
              Tell us who you are and what you would like help with. Mentors can
              choose the areas they cover. Fields marked optional can be left
              blank.
            </p>
          </div>
          <div
            id={FORM_ID}
            data-theme="light"
            className="light-island scroll-mt-24"
          >
            <EnquiryForm
              formId={FORM_ID}
              kind="mentorship"
              consent="reply to me about mentoring and careers, and share my details with a mentor or mentee only once I have agreed to the match"
              submitLabel="Send my sign-up"
              successText="Thank you. We have received your sign-up and will reply. We will not share your details until you have agreed to a match."
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
                  kind: "text",
                  name: "city",
                  label: "City",
                  autoComplete: "address-level2",
                  width: "half",
                },
                {
                  kind: "select",
                  name: "role",
                  label: "I am",
                  options: [...mentorshipRoles],
                  width: "full",
                },
                {
                  kind: "text",
                  name: "current",
                  label: "Course and year, or current role",
                  hint: "For example, MSc Statistics, second year, or Data analyst at a bank.",
                },
                {
                  kind: "text",
                  name: "organisation",
                  label: "Organisation or college",
                  autoComplete: "organization",
                  optional: true,
                },
                {
                  kind: "checks",
                  name: "areas",
                  label: "Areas",
                  hint: "Choose all that apply: what you can mentor in, or what you would like help with.",
                  options: [...mentoringAreas],
                },
                {
                  kind: "checks",
                  name: "help",
                  label: "What would help you most?",
                  hint: "Choose all that apply. These are requests, not promises.",
                  options: [...careerHelp],
                  optional: true,
                },
                {
                  kind: "textarea",
                  name: "message",
                  label: "Anything else we should know",
                  hint: "Optional. For example, how much time you can give each month.",
                  rows: 4,
                  optional: true,
                },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CallToAction
        title="Looking for something else?"
        text="You can also join the community, apply for a pitch day or register your interest in membership."
        primary={{ label: "Showcase your idea", href: "/innovation" }}
        secondary={{
          label: "Register your interest",
          href: "/membership/apply",
        }}
      />
    </>
  );
}
