# How to add an event

Every event is one file in `content/events/`. The site builds the events page, the event's own page, its status badge, its calendar file and its place in the home page's "Latest updates and events" from that file. You never edit a page by hand.

**The easiest way is the admin editor at `/admin`**, which fills in this file for you and has every change reviewed before it goes live. See `docs/ADMIN_GUIDE.md`. This page explains how to edit the file directly.

## Before you start

Only add an event that is real and confirmed: a date, a venue (or an online link) and a way to register. The site must never show an invented event.

## Steps

1. **Copy the template.** Duplicate `content/events/example-event-template.mdx` and give the copy a short name in lower case with hyphens, for example `ai-for-healthcare-workshop-2027.mdx`.
2. **Set the slug.** Change `slug:` to the file name without `.mdx`. The event's address will be `/events/<slug>`.
3. **Fill in the details.** Each field is explained in a comment in the template. The ones that matter most:
   - `title` and `summary`, a short description shown on cards and in search results.
   - `type` (workshop, seminar, webinar, conference, ceremony, masterclass, hackathon and so on) and `mode` (in-person, online or hybrid).
   - `startDate` and `endDate`, in Indian Standard Time. Write a date and time as `2027-03-20T10:00:00+05:30`, or a date alone as `2027-03-20`.
   - `venue` and `city`, for in-person and hybrid events.
   - `registrationUrl`, the full address where people register. If you leave it empty, the Register button sends people to the contact page.
4. **Write the description** below the second `---` line, in ordinary paragraphs.
5. **Publish.** Delete the `draft: true` line, or change it to `draft: false`.
6. **Check it.** Run `pnpm check`. It stops with a clear message if anything is missing or wrong, for example an in-person event without a venue.

## What you never need to do

- **Change the status badge.** "Registration open", "Opening soon", "Registration closed" and "Past" are worked out from the dates, in each visitor's browser, so they are always correct. Use `registrationOpens` and `registrationCloses` if registration has its own dates.
- **Move an event to "Past events".** This happens on its own once the event ends.
- **Make a calendar file.** The "Add to calendar" link is generated from the event's dates.

## Speakers

Add a speaker only once they have agreed to speak. A speaker photograph appears only when you also set `photoConsent: true`, which means the speaker has given written consent. Put photographs in `public/images/events/`.

## After the event

The event's page stays live and shows "This event has taken place". Add a `recap` to the file with:

- a short `summary` of what happened,
- `photos`, each with a description in `alt` and `consent: true`, which means everyone recognisable in it agreed to its publication (the check refuses a photograph without it). The first photograph appears under "Highlights from past events" on the home page,
- a `slidesUrl`, if the slides are shared.

Until a recap is added, the page shows a visible placeholder.

## Previewing a draft

While `draft: true` is set, the event appears when you run `pnpm dev` on your own computer, with a "Draft" notice, but never on the live site.
