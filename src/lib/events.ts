/**
 * Event helpers shared by the server and the browser.
 * Every date is shown in Indian Standard Time. A date without a time
 * (YYYY-MM-DD) means the whole day in Kolkata.
 */

export type EventDates = {
  startDate: string;
  endDate?: string;
  registrationOpens?: string;
  registrationCloses?: string;
};

export type EventStatus = "open" | "soon" | "closed" | "past";

export const statusLabels: Record<EventStatus, string> = {
  open: "Registration open",
  soon: "Opening soon",
  closed: "Registration closed",
  past: "Past",
};

/** The Badge colour for each status. */
export const statusBadge = {
  open: "open",
  soon: "planned",
  closed: "closed",
  past: "closed",
} as const;

export const typeLabels = {
  conference: "Conference",
  seminar: "Seminar",
  workshop: "Workshop",
  masterclass: "Masterclass",
  meetup: "Meetup",
  hackathon: "Hackathon",
  webinar: "Webinar",
  ceremony: "Ceremony",
  "pitch-day": "Pitch day",
  other: "Event",
} as const;

export const modeLabels = {
  "in-person": "In person",
  online: "Online",
  hybrid: "Hybrid",
} as const;

const TZ = "Asia/Kolkata";
const IST = "+05:30";

export function hasTime(value: string): boolean {
  return value.includes("T");
}

/** The moment a value begins: midnight in Kolkata for a plain date. */
function startOf(value: string): number {
  return Date.parse(hasTime(value) ? value : `${value}T00:00:00${IST}`);
}

/** The moment a value ends: the last second of the day in Kolkata for a plain date. */
function endOf(value: string): number {
  return Date.parse(hasTime(value) ? value : `${value}T23:59:59${IST}`);
}

export function eventEnd(event: EventDates): number {
  return endOf(event.endDate ?? event.startDate);
}

export function isPast(event: EventDates, now: number): boolean {
  return now > eventEnd(event);
}

/** Worked out from the dates every time, so it can never go out of date. */
export function eventStatus(event: EventDates, now: number): EventStatus {
  if (isPast(event, now)) return "past";
  const closes = event.registrationCloses
    ? endOf(event.registrationCloses)
    : startOf(event.startDate);
  if (now > closes) return "closed";
  if (event.registrationOpens && now < startOf(event.registrationOpens)) {
    return "soon";
  }
  return "open";
}

function parts(value: string) {
  return new Date(startOf(value));
}

const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: TZ, ...options });

export function dayOfMonth(value: string): string {
  return fmt({ day: "numeric" }).format(parts(value));
}

export function monthShort(value: string): string {
  return fmt({ month: "short" }).format(parts(value));
}

export function formatDate(value: string): string {
  return fmt({
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parts(value));
}

export function formatShortDate(value: string): string {
  return fmt({ day: "numeric", month: "long", year: "numeric" }).format(
    parts(value),
  );
}

export function formatTime(value: string): string {
  return fmt({ hour: "numeric", minute: "2-digit", hour12: true })
    .format(parts(value))
    .toLowerCase();
}

/** "Saturday 20 March 2027", or a range for events over several days. */
export function formatDateRange(event: EventDates): string {
  const end = event.endDate;
  if (!end || end.slice(0, 10) === event.startDate.slice(0, 10)) {
    return formatDate(event.startDate);
  }
  return `${formatShortDate(event.startDate)} to ${formatShortDate(end)}`;
}

/** "10:00 am to 1:00 pm IST", or null when no times are given. */
export function formatTimeRange(event: EventDates): string | null {
  if (!hasTime(event.startDate)) return null;
  const start = formatTime(event.startDate);
  const sameDay =
    event.endDate &&
    event.endDate.slice(0, 10) === event.startDate.slice(0, 10);
  if (event.endDate && hasTime(event.endDate) && sameDay) {
    return `${start} to ${formatTime(event.endDate)} IST`;
  }
  return `${start} IST`;
}

export function mapLink(venue: string, city: string, mapUrl?: string): string {
  if (mapUrl) return mapUrl;
  const query = encodeURIComponent([venue, city].filter(Boolean).join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/* ---------- Calendar file ---------- */

function icsStamp(ms: number): string {
  return new Date(ms)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function icsDate(value: string): string {
  return value.slice(0, 10).replace(/-/g, "");
}

function icsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/[,;]/g, (c) => `\\${c}`);
}

/** An iCalendar (.ics) file for one event, for "Add to calendar". */
export function icsFile(
  event: EventDates & {
    slug: string;
    title: string;
    summary: string;
    venue: string;
    city: string;
  },
  pageUrl: string,
  host: string,
): string {
  const timed = hasTime(event.startDate);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ASSOCADS//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.slug}@${host}`,
    `DTSTAMP:${icsStamp(startOf(event.startDate))}`,
  ];
  if (timed) {
    const end =
      event.endDate && hasTime(event.endDate)
        ? startOf(event.endDate)
        : startOf(event.startDate) + 2 * 60 * 60 * 1000;
    lines.push(
      `DTSTART:${icsStamp(startOf(event.startDate))}`,
      `DTEND:${icsStamp(end)}`,
    );
  } else {
    // All-day events end on the day after the last day.
    const last = new Date(
      `${(event.endDate ?? event.startDate).slice(0, 10)}T00:00:00Z`,
    );
    last.setUTCDate(last.getUTCDate() + 1);
    lines.push(
      `DTSTART;VALUE=DATE:${icsDate(event.startDate)}`,
      `DTEND;VALUE=DATE:${icsDate(last.toISOString())}`,
    );
  }
  const location = [event.venue, event.city].filter(Boolean).join(", ");
  lines.push(
    `SUMMARY:${icsText(event.title)}`,
    `DESCRIPTION:${icsText(`${event.summary}\n\n${pageUrl}`)}`,
    ...(location ? [`LOCATION:${icsText(location)}`] : []),
    `URL:${pageUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  );
  return lines.join("\r\n");
}
