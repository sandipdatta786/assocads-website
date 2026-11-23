import type { Metadata } from "next";
import { site } from "@/config/site";

/** True on a Vercel preview deployment. Previews are never indexed, so that
    only the real domain appears in search results. */
export function isPreviewDeployment(): boolean {
  return process.env.VERCEL_ENV === "preview";
}

/** The full address of a page, built from NEXT_PUBLIC_SITE_URL. */
export function absoluteUrl(path: string): string {
  return path === "/" ? site.url : `${site.url}${path}`;
}

/**
 * Complete metadata for any page: title, description, canonical address,
 * Open Graph and X card tags, and robots directives. Every route uses it.
 *
 * - The layout adds "| ASSOCADS" to the title, so pass the page's own title.
 *   Keep the whole title under 60 characters and the description under 155.
 * - The share image comes from the opengraph-image file next to the page.
 * - Set noindex for drafts and pages that must not appear in search.
 */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  absoluteTitle = false,
  type = "website",
}: {
  title: string;
  /** 120 to 155 characters reads best in search results. */
  description: string;
  /** The page's path, for example "/about/governance". */
  path: string;
  noindex?: boolean;
  /** Use the title exactly as given, without "| ASSOCADS". For the home page. */
  absoluteTitle?: boolean;
  type?: "website" | "article";
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.shortName}`;
  const url = absoluteUrl(path);
  const hidden = noindex || isPreviewDeployment();
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: site.name,
      locale: "en_IN",
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    robots: hidden
      ? { index: false, follow: !noindex }
      : { index: true, follow: true },
  };
}
