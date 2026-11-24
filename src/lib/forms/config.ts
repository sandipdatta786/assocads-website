import { isPlaceholderValue, site } from "@/config/site";
import type { FormKind } from "./schemas";

/**
 * Form settings read from environment variables. Every variable is listed,
 * with a comment, in .env.example. Read on the server only.
 */

/** True on a Vercel deployment (production or preview), never on a laptop. */
export function onVercel(): boolean {
  return Boolean(process.env.VERCEL);
}

/** Where submissions are written instead of sent, for automated tests only.
    Refused on Vercel, so it can never store real submissions. */
export function testOutbox(): string | null {
  const dir = process.env.FORMS_TEST_OUTBOX;
  return dir && !onVercel() ? dir : null;
}

export function resendConfig(): { apiKey: string; from: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.FORMS_FROM?.trim();
  return apiKey && from ? { apiKey, from } : null;
}

export function turnstileSecret(): string | null {
  return process.env.TURNSTILE_SECRET_KEY?.trim() || null;
}

/** The environment variable that holds the secretariat address for each kind
    of message. Contact messages are routed by their topic. */
const recipientVariables: Record<string, string> = {
  membership: "FORMS_TO_MEMBERSHIP",
  community: "FORMS_TO_COMMUNITIES",
  partner: "FORMS_TO_PARTNERSHIPS",
  support: "FORMS_TO_SUPPORT",
  innovation: "FORMS_TO_INNOVATION",
  mentorship: "FORMS_TO_MENTORSHIP",
  "contact:membership": "FORMS_TO_MEMBERSHIP",
  "contact:partnership": "FORMS_TO_PARTNERSHIPS",
  "contact:events": "FORMS_TO_EVENTS",
  "contact:media": "FORMS_TO_MEDIA",
  "contact:other": "FORMS_TO_CONTACT",
};

/** The secretariat address for a message, falling back to FORMS_TO. */
export function recipientFor(kind: FormKind, topic?: string): string | null {
  const key = kind === "contact" ? `contact:${topic ?? "other"}` : kind;
  const variable = recipientVariables[key];
  const specific = variable ? process.env[variable]?.trim() : "";
  return specific || process.env.FORMS_TO?.trim() || null;
}

/** The public email address shown when sending fails, if one has been set. */
export function publicContactEmail(): string | undefined {
  const email = site.contact.email;
  return isPlaceholderValue(email) ? undefined : email;
}
