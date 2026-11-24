import { cookies } from "next/headers";
import {
  notSetUpResponse,
  oauthSettings,
  SCOPE,
  STATE_COOKIE,
} from "@/lib/decap-auth";

/** Step 1 of the admin sign-in: send the admin to GitHub. See src/lib/decap-auth.ts. */
export async function GET(request: Request) {
  const settings = oauthSettings();
  if (!settings) return notSetUpResponse();

  const origin = new URL(request.url).origin;
  const state = crypto.randomUUID();

  (await cookies()).set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: origin.startsWith("https:"),
    sameSite: "lax",
    path: "/api/decap",
    maxAge: 600,
  });

  const github = new URL("https://github.com/login/oauth/authorize");
  github.searchParams.set("client_id", settings.clientId);
  github.searchParams.set("redirect_uri", `${origin}/api/decap/callback`);
  github.searchParams.set("scope", SCOPE);
  github.searchParams.set("state", state);

  return new Response(null, {
    status: 302,
    headers: { Location: github.toString(), "Cache-Control": "no-store" },
  });
}
