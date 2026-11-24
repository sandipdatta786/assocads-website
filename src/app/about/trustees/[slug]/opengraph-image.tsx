import { ogImage } from "@/lib/seo/og";
import { bySlug, getFounderMembers, getTrustees } from "@/lib/content/loaders";

/** Founder Trustees and founder members: both can have a page. */
const people = () => [
  ...getTrustees({ includeDrafts: true }),
  ...getFounderMembers({ includeDrafts: true }),
];

export const alt = "Share image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Made at build time for every page in the collection. */
export function generateStaticParams() {
  return people().map((item) => ({
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
  const item = bySlug(people(), slug);
  return ogImage({
    title: item?.name ?? "Founder Trustees",
    eyebrow: item?.capacity ?? "Founder Trustee",
  });
}
