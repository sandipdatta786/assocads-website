import { PROPOSE_CHAPTER } from "@/components/forms/communityInterest";
import { site } from "@/config/site";
import { getCommunities, getProgrammes } from "@/lib/content/loaders";
import {
  contactTopics,
  innovationAreas,
  innovationHelp,
  innovationStages,
  innovatorRoles,
  careerHelp,
  mentoringAreas,
  mentorshipRoles,
  collaboratorTypes,
  collaborationAreas,
  membershipCategories,
  membershipRoles,
  organisationTypes,
  organiseOptions,
  partnershipAreas,
  supportOffers,
  type Choice,
} from "@/lib/enquiries";
import type { FormKind, FormValues } from "./schemas";

/** The two plain-text emails sent for each submission. */
export type Message = {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

export const formTitles: Record<FormKind, string> = {
  membership: "Membership interest",
  community: "Community interest",
  partner: "Partnership enquiry",
  support: "Pledge or sponsor offer",
  contact: "Contact message",
  innovation: "Idea or innovation submission",
  mentorship: "Mentorship sign-up",
  collaboration: "Industry or academic collaboration enquiry",
};

/** What the acknowledgement says we received. */
const receivedWhat: Record<FormKind, string> = {
  membership: "your interest in membership",
  community: "your interest in a group or chapter",
  partner: "your partnership enquiry",
  support: "your offer of support",
  contact: "your message",
  innovation: "your idea or innovation",
  mentorship: "your mentorship sign-up",
  collaboration: "your collaboration enquiry",
};

type Row = [label: string, name: string, choices?: Choice[] | "lookup"];

/** Each form's fields as they appear in the secretariat email, in order. */
const rows: Record<FormKind, Row[]> = {
  membership: [
    ["Name", "name"],
    ["Email", "email"],
    ["Phone", "phone"],
    ["City", "city"],
    ["I am", "role", [...membershipRoles]],
    ["Organisation", "organisation"],
    ["Category of interest", "category", [...membershipCategories]],
    ["Areas of interest", "areas", "lookup"],
    ["Wants occasional news", "updates"],
  ],
  community: [
    ["Name", "name"],
    ["Email", "email"],
    ["City", "city"],
    ["Group or chapter", "interest", "lookup"],
    ["Proposed chapter in", "place"],
    ["Would help organise", "organise", [...organiseOptions]],
  ],
  partner: [
    ["Name", "name"],
    ["Role", "role"],
    ["Organisation", "organisation"],
    ["Type of organisation", "type", [...organisationTypes]],
    ["Email", "email"],
    ["Phone", "phone"],
    ["Would like to explore", "areas", partnershipAreas],
  ],
  support: [
    ["Name", "name"],
    ["Organisation", "organisation"],
    ["Email", "email"],
    ["Phone", "phone"],
    ["Offer", "offer", [...supportOffers]],
  ],
  contact: [
    ["Name", "name"],
    ["Email", "email"],
    ["Phone", "phone"],
    ["Topic", "topic", [...contactTopics]],
  ],
  innovation: [
    ["Name", "name"],
    ["Email", "email"],
    ["Phone", "phone"],
    ["I am", "role", [...innovatorRoles]],
    ["Organisation", "organisation"],
    ["Idea", "title"],
    ["Area", "area", [...innovationAreas]],
    ["Stage", "stage", [...innovationStages]],
    ["Summary", "summary"],
    ["Link", "link"],
    ["Would like", "help", [...innovationHelp]],
  ],
  mentorship: [
    ["Name", "name"],
    ["Email", "email"],
    ["Phone", "phone"],
    ["City", "city"],
    ["I am", "role", [...mentorshipRoles]],
    ["Course, year or current role", "current"],
    ["Organisation or college", "organisation"],
    ["Areas", "areas", [...mentoringAreas]],
    ["Would like", "help", [...careerHelp]],
    ["Message", "message"],
  ],
  collaboration: [
    ["Name", "name"],
    ["Email", "email"],
    ["Phone", "phone"],
    ["Organisation", "organisation"],
    ["Role", "role"],
    ["Type of organisation", "type", [...collaboratorTypes]],
    ["Would like to explore", "areas", [...collaborationAreas]],
    ["Summary", "summary"],
    ["Link", "link"],
  ],
};

function lookupChoices(kind: FormKind): Choice[] {
  if (kind === "membership")
    return getProgrammes().map((p) => ({ value: p.slug, label: p.title }));
  if (kind === "community")
    return [
      ...getCommunities().map((c) => ({ value: c.slug, label: c.name })),
      { value: PROPOSE_CHAPTER, label: "Propose a new chapter" },
      { value: "not-sure", label: "Not sure yet" },
    ];
  return [];
}

function labelOf(value: string, choices: Choice[]): string {
  return choices.find((c) => c.value === value)?.label ?? value;
}

function display(kind: FormKind, row: Row, v: FormValues): string {
  const [, name, choices] = row;
  const raw = v[name];
  const list = choices === "lookup" ? lookupChoices(kind) : choices;
  if (name === "updates") return raw === "on" ? "Yes" : "No";
  if (Array.isArray(raw))
    return raw.map((x) => (list ? labelOf(x, list) : x)).join(", ");
  const value = (raw ?? "").trim();
  return list && value ? labelOf(value, list) : value;
}

/** Strip line breaks, so a typed value cannot add lines to a subject. */
function oneLine(text: string, max = 80): string {
  return text.replace(/\s+/g, " ").trim().slice(0, max);
}

/** The email to the secretariat, with reply-to set to the sender. */
export function secretariatEmail(
  kind: FormKind,
  v: FormValues,
  to: string,
): Message {
  const name = oneLine(String(v.name ?? ""));
  const topic =
    kind === "contact"
      ? `: ${labelOf(String(v.topic), [...contactTopics])}`
      : "";
  const lines = rows[kind]
    .map((row) => [row[0], display(kind, row, v)] as const)
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);

  const message = String(v.message ?? "").trim();
  const text = [
    `${formTitles[kind]} from the ${site.shortName} website`,
    "",
    ...lines,
    ...(message ? ["", "Message:", message] : []),
    "",
    "---",
    `Reply to this email to answer ${name || "the sender"} directly.`,
    "The sender agreed to the privacy notice when submitting the form.",
  ].join("\n");

  return {
    to,
    replyTo: String(v.email),
    subject: `${formTitles[kind]}${topic} from ${name}`,
    text,
  };
}

/** The short acknowledgement to the sender. */
export function acknowledgementEmail(
  kind: FormKind,
  v: FormValues,
  secretariat: string,
): Message {
  // Only a plausible first name is echoed back, so the form cannot be used
  // to send arbitrary text to an address someone else typed in.
  const word = oneLine(String(v.name ?? "")).split(" ")[0] ?? "";
  const first = /^\p{L}[\p{L}\p{M}'’.-]{0,29}$/u.test(word) ? word : "there";
  const text = [
    `Dear ${first},`,
    "",
    `Thank you for contacting ${site.shortName}, the ${site.name}. We have received ${receivedWhat[kind]} and will reply as soon as we can.`,
    "",
    "If you need to add anything, reply to this email.",
    "",
    `You are receiving this because this address was entered in a form on ${site.url.replace(/^https?:\/\//, "")}. If that was not you, you can ignore this email.`,
    "",
    site.shortName,
    site.url,
  ].join("\n");
  return {
    to: String(v.email),
    replyTo: secretariat,
    subject: `We have received ${receivedWhat[kind]}`,
    text,
  };
}
