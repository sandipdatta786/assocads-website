import type { Faq } from "./schemas";
import { slugify } from "@/lib/headings";

/** The groups on /faq, in the order they appear. */
export const faqCategories: { value: Faq["category"]; label: string }[] = [
  { value: "about", label: "About ASSOCADS" },
  { value: "membership", label: "Membership" },
  { value: "programmes", label: "Programmes and events" },
  { value: "partnership", label: "Partnerships" },
  { value: "support", label: "Support and donations" },
  { value: "website", label: "Website and privacy" },
];

/** The anchor for one question, so that /faq#its-id links straight to it. */
export function faqAnchor(question: string): string {
  return slugify(question.replace(/\?$/, ""));
}
