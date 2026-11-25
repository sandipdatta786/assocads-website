# Launch checklist

What has been checked before the custom domain is connected, and what the founders still have to do or decide. Written after the pre-launch audit of 24 November 2026 (Prompt 26). Tick items as they are done.

The build enforces part of this list: once `NEXT_PUBLIC_SITE_URL` points at the custom domain, a production build fails while any "must fill" placeholder remains (see section 2.1). Run `pnpm content:check` to see what is left.

---

## 1. Verified

Checked on 24 November 2026 against the preview and https://assocads-website.vercel.app.

### Truthfulness

- [x] The legal status reads "registration in progress" everywhere and comes from the one setting in `src/config/site.ts`. "Registered" is never claimed.
- [x] 80G and 12AB are never offered as available. No fees are shown.
- [x] No partner, member or supporter is named. Third-party organisations appear only as sources, or in the FAQ that says ASSOCADS is not affiliated with them.
- [x] No invented numbers, events, news, testimonials or quotations.
- [x] Office titles appear only for the seven office bearers elected by the Board.
- [x] Plans are worded as plans. The audit corrected the pages that overstated what exists (about, support, FAQ, the student and professional pages, the research and responsible AI programmes, the roadmap).
- [x] Photographs appear only for people who gave consent.
- [x] All 12 guides and all 25 glossary entries name the trustee who reviewed them.
- [x] No personal data from the deed (PAN, Aadhaar, father's name, religion, home address) anywhere in the repository or its history. The deed itself is not in the repository.

### Security

- [x] Git history (all commits): no secrets, `.env` files, PAN, Aadhaar or phone numbers. `.env*` is ignored.
- [x] Form recipients come only from environment variables. The acknowledgement email repeats a name only if it looks like a real first name.
- [x] Security headers sent with every page: Content-Security-Policy, HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options.
- [x] Previews are behind Vercel sign-in and marked `noindex`.
- [x] `main` cannot be force-pushed or deleted.

### Function

- [x] All 74 routes return 200. All internal links and anchors work.
- [x] External links work (the one broken link, the West Bengal Employment Bank, was corrected).
- [x] The 404 page, the RSS feed, the sitemap, `robots.txt`, `llms.txt` and `llms-full.txt` work.
- [x] All 10 anchors from the old one-page site redirect to the right page.
- [x] Event filters, insight filters and the calendar download work.

### Search

- [x] Structured data parses on every page. Each page has exactly one `h1`, a description and a correct canonical address.
- [x] Full page text is in the HTML without JavaScript.
- [x] Only production can be indexed.

### Quality

- [x] `pnpm check` passes: lint, types, content, build and SEO checks.
- [x] `pnpm test` passes: end-to-end, forms, analytics, axe accessibility at 390px and 1440px, keyboard use, no sideways scrolling.
- [x] Lighthouse on mobile, six pages: performance 96 to 100; accessibility, best practices and SEO 100.
- [x] Brand: only the palette colours and approved pairings, the three typefaces in approved weights (including the share images), the logo from the master files.

---

## 2. Still to do or decide before the domain is connected

### 2.1 Must fill: the launch build fails until these are done

Each is a `[PLACEHOLDER: ...]` on live pages. Who supplies it is in brackets.

- [ ] **Public contact email address** (founders). `src/config/site.ts`, `contact.email`. Shown in the footer and on /contact.
- [ ] **Data protection email address** (founders). `contact.dataProtectionEmail`. Shown in the privacy notice.
- [ ] **Public phone number**, or a decision to have none (founders). `contact.phone`. If none, leave it empty.
- [ ] **Reply time** for messages (founders). `contact.replyTime`.
- [ ] **Registered office address** in West Bengal (founders). `legal.registeredOffice`.
- [ ] **Name of the email service** that holds the secretariat mailbox (founders). Privacy notice.
- [ ] **Retention periods** for enquiries and expressions of interest (Board). Privacy notice.
- [ ] **Legal review** of the privacy notice, terms of use, disclaimer and accessibility statement (the trust's legal advisor). When each page is approved, set its date in `src/lib/legal.ts` and remove its review note.

### 2.2 Settings in Vercel

None are set yet, so the live forms cannot send. `docs/DEPLOYMENT.md` section 4 has the full table.

- [ ] `RESEND_API_KEY`, `FORMS_FROM` and `FORMS_TO` for Production (and a test inbox for Preview).
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` for Production (Cloudflare's test keys for Preview).
- [ ] The sending domain verified in Resend.
- [ ] After the domain is connected: `NEXT_PUBLIC_SITE_URL` changed to it, and the GitHub variable `SITE_URL` added.
- [ ] For the mentorship sign-up form at `/mentorship`: `FORMS_TO_MENTORSHIP` (or `FORMS_TO`).
- [ ] For the collaboration proposal form at `/collaborate`: `FORMS_TO_COLLABORATION` (or `FORMS_TO`).
- [ ] For the idea submission form at `/innovation`: the secretariat address (`FORMS_TO_INNOVATION`, or `FORMS_TO`). Submissions are sent to it, and the form does nothing useful without it.
- [ ] For the admin editor at `/admin`: the GitHub OAuth App, then `DECAP_GITHUB_CLIENT_ID` and `DECAP_GITHUB_CLIENT_SECRET` (see `docs/ADMIN_GUIDE.md`, section 2). When the domain is connected, update the OAuth App's two addresses.
- [ ] On launch day: `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` (see `docs/LAUNCH_DAY_SEARCH_SETUP.md`).

### 2.3 Reviews and decisions

- [ ] **Guide corrections re-reviewed.** The audit corrected facts in seven guides: the SWAYAM credit regulations (now 2021), the DPDP timetable (a reported 2026 proposal is not yet notified), SEBI's 2025 AI rule, the EU AI Act amendment, IndiaAI centres of excellence, PLFS earnings and a salary comparison. Sandip Datta reviewed the originals and should read the changes and then set `lastReviewed` in each guide to the date of that review.
- [ ] **"Written by: ASSOCADS editorial team"** on the guides. Keep, change to "ASSOCADS", or name the authors?
- [ ] **"The secretariat"**, used for the people who handle form messages. Keep the word?
- [ ] **The affiliation FAQ**, which names ADaSci, NASSCOM and others to say ASSOCADS is not part of them. Happy with that?
- [ ] **About page**: it now says ASSOCADS was started "by professionals in AI, Data Science and Analytics". Add "academics and entrepreneurs" back only if true of the trustees.
- [ ] **Light-on-dark logo**: its descriptor uses a grey that is not in the palette. For the designer.
- [ ] **Logo adoption and trademark check** by the Board.

### 2.4 Can wait until after launch

The site works without these; each shows a quiet note until it arrives.

- [ ] Trustee and founder member profiles: role, organisation, biography, expertise, LinkedIn link, photograph and consent ("Profile to be added" until then). See `docs/CONTENT_TODO.md`.
- [ ] Official social media links.
- [ ] Registration number and date, which switch the site from "registration in progress" to "registered".
- [ ] Bye-laws, membership categories and fees, once the Board adopts them.
- [ ] Real events, with date, venue and registration method.

### 2.5 Nice to have, from the audit

Not needed for launch:

- Wording: "will hold" conferences → "plans to hold"; "more than 16,263 datasets" → "16,263"; "leading companies" in quotation marks as the scheme's own words; one wording for the AI Safety Institute across guides.
- Code: one `robots` tag on the 404 page instead of two; the calendar file's creation time; logo height 94.92; print colours from the palette.
- The form rate limiter works per server instance; Turnstile is the main spam defence.

---

## 3. On the day the domain is connected

Follow `docs/DEPLOYMENT.md` section 8, then `docs/LAUNCH_DAY_SEARCH_SETUP.md`. After the first production build on the domain:

- [ ] The build passed (if it failed on placeholders, `pnpm content:check` lists them).
- [ ] The home page, /contact and one guide open on the domain, with the padlock.
- [ ] A test message sent through /contact arrives, and its acknowledgement arrives.
- [ ] `https://<domain>/sitemap.xml` lists addresses on the domain.
- [ ] The `vercel.app` address redirects to the domain.
