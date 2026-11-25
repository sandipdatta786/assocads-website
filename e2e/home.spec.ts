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

test.describe("people on the homepage", () => {
  test("open a card of details on click, hover and Enter, never placeholders", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const section = page.locator("section", {
      has: page.locator("#trustees-heading"),
    });
    await section.scrollIntoViewIfNeeded();
    const tiles = section.getByRole("button");
    await expect(tiles).toHaveCount(12);
    const openCard = page.locator("[popover]:popover-open");

    // Click opens; Esc closes and returns focus to the tile.
    const sandip = tiles.filter({ hasText: "Sandip Datta" });
    await sandip.click();
    await expect(openCard).toBeVisible();
    await expect(openCard).toContainText("Branding and communication");
    await expect(
      openCard.getByRole("link", { name: /on LinkedIn/ }),
    ).toHaveAttribute("href", /^https:\/\/www\.linkedin\.com\//);
    await page.keyboard.press("Escape");
    await expect(openCard).toHaveCount(0);

    // Hover opens, and the card stays open while the pointer is on it.
    await tiles.first().hover();
    await expect(openCard).toBeVisible();
    await openCard.hover();
    await page.waitForTimeout(400);
    await expect(openCard).toBeVisible();
    await page.mouse.move(5, 5);
    await expect(openCard).toHaveCount(0);

    // Keyboard: Enter opens, Tab reaches its links.
    await sandip.focus();
    await page.keyboard.press("Enter");
    await expect(openCard).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(openCard.getByRole("link").first()).toBeFocused();

    // No card ever shows a placeholder.
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press("Escape");
      await tiles.nth(i).click();
      await expect(openCard).toBeVisible();
      await expect(openCard).not.toContainText("PLACEHOLDER");
      const box = await openCard.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(1440);
    }
  });

  test("the card stays on screen on a small phone", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");
    const section = page.locator("section", {
      has: page.locator("#trustees-heading"),
    });
    await section.scrollIntoViewIfNeeded();
    await section.getByRole("button").nth(1).click();
    const box = await page.locator("[popover]:popover-open").boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  });
});
