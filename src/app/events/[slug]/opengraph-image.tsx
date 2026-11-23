import { ogImage } from "@/lib/seo/og";
import { getEvents, bySlug } from "@/lib/content/loaders";

export const alt = "Share image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Made at build time for every page in the collection. */
export function generateStaticParams() {
  return getEvents({ includeDrafts: true }).map((item) => ({
    slug: item.slug,
  }));
}

/** The share image takes the page's own title automatically. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = bySlug(getEvents({ includeDrafts: true }), slug);
  return ogImage({ title: item?.title ?? "Event", eyebrow: "Event" });
}
