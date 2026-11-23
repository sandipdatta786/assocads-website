# Content still needed

Everything the site is waiting for from the founders. Tick an item when it has been supplied and added to the site. Every `[PLACEHOLDER: ...]` on the site should have a line here.

## From the founders

- [ ] **Final domain name.** Needed for canonical addresses and email addresses.
- [ ] **Registered office address.** Needed for the footer, contact page and structured data.
- [ ] **Public email addresses and a phone number, if any.** Needed for the contact page.
- [ ] **Trustee profiles.** For each of the thirteen Founder Trustees: photograph, current role, sixty-word biography, LinkedIn link, and consent to publish.
- [ ] **Trustee name spellings** confirmed against each trustee's PAN card.
- [ ] **Registration number and date.** Needed to switch the site from "pending" to "registered".
- [ ] **Membership fees and any student category**, once fixed by the Board.
- [ ] **Real upcoming events** with date, venue and registration method.
- [ ] **Official social media links.** Needed for the footer and structured data.
- [ ] **Signed permissions** for any partner names or logos.
- [ ] **Board adoption of the logo in `docs/logo/`, and a trademark check.**
- [ ] **Bank details and 80G status.** Needed for donations, later.

## Placeholders on the site

Run `pnpm content:check` for the current list with line numbers. Add one line here for every new placeholder, in the form `path/to/file` · what is needed.

### Organisation settings: `src/config/site.ts`

- [ ] `src/config/site.ts` · registered office address in West Bengal (`legal.registeredOffice`)
- [ ] `src/config/site.ts` · public contact email address (`contact.email`)
- [ ] `src/config/site.ts` · public phone number, if any (`contact.phone`)
- [ ] `src/config/site.ts` · email address for data protection requests (`contact.dataProtectionEmail`)
- [ ] `src/config/site.ts` · official social profile links, currently empty and so not shown (`social`)
- [ ] `src/config/site.ts` · registration number and date, then `legal.status: "registered"`. These are empty settings rather than placeholders, and the site keeps saying "registration in progress" until they are filled in.

### Founder Trustees: `content/trustees.json`

Send each trustee the form in `docs/TRUSTEE_PROFILE_TEMPLATE.md`. Each still needs a current role, organisation, a biography of about sixty words in the third person, up to five areas of expertise and a LinkedIn link. Photographs follow the specification in the README and are shown only with `consentToPublish: true`. A trustee gets an individual page once their biography is in.

- [ ] Amit Kumar Das · role, organisation, biography, expertise and LinkedIn needed; photo received (only 525 px; a larger one of at least 800 px is wanted)
- [ ] Abhijit Pal · role, organisation, biography, expertise and LinkedIn needed; photo and consent needed
- [ ] Prasun Nandy · role, organisation, biography, expertise and LinkedIn needed; photo and consent needed
- [ ] Sudip Dasgupta · role, organisation, biography, expertise and LinkedIn needed; photo and consent needed
- [ ] Rahul Bhattacharya · role, organisation, biography, expertise and LinkedIn needed; photo and consent needed
- [ ] Biswajeet Chaki · role, organisation, biography, expertise and LinkedIn needed; photo and consent needed
- [ ] Sayan Guha · role, organisation, biography, expertise and LinkedIn needed; photo received
- [ ] Deb Kumar Majumder · role, organisation, biography, expertise and LinkedIn needed; photo received
- [ ] Sandip Datta · role, organisation, biography, expertise and LinkedIn needed; photo received
- [ ] Agnimitra Biswas · role, organisation, biography, expertise and LinkedIn needed; photo and consent needed
- [ ] Kaushik Dey · role, organisation, biography, expertise and LinkedIn needed; photo and consent needed
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
- [ ] `src/app/for/[audience]` · four audience pages (Prompt 9)
- [ ] `src/app/membership/**` · membership and register-your-interest pages (Prompts 10 and 16)
- [ ] `src/app/events` · events (Prompt 11)
- [ ] `src/app/communities` · communities (Prompt 12)
- [ ] `src/app/insights` · insights (Prompt 13)
- [ ] `src/app/guides`, `src/app/glossary`, `src/app/resources` · guides, glossary and resources (Prompt 14)
- [ ] `src/app/partner`, `src/app/support`, `src/app/contact` · partner, support and contact (Prompts 15 and 16)
- [ ] `src/app/faq`, `src/app/legal/**`, `src/app/accessibility` · questions and legal pages (Prompt 17)
