import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { VoiceCard } from "@/components/voices/VoiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import { builtAt } from "@/lib/clock";
import { getEventsByTime, getInsights } from "@/lib/content/loaders";
import {
  formatDateRange,
  formatShortDate,
  modeLabels,
  typeLabels,
} from "@/lib/events";
import { formatLongDate, insightCategoryLabels } from "@/lib/publishing";
import { voiceItems } from "@/lib/voices";

/**
 * Latest updates and events: the next events, the newest announcements and
 * highlights from events that have taken place, each part shown only when it
 * has real content. With nothing published yet, an honest note instead.
 * Everything here comes from content/events and content/insights, which
 * admins edit at /admin. Cached for a day, because Cache Components does not
 * allow reading the clock while prerendering; the site rebuilds at least daily.
 */
export async function LatestUpdates() {
  "use cache";
  cacheLife("days");

  const now = await builtAt();
  const { upcoming, past } = getEventsByTime(new Date(now));
  const nextEvents = upcoming.slice(0, 3);
  const announcements = getInsights({ now }).slice(0, 3);
  const highlights = past
    .filter((e) => e.recap && e.recap.photos.length > 0)
    .slice(0, 3);

  const voices = (await voiceItems()).slice(0, 3);

  const empty =
    nextEvents.length === 0 &&
    announcements.length === 0 &&
    highlights.length === 0 &&
    voices.length === 0;

  return (
    <Section tone="cloud" aria-labelledby="latest-heading">
      <Container className="flex flex-col gap-12 lg:gap-16">
        <SectionIntro
          id="latest-heading"
          eyebrow="Latest"
          title="Latest updates and events"
          action={
            empty ? undefined : <TextLink href="/events">All events</TextLink>
          }
        />

        {empty && <NothingYet />}

        {nextEvents.length > 0 && (
          <Part id="latest-upcoming" title="Coming up">
            <ul className="grid gap-4 md:grid-cols-3 lg:gap-6">
              {nextEvents.map((event) => (
                <li key={event.slug}>
                  <Link
                    href={`/events/${event.slug}`}
                    className="card-link flex h-full flex-col gap-4 rounded-m border border-line bg-paper p-6 sm:p-8"
                  >
                    <EventStatusBadge
                      event={event}
                      builtAt={now}
                      className="w-fit"
                    />
                    <h4 className="font-display text-h3 font-semibold text-ink">
                      {event.title}
                    </h4>
                    <p className="text-body text-slate-600">
                      {typeLabels[event.type]} · {formatDateRange(event)} ·{" "}
                      {modeLabels[event.mode]}
                      {event.city ? `, ${event.city}` : ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Part>
        )}

        {announcements.length > 0 && (
          <Part
            id="latest-announcements"
            title="Announcements"
            action={<TextLink href="/insights">All news</TextLink>}
          >
            <ul className="grid gap-4 md:grid-cols-3 lg:gap-6">
              {announcements.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/insights/${item.slug}`}
                    className="card-link flex h-full flex-col gap-3 rounded-m border border-line bg-paper p-6 sm:p-8"
                  >
                    <p className="font-mono text-eyebrow font-medium text-slate-600 uppercase">
                      {insightCategoryLabels[item.category]} ·{" "}
                      <time dateTime={item.publishedDate}>
                        {formatLongDate(item.publishedDate)}
                      </time>
                    </p>
                    <h4 className="font-display text-h3 font-semibold text-ink">
                      {item.title}
                    </h4>
                    <p className="text-body text-slate-600">{item.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Part>
        )}

        {voices.length > 0 && (
          <Part
            id="latest-voices"
            title="Videos and podcasts"
            action={<TextLink href="/voices">All of ASSOCADS Voices</TextLink>}
          >
            <ul className="grid gap-4 md:grid-cols-3 lg:gap-6">
              {voices.map((item) => (
                <li key={item.key}>
                  <VoiceCard item={item} headingLevel={4} />
                </li>
              ))}
            </ul>
          </Part>
        )}

        {highlights.length > 0 && (
          <Part id="latest-highlights" title="Highlights from past events">
            <ul className="grid gap-4 md:grid-cols-3 lg:gap-6">
              {highlights.map((event) => {
                const photo = event.recap!.photos[0];
                return (
                  <li key={event.slug}>
                    <Link
                      href={`/events/${event.slug}`}
                      className="card-link flex h-full flex-col overflow-hidden rounded-m border border-line bg-paper"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2 p-6">
                        <h4 className="font-display text-h3 font-semibold text-ink">
                          {event.title}
                        </h4>
                        <p className="text-body text-slate-600">
                          {typeLabels[event.type]} · took place{" "}
                          {formatShortDate(event.startDate)}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Part>
        )}
      </Container>
    </Section>
  );
}

function Part({
  id,
  title,
  action,
  children,
}: {
  id: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 id={id} className="font-display text-h3 font-semibold text-ink">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function NothingYet() {
  return (
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
          No events, announcements or recordings yet
        </h3>
        <p className="text-body text-slate-600">
          We plan to announce our first programme calendar after the trust is
          registered. Upcoming events, news, videos, podcasts and highlights
          from past events will appear here. Register your interest and we will
          let you know.
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
  );
}
