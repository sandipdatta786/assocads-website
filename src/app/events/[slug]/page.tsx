import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarPlus, ExternalLink, MapPin } from "lucide-react";
import { EventPhase } from "@/components/events/EventPhase";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { Prose } from "@/components/ui/Typography";
import { site } from "@/config/site";
import { bySlug, getEvents } from "@/lib/content/loaders";
import { loadMdxBody } from "@/lib/content/mdx";
import { builtAt } from "@/lib/clock";
import {
  formatDateRange,
  formatShortDate,
  formatTimeRange,
  hasTime,
  icsFile,
  mapLink,
  modeLabels,
  typeLabels,
} from "@/lib/events";
import { pageMetadata } from "@/lib/seo/metadata";

/* Drafts are included here so that the route always has one path to prerender;
   the page itself returns "not found" for a draft in production. */
export function generateStaticParams() {
  return getEvents({ includeDrafts: true }).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/events/[slug]">): Promise<Metadata> {
  const event = bySlug(getEvents(), (await params).slug);
  if (!event) return {};
  return {
    ...pageMetadata({
      title: event.title,
      description: event.summary,
      path: `/events/${event.slug}`,
    }),
    ...(event.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

const attendance = {
  "in-person": "https://schema.org/OfflineEventAttendanceMode",
  online: "https://schema.org/OnlineEventAttendanceMode",
  hybrid: "https://schema.org/MixedEventAttendanceMode",
} as const;

export default async function EventPage({
  params,
}: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = bySlug(getEvents(), slug);
  if (!event) notFound();

  const now = await builtAt();
  const pageUrl = `${site.url}/events/${event.slug}`;
  const host = new URL(site.url).host;
  const Body = event.body.trim()
    ? await loadMdxBody("events", event.slug)
    : null;
  const time = formatTimeRange(event);
  const inPerson = event.mode !== "online";
  const map = inPerson ? mapLink(event.venue, event.city, event.mapUrl) : null;
  const ics = `data:text/calendar;charset=utf-8,${encodeURIComponent(
    icsFile(event, pageUrl, host),
  )}`;
  const register = event.registrationUrl
    ? { href: event.registrationUrl, external: true }
    : { href: "/contact", external: false };
  const share = [
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${event.title} ${pageUrl}`)}`,
    },
    {
      label: "X",
      href: `https://x.com/intent/post?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(event.title)}`,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(`${event.summary}\n\n${pageUrl}`)}`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: attendance[event.mode],
    location: [
      ...(inPerson
        ? [
            {
              "@type": "Place",
              name: event.venue,
              address: {
                "@type": "PostalAddress",
                addressLocality: event.city,
                addressCountry: "IN",
              },
            },
          ]
        : []),
      ...(event.mode !== "in-person"
        ? [
            {
              "@type": "VirtualLocation",
              url: event.registrationUrl || pageUrl,
            },
          ]
        : []),
    ],
    organizer: { "@type": "NGO", name: site.name, url: site.url },
    url: pageUrl,
    ...(event.registrationUrl
      ? {
          offers: {
            "@type": "Offer",
            url: event.registrationUrl,
            ...(event.registrationOpens
              ? { validFrom: event.registrationOpens }
              : {}),
          },
        }
      : {}),
    ...(event.speakers.length > 0
      ? {
          performer: event.speakers.map((s) => ({
            "@type": "Person",
            name: s.name,
          })),
        }
      : {}),
  };

  const registerButton = (
    <ButtonLink
      href={register.href}
      size="large"
      {...(register.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {register.external ? "Register" : "Contact us to register"}
      {register.external && (
        <ExternalLink aria-hidden="true" size={18} strokeWidth={1.5} />
      )}
      {register.external && (
        <span className="sr-only">(opens in a new tab)</span>
      )}
    </ButtonLink>
  );
  const opensText = event.registrationOpens
    ? `Registration opens on ${formatShortDate(event.registrationOpens)}.`
    : "Registration opens soon.";

  return (
    <>
      {!event.draft && (
        <script
          type="application/ld+json"
          // JSON-LD for search engines, built only from this event's own fields.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <PageHeader
        eyebrow={`${typeLabels[event.type]} · ${modeLabels[event.mode]}`}
        title={event.title}
        lead={event.summary}
        actions={
          <div className="flex flex-col items-start gap-4">
            <EventStatusBadge event={event} builtAt={now} />
            <EventPhase
              event={event}
              builtAt={now}
              open={registerButton}
              soon={<p className="text-body text-slate-600">{opensText}</p>}
            />
          </div>
        }
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: event.title },
        ]}
      />

      {event.draft && (
        <Container className="-mt-6 pb-10">
          <Callout variant="status" title="Draft">
            <p>
              This event is a draft. It is visible only on a local copy of the
              site and never on the live site.
            </p>
          </Callout>
        </Container>
      )}

      {/* After the event */}
      <EventPhase
        event={event}
        builtAt={now}
        past={
          <Section tone="ink" aria-labelledby="recap-heading">
            <Container className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <p className="font-mono text-eyebrow font-medium text-tone-faint uppercase">
                  Took place {formatShortDate(event.startDate)}
                </p>
                <h2
                  id="recap-heading"
                  className="font-display text-h2 font-semibold text-tone-fg"
                >
                  This event has taken place
                </h2>
                {event.recap?.summary ? (
                  <p className="max-w-[68ch] text-body text-slate-400">
                    {event.recap.summary}
                  </p>
                ) : (
                  <p className="max-w-[68ch] text-body text-slate-400">
                    A summary of the event, with photographs and slides, will be
                    added here.
                  </p>
                )}
              </div>
              {event.recap && event.recap.photos.length > 0 && (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {event.recap.photos.map((photo) => (
                    <li
                      key={photo.src}
                      className="relative aspect-[4/3] overflow-hidden rounded-m"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              )}
              {event.recap?.slidesUrl && (
                <div>
                  <ButtonLink
                    href={event.recap.slidesUrl}
                    variant="secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View the slides
                    <span className="sr-only">(opens in a new tab)</span>
                  </ButtonLink>
                </div>
              )}
            </Container>
          </Section>
        }
      />

      {/* Key facts */}
      <Section tone="cloud" aria-labelledby="details-heading">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <h2
              id="details-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              When and where
            </h2>
            <dl className="flex flex-col divide-y divide-line border-y border-line">
              {[
                ["Date", formatDateRange(event)],
                ...(time ? [["Time", time]] : []),
                ["Format", modeLabels[event.mode]],
                ...(inPerson
                  ? [["Venue", [event.venue, event.city].join(", ")]]
                  : []),
              ].map(([term, detail]) => (
                <div
                  key={term}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6"
                >
                  <dt className="w-24 shrink-0 text-small font-semibold text-ink">
                    {term}
                  </dt>
                  <dd className="text-body text-slate-600">{detail}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3">
              {map && (
                <a
                  href={map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 font-medium text-indigo underline-offset-4 hover:underline"
                >
                  <MapPin aria-hidden="true" size={18} strokeWidth={1.5} />
                  Open the venue in a map
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              <EventPhase
                event={event}
                builtAt={now}
                open={<CalendarLink href={ics} slug={event.slug} />}
                soon={<CalendarLink href={ics} slug={event.slug} />}
                closed={<CalendarLink href={ics} slug={event.slug} />}
              />
            </div>
            {!hasTime(event.startDate) && (
              <p className="text-small text-slate-600">
                Times will be added when they are confirmed. All times are in
                Indian Standard Time.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-6 lg:col-span-7">
            {Body ? (
              <Prose>
                <Body />
              </Prose>
            ) : (
              <p className="text-body text-slate-600">{event.summary}</p>
            )}
          </div>
        </Container>
      </Section>

      {/* Agenda */}
      {event.agenda.length > 0 && (
        <Section tone="paper" aria-labelledby="agenda-heading">
          <Container>
            <SectionIntro
              id="agenda-heading"
              title="Agenda"
              lead="All times are in Indian Standard Time."
            />
            <ol className="flex flex-col border-t border-line">
              {event.agenda.map((item) => (
                <li
                  key={`${item.time}-${item.title}`}
                  className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:gap-8"
                >
                  <span className="w-40 shrink-0 font-mono text-small font-medium text-indigo">
                    {item.time}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-display text-body font-semibold text-ink">
                      {item.title}
                    </span>
                    {item.detail && (
                      <span className="text-body text-slate-600">
                        {item.detail}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      )}

      {/* Speakers */}
      {event.speakers.length > 0 && (
        <Section
          tone={event.agenda.length > 0 ? "cloud" : "paper"}
          aria-labelledby="speakers-heading"
        >
          <Container>
            <SectionIntro id="speakers-heading" title="Speakers" />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {event.speakers.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center gap-4 rounded-m border border-line bg-paper p-5"
                >
                  <Avatar
                    name={s.name}
                    photo={s.photoConsent ? s.photo : null}
                    size={64}
                    decorative
                  />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-display text-body font-semibold text-ink">
                      {s.name}
                    </span>
                    {(s.role || s.organisation) && (
                      <span className="text-small text-slate-600">
                        {[s.role, s.organisation].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Register and share */}
      <Section tone="tint" aria-labelledby="register-heading">
        <Container className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-2xl flex-col gap-4">
            <h2
              id="register-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              <EventPhase
                event={event}
                builtAt={now}
                open="Take part"
                soon="Registration opens soon"
                closed="Registration has closed"
                past="Missed this one?"
              />
            </h2>
            <p className="text-body text-slate-600">
              <EventPhase
                event={event}
                builtAt={now}
                open={
                  register.external
                    ? "Registration is handled on another site. The button opens it in a new tab."
                    : "Tell us you would like to attend, and we will reply with the details."
                }
                soon={opensText}
                closed="You can still contact us with questions about this event."
                past="Register your interest to hear about future events."
              />
            </p>
            <EventPhase
              event={event}
              builtAt={now}
              open={<div>{registerButton}</div>}
              past={
                <div>
                  <TextLink href="/events">See all events</TextLink>
                </div>
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-small font-semibold text-ink">
              Share this event
            </p>
            <ul className="flex flex-wrap gap-2">
              {share.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.label === "Email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center rounded-pill border border-ink px-4 text-small font-medium text-ink transition-colors duration-150 hover:bg-ink hover:text-paper"
                  >
                    {s.label}
                    {s.label !== "Email" && (
                      <span className="sr-only"> (opens in a new tab)</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}

function CalendarLink({ href, slug }: { href: string; slug: string }) {
  return (
    <a
      href={href}
      download={`${slug}.ics`}
      className="inline-flex min-h-11 items-center gap-2 font-medium text-indigo underline-offset-4 hover:underline"
    >
      <CalendarPlus aria-hidden="true" size={18} strokeWidth={1.5} />
      Add to calendar
    </a>
  );
}
