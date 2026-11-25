import { expect, test } from "@playwright/test";

/* Homepage pacing: "On this page" dots on wide screens, and the eight
   areas of work as a row of cards to swipe through on phones. */

test.describe("section dots", () => {
  test("mark the section being read, on wide screens only", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "On this page" });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link")).toHaveCount(10);
    await expect(nav.getByRole("link", { name: "Roadmap" })).toHaveAttribute(
      "href",
      "#roadmap-heading",
    );

    await page.locator("#why-heading").scrollIntoViewIfNeeded();
    await page.evaluate(() => scrollBy(0, 200));
    await expect(nav.locator('[aria-current="location"]')).toHaveText(
      /Why ASSOCADS/,
    );

    await nav.getByRole("link", { name: "Good to know" }).click();
    await expect(page).toHaveURL(/#questions-heading$/);
    await expect(nav.locator('[aria-current="location"]')).toHaveText(
      "Good to know",
    );

    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(nav).toBeHidden();
  });
});

test.describe("areas of work on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("scroll sideways within the row, never the page", async ({ page }) => {
    await page.goto("/");
    const rail = page
      .locator("section", { has: page.locator("#programmes-heading") })
      .getByRole("list");
    await rail.scrollIntoViewIfNeeded();
    const metrics = await rail.evaluate((el) => ({
      scrolls: el.scrollWidth > el.clientWidth,
      snap: getComputedStyle(el).scrollSnapType,
    }));
    expect(metrics.scrolls).toBe(true);
    expect(metrics.snap).toContain("x");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBe(0);

    // Each card is reachable by keyboard, which brings it into view.
    const last = rail.getByRole("link").last();
    await last.focus();
    await expect(last).toBeInViewport();
  });
});
