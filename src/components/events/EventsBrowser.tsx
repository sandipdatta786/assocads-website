"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Tag";
import {
  dayOfMonth,
  eventStatus,
  formatDateRange,
  isPast,
  modeLabels,
  monthShort,
  statusBadge,
  statusLabels,
  typeLabels,
  type EventDates,
} from "@/lib/events";
import { setQuery, useQuery } from "@/lib/query";
import { FilterGroup } from "@/components/ui/FilterGroup";
import { useNow } from "./useNow";

export type EventListItem = EventDates & {
  slug: string;
  title: string;
  summary: string;
  type: keyof typeof typeLabels;
  mode: keyof typeof modeLabels;
  city: string;
};

/* ---------- Pieces ---------- */

function EventCard({ event, now }: { event: EventListItem; now: number }) {
  const status = eventStatus(event, now);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex h-full gap-5 rounded-l border border-line bg-paper p-5 transition-colors duration-150 hover:border-indigo sm:gap-6 sm:p-7"
    >
      <span
        aria-hidden="true"
        className="flex w-16 shrink-0 flex-col items-center justify-center self-start rounded-m bg-indigo-tint py-3 sm:w-20"
      >
        <span className="font-display text-h2 leading-none font-bold text-indigo-deep">
          {dayOfMonth(event.startDate)}
        </span>
        <span className="mt-1 font-mono text-eyebrow font-medium text-indigo-deep uppercase">
          {monthShort(event.startDate)}
        </span>
      </span>
      <span className="flex min-w-0 flex-col gap-3">
        <Badge
          status={statusBadge[status]}
          label={statusLabels[status]}
          className="w-fit"
        />
        <span className="font-display text-h3 font-semibold text-ink group-hover:text-indigo">
          {event.title}
        </span>
        <span className="text-small text-slate-600">
          <span className="sr-only">Date: </span>
          {formatDateRange(event)}
        </span>
        <span className="flex flex-wrap gap-x-2 text-small font-medium text-ink">
          <span>{typeLabels[event.type]}</span>
          <span aria-hidden="true">·</span>
          <span>{modeLabels[event.mode]}</span>
          {event.city && (
            <>
              <span aria-hidden="true">·</span>
              <span>{event.city}</span>
            </>
          )}
        </span>
      </span>
    </Link>
  );
}

/* ---------- The list ---------- */

export function EventsBrowser({
  events,
  builtAt,
}: {
  events: EventListItem[];
  builtAt: number;
}) {
  const now = useNow(builtAt);
  const query = useQuery();

  const typeOptions = Object.entries(typeLabels)
    .filter(([value]) => events.some((e) => e.type === value))
    .map(([value, label]) => ({
      value: value as EventListItem["type"],
      label,
    }));
  const modeOptions = Object.entries(modeLabels)
    .filter(([value]) => events.some((e) => e.mode === value))
    .map(([value, label]) => ({
      value: value as EventListItem["mode"],
      label,
    }));

  const typeParam = query.get("type");
  const modeParam = query.get("mode");
  const type = typeOptions.some((o) => o.value === typeParam)
    ? (typeParam as EventListItem["type"])
    : null;
  const mode = modeOptions.some((o) => o.value === modeParam)
    ? (modeParam as EventListItem["mode"])
    : null;

  const matching = events.filter(
    (e) => (!type || e.type === type) && (!mode || e.mode === mode),
  );
  const upcoming = matching.filter((e) => !isPast(e, now));
  const past = matching.filter((e) => isPast(e, now)).reverse();
  const filtered = type !== null || mode !== null;

  return (
    <div className="flex flex-col gap-14 lg:gap-20">
      <div className="flex flex-col gap-4 rounded-l bg-cloud p-5 sm:p-6">
        <FilterGroup
          label="Filter by type"
          allLabel="All types"
          options={typeOptions}
          value={type}
          onChange={(v) => setQuery("type", v)}
        />
        <FilterGroup
          label="Filter by format"
          allLabel="Any format"
          options={modeOptions}
          value={mode}
          onChange={(v) => setQuery("mode", v)}
        />
        <p aria-live="polite" className="text-small text-slate-600">
          {upcoming.length === 1
            ? "1 upcoming event"
            : `${upcoming.length} upcoming events`}
          {filtered
            ? upcoming.length === 1
              ? " matches your filters."
              : " match your filters."
            : "."}
          {filtered && (
            <>
              {" "}
              <button
                type="button"
                onClick={() => {
                  setQuery("type", null);
                  setQuery("mode", null);
                }}
                className="min-h-11 font-medium text-indigo underline underline-offset-4"
              >
                Clear filters
              </button>
            </>
          )}
        </p>
      </div>

      <section
        aria-labelledby="upcoming-heading"
        className="flex flex-col gap-6"
      >
        <h2
          id="upcoming-heading"
          className="font-display text-h2 font-semibold text-ink"
        >
          Upcoming events
        </h2>
        {upcoming.length > 0 ? (
          <ul className="grid gap-4 lg:grid-cols-2 lg:gap-6">
            {upcoming.map((e) => (
              <li key={e.slug}>
                <EventCard event={e} now={now} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body text-slate-600">
            {filtered
              ? "No upcoming events match these filters."
              : "No upcoming events have been announced."}
          </p>
        )}
      </section>

      {past.length > 0 && (
        <section aria-labelledby="past-heading" className="flex flex-col gap-6">
          <h2
            id="past-heading"
            className="font-display text-h2 font-semibold text-ink"
          >
            Past events
          </h2>
          <ul className="flex flex-col border-t border-line">
            {past.map((e) => (
              <li key={e.slug} className="border-b border-line">
                <Link
                  href={`/events/${e.slug}`}
                  className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="w-44 shrink-0 text-small text-slate-600">
                    {formatDateRange(e)}
                  </span>
                  <span className="font-display text-body font-semibold text-ink group-hover:text-indigo group-hover:underline">
                    {e.title}
                  </span>
                  <span className="text-small text-slate-600 sm:ml-auto">
                    {typeLabels[e.type]} · {modeLabels[e.mode]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
