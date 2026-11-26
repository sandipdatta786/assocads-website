/**
 * Lighthouse CI: `pnpm build` then `pnpm lighthouse`. See docs/PERFORMANCE.md.
 *
 * Seven representative pages are tested five times each on Lighthouse's
 * default mobile profile (a mid-range phone on a slow 4G connection, with
 * the processor slowed four times). For each budget below, the middle value
 * of the five runs must pass, so one run spoilt by a busy computer does not
 * fail the check. Reports are written to .lighthouseci/ and never uploaded.
 */

const PORT = 3400;
// LIGHTHOUSE_PROFILE=desktop runs the same pages on Lighthouse's desktop
// profile. (Not LHCI_*: Lighthouse CI reads those as its own options.)
const desktop = process.env.LIGHTHOUSE_PROFILE === "desktop";
const pages = [
  "/",
  "/programmes",
  "/programmes/training-and-certification",
  "/about/trustees",
  "/guides/what-is-responsible-ai",
  "/membership",
  "/contact",
];

module.exports = {
  ci: {
    collect: {
      startServerCommand: `pnpm start -p ${PORT}`,
      startServerReadyPattern: "Ready",
      url: pages.map((p) => `http://localhost:${PORT}${p}`),
      numberOfRuns: 5,
      settings: {
        chromeFlags: "--headless=new",
        ...(desktop && { preset: "desktop" }),
      },
    },
    assert: {
      // "median" takes the middle value of each figure. ("median-run" picks
      // one whole run by its timings, which can be the one slow run.)
      aggregationMethod: "median",
      assertions: {
        // Blueprint section 4.3: at least 95 in every category on mobile.
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        // Core Web Vitals targets from the same section. Total Blocking Time
        // stands in for Interaction to Next Paint, which needs a real visitor.
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: desktop ? ".lighthouseci/desktop" : ".lighthouseci",
    },
  },
};
