import { ogImage } from "@/lib/seo/og";
import { bySlug, getHub } from "@/lib/content/loaders";

export const alt = "Share image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Made at build time for every entry in the Knowledge Hub. */
export function generateStaticParams() {
  return getHub({ includeDrafts: true, includeFuture: true }).map((e) => ({
    slug: e.slug,
  }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = bySlug(
    getHub({ includeDrafts: true, includeFuture: true }),
    slug,
  );
  return ogImage({
    title: entry?.title ?? "Knowledge Hub",
    eyebrow: "Knowledge Hub",
  });
}
