/**
 * Choices used by the enquiry forms on /partner, /support and /contact, and by
 * the links on those pages that pre-fill them. Shared by server pages and the
 * client form, so it holds plain data only.
 */

export type Choice = { value: string; label: string };

/** Ids of the form sections, used as link targets. */
export const formIds = {
  partner: "partner-enquiry",
  support: "pledge-or-sponsor",
  contact: "contact-form",
} as const;

/** The partner types on /partner, which are also the form's "type of organisation". */
export const organisationTypes = [
  { value: "academic", label: "Academic institution" },
  { value: "company", label: "Company or startup" },
  { value: "government", label: "Government body" },
  { value: "community", label: "Community or non-profit organisation" },
  { value: "other", label: "Something else" },
] as const satisfies Choice[];

export const partnershipAreas: Choice[] = [
  { value: "training", label: "Training, workshops or faculty development" },
  { value: "events", label: "Events, hackathons or meetups" },
  { value: "research", label: "Research and publications" },
  { value: "internships", label: "Internships, mentoring or careers" },
  { value: "startups", label: "Startups and innovation" },
  { value: "responsible-ai", label: "Responsible AI" },
  { value: "policy", label: "Policy, standards or advisory work" },
  { value: "social-good", label: "AI for social good" },
  { value: "campus-group", label: "A campus group" },
  { value: "other", label: "Something else" },
];

/** What someone offers on /support. Nothing here is a payment. */
export const supportOffers = [
  { value: "pledge", label: "Pledge a donation for when giving opens" },
  { value: "sponsor", label: "Sponsor an event or programme" },
  { value: "venue", label: "Offer a venue" },
  { value: "speak", label: "Speak or mentor" },
  { value: "volunteer", label: "Volunteer" },
  { value: "other", label: "Something else" },
] as const satisfies Choice[];

/** The contact form's "What is it about?". The topic decides who receives the
    message once the form is connected (Prompt 16). */
export const contactTopics = [
  { value: "membership", label: "Membership" },
  { value: "partnership", label: "Partnership" },
  { value: "events", label: "Events" },
  { value: "media", label: "Media" },
  { value: "other", label: "Something else" },
] as const satisfies Choice[];

/** A note shown under a choice, pointing to a better place for that question. */
export type ChoiceNote = { text: string; href?: string; linkLabel?: string };

export const contactTopicNotes: Record<string, ChoiceNote> = {
  membership: {
    text: "Membership is not open yet. To hear as soon as it opens, register your interest.",
    href: "/membership/apply",
    linkLabel: "Register your interest",
  },
  partnership: {
    text: "If you are writing for an organisation, the partnership enquiry asks the questions we need to reply well.",
    href: `/partner#${formIds.partner}`,
    linkLabel: "Go to the partnership enquiry",
  },
  events: {
    text: "Announced events, with their dates and how to register, are on the events page.",
    href: "/events",
    linkLabel: "See events",
  },
};
