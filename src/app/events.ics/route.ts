import { site } from "@/config/site";
import { getEvents } from "@/lib/content/loaders";
import { icsCalendar } from "@/lib/events";

/**
 * /events.ics: a calendar of every published event that people can
 * subscribe to (webcal://) in Google Calendar, Apple Calendar or Outlook.
 * Drafts are never included. Built with the site, like /feed.xml, so it
 * changes when an event is published, moved or cancelled.
 */
export async function GET() {
  const ics = icsCalendar(getEvents(), {
    name: `${site.shortName} events`,
    description: `Events from ${site.shortName}, the ${site.name}. Each event is listed only once it is confirmed.`,
    baseUrl: site.url,
  });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="assocads-events.ics"',
    },
  });
}
