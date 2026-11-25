import { expect, test, type Page } from "@playwright/test";

/*
 * The custom events sent to Vercel Web Analytics. Its script loads only on
 * Vercel, so these tests put a stand-in window.va in its place and read
 * back what was sent.
 */

type Call = [string, { name: string; data?: Record<string, unknown> }];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { va: unknown; vaCalls: unknown[] };
    w.vaCalls = [];
    w.va = (...args: unknown[]) => w.vaCalls.push(args);
  });
});

async function events(page: Page) {
  const calls = await page.evaluate(
    () => (window as unknown as { vaCalls: Call[] }).vaCalls,
  );
  return calls.filter(([kind]) => kind === "event").map(([, e]) => e);
}

test("a membership click from the header is counted with its place on the page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Become a member", exact: true })
    .click();
  await expect(page).toHaveURL(/\/membership\/apply$/);
  expect(await events(page)).toContainEqual({
    name: "Join click",
    data: { location: "header", page: "/about" },
  });
});

test("a download is counted with the file's address", async ({ page }) => {
  await page.goto("/resources");
  const link = page.locator("a[download]").first();
  const href = await link.getAttribute("href");
  const download = page.waitForEvent("download");
  await link.click();
  await download;
  expect(await events(page)).toContainEqual({
    name: "Download",
    data: { file: new URL(href!, page.url()).pathname, page: "/resources" },
  });
});

test("other links send nothing", async ({ page }) => {
  await page.goto("/about");
  await page
    .getByRole("main")
    .getByRole("link", { name: /governance/i })
    .first()
    .click();
  await expect(page).toHaveURL(/governance/);
  expect(await events(page)).toEqual([]);
});

test("no search engine tags without their settings", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator('meta[name="google-site-verification"]'),
  ).toHaveCount(0);
  await expect(page.locator('meta[name="msvalidate.01"]')).toHaveCount(0);
});
