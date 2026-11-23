import { createHash } from "node:crypto";

/**
 * A per-address rate limit kept in the server's memory.
 *
 * Why this approach: it needs no database, no paid service and no new
 * account. On Vercel a warm function instance is reused for many requests,
 * so the count holds across them. Its limit is that separate instances keep
 * separate counts, so a determined sender spread across instances could get
 * a few more through. Turnstile stops automated senders first; this only
 * slows down a person or script that gets past it. If abuse ever gets
 * through, move the count to a shared store (for example Upstash Redis) or
 * add a Vercel Firewall rate-limit rule.
 *
 * Addresses are hashed before they are kept, and never logged.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_KEYS = 10_000;

const hits = new Map<string, number[]>();

function keyFor(address: string): string {
  return createHash("sha256")
    .update(`assocads-forms:${address}`)
    .digest("base64url");
}

/** Record one submission from an address. False when it is over the limit. */
export function allowSubmission(address: string, now = Date.now()): boolean {
  const key = keyFor(address);
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  // Keep memory bounded: drop the oldest entries when the map grows large.
  if (hits.size > MAX_KEYS) {
    for (const k of hits.keys()) {
      hits.delete(k);
      if (hits.size <= MAX_KEYS / 2) break;
    }
  }
  return true;
}

/** The caller's address from the proxy headers Vercel sets. */
export function clientAddress(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}
