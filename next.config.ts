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

const isPreview = process.env.VERCEL_ENV === "preview";
const isDev = process.env.NODE_ENV === "development";

/** Cloudflare Turnstile, the spam check on the forms: its script and frame. */
const TURNSTILE = "https://challenges.cloudflare.com";
/** YouTube's privacy-enhanced player, loaded only when a visitor presses
    Play on /voices (src/components/voices/VoicePlayer.tsx). */
const YOUTUBE_PLAYER = "https://www.youtube-nocookie.com";
/** Vercel's comment toolbar, shown only on preview deployments. */
const TOOLBAR = isPreview ? ["https://vercel.live"] : [];

/**
 * What the site may load. Everything is served from the site itself, except
 * the Turnstile spam check. Vercel Web Analytics and Speed Insights load from
 * the site's own /_vercel/ paths. Scripts need 'unsafe-inline' because pages
 * are built ahead of time with small inline scripts (Next.js page data, the
 * status banner), and per-request nonces would mean giving that up.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    TURNSTILE,
    ...TOOLBAR,
    ...(isDev ? ["'unsafe-eval'"] : []),
  ].join(" "),
  ["style-src 'self' 'unsafe-inline'", ...TOOLBAR].join(" "),
  [
    "img-src 'self' data: blob:",
    ...(isPreview ? ["https://vercel.live", "https://vercel.com"] : []),
  ].join(" "),
  [
    "font-src 'self'",
    ...(isPreview ? ["https://vercel.live", "https://assets.vercel.com"] : []),
  ].join(" "),
  [
    "connect-src 'self'",
    TURNSTILE,
    ...(isPreview ? ["https://vercel.live", "wss://ws-us3.pusher.com"] : []),
    ...(isDev ? ["ws:"] : []),
  ].join(" "),
  ["frame-src", TURNSTILE, YOUTUBE_PLAYER, ...TOOLBAR].join(" "),
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  // Only on Vercel: on a local http:// address it would break the page.
  ...(process.env.VERCEL ? ["upgrade-insecure-requests"] : []),
].join("; ");

/**
 * The admin editor at /admin (Decap CMS, public/admin/) is a separate app. It
 * loads its pinned script from unpkg (checked by an integrity hash), talks to
 * GitHub's API and shows images from GitHub. It also needs 'unsafe-eval',
 * because Decap checks its settings with code it compiles at run time. These
 * looser rules apply only under /admin, which holds no public content and is
 * never indexed.
 */
const adminContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.githubusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.github.com https://*.githubusercontent.com",
  "frame-src 'self' blob:",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Browsers ignore this on http://, so it is safe locally.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  // For older browsers; frame-ancestors above does the same in newer ones.
  { key: "X-Frame-Options", value: "DENY" },
];

/* Files in public/ keep their names when they change, so browsers keep them
   for a week rather than a year. Next.js already serves its own build files
   (/_next/static: scripts, styles, fonts) with a one-year immutable cache,
   because their names change whenever their contents do. */
const publicFileCache = "public, max-age=604800, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  // No "X-Powered-By: Next.js" header: it tells visitors nothing they need.
  poweredByHeader: false,
  async redirects() {
    return oldPaths.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  // The admin editor lives in public/admin/index.html; serve it at /admin.
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
  async headers() {
    const adminHeaders = [
      { key: "Content-Security-Policy", value: adminContentSecurityPolicy },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
      { key: "Cache-Control", value: "no-store" },
    ];
    return [
      { source: "/:path*", headers: securityHeaders },
      // Later entries override earlier ones for the same header.
      { source: "/admin", headers: adminHeaders },
      { source: "/admin/:path*", headers: adminHeaders },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:dir(brand|images)/:path*",
        headers: [{ key: "Cache-Control", value: publicFileCache }],
      },
      // Preview deployments must never be indexed: only the real domain.
      ...(isPreview
        ? [
            {
              source: "/:path*",
              headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
            },
          ]
        : []),
    ];
  },
  // Photographs are served as AVIF where the browser supports it (about 20%
  // smaller than WebP), then WebP. Graphics are SVG and are not converted.
  // YouTube thumbnails on /voices are fetched by the site's image service,
  // so visitors' browsers do not contact YouTube until they press Play.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
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
