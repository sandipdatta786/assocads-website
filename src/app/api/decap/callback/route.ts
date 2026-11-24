import { cookies } from "next/headers";
import {
  handOverPage,
  notSetUpResponse,
  oauthSettings,
  STATE_COOKIE,
} from "@/lib/decap-auth";

/** Step 2 of the admin sign-in: GitHub returns here with a one-time code. */
export async function GET(request: Request) {
  const settings = oauthSettings();
  if (!settings) return notSetUpResponse();

  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const jar = await cookies();
  const expected = jar.get(STATE_COOKIE)?.value;
  jar.delete({ name: STATE_COOKIE, path: "/api/decap" });

  if (!code || !state || !expected || state !== expected) {
    return handOverPage(origin, {
      status: "error",
      message: "The sign-in expired or did not start here. Please try again.",
    });
  }

  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: settings.clientId,
          client_secret: settings.clientSecret,
          code,
          redirect_uri: `${origin}/api/decap/callback`,
        }),
        cache: "no-store",
      },
    );
    const data = (await response.json()) as {
      access_token?: string;
      error_description?: string;
    };
    if (!data.access_token) {
      return handOverPage(origin, {
        status: "error",
        message: data.error_description ?? "GitHub did not return a token.",
      });
    }
    return handOverPage(origin, {
      status: "success",
      token: data.access_token,
    });
  } catch {
    return handOverPage(origin, {
      status: "error",
      message: "Could not reach GitHub. Please try again.",
    });
  }
}
