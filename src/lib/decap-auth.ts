/**
 * GitHub sign-in for the admin editor at /admin (Decap CMS).
 *
 * The editor opens /api/decap/auth in a pop-up, which sends the admin to
 * GitHub. GitHub sends them back to /api/decap/callback with a one-time code,
 * which is exchanged for a token and handed to the editor window. GitHub
 * itself decides what the token may do: only people with write access to the
 * repository can save anything.
 *
 * Needs two settings in Vercel, from a GitHub OAuth App (docs/ADMIN_GUIDE.md):
 * DECAP_GITHUB_CLIENT_ID and DECAP_GITHUB_CLIENT_SECRET.
 */

export const STATE_COOKIE = "decap_oauth_state";

/** Enough to read and write a public repository, nothing more. */
export const SCOPE = "public_repo";

export function oauthSettings() {
  const clientId = process.env.DECAP_GITHUB_CLIENT_ID;
  const clientSecret = process.env.DECAP_GITHUB_CLIENT_SECRET;
  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

const NOT_SET_UP =
  "The admin sign-in is not set up yet: DECAP_GITHUB_CLIENT_ID and DECAP_GITHUB_CLIENT_SECRET are missing in Vercel. See docs/ADMIN_GUIDE.md.";

export function notSetUpResponse(): Response {
  return new Response(NOT_SET_UP, {
    status: 503,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/**
 * The page GitHub returns to. It tells the editor window the outcome, using
 * Decap's message format, and only ever talks to a window on this site.
 */
export function handOverPage(
  origin: string,
  outcome:
    { status: "success"; token: string } | { status: "error"; message: string },
): Response {
  const content =
    outcome.status === "success"
      ? { token: outcome.token, provider: "github" }
      : { message: outcome.message, provider: "github" };
  const message = `authorization:github:${outcome.status}:${JSON.stringify(content)}`;
  // JSON.stringify gives safe script literals; "<" is escaped so the values
  // cannot close the script element.
  const literal = (value: string) =>
    JSON.stringify(value).replace(/</g, "\\u003c");

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Signing in</title></head>
<body>
<p>${outcome.status === "success" ? "Signed in. This window will close." : "Sign-in failed. You can close this window and try again."}</p>
<script>
(function () {
  var origin = ${literal(origin)};
  var message = ${literal(message)};
  if (!window.opener) return;
  window.addEventListener("message", function receive(event) {
    if (event.origin !== origin) return;
    window.removeEventListener("message", receive);
    window.opener.postMessage(message, origin);
  });
  window.opener.postMessage("authorizing:github", origin);
})();
</script>
</body>
</html>`;

  return new Response(html, {
    status: outcome.status === "success" ? 200 : 400,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
