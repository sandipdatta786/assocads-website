import createMDX from "@next/mdx";
import type { NextConfig } from "next";

/** Paths the old one-page site or common guesses may have used. The old
    site's #anchors are handled on the home page, because the part after #
    never reaches the server. */
const oldPaths: Array<[string, string]> = [
  ["/index.html", "/"],
  ["/home", "/"],
  ["/about-us", "/about"],
  ["/leaders", "/about/trustees"],
  ["/trustees", "/about/trustees"],
  ["/programs", "/programmes"],
  ["/programs/:slug", "/programmes/:slug"],
  ["/plan", "/about/roadmap"],
  ["/goals", "/about/objects"],
  ["/news", "/insights"],
  ["/blog", "/insights"],
  ["/join", "/membership/apply"],
  ["/privacy", "/legal/privacy"],
  ["/terms", "/legal/terms"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return oldPaths.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  async headers() {
    // Preview deployments must never be indexed: only the real domain.
    if (process.env.VERCEL_ENV !== "preview") return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  // Photographs are served as AVIF where the browser supports it (about 20%
  // smaller than WebP), then WebP. Graphics are SVG and are not converted.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// MDX content in content/ is imported by pages. Plugins are named as strings
// so that Turbopack can use them. remark-frontmatter strips the --- block,
// which the content loaders read and validate separately.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-gfm"],
  },
});

export default withMDX(nextConfig);
