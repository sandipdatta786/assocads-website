import type { MetadataRoute } from "next";
import { absoluteUrl, isPreviewDeployment } from "@/lib/seo/metadata";

/**
 * /robots.txt. Every reputable crawler, including search engines and AI
 * assistants that cite sources, may read the public site. Only the internal
 * style guide is blocked. Preview deployments block everything, so that only
 * the real domain is indexed.
 */
export default function robots(): MetadataRoute.Robots {
  if (isPreviewDeployment()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/styleguide"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
