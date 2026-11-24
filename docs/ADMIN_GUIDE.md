# Admin guide: publishing events and news

Admins can add and update events, news and announcements from a web page, without touching any code. The editor is at **`/admin`** on the live site, for example https://assocads-website.vercel.app/admin.

What admins can publish there:

- **Events**: workshops, seminars, webinars, conferences, ceremonies, pitch days, masterclasses, meetups and hackathons. Each gets its own page, appears on the events page and, while it is upcoming, on the home page.
- **After an event**: a summary, photographs and a slides link. The first photograph appears under "Highlights from past events" on the home page.
- **News and announcements**: each gets its own page on the Insights page, in the RSS feed and on the home page under "Announcements".

The home page section "Latest updates and events" fills itself from these. Until something is published it shows an honest note that nothing has been announced yet.

---

## 1. The rules for everything published

These come from `CLAUDE.md` and apply to every entry:

- **Only real, confirmed facts.** No invented numbers, quotations, testimonials, partners or awards. Add an event only once its date, place and registration method are confirmed.
- **Plans are worded as plans**: "we plan to", "we aim to", "proposed".
- **No organisation is named as a partner, sponsor or supporter** without written permission on file.
- **Photographs of people only with their consent.** The editor asks for a consent tick on every event photograph, and the site refuses to publish a photograph without it.
- **While registration is in progress**, never write that ASSOCADS is "registered", and never mention 80G or 12AB.
- **Never** include anyone's PAN, Aadhaar number, home address, phone number or personal email.

Every entry is checked by a second admin before it goes live (section 4), so there is always a chance to catch a mistake.

---

## 2. One-time setup (the repository owner does this once)

The editor signs admins in with GitHub. It needs a GitHub "OAuth App" and two settings in Vercel. Do this yourself; never paste the secret into a chat, email or document.

1. **Create the OAuth App.** Signed in to GitHub as the repository owner, open https://github.com/settings/developers, then **OAuth Apps → New OAuth App**, and fill in:
   - Application name: `ASSOCADS admin`
   - Homepage URL: `https://assocads-website.vercel.app`
   - Authorization callback URL: `https://assocads-website.vercel.app/api/decap/callback`

   Choose **Register application**. On the next page, copy the **Client ID**, then choose **Generate a new client secret** and copy the secret.

2. **Add the two settings in Vercel.** Project **assocads-website → Settings → Environment Variables**. Add, for **Production** only, with "Sensitive" switched on for the secret:
   - `DECAP_GITHUB_CLIENT_ID`: the Client ID
   - `DECAP_GITHUB_CLIENT_SECRET`: the client secret
3. **Redeploy**: **Deployments**, the latest production deployment, **⋯ → Redeploy**.
4. **Test**: open `/admin` and choose **Login with GitHub**. A small window asks you to authorise "ASSOCADS admin" once; it then closes and the editor opens.

**When the custom domain is connected**, edit the OAuth App and change both addresses to the new domain, for example `https://<domain>/api/decap/callback`. Until then, sign-in on the new domain fails with a "redirect_uri" message.

Sign-in works only on the production address, not on preview addresses.

---

## 3. Giving someone admin access, and taking it away

An admin is anyone with **Write** access to the GitHub repository. GitHub itself enforces this: someone without it can sign in but cannot save anything.

**To add an admin:**

1. They create a free account at https://github.com/signup, if they do not have one, and tell you their GitHub username.
2. Open https://github.com/sandipdatta786/assocads-website/settings/access, choose **Add people**, enter their username and choose the **Write** role.
3. They accept the invitation from their email or from https://github.com/notifications.

**To remove an admin:** same page, **Remove** next to their name. They lose access at once.

Write access also allows changing the site's code on GitHub, so give it only to people the Board trusts with the website. Ask every admin to turn on two-factor authentication in their GitHub settings.

---

## 4. Publishing, step by step

Nothing goes live the moment you save. Each save becomes a draft that is checked automatically and gets a private preview, and goes live only when an admin presses **Publish**.

1. **Open `/admin`** and sign in with GitHub.
2. **Choose a collection** on the left: **Events** or **News and announcements**, then **New event** or **New news item**. To change an existing entry, click it in the list.
3. **Fill in the fields.** Each has a short hint under it. The **Web address name** becomes the end of the page's address, for example `ai-in-healthcare-workshop-2027`, and cannot be changed later.
4. **Save.** The entry becomes a **Draft**. Nothing on the site has changed yet.
5. **Set the status to "In review"** (the **Status** menu at the top). This starts the automatic checks and builds a preview, which takes about three minutes. When it is ready, **View preview** opens the page as it will look. The preview opens only for people with access to the Vercel project; anyone else can check the text in the editor instead.
6. **A second admin reviews it**: in the **Workflow** tab, open the entry, read it against the rules in section 1, and correct anything needed.
7. **Set the status to "Ready", then choose Publish → Publish now.** The site updates within about three minutes.

If the automatic checks fail, the entry cannot harm the live site. Open it again, read the message next to the field concerned, correct it and save. If the message is unclear, ask the person who maintains the site.

**The Workflow tab** at the top shows every unpublished entry in three columns: Drafts, In review and Ready.

### Dates and times

- Enter times in **Indian Standard Time**.
- An event's status badge ("Registration open", "Opening soon", "Registration closed", "Past") is worked out from its dates. You never change it by hand, and an event moves to the past by itself once it ends.
- A news item with a **publication date in the future** stays hidden until that day.

### Photographs

- Use landscape photographs, ideally 1600 pixels wide and under 2 MB. On a phone, share the photo at "medium" or "large" size rather than the original. The site makes smaller copies for visitors itself.
- Write a short **Description** of each photograph for people who cannot see it, for example "Participants working in small groups at the workshop".
- Tick the **consent** box only if everyone recognisable in the photograph has agreed to its publication. Keep their written consent on file.

---

## 5. After an event

1. Open the event in **Events**.
2. Expand **After the event** and fill in **What happened**: a few sentences of confirmed facts, for example the number of participants only if it was counted.
3. Add **Photographs**, each with a description and the consent tick. The first one appears on the home page.
4. Add the **Slides link** if the slides are shared publicly.
5. Save and publish as in section 4.

---

## 6. For the person who maintains the site

- The editor is Decap CMS, loaded from `public/admin/index.html`. Its fields are in `public/admin/config.yml` and must match the schemas in `src/lib/content/schemas.ts`. If a schema changes, change the matching field.
- The sign-in runs through `src/app/api/decap/` (`src/lib/decap-auth.ts`). It asks GitHub only for the `public_repo` permission.
- Each entry is saved on a branch `cms/...` with a pull request. Publishing merges it into `main` with a squash commit.
- Fields left empty in the editor are saved as empty values; the content loaders treat them as not given.
- `/admin` has its own, looser Content-Security-Policy (in `next.config.ts`), is excluded in `robots.txt` and sends `noindex`.
- **Upgrading Decap**: choose a version at least two weeks old, change the version in the script address in `public/admin/index.html`, and replace the integrity hash with the output of:

  ```bash
  echo "sha384-$(curl -sSfL https://unpkg.com/decap-cms@VERSION/dist/decap-cms.js | openssl dgst -sha384 -binary | openssl base64 -A)"
  ```

  Then open `/admin` locally (`pnpm dev`) and check that the sign-in screen appears.
