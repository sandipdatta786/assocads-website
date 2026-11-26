# Speed and Core Web Vitals

Many visitors use mid-range Android phones on mobile data, so the site is measured as a phone, not a laptop. The targets come from section 4.3 of `docs/BLUEPRINT.md`:

- **Largest Contentful Paint** under 2.5 seconds;
- **Interaction to Next Paint** under 200 milliseconds;
- **Cumulative Layout Shift** under 0.1;
- **Lighthouse** at least 95 for performance, accessibility, best practices and SEO.

## How to check

Build the site, then run Lighthouse CI:

```bash
pnpm build
```

```bash
pnpm lighthouse
```

It starts the production build on port 3400 and runs Lighthouse five times on each of seven pages: the home page, the programmes page, a programme page, the trustees page, a guide, the membership page and the contact page. It uses Lighthouse's standard mobile profile: a mid-range phone on slow 4G, with the processor slowed four times. For each budget, the middle value of the five runs must pass, or the command fails:

| Budget                   | Limit               |
| ------------------------ | ------------------- |
| Performance              | at least 95         |
| Accessibility            | at least 95         |
| Best practices           | at least 95         |
| SEO                      | at least 95         |
| Largest Contentful Paint | at most 2.5 seconds |
| Cumulative Layout Shift  | at most 0.1         |
| Total Blocking Time      | 200 ms (a warning)  |

Total Blocking Time stands in for Interaction to Next Paint, which can only be measured with real visitors.

The same pages and budgets on Lighthouse's desktop profile:

```bash
pnpm lighthouse:desktop
```

Its reports go to `.lighthouseci/desktop/`.

The reports are saved in `.lighthouseci/`, which is not committed. Open any `lhr-*.html` file in a browser to read one. The budgets and the list of pages are in `lighthouserc.cjs`.

Lighthouse slows the processor by a fixed amount, so a busy computer gives lower scores. Close other heavy apps before running it. For the same reason it is not part of the GitHub check, where shared machines vary from run to run.

## The automatic check on GitHub

`.github/workflows/ci.yml` runs on every pull request and every push to `main`. It runs, in this order:

- lint;
- type checking;
- the content check;
- the production build;
- the SEO check;
- the end-to-end tests, which include the accessibility and colour checks.

If something fails, it keeps the Playwright traces for a week as a download on the run's page.

## What keeps the site fast

**Every page is static.** All 86 pages in the sitemap are built ahead of time and served from Vercel's cache. The only parts that render on request are the shells for addresses that do not exist (an unknown guide or event, for example), which show the 404 page.

**Server components by default.** Only these parts send JavaScript to the browser, because each one reacts to the visitor:

| Component                                                                       | Why it runs in the browser                                                        |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `HeaderNav`                                                                     | Desktop dropdowns and the mobile menu: opening, closing, focus and Escape         |
| `SiteSearch`                                                                    | The search dialog (⌘K or Ctrl+K); its index loads only when the dialog opens      |
| `ThemeToggle`, `ThemeChoices`                                                   | Switching between the light and dark themes and saving the choice                 |
| `AnalyticsEvents`                                                               | Counting clicks on Join links and downloads, with no personal data                |
| `DismissBanner`                                                                 | The button that hides the registration banner for the session                     |
| `Reveal`                                                                        | Sections fading in as they scroll into view                                       |
| `HeroNetwork`, `SectionDots`, `PersonPeek`                                      | The homepage: the hero graphic, the "On this page" dots and the trustee cards     |
| `VoicePlayer`                                                                   | Playing a video only after someone asks for it                                    |
| Forms (`EnquiryForm`, `RegisterInterestForm`, `CommunityInterestForm`, helpers) | Checking answers, showing errors, sending without a page reload, Turnstile        |
| `FaqBrowser`, `GlossaryIndex`                                                   | Searching and filtering the list as you type                                      |
| `EventsBrowser`, `InsightsBrowser`, `FilterGroup`                               | Filters kept in the address so a filtered list can be shared                      |
| `EventPhase`, `EventStatusBadge`                                                | "Upcoming" or "past" by the visitor's clock, which a static page cannot know      |
| `app/error.tsx`                                                                 | Next.js requires the error page to run in the browser so it can offer "Try again" |

**Heavy code loads only when it is needed.**

- The form rules use Zod, which is about 34 KB compressed. They load when someone first moves into a form, not with the page.
- Cloudflare Turnstile loads only when a form comes within a screen's height of view, or someone moves into it. No other third-party script loads with any page.

**Long pages render as you scroll.** Sections after the first use `content-visibility: auto`, so a phone lays out and paints only what is near the screen. The content stays in the page for search engines, screen readers and find-in-page.

**Fonts.**

- The three brand typefaces are self-hosted by `next/font`.
- Only the Latin files are preloaded. All three are used above the fold: Inter for body text, Inter Tight for headings and JetBrains Mono for the small labels.
- Each family is a single variable file, so listing fewer weights would not make it smaller.
- Fallback fonts are resized to match, so nothing moves when the brand fonts arrive.

**Images.**

- Photographs go through `next/image`, which serves AVIF or WebP at the right size with fixed dimensions.
- The logo and all graphics are SVG.
- Avatars without a photograph are initials on a fixed-size tile, so they never shift the layout.

**Layout stability.** The registration banner is in the HTML from the start. Whether it was dismissed is checked before the first paint, so it never appears and then disappears.
