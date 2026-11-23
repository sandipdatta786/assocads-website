import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  BANNER_STORAGE_KEY,
  StatusBanner,
} from "@/components/layout/StatusBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import { organisation, website } from "@/lib/seo/schema";
import "./globals.css";

// The three brand typefaces, self-hosted by next/font. See docs/BRAND_GUIDE.md.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-inter-tight",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.shortName} | ${site.name}`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.shortName,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: `${site.shortName}, ${site.name}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

// Hides the status banner before first paint if it was dismissed this session.
const bannerScript = `try{if(sessionStorage.getItem(${JSON.stringify(BANNER_STORAGE_KEY)}))document.documentElement.dataset.statusBannerDismissed=""}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bannerScript }} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${site.shortName}: insights and guides`}
          href="/feed.xml"
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main-content"
          className="sr-only rounded-pill bg-indigo px-5 py-3 text-small font-medium text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
        >
          Skip to content
        </a>
        <JsonLd items={[organisation(), website()]} />
        <SiteHeader />
        <StatusBanner />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
