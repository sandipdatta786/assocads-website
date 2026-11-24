import type { Metadata } from "next";

/**
 * Ownership tags for Google Search Console and Bing Webmaster Tools. Each tag
 * is rendered only when its environment variable is set. The values are the
 * "content" part of the meta tag each service gives you, not the whole tag.
 * Pages are built ahead of time, so redeploy after setting or changing them.
 * See docs/LAUNCH_DAY_SEARCH_SETUP.md.
 */
export function verification(): Metadata["verification"] {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  const bing = process.env.BING_SITE_VERIFICATION?.trim();
  if (!google && !bing) return undefined;
  return {
    ...(google ? { google } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}
