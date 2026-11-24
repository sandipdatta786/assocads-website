import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/*
 * Accessibility and mobile checks to WCAG 2.2 AA (Prompt 22).
 *
 * - axe-core on every page in the sitemap, plus the 404 page, at 390px and
 *   1440px wide. Pages are split into chunks so the runs go in parallel.
 * - Layout on every page: no sideways scrolling at the phone, tablet and
 *   landscape widths, touch targets of at least 44 by 44 pixels, and
 *   form fields with text of at least 16px (so iOS does not zoom).
 * - Keyboard: the skip link, the desktop dropdowns, the mobile menu (focus
 *   trap and Escape), the accordions, a visible focus ring on everything
 *   that can take focus, and focus never hidden under the sticky header.
 */

const CHUNKS = 4;
const AXE_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

let cachedRoutes: string[] | undefined;
async function routes(page: Page): Promise<string[]> {
  if (cachedRoutes) return cachedRoutes;
  const xml = await (await page.request.get("/sitemap.xml")).text();
  cachedRoutes = [
    ...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => new URL(m[1]).pathname,
    ),
    "/no-such-page",
  ];
  return cachedRoutes;
}

function chunk<T>(items: T[], index: number): T[] {
  return items.filter((_, i) => i % CHUNKS === index);
}

test.describe.configure({ mode: "parallel" });

for (const width of [390, 1440]) {
  for (let part = 0; part < CHUNKS; part++) {
    test(`axe: every page at ${width}px (part ${part + 1} of ${CHUNKS})`, async ({
      browser,
    }) => {
      test.setTimeout(300_000);
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const problems: string[] = [];
      for (const path of chunk(await routes(page), part)) {
        await page.goto(path, { waitUntil: "load" });
        // Sections below the fold render only near the screen
        // (content-visibility in globals.css). axe measures positions and
        // background colours as it scrolls, so lay every section out first,
        // as each one is when a visitor reaches it.
        await page.addStyleTag({
          content: "section { content-visibility: visible !important; }",
        });
        const { violations } = await new AxeBuilder({ page })
          .withTags(AXE_TAGS)
          .analyze();
        for (const v of violations) {
          problems.push(
            `${path}: ${v.id} (${v.impact}) ${v.help}\n    ${v.nodes
              .slice(0, 3)
              .map((n) => n.target.join(" "))
              .join("\n    ")}`,
          );
        }
      }
      await context.close();
      expect(problems, problems.join("\n")).toEqual([]);
    });
  }
}

/** Phone and tablet widths, then two phones held sideways. */
const LAYOUTS = [
  { width: 320, height: 640 },
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 768, height: 1024 },
  { width: 667, height: 375 },
  { width: 844, height: 390 },
];

for (let part = 0; part < CHUNKS; part++) {
  test(`layout: no sideways scrolling, targets and field text (part ${part + 1} of ${CHUNKS})`, async ({
    browser,
  }) => {
    test.setTimeout(300_000);
    const problems: string[] = [];
    for (const viewport of LAYOUTS) {
      const context = await browser.newContext({
        viewport,
        reducedMotion: "reduce",
        hasTouch: viewport.width < 768,
      });
      const page = await context.newPage();
      for (const path of chunk(await routes(page), part)) {
        await page.goto(path, { waitUntil: "load" });
        const found = await page.evaluate(
          ({ checkTargets, checkText }) => {
            const out: string[] = [];
            const doc = document.documentElement;
            if (doc.scrollWidth > window.innerWidth)
              out.push(`scrolls sideways (${doc.scrollWidth}px)`);
            // Text enlarged to 200% (as with the browser's text size
            // setting) must not push the page sideways either.
            if (checkText) {
              doc.style.fontSize = "200%";
              if (doc.scrollWidth > window.innerWidth)
                out.push(
                  `scrolls sideways with 200% text (${doc.scrollWidth}px)`,
                );
              doc.style.fontSize = "";
            }
            if (!checkTargets) return out;
            const visible = (el: Element) => {
              const r = el.getBoundingClientRect();
              return (
                r.width > 0 &&
                r.height > 0 &&
                getComputedStyle(el).visibility !== "hidden" &&
                !el.closest(".sr-only")
              );
            };
            const controls = document.querySelectorAll<HTMLElement>(
              "a[href], button, summary, input:not([type=hidden]), select, textarea",
            );
            for (const el of controls) {
              if (!visible(el)) continue;
              // Links inside running text are exempt (WCAG 2.5.8).
              const block = el.closest("p, li, dd, td, th, label, figcaption");
              if (
                el.tagName === "A" &&
                getComputedStyle(el).display === "inline" &&
                block &&
                (block.textContent ?? "").trim().length >
                  (el.textContent ?? "").trim().length + 5
              )
                continue;
              let box = el.getBoundingClientRect();
              // A card link whose ::after covers the whole card.
              const after = getComputedStyle(el, "::after");
              if (after.content !== "none" && after.position === "absolute") {
                const card = el.parentElement?.closest<HTMLElement>(
                  ".relative, [class*='relative']",
                );
                if (card) box = card.getBoundingClientRect();
              }
              // Links in data-table cells: WCAG 2.5.8's 24px minimum.
              const min = el.closest("td, th") ? 24 : 44;
              const input = el as HTMLInputElement;
              if (input.type === "checkbox" || input.type === "radio") {
                const label = el.closest("label");
                if (label) box = label.getBoundingClientRect();
              }
              if (box.width < min || box.height < min) {
                const name = (
                  el.getAttribute("aria-label") ??
                  el.textContent ??
                  ""
                ).trim();
                out.push(
                  `target ${Math.round(box.width)}x${Math.round(box.height)}: ${el.tagName.toLowerCase()} "${name.slice(0, 40)}"`,
                );
              }
            }
            for (const el of document.querySelectorAll<HTMLInputElement>(
              "input:not([type=hidden]):not([type=checkbox]):not([type=radio]), select, textarea",
            )) {
              if (!visible(el)) continue;
              const size = parseFloat(getComputedStyle(el).fontSize);
              if (size < 16) out.push(`field text ${size}px: ${el.name}`);
            }
            return out;
          },
          {
            checkTargets: viewport.width === 390,
            checkText: viewport.width <= 390,
          },
        );
        for (const f of found)
          problems.push(
            `${path} at ${viewport.width}x${viewport.height}: ${f}`,
          );
      }
      await context.close();
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });
}

test.describe("keyboard", () => {
  test.use({ reducedMotion: "reduce" });

  test("the skip link is the first stop and moves focus to the content", async ({
    page,
  }) => {
    await page.goto("/membership");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("desktop dropdowns open with the keyboard and close with Escape", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const trigger = page
      .getByRole("banner")
      .getByRole("button", { name: "About" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    const panel = page.locator(
      `#${await trigger.getAttribute("aria-controls")}`,
    );
    await expect(panel.locator(":focus")).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("the current section is marked with aria-current", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/membership");
    await expect(
      page.getByRole("banner").locator('[aria-current="page"]'),
    ).toHaveText("Membership");
  });

  test("the mobile menu traps focus and closes with Escape", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const button = page.getByRole("button", { name: "Open menu", exact: true });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    // Tab more times than there are controls: focus must stay inside.
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(
        () =>
          !!document.activeElement?.closest('[role="dialog"]') ||
          !!document.activeElement?.closest("header"),
      );
      expect(inside, `focus left the menu after ${i + 1} tabs`).toBe(true);
    }
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("accordions open and close from the keyboard", async ({ page }) => {
    await page.goto("/faq");
    const summary = page.locator("details summary").first();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("details").first()).toHaveAttribute("open", "");
    await page.keyboard.press("Space");
    await expect(page.locator("details").first()).not.toHaveAttribute(
      "open",
      "",
    );
  });

  for (const width of [390, 1440]) {
    test(`every stop shows a focus ring and is not under the header at ${width}px`, async ({
      page,
    }) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
      const problems: string[] = [];
      for (const path of [
        "/",
        "/membership",
        "/contact",
        "/events",
        "/guides/what-is-responsible-ai",
        "/programmes/training-and-certification",
      ]) {
        await page.goto(path);
        for (let i = 0; i < 150; i++) {
          await page.keyboard.press("Tab");
          const stop = await page.evaluate(() => {
            const el = document.activeElement as HTMLElement | null;
            if (!el || el === document.body) return null;
            const cs = getComputedStyle(el);
            const box = el.getBoundingClientRect();
            const header = document.querySelector("header");
            const headerBottom =
              header && /sticky|fixed/.test(getComputedStyle(header).position)
                ? header.getBoundingClientRect().bottom
                : 0;
            return {
              name: `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 30)}"`,
              ring:
                (cs.outlineStyle !== "none" &&
                  parseFloat(cs.outlineWidth) > 0) ||
                cs.boxShadow !== "none",
              // The skip link is fixed above the header on purpose.
              // Anything that fits below the header must be fully clear of
              // it; something taller than that space (a long table) must
              // not be entirely hidden (WCAG 2.4.11).
              covered:
                !el.closest("header") &&
                cs.position !== "fixed" &&
                (box.height <= window.innerHeight - headerBottom
                  ? box.top < headerBottom - 1
                  : box.bottom <= headerBottom),
              footer: !!el.closest("footer"),
            };
          });
          if (!stop) break;
          if (!stop.ring)
            problems.push(`${path}: no focus ring on ${stop.name}`);
          if (stop.covered)
            problems.push(`${path}: ${stop.name} is under the header`);
          if (stop.footer) break;
        }
      }
      expect(problems, problems.join("\n")).toEqual([]);
    });
  }
});
