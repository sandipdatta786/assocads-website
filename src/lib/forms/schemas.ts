import { z } from "zod";
import { PROPOSE_CHAPTER } from "@/components/forms/communityInterest";
import {
  contactTopics,
  membershipCategories,
  membershipRoles,
  organisationTypes,
  organiseOptions,
  partnershipAreas,
  supportOffers,
  type Choice,
} from "@/lib/enquiries";

/**
 * The five forms, one Zod schema each. The browser and the server both check
 * answers with these, so the rules and messages can never drift apart.
 * Every form is read into a plain object first (fromFormData), so both sides
 * validate exactly the same shape.
 */

export type FormKind =
  "membership" | "community" | "partner" | "support" | "contact";

export const formKinds: FormKind[] = [
  "membership",
  "community",
  "partner",
  "support",
  "contact",
];

/** Field names that hold several values (checkbox groups). */
const listFields: Record<FormKind, string[]> = {
  membership: ["areas"],
  community: [],
  partner: ["areas"],
  support: [],
  contact: [],
};

export type FormValues = Record<string, string | string[]>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MESSAGE_LIMIT = 3000;
export const MEMBERSHIP_MESSAGE_LIMIT = 1000;

function values<T extends readonly Choice[]>(choices: T) {
  return choices.map((c) => c.value) as [
    T[number]["value"],
    ...T[number]["value"][],
  ];
}

const required = (message: string, max = 200) =>
  z
    .string()
    .trim()
    .min(1, message)
    .max(max, `Keep this under ${max} characters.`);

const optional = (max = 200) =>
  z.string().trim().max(max, `Keep this under ${max} characters.`);

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .max(254, "Enter a shorter email address.")
  .regex(EMAIL, "Enter an email address in the form name@example.com.");

const phone = z
  .string()
  .trim()
  .refine(
    (v) =>
      !v ||
      (/^[+()\d\s-]{7,20}$/.test(v) && (v.match(/\d/g)?.length ?? 0) >= 8),
    "Enter a phone number with at least eight digits, or leave it blank.",
  );

const message = (text: string, max = MESSAGE_LIMIT) =>
  z
    .string()
    .trim()
    .min(1, text)
    .max(max, `Keep your message under ${max} characters.`);

const consent = z
  .string()
  .refine(
    (v) => v === "on",
    "Tick this box so that we can store your details and reply.",
  );

const choice = <T extends readonly Choice[]>(choices: T, error: string) =>
  z.enum(values(choices), { error });

const slug = z.string().regex(/^[a-z0-9-]{1,80}$/);

export const schemas = {
  membership: z
    .object({
      name: required("Enter your full name."),
      email,
      phone,
      city: required("Enter the city where you live or work.", 100),
      role: choice(
        membershipRoles,
        "Choose the option that describes you best.",
      ),
      organisation: optional(),
      category: choice(
        membershipCategories,
        "Choose a category, or choose Not sure yet.",
      ),
      areas: z.array(slug).max(20),
      message: optional(MEMBERSHIP_MESSAGE_LIMIT),
      consent,
      updates: z.string(),
    })
    .superRefine((v, ctx) => {
      if (v.role === "organisation" && !v.organisation)
        ctx.addIssue({
          code: "custom",
          path: ["organisation"],
          message: "Enter the name of the organisation you represent.",
        });
    }),

  community: z
    .object({
      name: required("Enter your full name."),
      email,
      city: required("Enter the city where you live or work.", 100),
      interest: z
        .string()
        .regex(
          /^[a-z0-9-]{1,80}$/,
          "Choose a group or a chapter, or choose Not sure yet.",
        ),
      place: optional(100),
      organise: choice(
        organiseOptions,
        "Tell us whether you would like to help organise.",
      ),
      consent,
    })
    .superRefine((v, ctx) => {
      if (v.interest === PROPOSE_CHAPTER && !v.place)
        ctx.addIssue({
          code: "custom",
          path: ["place"],
          message: "Enter the city or state for the chapter you propose.",
        });
    }),

  partner: z.object({
    name: required("Enter your full name."),
    role: required("Enter your role, for example Head of Department."),
    organisation: required("Enter the name of your organisation."),
    type: choice(organisationTypes, "Choose the type of organisation."),
    email,
    phone,
    areas: z
      .array(z.enum(values(partnershipAreas)))
      .min(1, "Choose at least one thing you would like to explore."),
    message: message("Enter a short message about what you have in mind."),
    consent,
  }),

  support: z.object({
    name: required("Enter your full name."),
    organisation: optional(),
    email,
    phone,
    offer: choice(supportOffers, "Choose how you would like to help."),
    message: message("Tell us a little more about your offer."),
    consent,
  }),

  contact: z.object({
    name: required("Enter your full name."),
    email,
    phone,
    topic: choice(contactTopics, "Choose what your message is about."),
    message: message("Enter your message."),
    consent,
  }),
} satisfies Record<FormKind, z.ZodType>;

/** The field names a form reads, in the order they appear. */
export function fieldNames(kind: FormKind): string[] {
  return Object.keys(schemas[kind].shape);
}

/** Read only this form's own fields from submitted data. Anything else is ignored. */
export function fromFormData(kind: FormKind, data: FormData): FormValues {
  const out: FormValues = {};
  for (const name of fieldNames(kind)) {
    if (listFields[kind].includes(name)) {
      out[name] = data
        .getAll(name)
        .filter((v): v is string => typeof v === "string");
    } else {
      const v = data.get(name);
      out[name] = typeof v === "string" ? v : "";
    }
  }
  return out;
}

/** The first message for each field that fails, keyed by field name. */
export function validateForm(
  kind: FormKind,
  input: FormValues,
): Record<string, string> {
  const result = schemas[kind].safeParse(input);
  if (result.success) return {};
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}

/** True when a form's field holds several values. */
export function isListField(kind: FormKind, name: string): boolean {
  return listFields[kind].includes(name);
}
