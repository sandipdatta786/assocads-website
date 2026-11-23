"use server";

import { headers } from "next/headers";
import {
  onVercel,
  publicContactEmail,
  recipientFor,
  resendConfig,
  testOutbox,
  turnstileSecret,
} from "./config";
import { deliver } from "./deliver";
import { acknowledgementEmail, secretariatEmail } from "./email";
import { allowSubmission, clientAddress } from "./rateLimit";
import {
  formKinds,
  fromFormData,
  validateForm,
  type FormKind,
} from "./schemas";
import {
  HONEYPOT_FIELD,
  KIND_FIELD,
  MIN_FILL_MS,
  STARTED_FIELD,
  TURNSTILE_FIELD,
  type FormState,
} from "./state";
import { verifyTurnstile } from "./turnstile";

/**
 * Handles every form on the site. Each form says which one it is in a hidden
 * field. Works with JavaScript switched off.
 *
 * The action is deliberately not bound to the form kind with .bind(): in this
 * Next.js version a bound action used with useActionState hangs the server
 * when a form is posted without JavaScript.
 *
 * Order of checks: honeypot, then answers, then time to fill, then
 * Turnstile, then the rate limit, then sending. Logs never include what
 * the visitor typed.
 */
export async function submitForm(
  _previous: FormState,
  data: FormData,
): Promise<FormState> {
  const kind = data.get(KIND_FIELD) as FormKind;
  if (!formKinds.includes(kind)) return { status: "failed" };
  const contactEmail = publicContactEmail();

  // 1. Honeypot: people never see this field. Pretend to succeed, send nothing.
  const trap = data.get(HONEYPOT_FIELD);
  if (typeof trap === "string" && trap.trim()) {
    console.info(`[forms] ${kind}: honeypot filled, not sent`);
    return { status: "sent", mode: modeLabel() };
  }

  // 2. The answers, checked with the same schema as the browser.
  const values = fromFormData(kind, data);
  const errors = validateForm(kind, values);
  if (Object.keys(errors).length > 0)
    return { status: "invalid", errors, values };

  // 3. Time to fill. The browser records when the form appeared; with
  //    JavaScript off there is no record, and Turnstile decides instead.
  const started = Number(data.get(STARTED_FIELD));
  const hasScript = Number.isFinite(started) && started > 0;
  if (hasScript && Date.now() - started < MIN_FILL_MS)
    return { status: "too-fast", values };

  // 4. Turnstile, when it is configured.
  const requestHeaders = await headers();
  const address = clientAddress(requestHeaders);
  const secret = turnstileSecret();
  if (secret) {
    const token = data.get(TURNSTILE_FIELD);
    if (typeof token !== "string" || !token) {
      return {
        status: hasScript ? "security" : "needs-js",
        values,
        contactEmail,
      };
    }
    if (!(await verifyTurnstile(secret, token, address)))
      return { status: "security", values };
  } else if (onVercel()) {
    // A live site without spam protection would be an open relay for abuse.
    console.error("[forms] TURNSTILE_SECRET_KEY is not set on this deployment");
    return { status: "failed", values, contactEmail };
  }

  // 5. Rate limit per address.
  if (!allowSubmission(address))
    return { status: "rate-limited", values, contactEmail };

  // 6. Send.
  const topic = kind === "contact" ? String(values.topic) : undefined;
  const to = recipientFor(kind, topic);
  if (!to && (resendConfig() || onVercel())) {
    console.error(`[forms] ${kind}: no recipient address is configured`);
    return { status: "failed", values, contactEmail };
  }
  const secretariat = to ?? "(FORMS_TO is not set)";
  const result = await deliver(
    secretariatEmail(kind, values, secretariat),
    acknowledgementEmail(kind, values, secretariat),
  );
  if (!result.ok) return { status: "failed", values, contactEmail };

  console.info(`[forms] ${kind}: sent (${result.mode})`);
  return { status: "sent", mode: result.mode };
}

/** The mode a real submission would report, so a robot learns nothing. */
function modeLabel(): FormState["mode"] {
  if (testOutbox()) return "test";
  if (resendConfig()) return "email";
  return onVercel() ? "email" : "terminal";
}
