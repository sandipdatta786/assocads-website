# Deployment

How the website gets from a change on your Mac to the live site, and how to look after it. No deploy command is ever needed: GitHub and Vercel do it.

- **Code:** https://github.com/sandipdatta786/assocads-website
- **Hosting:** the Vercel project `assocads-website`
- **Live address (until the domain is connected):** https://assocads-website.vercel.app

The older ASSOCADS site at `assocads.vercel.app` is a separate Vercel project. Nothing here touches it.

---

## 1. How a change travels to the live site

1. **On your Mac**, a change is made in this folder and checked with `pnpm check` (lint, types, content, build and SEO checks). It must pass.
2. **It goes to GitHub** in one of two ways:
   - **Small content changes** (a typo, a date) are committed to `main` and pushed.
   - **Anything larger** goes on its own branch, which is pushed and opened as a **pull request**.
3. **On a pull request:**
   - Vercel builds a **preview**: a private copy of the site with its own address. It posts the address on the pull request ("Visit Preview"). Previews are marked `noindex`, so search engines ignore them.
   - GitHub Actions runs the **check** workflow (`.github/workflows/ci.yml`): lint, types, content, build, SEO checks and the Playwright tests.
   - Look at the preview. When the check is green and the preview looks right, merge the pull request.
4. **On every push to `main`** (including a merged pull request), Vercel builds and publishes the **production** site automatically, usually within two minutes.
5. **After production is live**, the IndexNow workflow tells Bing and other search engines which pages changed (see `docs/INDEXNOW.md`).

If a build fails on Vercel, the live site stays on the previous version. Nothing half-built is ever published.

## 2. Seeing a deployment's status

- **On GitHub:** every commit and pull request shows a status next to it: a yellow dot while building, a green tick when done, a red cross if it failed. Click it for details. **Vercel** is the deployment; **check** is the test workflow.
- **On Vercel:** open https://vercel.com, choose the `assocads-website` project, then **Deployments**. Each row shows the branch, the commit message, whether it is **Production** or **Preview**, and its state (**Building**, **Ready**, **Error**). Click a row to see the build log and open that version.
- **By email:** Vercel and GitHub email you when a production build fails.

## 3. Rolling back to an earlier version

If something goes wrong on the live site, put back the last good version first and fix the problem afterwards.

1. In Vercel, open the project, then **Deployments**.
2. Find the last production deployment that was working. Production rows are marked **Production**; the current one is marked **Current**.
3. Click the **⋯** menu on that row and choose **Instant Rollback** (on some plans it is called **Promote to Production**). Confirm.
4. The live address shows that version within seconds. No rebuild is needed.

After a rollback, Vercel stops publishing new pushes to production automatically, so a broken change is not put back by accident. Once the fix is merged into `main` and its deployment shows **Ready**, open it and choose **Promote to Production** (or **Undo Rollback**) to resume normal publishing.

On the free Hobby plan, Instant Rollback can only go back to the version just before the current one. To go further back, revert the bad commit on GitHub (open the commit, then **Revert**) and let the new push deploy.

## 4. Environment variables

Settings that are secret, or differ between your Mac and the live site, are kept as environment variables, not in the code. `.env.example` lists every one.

**To add or change one:**

1. In Vercel, open the project, then **Settings → Environment Variables**.
2. To change one, click **⋯ → Edit** on its row. To add one, fill in **Key** and **Value**, and tick the environments it applies to (**Production**, **Preview**, or both).
3. Choose **Save**.
4. **Redeploy**, because pages are built ahead of time and read the values at build time: **Deployments**, the latest production deployment, **⋯ → Redeploy**. For a Preview value, push a new commit to the pull request instead.

Never paste a secret into a chat, an issue, a commit or a document. Type it only into Vercel (and, for IndexNow, GitHub's secrets page).

**What to set:**

| Variable                                                                                                                                                                                                                    | Production                            | Preview                                                            | What it is for                                                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                                                                                                                                                                      | `https://assocads-website.vercel.app` | The same                                                           | The site's public address, used in links, the sitemap, share images and structured data. Change it when the domain is connected. Previews use the production address too, which is correct because previews are never indexed.                                  |
| `RESEND_API_KEY`                                                                                                                                                                                                            | Required                              | Optional                                                           | Secret key from Resend that sends the form emails. Without it, forms on Vercel show a polite "could not send" message.                                                                                                                                          |
| `FORMS_FROM`                                                                                                                                                                                                                | Required                              | With `RESEND_API_KEY`                                              | The sender on every email, for example `ASSOCADS <forms@example.org>`. Its domain must be verified in Resend.                                                                                                                                                   |
| `FORMS_TO`                                                                                                                                                                                                                  | Required                              | With `RESEND_API_KEY`                                              | The secretariat address that receives every form. **On Preview, use a test inbox**, so that testing a preview does not email the secretariat.                                                                                                                   |
| `FORMS_TO_MEMBERSHIP`, `FORMS_TO_COMMUNITIES`, `FORMS_TO_PARTNERSHIPS`, `FORMS_TO_SUPPORT`, `FORMS_TO_INNOVATION`, `FORMS_TO_MENTORSHIP`, `FORMS_TO_COLLABORATION`, `FORMS_TO_EVENTS`, `FORMS_TO_MEDIA`, `FORMS_TO_CONTACT` | Optional                              | Leave blank                                                        | A different address for each kind of message. Blank means `FORMS_TO`.                                                                                                                                                                                           |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`                                                                                                                                                                                            | Required                              | Cloudflare's test site key `1x00000000000000000000AA`              | Public key for the spam check shown on each form.                                                                                                                                                                                                               |
| `TURNSTILE_SECRET_KEY`                                                                                                                                                                                                      | Required                              | Cloudflare's test secret key `1x0000000000000000000000000000000AA` | Secret key that checks the spam test on the server. **On Vercel, forms do not send without it.** Cloudflare's test keys always pass, so previews work without adding every preview address to Cloudflare. They are published by Cloudflare and are not secrets. |
| `GOOGLE_SITE_VERIFICATION`                                                                                                                                                                                                  | On launch day                         | Leave blank                                                        | Google Search Console ownership tag. See `docs/LAUNCH_DAY_SEARCH_SETUP.md`.                                                                                                                                                                                     |
| `BING_SITE_VERIFICATION`                                                                                                                                                                                                    | On launch day                         | Leave blank                                                        | Bing Webmaster Tools ownership tag. Same guide.                                                                                                                                                                                                                 |
| `INDEXNOW_KEY`                                                                                                                                                                                                              | Optional                              | Leave blank                                                        | The IndexNow key, published at `/indexnow-key.txt`. Also add it as a GitHub secret. See `docs/INDEXNOW.md`.                                                                                                                                                     |
| `DECAP_GITHUB_CLIENT_ID`                                                                                                                                                                                                    | For the admin editor                  | Leave blank                                                        | Client ID of the GitHub OAuth App that signs admins in at `/admin`. See `docs/ADMIN_GUIDE.md`, section 2.                                                                                                                                                       |
| `DECAP_GITHUB_CLIENT_SECRET`                                                                                                                                                                                                | For the admin editor                  | Leave blank                                                        | The OAuth App's client secret. Mark it Sensitive.                                                                                                                                                                                                               |
| `FORMS_TEST_OUTBOX`                                                                                                                                                                                                         | **Never**                             | **Never**                                                          | For the automated tests only. Ignored on Vercel.                                                                                                                                                                                                                |

Vercel sets `VERCEL`, `VERCEL_ENV` and `VERCEL_PROJECT_PRODUCTION_URL` itself. Do not add them.

`docs/FORMS_SETUP.md` explains where to get the Resend and Turnstile values.

## 5. Build settings

Vercel detects these from the code; they should not need changing.

- **Framework preset:** Next.js
- **Install command:** `pnpm install` (from `pnpm-lock.yaml`)
- **Build command:** `pnpm build` (from `package.json`), which runs `pnpm content:check` and then `next build`
- **Node.js version:** 24, set by `"engines": { "node": "24.x" }` in `package.json`. This overrides the Node.js setting in the Vercel dashboard. GitHub Actions also uses Node.js 24. If you change one, change both: `package.json` and `node-version` in `.github/workflows/*.yml`.

## 6. Security headers and caching

Set in `next.config.ts` and sent with every page:

- **Content-Security-Policy:** the page may load only the site's own files and the Cloudflare Turnstile spam check, and may not be shown inside another website's frame. Previews also allow Vercel's comment toolbar. If you add something that loads from another website, such as a video embed, add its address here, or the browser will block it.
- **Strict-Transport-Security:** browsers always use the encrypted address.
- **X-Content-Type-Options**, **Referrer-Policy**, **Permissions-Policy** (no camera, microphone, location or payment access) and **X-Frame-Options**.
- **Previews only:** `X-Robots-Tag: noindex, nofollow`.

Caching: the build's own files (`/_next/static`: scripts, styles, fonts) are cached for a year, because their names change whenever they change. Logos and photos in `public/` keep their names, so browsers keep them for a week.

## 7. Protecting the main branch

GitHub is set so that `main` cannot be force-pushed (which would rewrite history) or deleted. Normal pushes and merges are unaffected. To see or change this, open the repository on GitHub, then **Settings → Rules → Rulesets → Protect main**.

## 8. Connecting the custom domain later

Full steps come with the domain prompt (Prompt 27). In outline:

1. In Vercel, open the project, then **Settings → Domains → Add Domain**, and type the domain, for example `example.org`. Add `www.example.org` as well and let Vercel redirect one to the other.
2. Vercel shows the DNS records to add (an **A** record for the bare domain and a **CNAME** for `www`). Add exactly those values at your domain registrar or DNS provider. Vercel shows **Valid Configuration** once they are working, and issues the security certificate itself.
3. Change `NEXT_PUBLIC_SITE_URL` (Production and Preview) to `https://example.org` and redeploy. **This build fails on purpose if any "must fill" placeholder remains** (contact details, registered office, privacy details, legal review), and the site stays on the previous version. `pnpm content:check` lists them; `docs/LAUNCH_CHECKLIST.md` says who supplies each one.
4. In GitHub, add the repository variable `SITE_URL` with the same address (see `docs/INDEXNOW.md`).
5. Follow `docs/LAUNCH_DAY_SEARCH_SETUP.md` for Google and Bing.

The `vercel.app` address keeps working and is redirected by Vercel to the domain if you choose that in **Domains**.
