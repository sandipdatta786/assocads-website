/** Labels and wording for guides, shared by the guide pages and the hubs. */

export const themeLabels = {
  careers: "Careers",
  kolkata: "Kolkata and West Bengal",
  policy: "Policy and governance",
  fundamentals: "Fundamentals",
} as const;

export const themeDescriptions = {
  careers:
    "Becoming a data scientist, roadmaps, internships and what the public data says about pay.",
  kolkata:
    "Independent guides to courses, employers and events in Kolkata and West Bengal.",
  policy:
    "Plain-English explainers on data protection, the IndiaAI Mission and AI regulation in India.",
  fundamentals:
    "Responsible AI and how AI is being used for public good in India.",
} as const;

export const themeOrder = [
  "careers",
  "kolkata",
  "policy",
  "fundamentals",
] as const;

/** The soft call to action at the end of a guide. */
export const guideCtas = {
  membership: {
    title: "Learn and grow with others in AI and Data Science",
    text: "ASSOCADS is a membership association for students, professionals and organisations. Membership opens after registration. Register your interest and we will tell you when it does.",
    primary: { label: "Register your interest", href: "/membership/apply" },
    secondary: { label: "How membership works", href: "/membership" },
  },
  events: {
    title: "Meet people working on this",
    text: "ASSOCADS plans workshops, meetups and hackathons in Kolkata and online. See what has been announced, or register your interest to hear first.",
    primary: { label: "See events", href: "/events" },
    secondary: { label: "Register your interest", href: "/membership/apply" },
  },
  communities: {
    title: "Find people in your field",
    text: "ASSOCADS proposes Special Interest Groups by industry and domain, and chapters by city. Tell us which you would join.",
    primary: { label: "See communities", href: "/communities" },
    secondary: { label: "Register your interest", href: "/membership/apply" },
  },
  contact: {
    title: "Working on this in your organisation?",
    text: "If your organisation would like to talk about training, research or policy in AI and Data Science, tell us what you need.",
    primary: { label: "Contact us", href: "/contact" },
    secondary: { label: "Partner with us", href: "/partner" },
  },
} as const;

/** Shorten text to a search-result description at a word boundary. */
export function clip(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}
