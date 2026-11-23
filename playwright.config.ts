import { rmSync } from "node:fs";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests. They build and start the site with FORMS_TEST_OUTBOX set,
 * so every form writes its emails to .e2e-outbox instead of sending
 * them. Playwright empties test-results itself, so the outbox lives in
 * .e2e-outbox instead. Email and Turnstile keys are blanked, so a .env.local with real keys
 * can never send anything during a test run.
 */

const PORT = 3100;
const outbox = path.resolve(".e2e-outbox");
process.env.FORMS_TEST_OUTBOX = outbox;
rmSync(outbox, { recursive: true, force: true });

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm build && pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 300_000,
    reuseExistingServer: false,
    env: {
      FORMS_TEST_OUTBOX: outbox,
      RESEND_API_KEY: "",
      FORMS_FROM: "",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
      TURNSTILE_SECRET_KEY: "",
      FORMS_TO: "secretariat@example.org",
      FORMS_TO_MEDIA: "media@example.org",
    },
  },
});
