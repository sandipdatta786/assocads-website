import { ogImage } from "@/lib/seo/og";
import { getGlossary, bySlug } from "@/lib/content/loaders";

export const alt = "Share image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Made at build time for every page in the collection. */
export function generateStaticParams() {
  return getGlossary({ includeDrafts: true }).map((item) => ({
    term: item.slug,
  }));
}

/** The share image takes the page's own title automatically. */
export default async function Image({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term } = await params;
  const item = bySlug(getGlossary({ includeDrafts: true }), term);
  return ogImage({
    title: item ? `${item.term}: meaning and example` : "Glossary",
    eyebrow: "Glossary",
  });
}
