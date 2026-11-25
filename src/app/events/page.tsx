import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { EventsBrowser } from "@/components/events/EventsBrowser";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { isRegistered, site } from "@/config/site";
import { getEvents } from "@/lib/content/loaders";
import { builtAt } from "@/lib/clock";
import { pageMetadata } from "@/lib/seo/metadata";
import { relatedWithContent } from "@/lib/related";

export const metadata: Metadata = pageMetadata({
  title: "Events",
  description:
    "ASSOCADS conferences, workshops, masterclasses, meetups and hackathons in AI and Data Science, in Kolkata and online. Upcoming and past events.",
  path: "/events",
});

export default async function Page() {
  const now = await builtAt();
  const events = getEvents().map((e) => ({
    slug: e.slug,
    title: e.title,
    summary: e.summary,
    type: e.type,
    mode: e.mode,
    city: e.city,
    startDate: e.startDate,
    endDate: e.endDate,
    registrationOpens: e.registrationOpens,
    registrationCloses: e.registrationCloses,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Events"
        lead={`${site.shortName} plans to hold conferences, workshops, masterclasses, meetups and hackathons that bring students, professionals, researchers and industry together, beginning in West Bengal. An event is listed here only once it is confirmed, with its own page giving the date, the place and how to register.`}
        breadcrumbs={[{ label: "Events" }]}
      />

      <Section tone="paper" spacing="none" className="pb-16 lg:pb-28">
        <Container>
          {events.length > 0 ? (
            <EventsBrowser events={events} builtAt={now} />
          ) : (
            <EmptyState
              icon={CalendarDays}
              title={
                isRegistered()
                  ? "Our first programme calendar will be announced soon"
                  : "Our first programme calendar will be announced after registration"
              }
              actions={
                <>
                  <ButtonLink href={site.joinLink.href} size="large">
                    Register your interest
                  </ButtonLink>
                  <TextLink href="/programmes/events-and-community">
                    Events and community programme
                  </TextLink>
                </>
              }
              related={relatedWithContent(
                ["programmes", "guides", "glossary"],
                now,
              )}
            >
              <p>
                No events have been announced yet. Register your interest and we
                will tell you when the first ones are published.
              </p>
            </EmptyState>
          )}
        </Container>
      </Section>

      <CallToAction
        title="Host or sponsor an event with us"
        text="If your college, company or organisation would like to host, sponsor or bring a real problem to an ASSOCADS event, tell us."
        primary={{ label: "Partner with us", href: "/partner" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
