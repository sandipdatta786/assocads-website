import { expect, test } from "@playwright/test";

/* Light and dark themes: the system setting by default, a saved choice
   applied before the first paint, controls in the header and footer that
   agree, and forms that stay light. */

const theme = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.documentElement.dataset.theme);

test("follows the system setting when nothing is chosen", async ({
  browser,
}) => {
  for (const scheme of ["light", "dark"] as const) {
    const context = await browser.newContext({ colorScheme: scheme });
    const page = await context.newPage();
    await page.goto("/");
    expect(await theme(page)).toBe(scheme);
    await context.close();
  }
});

test("a saved choice is applied before the page is drawn", async ({
  browser,
}) => {
  const context = await browser.newContext({ colorScheme: "light" });
  await context.addInitScript(() =>
    localStorage.setItem("assocads:theme", "dark"),
  );
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "commit" });
  // Before any script of the page's own has run: set by the inline script.
  const atParse = await page.evaluate(
    () =>
      new Promise<[string | undefined, string]>((resolve) => {
        const read = () =>
          resolve([
            document.documentElement.dataset.theme,
            getComputedStyle(document.body).backgroundColor,
          ]);
        if (document.readyState === "loading")
          document.addEventListener("DOMContentLoaded", read);
        else read();
      }),
  );
  expect(atParse).toEqual(["dark", "rgb(11, 16, 32)"]);
  await context.close();
});

test("header and footer controls agree and the choice is kept", async ({
  browser,
}) => {
  const context = await browser.newContext({
    colorScheme: "light",
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/");
  const toggle = page.getByRole("banner").getByRole("button", {
    name: "Dark theme",
  });
  const footer = page.getByRole("group", { name: "Theme" });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(footer.getByRole("button", { name: "System" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await toggle.click();
  expect(await theme(page)).toBe("dark");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(footer.getByRole("button", { name: "Dark" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.goto("/about");
  expect(await theme(page)).toBe("dark");

  await footer.getByRole("button", { name: "System" }).click();
  expect(await theme(page)).toBe("light");
  expect(
    await page.evaluate(() => localStorage.getItem("assocads:theme")),
  ).toBeNull();
  await context.close();
});

test("forms stay light in the dark theme", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "dark" });
  const page = await context.newPage();
  await page.goto("/contact");
  expect(await theme(page)).toBe("dark");
  const card = page.locator('[data-theme="light"]').filter({
    has: page.locator("#contact-form-name"),
  });
  await expect(card).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.locator("#contact-form-name")).toHaveCSS(
    "color",
    "rgb(11, 16, 32)",
  );
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(11, 16, 32)",
  );
  await context.close();
});
