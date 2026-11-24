import { track } from "@vercel/analytics";
import type { FormKind } from "@/lib/forms/limits";

/**
 * The custom events sent to Vercel Web Analytics, and the only data each one
 * carries. None of it is personal: no names, email addresses or form answers.
 * The privacy notice (src/app/legal/privacy) lists these; keep both in step.
 *
 * Vercel records custom events only on its Pro and Enterprise plans. On other
 * plans these calls do nothing, and page views are still counted.
 */
type Events = {
  /** A click on any link to the Join page, and where on the page it was. */
  "Join click": { location: string; page: string };
  /** A form sent successfully. Only the kind of form, never its contents. */
  "Form sent": { form: FormKind };
  /** A click on an event's external registration link. */
  "Event registration click": { event: string };
  /** A click on a downloadable file. */
  Download: { file: string; page: string };
};

export type AnalyticsEvent = keyof Events;

export function trackEvent<E extends AnalyticsEvent>(name: E, data: Events[E]) {
  track(name, data);
}

/**
 * Analytics scripts load only on Vercel, where Web Analytics and Speed
 * Insights are served. Elsewhere (your own machine, CI) they would fail to load.
 */
export const analyticsEnabled = Boolean(process.env.VERCEL);
