import { isPlaceholderValue } from "../../config/site.ts";

/**
 * Whether a trustee gets an individual page at /about/trustees/[slug]:
 * published, consent to publish given, and a real biography supplied.
 * Kept free of file access so browser code can use it too.
 */
export function hasTrusteeProfile(t: {
  published: boolean;
  consentToPublish: boolean;
  bio: string;
}): boolean {
  return t.published && t.consentToPublish && !isPlaceholderValue(t.bio);
}
