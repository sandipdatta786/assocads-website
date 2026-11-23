import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { onVercel, resendConfig, testOutbox } from "./config";
import type { Message } from "./email";

/**
 * Sends the emails for one submission.
 *  - With Resend configured: through the Resend API.
 *  - On a laptop without keys: printed to the terminal, so forms can be tried.
 *  - In automated tests (FORMS_TEST_OUTBOX): written to files the tests read.
 * Nothing is stored anywhere else.
 */

export type Delivery =
  { ok: true; mode: "email" | "terminal" | "test" } | { ok: false };

const RESEND_URL = "https://api.resend.com/emails";

async function sendWithResend(
  config: { apiKey: string; from: string },
  message: Message,
  idempotencyKey: string,
): Promise<boolean> {
  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: config.from,
        to: [message.to],
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      // The status alone: never the body, which may echo personal data.
      console.error(`[forms] Resend refused a message (HTTP ${res.status})`);
      return false;
    }
    return true;
  } catch {
    console.error("[forms] Resend could not be reached");
    return false;
  }
}

/** Send the secretariat email, then the acknowledgement. The visitor's
    submission counts as sent once the secretariat email has gone. */
export async function deliver(
  secretariat: Message,
  acknowledgement: Message,
): Promise<Delivery> {
  const outbox = testOutbox();
  if (outbox) {
    await mkdir(outbox, { recursive: true });
    const id = `${Date.now()}-${randomUUID()}`;
    await writeFile(
      path.join(outbox, `${id}.json`),
      JSON.stringify({ secretariat, acknowledgement }, null, 2),
    );
    return { ok: true, mode: "test" };
  }

  const resend = resendConfig();
  if (resend) {
    const id = randomUUID();
    const sent = await sendWithResend(resend, secretariat, `${id}-secretariat`);
    if (!sent) return { ok: false };
    await sendWithResend(resend, acknowledgement, `${id}-acknowledgement`);
    return { ok: true, mode: "email" };
  }

  if (!onVercel()) {
    // Development without keys: show the emails in the terminal instead.
    const show = (label: string, m: Message) =>
      [
        `----- ${label} -----`,
        `To: ${m.to}`,
        `Reply-To: ${m.replyTo}`,
        `Subject: ${m.subject}`,
        "",
        m.text,
      ].join("\n");
    console.info(
      [
        "",
        "[forms] RESEND_API_KEY or FORMS_FROM is not set, so these emails were printed here instead of sent.",
        show("To the secretariat", secretariat),
        show("Acknowledgement to the sender", acknowledgement),
        "-----",
        "",
      ].join("\n"),
    );
    return { ok: true, mode: "terminal" };
  }

  console.error("[forms] Email is not configured on this deployment");
  return { ok: false };
}
