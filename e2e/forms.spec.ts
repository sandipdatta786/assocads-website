import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

/*
 * Every form: a successful submission (the email step writes to the test
 * outbox instead of sending), a validation failure, and the honeypot.
 * Each test sends from its own made-up internet address, so the rate limit
 * of one test never affects another.
 */

const outbox = process.env.FORMS_TEST_OUTBOX ?? ".e2e-outbox";

type Sent = {
  secretariat: { to: string; replyTo: string; subject: string; text: string };
  acknowledgement: { to: string; replyTo: string; subject: string };
};

/** The emails written for one sender address, if any. */
async function sentTo(email: string): Promise<Sent[]> {
  let files: string[] = [];
  try {
    files = await readdir(outbox);
  } catch {
    return [];
  }
  const all = await Promise.all(
    files.map(
      async (f) =>
        JSON.parse(await readFile(path.join(outbox, f), "utf8")) as Sent,
    ),
  );
  return all.filter((m) => m.acknowledgement.to === email);
}

let counter = 0;
function uniqueEmail(label: string) {
  counter += 1;
  return `${label}-${Date.now()}-${counter}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

test.beforeEach(async ({ page }) => {
  const part = () => Math.floor(Math.random() * 250) + 1;
  await page.setExtraHTTPHeaders({
    "x-forwarded-for": `198.51.${part()}.${part()}, 10.0.0.1`,
  });
});

/** The form records when it appeared; pretend it has been open a minute, so
    tests need not wait out the minimum time. */
async function ageForm(page: Page) {
  await page.evaluate(() => {
    for (const input of document.querySelectorAll<HTMLInputElement>(
      'input[name="started"]',
    ))
      input.value = String(Date.now() - 60_000);
  });
}

async function waitForHydration(page: Page) {
  await expect(page.locator('input[name="started"]').first()).not.toHaveValue(
    "",
  );
}

async function fillHoneypot(page: Page, formId: string) {
  await page.evaluate((id) => {
    const el = document.getElementById(`${id}-website`) as HTMLInputElement;
    el.value = "https://spam.example";
  }, formId);
}

type FormCase = {
  kind: string;
  path: string;
  formId: string;
  submit: string;
  fill: (page: Page, email: string) => Promise<void>;
  /** A message the empty form must show, tied to a field. */
  emptyError: { field: string; text: string };
  subject: RegExp;
  to: string;
};

const cases: FormCase[] = [
  {
    kind: "membership interest",
    path: "/membership/apply",
    formId: "register-interest",
    submit: "Register your interest",
    async fill(page, email) {
      await page.locator("#register-interest-name").fill("Asha Test");
      await page.locator("#register-interest-email").fill(email);
      await page.locator("#register-interest-city").fill("Kolkata");
      await page.getByLabel("A student").check();
      await page.getByLabel("Ordinary membership").check();
      await page.locator("#register-interest-consent").check();
    },
    emptyError: {
      field: "#register-interest-city",
      text: "Enter the city where you live or work.",
    },
    subject: /^Membership interest from Asha Test$/,
    to: "secretariat@example.org",
  },
  {
    kind: "community interest",
    path: "/communities",
    formId: "community-interest",
    submit: "Send my interest",
    async fill(page, email) {
      await page.locator("#community-interest-name").fill("Asha Test");
      await page.locator("#community-interest-email").fill(email);
      await page.locator("#community-interest-city").fill("Kolkata");
      await page.locator("#community-interest-choice").selectOption("not-sure");
      await page.getByLabel("Maybe, tell me more").check();
      await page.locator("#community-interest-consent").check();
    },
    emptyError: {
      field: "#community-interest-choice",
      text: "Choose a group or a chapter, or choose Not sure yet.",
    },
    subject: /^Community interest from Asha Test$/,
    to: "secretariat@example.org",
  },
  {
    kind: "partnership enquiry",
    path: "/partner",
    formId: "partner-enquiry",
    submit: "Send enquiry",
    async fill(page, email) {
      await page.locator("#partner-enquiry-name").fill("Asha Test");
      await page.locator("#partner-enquiry-role").fill("Head of Department");
      await page.locator("#partner-enquiry-organisation").fill("Test College");
      await page.locator("#partner-enquiry-type").selectOption("academic");
      await page.locator("#partner-enquiry-email").fill(email);
      await page.locator("#partner-enquiry-areas-training").check();
      await page.locator("#partner-enquiry-message").fill("A workshop series.");
      await page.locator("#partner-enquiry-consent").check();
    },
    emptyError: {
      field: "#partner-enquiry-organisation",
      text: "Enter the name of your organisation.",
    },
    subject: /^Partnership enquiry from Asha Test$/,
    to: "secretariat@example.org",
  },
  {
    kind: "pledge or sponsor",
    path: "/support",
    formId: "pledge-or-sponsor",
    submit: "Send my offer",
    async fill(page, email) {
      await page.locator("#pledge-or-sponsor-name").fill("Asha Test");
      await page.locator("#pledge-or-sponsor-email").fill(email);
      await page.getByLabel("Offer a venue").check();
      await page
        .locator("#pledge-or-sponsor-message")
        .fill("A room for forty people in Salt Lake.");
      await page.locator("#pledge-or-sponsor-consent").check();
    },
    emptyError: {
      field: "#pledge-or-sponsor-message",
      text: "Tell us a little more about your offer.",
    },
    subject: /^Pledge or sponsor offer from Asha Test$/,
    to: "secretariat@example.org",
  },
  {
    kind: "idea or innovation",
    path: "/innovation",
    formId: "showcase-idea",
    submit: "Send my idea",
    async fill(page, email) {
      await page.locator("#showcase-idea-name").fill("Asha Test");
      await page.locator("#showcase-idea-email").fill(email);
      await page.locator("#showcase-idea-role").selectOption("student");
      await page.locator("#showcase-idea-title").fill("Field soil checker");
      await page.locator("#showcase-idea-area").selectOption("agriculture");
      await page.locator("#showcase-idea-stage").selectOption("prototype");
      await page
        .locator("#showcase-idea-summary")
        .fill("A low-cost soil test that farmers can run themselves.");
      await page.getByLabel("Mentoring from experienced practitioners").check();
      await page.locator("#showcase-idea-consent").check();
    },
    emptyError: {
      field: "#showcase-idea-title",
      text: "Give the idea a short name.",
    },
    subject: /^Idea or innovation submission from Asha Test$/,
    to: "secretariat@example.org",
  },
  {
    kind: "contact",
    path: "/contact",
    formId: "contact-form",
    submit: "Send message",
    async fill(page, email) {
      await page.locator("#contact-form-name").fill("Asha Test");
      await page.locator("#contact-form-email").fill(email);
      await page.locator("#contact-form-topic").selectOption("media");
      await page.locator("#contact-form-message").fill("A question.");
      await page.locator("#contact-form-consent").check();
    },
    emptyError: {
      field: "#contact-form-topic",
      text: "Choose what your message is about.",
    },
    // Media messages go to the media address, not the general one.
    subject: /^Contact message: Media from Asha Test$/,
    to: "media@example.org",
  },
];

for (const c of cases) {
  test.describe(c.kind, () => {
    test("sends a valid submission", async ({ page }) => {
      const email = uniqueEmail("ok");
      // Stands in for Vercel Web Analytics, which loads only on Vercel.
      await page.addInitScript(() => {
        const w = window as unknown as { va: unknown; vaCalls: unknown[] };
        w.vaCalls = [];
        w.va = (...args: unknown[]) => w.vaCalls.push(args);
      });
      await page.goto(c.path);
      await waitForHydration(page);
      await c.fill(page, email);
      await ageForm(page);
      await page.getByRole("button", { name: c.submit }).click();

      const status = page.getByRole("status").filter({ hasText: "Thank you" });
      await expect(status).toBeVisible();
      await expect(status).toBeFocused();
      await expect(status).toContainText("Test mode");

      // The send is counted with the kind of form only, never the answers.
      const calls = await page.evaluate(
        () => (window as unknown as { vaCalls: unknown[] }).vaCalls,
      );
      expect(calls).toContainEqual([
        "event",
        expect.objectContaining({
          name: "Form sent",
          data: { form: expect.any(String) },
        }),
      ]);
      expect(JSON.stringify(calls)).not.toContain(email);

      await expect.poll(async () => (await sentTo(email)).length).toBe(1);
      const [mail] = await sentTo(email);
      expect(mail.secretariat.to).toBe(c.to);
      expect(mail.secretariat.replyTo).toBe(email);
      expect(mail.secretariat.subject).toMatch(c.subject);
      expect(mail.acknowledgement.replyTo).toBe(c.to);
    });

    test("shows validation errors and sends nothing", async ({ page }) => {
      await page.goto(c.path);
      await waitForHydration(page);
      await page.getByRole("button", { name: c.submit }).click();

      const summary = page.getByRole("alert").filter({ hasText: "problem" });
      await expect(summary).toBeVisible();
      await expect(summary).toBeFocused();
      await expect(summary).toContainText(c.emptyError.text);

      // The message is tied to its field.
      const field = page.locator(c.emptyError.field);
      await expect(field).toHaveAttribute("aria-invalid", "true");
      const describedBy = await field.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();
      await expect(
        page.locator(`[id="${describedBy?.split(" ").at(-1)}"]`),
      ).toContainText(c.emptyError.text);
    });

    test("pretends to accept a honeypot submission but sends nothing", async ({
      page,
    }) => {
      const email = uniqueEmail("trap");
      await page.goto(c.path);
      await waitForHydration(page);
      await c.fill(page, email);
      await fillHoneypot(page, c.formId);
      await ageForm(page);
      await page.getByRole("button", { name: c.submit }).click();

      await expect(
        page.getByRole("status").filter({ hasText: "Thank you" }),
      ).toBeVisible();
      // Give a real send time to land, then check that none did.
      await page.waitForTimeout(500);
      expect(await sentTo(email)).toHaveLength(0);
    });
  });
}

test.describe("spam checks", () => {
  test("refuses a form sent too quickly", async ({ page }) => {
    const email = uniqueEmail("fast");
    await page.goto("/contact");
    await waitForHydration(page);
    await cases[4].fill(page, email);
    await page.evaluate(() => {
      const input = document.querySelector<HTMLInputElement>(
        'input[name="started"]',
      );
      if (input) input.value = String(Date.now());
    });
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "quicker than we expected" }),
    ).toBeVisible();
    expect(await sentTo(email)).toHaveLength(0);
  });

  test("limits submissions from one address", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-forwarded-for": "203.0.113.77" });
    await page.goto("/contact");
    await waitForHydration(page);
    for (let i = 0; i < 5; i += 1) {
      await cases[4].fill(page, uniqueEmail("limit"));
      await ageForm(page);
      await page.getByRole("button", { name: "Send message" }).click();
      await page.getByRole("button", { name: "Back to the form" }).click();
    }
    const email = uniqueEmail("limit-over");
    await cases[4].fill(page, email);
    await ageForm(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "Too many messages" }),
    ).toBeVisible();
    expect(await sentTo(email)).toHaveLength(0);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the contact form still validates and sends", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(
      page.getByText("Choose what your message is about.").first(),
    ).toBeVisible();

    const email = uniqueEmail("nojs");
    await page.locator("#contact-form-name").fill("Asha Test");
    await page.locator("#contact-form-email").fill(email);
    await page.locator("#contact-form-topic").selectOption("events");
    await page.locator("#contact-form-message").fill("Without scripts.");
    await page.locator("#contact-form-consent").check();
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(
      page.getByRole("status").filter({ hasText: "Thank you" }),
    ).toBeVisible();
    await expect.poll(async () => (await sentTo(email)).length).toBe(1);
  });
});
