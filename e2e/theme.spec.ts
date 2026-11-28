import { expect, test } from "@playwright/test";

/* Light and dark themes: time of day by default, a saved choice
   applied before the first paint, controls in the header and footer that
   agree, and forms that stay light. */

const theme = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.documentElement.dataset.theme);

test("follows the visitor's clock when nothing is chosen", async ({
  browser,
}) => {
  for (const [time, expected] of [
    ["2026-11-28T21:30:00", "dark"],
    ["2026-11-28T13:00:00", "light"],
  ] as const) {
    // The system setting says the opposite, so the clock must win.
    const context = await browser.newContext({
      colorScheme: expected === "dark" ? "light" : "dark",
    });
    const page = await context.newPage();
    await page.clock.install({ time: new Date(time) });
    await page.goto("/");
    expect(await theme(page)).toBe(expected);
    await context.close();
  }
});

test("the system setting is followed when the visitor chooses it", async ({
  browser,
}) => {
  for (const scheme of ["light", "dark"] as const) {
    const context = await browser.newContext({ colorScheme: scheme });
    await context.addInitScript(() =>
      localStorage.setItem("assocads:theme", "system"),
    );
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
  // Daytime, so the default (time of day) starts light.
  await page.clock.install({ time: new Date("2026-11-28T13:00:00") });
  await page.goto("/");
  const toggle = page.getByRole("banner").getByRole("button", {
    name: "Dark theme",
  });
  const footer = page.getByRole("group", { name: "Theme" });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(
    footer.getByRole("button", { name: "Time of day" }),
  ).toHaveAttribute("aria-pressed", "true");

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
  ).toBe("system");
  await context.close();
});

test("forms stay light in the dark theme", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "dark" });
  await context.addInitScript(() =>
    localStorage.setItem("assocads:theme", "dark"),
  );
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

test("time of day: dark at night, light by day, by the visitor's clock", async ({
  browser,
}) => {
  // Four full page loads: allow longer than the default 30 seconds.
  test.setTimeout(90_000);
  for (const [time, expected] of [
    ["2026-11-28T21:30:00", "dark"],
    ["2026-11-28T06:59:00", "dark"],
    ["2026-11-28T07:00:00", "light"],
    ["2026-11-28T13:00:00", "light"],
  ] as const) {
    // The system setting says the opposite, so the clock must win.
    const context = await browser.newContext({
      colorScheme: expected === "dark" ? "light" : "dark",
    });
    await context.addInitScript(() =>
      localStorage.setItem("assocads:theme", "time"),
    );
    const page = await context.newPage();
    await page.clock.install({ time: new Date(time) });
    await page.goto("/");
    expect(await theme(page)).toBe(expected);
    await expect(
      page
        .getByRole("group", { name: "Theme" })
        .getByRole("button", { name: "Time of day" }),
    ).toHaveAttribute("aria-pressed", "true");
    await context.close();
  }
});

test("time of day turns dark at 7 pm without a reload", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "light" });
  const page = await context.newPage();
  await page.clock.install({ time: new Date("2026-11-28T18:58:30") });
  await page.goto("/");
  await page
    .getByRole("group", { name: "Theme" })
    .getByRole("button", { name: "Time of day" })
    .click();
  expect(await theme(page)).toBe("light");
  await page.clock.runFor(3 * 60_000);
  expect(await theme(page)).toBe("dark");
  await context.close();
});
