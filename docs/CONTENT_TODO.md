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

Each of the thirteen trustees has five placeholders: current role, current organisation, a biography of about sixty words, two to four areas of expertise, and a LinkedIn link. Each also needs a photograph, which is added only with `consentToPublish: true`.

Photographs received with consent (23 November 2026): Amit Kumar Das, Eshwar Boini, Deb Kumar Majumder, Sandip Datta and Sayan Guha. Still needed from the other eight trustees.

- [ ] `content/trustees.json` · Amit Kumar Das
- [ ] `content/trustees.json` · Abhijit Pal
- [ ] `content/trustees.json` · Prasun Nandy
- [ ] `content/trustees.json` · Sudip Dasgupta
- [ ] `content/trustees.json` · Rahul Bhattacharya
- [ ] `content/trustees.json` · Biswajeet Chaki
- [ ] `content/trustees.json` · Sayan Guha
- [ ] `content/trustees.json` · Deb Kumar Majumder
- [ ] `content/trustees.json` · Sandip Datta
- [ ] `content/trustees.json` · Agnimitra Biswas
- [ ] `content/trustees.json` · Kaushik Dey
- [ ] `content/trustees.json` · Ayan Chakraborty
- [ ] `content/trustees.json` · Eshwar Boini

### Pages still to be built

Every route in the site map exists, but most show only a heading and `[PLACEHOLDER: page content, built in a later playbook step]`. These are filled in by playbook prompts 5 to 17, not by the founders. `pnpm content:check` lists each one with its file.

- [ ] `src/app/page.tsx` · home page content (Prompt 5)
- [ ] `src/app/about/**` · About section pages (Prompts 6 and 7)
- [ ] `src/app/programmes/**` · programmes overview and eight programme pages (Prompt 8)
- [ ] `src/app/for/[audience]` · four audience pages (Prompt 9)
- [ ] `src/app/membership/**` · membership and register-your-interest pages (Prompts 10 and 16)
- [ ] `src/app/events` · events (Prompt 11)
- [ ] `src/app/communities` · communities (Prompt 12)
- [ ] `src/app/insights` · insights (Prompt 13)
- [ ] `src/app/guides`, `src/app/glossary`, `src/app/resources` · guides, glossary and resources (Prompt 14)
- [ ] `src/app/partner`, `src/app/support`, `src/app/contact` · partner, support and contact (Prompts 15 and 16)
- [ ] `src/app/faq`, `src/app/legal/**`, `src/app/accessibility` · questions and legal pages (Prompt 17)
