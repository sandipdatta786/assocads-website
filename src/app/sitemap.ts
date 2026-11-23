import type { MetadataRoute } from "next";
import { builtAt } from "@/lib/clock";
import { absoluteUrl } from "@/lib/seo/metadata";
import { siteRoutes } from "@/lib/seo/routes";

/** /sitemap.xml: every indexable page, with the date it last changed.
    Drafts, the style guide and noindex pages are not listed. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = await builtAt();
  return siteRoutes(now).map((r) => ({
    url: absoluteUrl(r.path),
    ...(r.lastModified ? { lastModified: r.lastModified } : {}),
  }));
}
