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
  innovation: "showcase-idea",
  mentorship: "mentorship-signup",
  collaboration: "collaboration-enquiry",
} as const;

/** The kinds of organisation that can propose a collaboration. */
export const collaboratorTypes = [
  { value: "corporate", label: "Corporate or industry organisation" },
  { value: "technology", label: "Technology company or startup" },
  { value: "academic", label: "Academic institution" },
  { value: "research", label: "Research organisation" },
  { value: "other", label: "Something else" },
] as const satisfies Choice[];

/** What a collaboration could cover. Each is a request to explore, not a commitment. */
export const collaborationAreas = [
  { value: "workshops", label: "Workshops or seminars" },
  { value: "training", label: "Training or certification" },
  { value: "research", label: "Joint research or publications" },
  { value: "innovation", label: "Innovation or pitch days" },
  { value: "projects", label: "An industry project or problem statement" },
  { value: "internships", label: "Internships or hiring" },
  { value: "other", label: "Something else" },
] as const satisfies Choice[];

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

/** "I am" on the membership interest form. */
export const membershipRoles = [
  { value: "student", label: "A student" },
  { value: "professional", label: "A working professional" },
  { value: "faculty-researcher", label: "Faculty or a researcher" },
  { value: "organisation", label: "Representing an organisation" },
  { value: "other", label: "Other" },
] as const satisfies Choice[];

/** Membership categories a visitor can register interest in. Honorary
    membership is by invitation of the Board, so it is not listed. */
export const membershipCategories = [
  { value: "ordinary", label: "Ordinary membership" },
  { value: "life", label: "Life membership" },
  { value: "associate", label: "Associate membership (for organisations)" },
  { value: "not-sure", label: "Not sure yet" },
] as const satisfies Choice[];

/** "Would you like to help organise it?" on the communities form. */
export const organiseOptions = [
  { value: "yes", label: "Yes, I would like to help organise it" },
  { value: "maybe", label: "Maybe, tell me more" },
  { value: "no", label: "No, I would just like to take part" },
] as const satisfies Choice[];

/** "I am" on the idea submission form. */
export const innovatorRoles = [
  { value: "student", label: "A student" },
  { value: "researcher", label: "A researcher or faculty member" },
  { value: "founder", label: "A startup founder" },
  { value: "entrepreneur", label: "An entrepreneur or small business owner" },
  { value: "professional", label: "A working professional" },
  { value: "other", label: "Something else" },
] as const satisfies Choice[];

/** How far the idea has got. */
export const innovationStages = [
  { value: "idea", label: "An idea, not yet tested" },
  { value: "prototype", label: "A prototype or proof of concept" },
  { value: "pilot", label: "A pilot with real users" },
  { value: "operating", label: "A product or service in use" },
] as const satisfies Choice[];

/** The fields an idea can be in, for the submission form. */
export const innovationAreas = [
  { value: "health", label: "Health" },
  { value: "agriculture", label: "Agriculture and rural life" },
  { value: "education", label: "Education and skills" },
  { value: "public-services", label: "Public services and governance" },
  { value: "finance", label: "Finance" },
  { value: "manufacturing", label: "Manufacturing and logistics" },
  { value: "climate", label: "Climate and environment" },
  { value: "other", label: "Something else" },
] as const satisfies Choice[];

/** What the submitter would like, which the secretariat reads when replying.
    Each is a plan on ASSOCADS's side; none is promised. */
export const innovationHelp = [
  { value: "mentoring", label: "Mentoring from experienced practitioners" },
  { value: "industry", label: "Introductions to industry" },
  {
    value: "investors",
    label: "Introductions to investors, if the idea is ready",
  },
  {
    value: "pitch-day",
    label: "A place to pitch at an ASSOCADS Innovation Pitch Day",
  },
  { value: "feedback", label: "Feedback on the idea only" },
] as const satisfies Choice[];

/** Who is signing up on the mentorship form. */
export const mentorshipRoles = [
  {
    value: "mentor",
    label: "I would like to mentor students or young professionals",
  },
  { value: "student", label: "I am a student and would like mentoring" },
  {
    value: "young-professional",
    label: "I am an early-career professional and would like mentoring",
  },
] as const satisfies Choice[];

/** The subjects a mentor can offer, or a mentee would like help with. */
export const mentoringAreas = [
  { value: "data-science", label: "Data science and analytics" },
  { value: "machine-learning", label: "Machine learning and AI" },
  { value: "data-engineering", label: "Data engineering and cloud" },
  { value: "responsible-ai", label: "Responsible AI and governance" },
  { value: "healthcare-ai", label: "AI in healthcare" },
  { value: "business-analysis", label: "Business analysis and strategy" },
  { value: "research", label: "Research and higher studies" },
  { value: "other", label: "Something else" },
] as const satisfies Choice[];

/** What a mentee would like, or what a mentor can offer. Requests, not promises. */
export const careerHelp = [
  { value: "guidance", label: "Career guidance" },
  { value: "internship", label: "Help finding an internship" },
  { value: "job", label: "Help with job applications and interviews" },
  { value: "industry", label: "Meeting people working in industry" },
  { value: "skills", label: "Advice on skills and learning paths" },
] as const satisfies Choice[];
