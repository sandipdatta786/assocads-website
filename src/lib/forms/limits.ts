/**
 * The small facts about the forms that the page needs as soon as it loads.
 * They live apart from the Zod schemas (schemas.ts) so that importing them
 * does not send Zod to the browser: the browser loads the schemas only when
 * someone starts to fill in a form.
 */

export type FormKind =
  | "membership"
  | "community"
  | "partner"
  | "support"
  | "contact"
  | "innovation"
  | "mentorship"
  | "collaboration"
  | "newsletter";

export type FormValues = Record<string, string | string[]>;

export const MESSAGE_LIMIT = 3000;
export const MEMBERSHIP_MESSAGE_LIMIT = 1000;
