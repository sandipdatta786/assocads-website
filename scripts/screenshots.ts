/**
 * node scripts/screenshots.ts <origin> <label>
 *
 * Full-page screenshots of the home, membership and a programme page at
 * 390px and 1440px wide, written to test-results/screenshots/<label>/.
 * Used for before-and-after comparisons of visual changes. The page is
 * scrolled to the bottom first so that anything revealed on scroll shows.
 */
import { chromium } from "@playwright/test";

const [origin = "http://localhost:3000", label = "current"] =
  process.argv.slice(2);
const PAGES = ["/", "/membership", "/programmes/training-and-certification"];
const WIDTHS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
];

const browser = await chromium.launch();
try {
  for (const viewport of WIDTHS) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    for (const p of PAGES) {
      await page.goto(`${origin}${p}`, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 400) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        // Lazy images must have loaded before the full-page capture.
        await Promise.all(
          [...document.images].map((img) => {
            img.loading = "eager";
            return img.complete
              ? null
              : new Promise((r) => {
                  img.onload = img.onerror = r;
                });
          }),
        );
      });
      await page.waitForTimeout(900);
      const name = p === "/" ? "home" : p.split("/").filter(Boolean).join("-");
      const file = `test-results/screenshots/${label}/${name}-${viewport.width}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log(file);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
