import { cacheLife } from "next/cache";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import { getEventsByTime } from "@/lib/content/loaders";
import { builtAt } from "@/lib/clock";
import { formatDateRange, modeLabels } from "@/lib/events";

/**
 * The next three events, or an honest note when none have been announced.
 * Cached for a day, because Cache Components does not allow reading the clock
 * while prerendering; past events drop off at the next refresh.
 */
export async function WhatsNext() {
  "use cache";
  cacheLife("days");

  const now = await builtAt();
  const upcoming = getEventsByTime(new Date(now)).upcoming.slice(0, 3);

  return (
    <Section tone="cloud" aria-labelledby="next-heading">
      <Container>
        <SectionIntro
          id="next-heading"
          eyebrow="What is next"
          title="Events and programmes"
          action={
            upcoming.length > 0 ? (
              <TextLink href="/events">All events</TextLink>
            ) : undefined
          }
        />

        {upcoming.length > 0 ? (
          <ul className="grid gap-4 md:grid-cols-3 lg:gap-6">
            {upcoming.map((event) => (
              <li key={event.slug}>
                <Link
                  href={`/events/${event.slug}`}
                  className="flex h-full flex-col gap-4 rounded-m border border-line bg-paper p-6 transition-colors duration-150 hover:border-indigo sm:p-8"
                >
                  <EventStatusBadge
                    event={event}
                    builtAt={now}
                    className="w-fit"
                  />
                  <h3 className="font-display text-h3 font-semibold text-ink">
                    {event.title}
                  </h3>
                  <p className="text-body text-slate-600">
                    {formatDateRange(event)} · {modeLabels[event.mode]}
                    {event.city ? `, ${event.city}` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-l border border-line bg-paper p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 -z-10 w-1/2 [mask-image:linear-gradient(to_right,transparent,black)] opacity-60"
            >
              <DotGrid />
            </div>
            <div className="flex max-w-xl flex-col gap-4">
              <Icon icon={CalendarDays} size={32} className="text-indigo" />
              <h3 className="font-display text-h3 font-semibold text-ink">
                No events have been announced yet
              </h3>
              <p className="text-body text-slate-600">
                We plan to announce our first programme calendar after the trust
                is registered. Register your interest and we will let you know
                when it is published.
              </p>
            </div>
            <ButtonLink
              href={site.joinLink.href}
              size="large"
              className="w-fit shrink-0"
            >
              Register your interest
            </ButtonLink>
          </div>
        )}
      </Container>
    </Section>
  );
}
