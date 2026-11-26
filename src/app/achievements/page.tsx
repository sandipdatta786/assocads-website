import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  FlaskConical,
  Flag,
  GraduationCap,
  Handshake,
  Rocket,
  Users,
  type LucideIcon,
} from "lucide-react";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { WithPlaceholders } from "@/components/ui/WithPlaceholders";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { site, legalStatusLine } from "@/config/site";
import {
  getEventsByTime,
  getImpactFigures,
  getMilestones,
} from "@/lib/content/loaders";
import { impactCategories } from "@/lib/content/schemas";
import { builtAt } from "@/lib/clock";
import { pageMetadata } from "@/lib/seo/metadata";
import { formatLongDate, todayInKolkata } from "@/lib/publishing";

export const metadata: Metadata = pageMetadata({
  title: "Achievements and impact",
  description:
    "What ASSOCADS has counted so far: events held, milestones, members, professionals trained, startups and research. Only confirmed figures are shown.",
  path: "/achievements",
});

/** What to say for each counted category until a figure is confirmed. */
const pending: Record<
  (typeof impactCategories)[number]["value"],
  { icon: LucideIcon; text: string }
> = {
  members: {
    icon: Users,
    text: "Membership opens after the trust is registered. Figures will appear here after that.",
  },
  trained: {
    icon: GraduationCap,
    text: "Training is planned. A count will appear once sessions have been held and attendance has been recorded.",
  },
  startups: {
    icon: Rocket,
    text: "Support for startups is planned. A count will appear once support has been given and recorded.",
  },
  research: {
    icon: FlaskConical,
    text: "Our first research reports are planned, and each will be reviewed by a trustee before it is published.",
  },
  collaborations: {
    icon: Handshake,
    text: "Collaborations are invited, and no organisation is named without its written permission.",
  },
};

const number = (n: number) => n.toLocaleString("en-IN");

export default async function Page() {
  const now = await builtAt();
  const { past } = getEventsByTime(new Date(now));
  const figures = getImpactFigures();
  const milestones = getMilestones();

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Achievements and impact"
        lead={`${site.shortName}, the ${site.name}, shows here its milestones and the work it has counted: events, members, professionals trained, startups, research and industry collaborations. Each figure appears only once it has been confirmed, dated and explained, and nothing is estimated.`}
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Achievements and impact" },
        ]}
      />

      <Section tone="paper" spacing="none" className="pb-12 lg:pb-16">
        <Container>
          <Callout title="Read this first">
            <p>
              {site.shortName} was founded in {site.foundingYear} and is new.{" "}
              {legalStatusLine()} Much of its work is still planned, and the{" "}
              <Link href="/about/roadmap" className="underline">
                roadmap
              </Link>{" "}
              says what is planned. This page shows only what has happened. It
              contains no estimates, targets or figures from other
              organisations.
            </p>
          </Callout>
        </Container>
      </Section>

      <Section tone="cloud" aria-labelledby="counted-heading">
        <Container className="flex flex-col gap-8">
          <SectionIntro
            id="counted-heading"
            eyebrow="Counted so far"
            title="Figures and what they measure"
            lead="Events are counted from our events list once they have ended. Every other figure is confirmed by a Founder Trustee, and shows the date it is correct as at and how it was counted."
          />
          <ul className="grid gap-4 md:grid-cols-2 lg:gap-6">
            <li className="flex flex-col gap-3 rounded-m border border-line bg-paper p-6 sm:p-8">
              <Icon icon={CalendarDays} size={28} className="text-indigo" />
              <h3 className="font-display text-h3 font-semibold text-ink">
                Events conducted
              </h3>
              {past.length > 0 ? (
                <p className="font-display text-h2 font-semibold text-ink">
                  {number(past.length)}
                </p>
              ) : (
                <p className="text-body text-slate-600">
                  No events have ended yet.
                </p>
              )}
              <p className="text-small text-slate-600">
                Counted as at {formatLongDate(todayInKolkata(now))} from the
                events that have ended.
              </p>
            </li>
            {impactCategories.map((category) => {
              const figure = figures.find((f) => f.category === category.value);
              const fallback = pending[category.value];
              return (
                <li
                  key={category.value}
                  className="flex flex-col gap-3 rounded-m border border-line bg-paper p-6 sm:p-8"
                >
                  <Icon
                    icon={fallback.icon}
                    size={28}
                    className="text-indigo"
                  />
                  <h3 className="font-display text-h3 font-semibold text-ink">
                    {category.label}
                  </h3>
                  {figure ? (
                    <>
                      <p className="font-display text-h2 font-semibold text-ink">
                        {number(figure.value)}
                      </p>
                      <p className="text-small text-slate-600">
                        Correct as at {formatLongDate(figure.asOf)}. Counted by:{" "}
                        {figure.method}. Confirmed by {figure.confirmedBy}.
                      </p>
                    </>
                  ) : (
                    <p className="text-body text-slate-600">{fallback.text}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section tone="paper" aria-labelledby="milestones-heading">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <Icon icon={Flag} size={28} className="text-indigo" />
            <h2
              id="milestones-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              Milestones
            </h2>
            <p className="text-body text-slate-600">
              A milestone is something that has happened, with its date. Plans
              belong on the roadmap.
            </p>
            <TextLink href="/about/roadmap">See the roadmap</TextLink>
          </div>
          {milestones.length > 0 ? (
            <ol className="flex flex-col gap-4 border-l-2 border-line pl-6">
              {milestones.map((m) => (
                <li
                  key={`${m.date}-${m.title}`}
                  className="flex flex-col gap-1"
                >
                  <p className="font-mono text-eyebrow font-medium text-slate-600 uppercase">
                    {m.date}
                  </p>
                  <h3 className="font-display text-h3 font-semibold text-ink">
                    {m.title}
                  </h3>
                  <p className="text-body text-slate-600">{m.text}</p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="rounded-l border border-line bg-cloud p-8 text-body text-slate-600">
              <WithPlaceholders text="No milestones have been confirmed yet. [PLACEHOLDER: dated milestones confirmed by the founders, for example the date the trust deed was signed and the date of the first public launch]" />
            </div>
          )}
        </Container>
      </Section>

      <Section tone="cloud" aria-labelledby="next-heading">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Icon icon={Handshake} size={28} className="text-indigo" />
            <h2
              id="next-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              Where to see more
            </h2>
            <p className="text-body text-slate-600">
              Research and articles are published in the Knowledge Hub once a
              trustee has reviewed them. Organisations that would like to work
              with us can get in touch through our partner page.
            </p>
          </div>
          <ul className="flex flex-col gap-3 text-body">
            <li>
              <TextLink href="/knowledge-hub">Knowledge Hub</TextLink>
            </li>
            <li>
              <TextLink href="/events">Events</TextLink>
            </li>
            <li>
              <TextLink href="/partner">Partner with us</TextLink>
            </li>
            <li>
              <TextLink href="/about/roadmap">Roadmap</TextLink>
            </li>
          </ul>
        </Container>
      </Section>

      <CallToAction
        title="Help us build an honest record"
        text="Register your interest in membership, or get in touch about working together, and we will tell you as the work is counted."
        primary={{ label: "Register your interest", href: "/membership/apply" }}
        secondary={{ label: "Partner with us", href: "/partner" }}
      />
    </>
  );
}
