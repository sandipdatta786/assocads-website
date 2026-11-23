import type { Metadata } from "next";
import { site } from "@/config/site";

/**
 * Complete metadata for an inner page: title, description, canonical address,
 * Open Graph and Twitter cards. The layout adds "| ASSOCADS" to the title.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  /** 120 to 160 characters reads best in search results. */
  description: string;
  /** The page's path, for example "/about/governance". */
  path: string;
}): Metadata {
  const fullTitle = `${title} | ${site.shortName}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: site.name,
      locale: "en_IN",
      title: fullTitle,
      description,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
