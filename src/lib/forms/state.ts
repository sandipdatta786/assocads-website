import type { FormValues } from "./limits";

/**
 * What a form submission returns to the page. Shared by the server action and
 * the form components. It never holds more than the visitor typed.
 */
export type FormStatus =
  /** Nothing submitted yet. */
  | "idle"
  /** Some answers need fixing; see errors. */
  | "invalid"
  /** Sent, or (in development) printed to the terminal; see mode. */
  | "sent"
  /** Submitted too quickly after the page loaded. */
  | "too-fast"
  /** The security check failed or expired. */
  | "security"
  /** JavaScript is off, so the security check could not run. */
  | "needs-js"
  /** Too many submissions from one address in a short time. */
  | "rate-limited"
  /** Sending failed, or the form is not configured on this server. */
  | "failed";

export type FormState = {
  status: FormStatus;
  /** First problem per field, keyed by field name. */
  errors?: Record<string, string>;
  /** The answers, returned only when the page must show them again. */
  values?: FormValues;
  /** How a sent message was delivered. Anything but "email" is local only. */
  mode?: "email" | "terminal" | "test";
  /** The secretariat's address, for the fallback message, if it is known. */
  contactEmail?: string;
};

export const initialFormState: FormState = { status: "idle" };

/** The names of the hidden fields that every form carries. */
export const HONEYPOT_FIELD = "website";
export const STARTED_FIELD = "started";
/** Which of the five forms was sent. */
export const KIND_FIELD = "form-kind";
export const TURNSTILE_FIELD = "cf-turnstile-response";

/** Faster than this, in milliseconds, is treated as a robot. */
export const MIN_FILL_MS = 3000;
