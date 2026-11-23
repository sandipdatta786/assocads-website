import { ogImage } from "@/lib/seo/og";
import { getAudiences, bySlug } from "@/lib/content/loaders";

export const alt = "Share image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Made at build time for every page in the collection. */
export function generateStaticParams() {
  return getAudiences().map((item) => ({ audience: item.slug }));
}

/** The share image takes the page's own title automatically. */
export default async function Image({
  params,
}: {
  params: Promise<{ audience: string }>;
}) {
  const { audience } = await params;
  const item = bySlug(getAudiences(), audience);
  return ogImage({ title: item?.title ?? "ASSOCADS", eyebrow: "For you" });
}
