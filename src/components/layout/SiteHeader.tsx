import Link from "next/link";
import { HeaderNav, type HeaderItem } from "@/components/layout/HeaderNav";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/config/site";
import { getAudiences, getProgrammes } from "@/lib/content/loaders";

/** The sticky header. Navigation comes from src/config/site.ts; the
    Programmes menu is filled from content/programmes and content/audiences. */
export function SiteHeader() {
  const programmes = getProgrammes();
  const audiences = getAudiences();

  const items: HeaderItem[] = site.navigation.map((item) => {
    if (item.label !== "Programmes") return item;
    return {
      ...item,
      menu: [
        {
          label: "All programmes",
          href: "/programmes",
          description: "Our eight planned areas of work",
        },
        ...programmes.map((p) => ({
          label: p.title,
          href: `/programmes/${p.slug}`,
          description: p.tagline,
        })),
      ],
      aside: {
        heading: "Who it is for",
        links: [
          ...audiences.map((a) => ({ label: a.title, href: `/for/${a.slug}` })),
          { label: "Communities", href: "/communities" },
        ],
      },
    };
  });

  const logo = (
    <Link href="/" className="inline-flex min-h-11 items-center rounded-s">
      <Logo layout="horizontal" version="colour" height={34} />
    </Link>
  );

  return (
    <header className="sticky top-0 z-40">
      <HeaderNav
        items={items}
        more={site.moreLinks}
        join={site.joinLink}
        logo={logo}
      />
      {/* How far down the page the reader is, along the header's lower edge.
          Scroll-driven CSS (.reading-progress in globals.css); hidden where
          unsupported or with reduced motion. */}
      <div
        aria-hidden="true"
        className="reading-progress pointer-events-none absolute inset-x-0 bottom-0 hidden h-0.5 origin-left bg-indigo"
      />
    </header>
  );
}
