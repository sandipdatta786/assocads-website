# Content still needed

Everything the site is waiting for from the founders. Tick an item when it has been supplied and added to the site. Every `[PLACEHOLDER: ...]` on the site should have a line here.

## From the founders

- [ ] **Final domain name.** Needed for canonical addresses and email addresses.
- [ ] **Registered office address.** Needed for the footer, contact page and structured data.
- [ ] **Public email addresses and a phone number, if any.** Needed for the contact page.
- [ ] **Trustee and founder member profiles.** For each of the seven Founder Trustees and five founder members: photograph, current role, sixty-word biography, LinkedIn link, and consent to publish.
- [ ] **Date of the Board resolution electing the office bearers.** The site says the Board has elected them, without a date; add it to `docs/BLUEPRINT.md` section 7.4 once supplied.
- [ ] **Trustee name spellings** confirmed against each trustee's PAN card.
- [ ] **Registration number and date.** Needed to switch the site from "pending" to "registered".
- [ ] **Membership fees and any student category**, once fixed by the Board.
- [ ] **Real upcoming events** with date, venue and registration method.
- [ ] **Official social media links.** Needed for the footer and structured data.
- [ ] **YouTube channel ID** (`youtubeChannelId` in `src/config/site.ts`), once the channel exists. The channel's videos then appear on /voices and the home page by themselves. See `docs/ADMIN_GUIDE.md`, section 5a.
- [ ] **Signed permissions** for any partner names or logos.
- [ ] **Board adoption of the logo in `docs/logo/`, and a trademark check.**
- [ ] **Bank details and 80G status.** Needed for donations, later.

## Placeholders on the site

Run `pnpm content:check` for the current list with line numbers. Add one line here for every new placeholder, in the form `path/to/file` · what is needed.

`pnpm content:check` sorts them into two groups. **Must fill**: everything except the trustee and founder member profiles. A launch build (a production build on the custom domain, or `LAUNCH_CHECK=1`) fails while any of these remain. **Can wait**: the profiles in `content/trustees.json`, which the site shows as "Profile to be added". See `docs/LAUNCH_CHECKLIST.md`.

### Organisation settings: `src/config/site.ts`

- [ ] `src/config/site.ts` · registered office address in West Bengal (`legal.registeredOffice`)
- [ ] `src/config/site.ts` · public contact email address (`contact.email`)
- [ ] `src/config/site.ts` · public phone number, if any (`contact.phone`)
- [ ] `src/config/site.ts` · email address for data protection requests (`contact.dataProtectionEmail`)
- [ ] `src/config/site.ts` · expected reply time agreed by the founders, shown on /contact (`contact.replyTime`)
- [ ] `src/config/site.ts` · official social profile links, currently empty and so not shown (`social`)
- [ ] `src/config/site.ts` · registration number and date, then `legal.status: "registered"`. These are empty settings rather than placeholders, and the site keeps saying "registration in progress" until they are filled in.

### Founder Trustees: `content/trustees.json`

Send each trustee the form in `docs/TRUSTEE_PROFILE_TEMPLATE.md`. Each still needs a current role, organisation, a biography of about sixty words in the third person, up to five areas of expertise and a LinkedIn link. Photographs follow the specification in the README and are shown only with `consentToPublish: true`. A trustee gets an individual page once their biography is in.

- [ ] Amit Kumar Das · LinkedIn needed; profile added 24 November 2026; photo received (only 525 px; a larger one of at least 800 px is wanted)
- [ ] Abhijit Pal · LinkedIn needed; profile, photo and consent received 24 November 2026
- [ ] Prasun Nandy · role, organisation, biography, expertise and LinkedIn needed; photo and consent needed
- [ ] Sudip Dasgupta · LinkedIn needed; profile, photo and consent received 24 November 2026
- [ ] Rahul Bhattacharya · role, organisation, biography, expertise and LinkedIn needed; photo and consent needed
- [ ] Biswajeet Chaki · role, organisation, biography, expertise and LinkedIn needed; photo and consent received 24 November 2026
- [ ] Sayan Guha · role, organisation, biography, expertise and LinkedIn needed; photo received
- [ ] Deb Kumar Majumder · LinkedIn needed; profile added 24 November 2026; photo received
- [x] Sandip Datta · profile, LinkedIn and photo received; profile added 25 November 2026 from his resume
- [ ] Agnimitra Biswas · role, organisation, biography, expertise and LinkedIn needed; photo and consent needed
- [ ] Ayan Chakraborty · role, organisation, biography, expertise and LinkedIn needed; photo and consent needed
- [ ] Eshwar Boini · role, organisation, biography, expertise and LinkedIn needed; photo received

### Documents: `content/documents.json`

The governance page lists four documents as "To be published": the certificate of registration, the bye-laws, the annual report 2026–27 and the audited accounts 2026–27. When one is ready, put the PDF in `public/documents/`, set `available: true` and add its `date`.

### Pages still to be built

Every route in the site map exists, but most show only a heading and `[PLACEHOLDER: page content, built in a later playbook step]`. These are filled in by playbook prompts 5 to 17, not by the founders. `pnpm content:check` lists each one with its file.

- [x] `src/app/page.tsx` · home page content (Prompt 5)
- [x] `src/app/about`, `objects`, `governance`, `roadmap`, `facts` · About pages (Prompt 6)
- [x] `src/app/about/trustees` · Founder Trustees page (Prompt 7)
- [x] `src/app/programmes/**` · programmes overview and eight programme pages (Prompt 8)
- [x] `src/app/for/[audience]` · four audience pages (Prompt 9)
- [x] `src/app/membership/**` · membership page and register-your-interest form interface (Prompt 10)
- [x] Register-your-interest form sending (Prompt 16)
- [x] `src/app/events` · events list, event pages and a draft template (Prompt 11). See `docs/HOW_TO_ADD_AN_EVENT.md`.
- [x] `src/app/communities` · communities page, nine proposed Special Interest Groups and the interest form interface (Prompt 12)
- [x] Communities interest form sending (Prompt 16)
- [x] `src/app/insights` · insights list, article pages, `/feed.xml` and a draft template (Prompt 13). See `docs/HOW_TO_PUBLISH_NEWS.md`.
- [ ] First real news item, written and approved by the founders (no news has been published)
- [x] `src/app/guides`, `src/app/glossary`, `src/app/resources` · guide and glossary templates, Resources hub and brand kit (Prompt 14)
- [x] Review the 12 guides and 25 glossary entries and publish them. Reviewed by Sandip Datta on 23 November 2026; see `docs/EDITORIAL_REVIEW.md`.
- [ ] Board to adopt the logo and check it against registered trademarks, then remove the notice in the Resources brand kit
- [x] `src/app/partner`, `src/app/support`, `src/app/contact` · partner, support and contact pages, with their forms as interface only (Prompt 15)
- [x] Connect the partnership, pledge or sponsor, and contact forms, routing contact messages by topic (Prompt 16)
- [ ] Founders: create the Resend account, verify the sending domain and add `RESEND_API_KEY`, `FORMS_FROM` and `FORMS_TO` in Vercel (`docs/FORMS_SETUP.md`). Until then, forms on the live site show a polite "could not send" message.
- [ ] Founders: create the Cloudflare Turnstile widget and add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Vercel, then redeploy (`docs/FORMS_SETUP.md`)
- [ ] Founders: decide whether membership, communities, partnerships, support, events and media messages go to separate addresses (`FORMS_TO_*`), or all to `FORMS_TO`
- [x] `src/app/faq`, `src/app/legal/**`, `src/app/accessibility` · questions and legal pages (Prompt 17)
- [ ] `src/app/legal/privacy`, `src/app/legal/terms`, `src/app/legal/disclaimer`, `src/app/accessibility` · this page must be reviewed by the trust's legal advisor before launch. Once a page is approved, set its date in `src/lib/legal.ts` and remove its `reviewNote`
- [ ] `src/app/legal/privacy/page.tsx` · name of the email service used for the secretariat mailbox
- [ ] `src/app/legal/privacy/page.tsx` · retention periods agreed by the Board, for example how long enquiries and expressions of interest are kept
- [x] `/accessibility` · update "What has been tested" after the full audit (Prompt 22)
- [ ] `/accessibility` · test with screen readers (NVDA, VoiceOver, TalkBack), in Safari and Firefox, and with disabled users before launch, then update the statement
- [x] AEO and GEO layer: `/llms.txt`, `/llms-full.txt`, named AI crawlers in `robots.txt`, answer-first page openings, "Last updated" dates, IndexNow (Prompt 20)
- [ ] Trustee to re-review three small citation edits made on 24 November 2026, which add the source and date to the same sentence as each figure: `indiaai-mission-explained` (PIB figures list), `dpdp-act-explained-for-data-teams` (consent manager net worth, penalty table), `data-scientist-salary-in-india` (pharma and healthcare range). `lastReviewed` was left unchanged until that review.
- [ ] Founders: create an IndexNow key and add it as `INDEXNOW_KEY` in Vercel (Production) and as a GitHub Actions secret of the same name (`docs/INDEXNOW.md`)
- [ ] Founders: work through `docs/GEO_OFFSITE_CHECKLIST.md`, and run its ten test questions each month
- [ ] `/achievements` · dated milestones confirmed by the founders, for example the date the trust deed was signed and the date of the first public launch. Add them to `content/milestones.json`
- [ ] `/achievements` · counted figures (members, professionals trained, startups supported, research initiatives, industry collaborations). Each needs a count, the date it is correct as at, how it was counted and the confirming Founder Trustee. Add them to `content/impact.json`
