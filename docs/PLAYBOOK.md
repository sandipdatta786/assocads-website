# ASSOCADS Website Build Playbook

**Step-by-step prompts for Claude Code · Version 1.2 · November 2026**

This playbook rebuilds the ASSOCADS website from scratch in 27 prompts. Paste them into Claude Code one at a time, in order. Each one builds on the last, and each ends with checks so that you know it worked before moving on.

It works together with two companion files:

- `ASSOCADS_Brand_Guide.md`: colours, fonts and usage rules.
- `ASSOCADS_Website_Blueprint.md`: the strategy, site map, facts from the trust deed, truthfulness rules and SEO specification.

The prompts are short because they point Claude Code at those two files instead of repeating them.

---

## How to use this playbook

### Before you start (about 20 minutes, done by you)

1. Install Node.js 22 or later, Git, and the Claude Code desktop app or command-line tool.
2. Have your GitHub account (`github.com/sandipdatta786`) and your Vercel account ready. The GitHub command-line tool (`gh`) is already signed in to that account on your Mac, so Claude Code can create the repository and push to it for you.
3. Create an empty folder for the project, for example `assocads-website`, **outside OneDrive**. Syncing a code project through OneDrive causes file-locking errors and very slow installs.
4. Inside it, create a folder called `docs` and copy in the two companion files, renamed to `docs/BRAND_GUIDE.md` and `docs/BLUEPRINT.md`.
5. Copy the `ASSOCADS_Logo_Final` folder into the project as `docs/logo/`.
6. **Do not copy the trust deed into the project.** It contains PAN and Aadhaar numbers. Everything the site needs from it is already in the blueprint.
7. Open the folder in Claude Code.

### Where the code lives

The code sits in three places that stay in step with each other:

| Place    | What it is                                                         | How it gets updated                                                                                                        |
| -------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Your Mac | The project folder you open in Claude Code                         | Claude Code edits files here                                                                                               |
| GitHub   | `github.com/sandipdatta786/assocads-website`, a private repository | Every "commit and push" sends your changes here. This is the backup and the history.                                       |
| Vercel   | The live website                                                   | Vercel watches the GitHub repository and publishes automatically within a minute or two of every push to the `main` branch |

So the routine is always the same: change on your Mac, push to GitHub, and Vercel deploys by itself. You never upload anything to Vercel by hand. Prompt 1 creates the GitHub repository; Prompt 25 connects Vercel to it.

### Working rhythm

| Step | What to do                                                                                                                                     |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Start a fresh conversation for each prompt (or type `/clear`). The project's `CLAUDE.md` file, created in Prompt 1, carries the rules forward. |
| 2    | Paste the prompt exactly as written.                                                                                                           |
| 3    | For the larger prompts (marked **Plan first**), switch on plan mode, read the plan, then approve it.                                           |
| 4    | When Claude Code finishes, look at the result in the browser on both a desktop and a phone-sized window.                                       |
| 5    | Ask for changes in plain language: "The hero headline is too large on a phone", "Make the cards the same height".                              |
| 6    | When you are happy, say "commit and push". This saves the work to GitHub. Then move to the next prompt.                                        |

### If something goes wrong

- **A check fails:** paste the error and say "fix this, then run the checks again".
- **The design drifts from the brand:** say "re-read docs/BRAND_GUIDE.md and correct anything that does not match".
- **Claude Code invents content:** say "this breaks the truthfulness rules in CLAUDE.md; replace it with a placeholder".
- **You want to undo a step:** say "revert to the last commit".
- **A push to GitHub is refused:** run `gh auth status` in a terminal. If it says you are signed out, run `gh auth login` yourself and follow the browser steps, then ask Claude Code to push again.

### Overview of the prompts

| Phase         | Prompts  | What you have at the end                                                                |
| ------------- | -------- | --------------------------------------------------------------------------------------- |
| A. Foundation | 1 to 4   | A working project with the brand, content structure and page frame                      |
| B. Core pages | 5 to 10  | Home, About, Trustees, Programmes, audience pages, Membership                           |
| C. Publishing | 11 to 14 | Events, Communities, Insights, Guides and Glossary                                      |
| D. Conversion | 15 to 17 | Partner, Support, Contact, working forms, FAQ, legal pages                              |
| E. Ranking    | 18 to 20 | Technical SEO, structured data, the AEO and GEO layer                                   |
| F. Quality    | 21 to 23 | Motion and polish, accessibility and mobile, speed                                      |
| G. Launch     | 24 to 27 | Analytics, automatic deployment from GitHub to Vercel, the pre-launch audit, the domain |
| H. Afterwards | Recipes  | Short prompts for everyday updates                                                      |

Expect two to four working days in total, most of it spent reviewing.

---

# Phase A: Foundation

## Prompt 1: Create the project and its rulebook

**Plan first.**

```text
You are setting up a brand-new website for ASSOCADS (Association for AI and Data Science), a public charitable trust in Kolkata, India, whose registration is in progress.

Before doing anything, read docs/BLUEPRINT.md and docs/BRAND_GUIDE.md in full. They are the source of truth for this whole project.

Do the following.

1. Create a Next.js project in this folder using the latest stable version: App Router, TypeScript in strict mode, ESLint, the src/ directory, the "@/..." import alias, and Tailwind CSS (latest stable). Use pnpm if it is installed, otherwise npm. Check the official Next.js and Tailwind documentation for the current setup steps rather than relying on memory. Keep the existing docs/ folder.

2. Add Prettier with the Tailwind class-sorting plugin, and scripts named: dev, build, start, lint, typecheck, format, and "check" (which runs lint, typecheck and build in turn).

3. Create the folder structure:
   src/app            routes
   src/components     ui/ (primitives), layout/, sections/, forms/, seo/
   src/lib            helpers, content loaders, SEO helpers
   src/config         site configuration
   content/           all editable content (MDX and JSON)
   public/            static files
   docs/              BLUEPRINT.md, BRAND_GUIDE.md, CONTENT_TODO.md

4. Write CLAUDE.md at the project root. It must be concise and contain:
   - What the project is, in three lines.
   - The commands.
   - The architecture: every page is statically generated; all content lives in content/; all organisation facts come from src/config/site.ts; no database.
   - The truthfulness rules from section 8 of the blueprint, copied in full and marked as mandatory.
   - The brand rules in brief: only the tokens and three typefaces in the brand guide; never add a colour or font.
   - Writing style: Indian English spelling, sentence-case headings, plain direct sentences, no hype words.
   - Engineering rules: server components by default; client components only for real interactivity; mobile first; WCAG 2.2 AA; no new dependency without stating why; every page exports metadata; one h1 per page.
   - The placeholder convention: missing content is written as [PLACEHOLDER: what is needed] and logged in docs/CONTENT_TODO.md.
   - Git workflow: the remote is github.com/sandipdatta786/assocads-website and the main branch deploys to production automatically through Vercel, so main must always build. Small content changes are committed straight to main. Anything larger goes on a branch with a pull request, which gets its own Vercel preview address. Commit messages are short and say what changed. Never commit secrets or .env files, and never force-push main.
   - Definition of done for any task: "pnpm check" passes, the page works at 360px and 1440px wide, and nothing in the truthfulness rules is broken.

5. Create docs/CONTENT_TODO.md, starting with the list in section 12 of the blueprint as a checklist.

6. Create a .gitignore suitable for Next.js, a .env.example with no real values, and a README.md that explains in plain language how to run the site and how content is edited.

7. Replace the default home page with a single line of text, "ASSOCADS: site under construction", so the build passes.

8. Initialise Git on a branch called main and make the first commit.

9. Put the code on GitHub. The GitHub CLI (gh) is already signed in as sandipdatta786. First check whether a repository named assocads-website already exists on that account; if it does, stop and ask me what to do. Otherwise create a PRIVATE repository at github.com/sandipdatta786/assocads-website with the description "Website of ASSOCADS, the Association for AI and Data Science", add it as the "origin" remote, and push main with upstream tracking. Do not create it as public, and do not touch any other repository on the account.

Do not build any real pages yet. When finished, run "pnpm check", start the dev server, and tell me the address to open, the address of the GitHub repository, the versions of Next.js and Tailwind that were installed, and anything you were unsure about.
```

**Done when:** the dev server shows the one-line page, `pnpm check` passes, `CLAUDE.md` contains the truthfulness rules, and the code is visible at `github.com/sandipdatta786/assocads-website`.

---

## Prompt 2: Build the design system

**Plan first.**

```text
Read docs/BRAND_GUIDE.md in full, and section 9 of docs/BLUEPRINT.md.

Build the design system for the site. Nothing outside the brand guide may be introduced.

1. Tokens. Put every colour, type size, radius, shadow, motion and layout value from section 8 of the brand guide into the global stylesheet as CSS custom properties, and map them into the Tailwind theme so that classes such as bg-ink, text-indigo, text-display-xl, rounded-m and shadow-card exist. Remove Tailwind's default colour palette so that off-brand colours cannot be used by accident.

2. Fonts. Load Inter, Inter Tight and JetBrains Mono through next/font/google, self-hosted, with "swap" display and only the weights the brand guide lists. Expose them as CSS variables used by the tokens.

3. Base styles. Set body text, heading styles, link styles, selection colour, the visible focus ring from the brand guide, smooth scrolling that is disabled when the visitor prefers reduced motion, and sensible defaults for lists, tables and blockquotes in long-form content.

4. Primitives, in src/components/ui, each fully typed, accessible and usable on both light and dark sections:
   Container, Section (with tone: paper, cloud, ink, tint), Heading, Eyebrow, Lead, Prose (for MDX content),
   Button and ButtonLink (primary, secondary, ghost, marigold; sizes medium and large; pill shape; minimum 44px touch target),
   TextLink (with arrow), Card, BentoGrid and BentoCell, Tag, Badge (status: open, upcoming, closed, planned),
   Divider, Icon (Lucide, 1.5px stroke), Accordion (native details/summary based),
   Breadcrumbs, Callout (note and status variants), StatBlock, Placeholder (a clearly marked dashed box that prints its "[PLACEHOLDER: ...]" text),
   Avatar (shows a photo, or the person's initials on a Cloud tile when there is no photo),
   and a DotGrid and a NodeLines decorative background drawn in SVG from the brand colours.

5. The logo. The master logo files are in docs/logo/ (svg, png and favicon folders, with a README). Do not redraw or retype the logo. Copy the SVG files the site needs into public/brand/, and build a Logo React component that renders them inline with three layouts (horizontal, horizontal without descriptor, symbol) and the "colour" and "colour-on-dark" versions, switching automatically by section tone, with the accessible name "ASSOCADS, Association for AI and Data Science". Use the files in docs/logo/favicon for the favicon, the Apple touch icon and the web manifest icons. Follow the size and clear-space rules in section 4 of the brand guide.

6. A private page at /styleguide, excluded from search engines, that shows every token and every primitive in every variant on light and dark backgrounds, with the contrast ratio written beside each text and background pairing.

Rules: mobile first; no component may cause horizontal scrolling at 320px; every interactive element must be reachable and operable by keyboard; honour prefers-reduced-motion.

When finished, run "pnpm check", open /styleguide, take a screenshot at phone width and at desktop width, check them yourself against the brand guide, fix what does not match, and then show me.
```

**Done when:** `/styleguide` shows the whole system and looks calm, spacious and consistent on a phone and a desktop.

---

## Prompt 3: Set up the content model and site configuration

```text
Read sections 5, 6, 7 and 8 of docs/BLUEPRINT.md.

Create the content layer, so that every later page reads from typed content files and nothing is hard-coded in components.

1. src/config/site.ts, the single source of organisation facts:
   name, shortName, description (one sentence from the blueprint), tagline,
   url (from the NEXT_PUBLIC_SITE_URL environment variable, defaulting to http://localhost:3000),
   foundingYear 2026, location (Kolkata, West Bengal, India),
   legal: { status: "pending" | "registered", registrationNumber, registrationDate, registeredOffice, taxExemption: { twelveAB: "not-applied" | "applied" | "granted", eightyG: "not-applied" | "applied" | "granted" } } with status "pending" and both exemptions "not-applied",
   contact: { email, phone, dataProtectionEmail }, all as placeholders,
   social: { linkedin, youtube, x, instagram, github }, all empty,
   navigation and footer link lists matching section 5 of the blueprint.
   Add helper functions legalStatusLine() and canMentionTaxExemption() that the whole site uses, so that wording about registration can never be typed by hand in a page.

2. Zod schemas and typed loaders in src/lib/content for these collections, stored in content/:
   trustees (JSON): order, name, slug, capacity, officeTitle (optional, empty), role, organisation, bio, expertise[], photo, linkedin, consentToPublish (boolean, false by default), published
   programmes (MDX): slug, title, summary, deedObjects[], status ("active" | "planned"), icon, order
   audiences (MDX): slug, title, summary
   membershipCategories (JSON): the four categories from section 7.6, with eligibility, terms, fee (null) and benefits
   events (MDX): slug, title, summary, type, startDate, endDate, mode ("in-person" | "online" | "hybrid"), venue, city, registrationUrl, registrationStatus, speakers[], draft
   insights (MDX): slug, title, summary, category, publishedDate, author, image, draft
   guides (MDX): slug, title, summary, directAnswer (40 to 60 words), author, reviewedBy, publishedDate, lastReviewed, targetQuery, faqs[], draft
   glossary (MDX): term, slug, shortDefinition (under 40 words), related[], lastReviewed, draft
   faqs (JSON): question, answer, category, pages[]
   documents (JSON): title, description, file, category, date, available (boolean)
   The loaders must: fail the build with a clear message when a file is invalid; hide anything with draft: true in production; and sort sensibly.

3. Seed content, strictly from the blueprint and nothing else:
   - The thirteen trustees from section 7.5, names and capacity only; every other field a placeholder; consentToPublish false.
   - The eight programmes from section 6, each with a 60 to 90 word plain-English summary drawn only from the deed objects listed for it, status "planned".
   - The four audiences.
   - The four membership categories with fee null.
   - No events, no insights and no partners. Those collections start empty.
   - About fifteen FAQs that can be answered truthfully from the blueprint, including: what ASSOCADS is; whether it is registered (answered through the legal status helper); who runs it; who can join; what membership costs (not yet fixed, and why); whether members can vote (no, and why); whether donations are tax-deductible (not at present); whether it accepts foreign donations (no); how it differs from, and that it is not affiliated with, ADaSci, the Artificial Intelligence Association of India, the Analytics Society of India, NASSCOM and IAMAI.

4. MDX support with a small set of approved components (Callout, Placeholder, StatBlock, a responsive Table, and Figure).

5. A script "pnpm content:check" that validates all content and prints every remaining [PLACEHOLDER: ...] with its file, and add it to "pnpm check" as a warning, not a failure, for now.

6. Update docs/CONTENT_TODO.md with every placeholder you created.

Do not create any pages in this step. Run "pnpm check" and show me the list of collections with their item counts and the placeholder report.
```

**Done when:** the content report lists 13 trustees, 8 programmes, 4 audiences, 4 membership categories, and no events or news.

---

## Prompt 4: Build the page frame: header, navigation and footer

```text
Read sections 5 and 9 of docs/BLUEPRINT.md and the layout section of docs/BRAND_GUIDE.md.

Build the frame that wraps every page.

1. Root layout: correct lang attribute ("en-IN"), the fonts, a "Skip to content" link as the first focusable element, the header, a main landmark, the footer, and default metadata taken from src/config/site.ts.

2. Header: a sticky, translucent bar with a background blur and a hairline bottom border that appears after scrolling. Logo lockup on the left; the six navigation items in the centre; a "Join" primary button on the right. On desktop, "About", "Programmes" and "Resources" open a wide, calm dropdown panel listing their child pages with one-line descriptions. Dropdowns must work by keyboard and close on Escape, and the current section must be marked with aria-current.

3. Mobile navigation (below 1024px): a menu button that opens a full-screen panel, with large, well-spaced links, collapsible groups, the Join button pinned at the bottom, focus trapped inside while open, page scrolling locked, and closing on Escape or on navigation. Minimum touch target 44px.

4. A slim status banner under the header that is driven only by the legal status helper. While status is "pending" it reads: "ASSOCADS is a public charitable trust in formation. Registration is in progress." with a link to /about/governance. When status is "registered" it disappears. It must be dismissible for the session.

5. Footer, on an Ink background: logo and the one-sentence description; four link columns (About, Get involved, Resources, Legal) from the site configuration; contact details; social links shown only when they are filled in; and a bottom line that prints the legal status line, the registered office when known, and the copyright year computed automatically. Show the registration number only when it exists.

6. Shared page furniture: a PageHeader component (eyebrow, h1, lead, optional actions, breadcrumbs), a CallToAction band reused at the bottom of pages, a styled 404 page with helpful links, and an error page.

7. Create empty placeholder routes for every URL in section 5 of the blueprint, each with just a PageHeader, so the navigation has somewhere to go.

Check it yourself at 320, 390, 768, 1024 and 1440 pixels wide, in keyboard-only use, and with reduced motion switched on. Fix what you find, run "pnpm check", then show me screenshots of the header open and closed on a phone and on a desktop.
```

**Done when:** you can reach every page from the menu on a phone using one thumb, and by keyboard on a desktop.

---

# Phase B: Core pages

## Prompt 5: Build the home page

**Plan first.**

```text
Read sections 1, 3, 4, 8 and 9 of docs/BLUEPRINT.md, and docs/BRAND_GUIDE.md.

Build the home page. It must explain what ASSOCADS is within five seconds, send each audience to the right place, and feel calm, confident and spacious in the manner described in section 9. Every word must be true today: follow the truthfulness rules in CLAUDE.md without exception.

Sections, in this order:

1. Hero. Eyebrow: "Association for AI and Data Science". A headline of at most nine words built around "Connecting talent, knowledge, innovation and opportunity". One supporting sentence stating that ASSOCADS is a not-for-profit professional association connecting students, professionals, academia, industry, startups and government to advance AI and Data Science in India, beginning in West Bengal. Two actions: "Become a member" (to /membership) and "See what we do" (to /programmes). Behind it, the NodeLines graphic, subtle. No photograph and no carousel.

2. Audience routing. Four large cards, "For students", "For professionals", "For industry", "For government", each with one sentence on what that audience gets and a link to its page.

3. What we do. A bento grid of the eight programmes from the content layer, with icon, title, one-line summary, a "Planned" or "Active" badge, and a link.

4. Why ASSOCADS, on an Ink section. Three points drawn from the deed: open to all without discrimination; run as a not-for-profit public charitable trust with audited accounts; committed to responsible AI. No numbers.

5. Founder Trustees preview. A short line, "Founded by thirteen practitioners, academics and entrepreneurs", a row of avatars showing initials, and a link to /about/trustees.

6. What is next. If there are upcoming events, show the next three. If there are none, show an honest panel saying the first programme calendar will be announced after registration, with a button to register interest.

7. Roadmap teaser. Three columns for the near, mid and long term, each with three items, all worded as plans, linking to /about/roadmap.

8. Questions. The five most important FAQs in an accordion, with a link to /faq.

9. Closing call to action. "Be part of it from the start", with "Become a member" and "Partner with us".

Do not include: partner or university or company logos, member counts, statistics, testimonials, countdown timers, news items, fees, or any claim of registration or tax exemption.

Write tight, plain copy. Headline sizes must use the display tokens. On a phone, every section must read well in a single column, with no horizontal scrolling and no text smaller than 16px.

Add complete metadata for the page. When finished, run "pnpm check", review your own screenshots at 390px and 1440px against the brand guide and section 9, improve the weakest two sections, and then show me.
```

**Done when:** a stranger can say what ASSOCADS is after five seconds on the page, and nothing on it is untrue.

---

## Prompt 6: Build the About section

```text
Read section 7 of docs/BLUEPRINT.md carefully. Build the About pages from it, in plain English, without legal language and without inventing anything.

1. /about: the story. Why ASSOCADS exists; who started it (professionals, academics and entrepreneurs in AI, Data Science and Analytics); the vision (an ecosystem enabler, with the long-term aim of becoming an apex professional body); the scope (India, beginning with West Bengal); how it differs from trade bodies and commercial certification providers, using the positioning in section 3.3. End with links to the other About pages.

2. /about/objects: "Aims and objects". Present the sixteen objects from section 7.2 as a readable page: group them under five or six plain headings, give each a short title and one or two sentences, and number them so they can be cited. Open with a two-sentence summary. State that these are taken from the trust deed.

3. /about/governance: how the trust is run. Cover: its nature as a public charitable trust; the Board of Trustees; the office bearers and that they will be elected at the first Board meeting after registration; that trustees are honorary; meetings; annual audit and annual report; the ten principles in section 7.3 presented as a clear list; conflict-of-interest rules; what happens on dissolution. Include a "Legal status" panel generated only from the legal status helper, and a "Documents" list from the documents collection where anything not yet available is shown as "To be published" and is not a link.

4. /about/roadmap: near term (first 12 months), mid term (12 to 24 months) and long term (beyond 24 months), drawn from the programme areas in the blueprint. Every item is worded as a plan. Put a clear note at the top: "This roadmap sets out intentions. Dates and details will be confirmed by the Board."

5. /about/facts: "ASSOCADS at a glance". A page of short, self-contained, dated facts written to be quoted: full name, short name, what it is, legal form, legal status (from the helper), year founded, where it is based, scope, number of Founder Trustees, membership categories, programme areas, how to contact it, and what it is not affiliated with. Show a "Last updated" date. Use a definition list.

Give every page a PageHeader with breadcrumbs, complete metadata, a relevant set of FAQs where useful, and the shared call-to-action band. Run "pnpm check" and show me each page at phone and desktop width.
```

**Done when:** every statement on these pages can be traced to the blueprint.

---

## Prompt 7: Build the Founder Trustees page with placeholders

```text
Read section 7.5 of docs/BLUEPRINT.md and the imagery section of docs/BRAND_GUIDE.md.

Build /about/trustees from the trustees collection.

1. Introduction: one short paragraph explaining that the first Board has thirteen Founder Trustees, that they serve in an honorary capacity, and that office bearers will be elected at the first Board meeting after registration.

2. A responsive grid of thirteen cards in deed order (one column on small phones, two from 480px, three from 900px, four from 1280px). Each card shows:
   - a square portrait with rounded corners. When there is no photo, show the Avatar with the person's initials and a small caption "Photo to be added";
   - the name;
   - the capacity: "Settlor and Founder Trustee" or "Founder Trustee";
   - an office title only if one is filled in;
   - role and organisation, or the placeholder text;
   - a short biography, or the placeholder text;
   - expertise tags, shown only when filled in;
   - a LinkedIn link, shown only when filled in, with an accessible label.

3. A trustee's individual page at /about/trustees/[slug] is generated only when that trustee has published: true, consentToPublish: true and a real biography. Until then the card is not a link.

4. Photos: read from public/images/trustees/[slug].jpg. Document in the README the exact specification for founders to follow: square, at least 800 by 800 pixels, head and shoulders, plain light background, JPG, file named with the trustee's slug.

5. Create docs/TRUSTEE_PROFILE_TEMPLATE.md: a simple form that can be sent to each trustee, asking for their name as it should appear, current role, organisation, a biography of about 60 words written in the third person, up to five areas of expertise, a LinkedIn address, a photograph to the specification above, and a signed line giving consent to publish.

6. Make sure no personal detail from the deed beyond the name and capacity appears anywhere.

Update docs/CONTENT_TODO.md with one line per trustee. Run "pnpm check" and show me the page at 360px, 768px and 1440px.
```

**Done when:** thirteen tidy cards appear, with initials in place of photos and clearly marked gaps.

---

## Prompt 8: Build the Programmes section

```text
Read section 6 and section 7.2 of docs/BLUEPRINT.md.

1. /programmes: an overview. A short introduction, then the eight programmes in a bento grid, then a section explaining how the programmes map to the trust's objects, then the call-to-action band.

2. /programmes/[slug]: one page per programme, generated from the MDX collection. Write the full content for all eight now, each with:
   - a one-sentence statement of what the programme is for;
   - "What this will include": four to six concrete activities taken only from the deed objects mapped to it;
   - "Who it is for": the relevant audiences, linking to their pages;
   - "Status": an honest paragraph. While the status is "planned" it says the programme will begin after registration and that details will be published here;
   - "How to get involved": the action that fits (join, partner, register interest);
   - three or four FAQs;
   - links to related programmes.

3. For the responsible-ai page, add a section stating the trust's own commitment to responsible AI, taken from principle (d) in section 7.3.

4. For awards-and-ai-for-good, cover recognition (awards, fellowships) and AI for social good (healthcare, agriculture, education, governance, sustainability, climate resilience, accessibility, rural development, social inclusion) as two clear halves.

Do not name dates, fees, partners, numbers or past activity. Give each page complete metadata targeting a sensible search phrase, breadcrumbs, and a previous and next link. Run "pnpm check" and show me the overview and two programme pages.
```

---

## Prompt 9: Build the four audience pages

```text
Read sections 1, 4.1 and 6 of docs/BLUEPRINT.md.

Build /for/students, /for/professionals, /for/industry and /for/government from the audiences collection. Each is a landing page written for that reader, in the second person, answering "what is in this for me?" truthfully.

Shared structure:
1. PageHeader with a headline specific to the audience and one primary action.
2. "What you can expect": four to six benefits, each tied to a real programme and linking to it. Word them as what ASSOCADS plans to offer.
3. "How to take part": three numbered steps.
4. The programmes most relevant to this audience.
5. Relevant guides and glossary entries, shown only when published ones exist.
6. FAQs specific to this audience.
7. Call to action.

Specifics:
- Students: learning, mentoring, internships and career guidance, hackathons, recognition. Note that membership is open to individuals aged eighteen or over, and that a student category is under consideration and depends on the bye-laws. Primary action: register interest in membership.
- Professionals: includes practitioners, faculty and researchers. Peer community, Special Interest Groups, speaking and mentoring, research collaboration, recognition. Primary action: register interest in membership.
- Industry: includes companies, startups and institutions. Associate membership, access to talent, workforce training, joint research, startup support, sponsorship. Mention that corporate social responsibility contributions are something the deed allows the trust to receive, without making any tax claim. Primary action: partner with us.
- Government: policy and standards input, advisory and knowledge support, capacity building for officials, AI-for-social-good projects, responsible AI. State that ASSOCADS is non-political and not-for-profit. Primary action: contact the secretariat.

Complete metadata for each page. Run "pnpm check" and show me all four at phone width.
```

---

## Prompt 10: Build the Membership pages

```text
Read section 7.6 and section 8 of docs/BLUEPRINT.md. The membership rules come from the trust deed and must be stated exactly.

1. /membership:
   - Header: "Membership" with a lead sentence and a "Register your interest" action.
   - A status callout: "Membership will open after the trust is registered and the Board has adopted its bye-laws. Register your interest now and we will write to you when applications open."
   - "Who can join": the four categories from the collection (Ordinary, Life, Associate, Honorary) as cards, each with who it is for and its terms from the deed. Where the fee would appear, show "Fee to be fixed by the Board". Honorary shows "By invitation of the Board".
   - "What members can take part in": programmes, Special Interest Groups, events and publications, as the Board decides.
   - "What membership is not": a short, honest section explaining that members do not own a share of the trust, do not manage it and do not vote on its affairs, and why this is normal for a public charitable trust.
   - "How admission works": application, approval by the Board or its committee, payment of the fee.
   - A comparison table of the four categories that turns into stacked cards on a phone.
   - FAQs, including: cost; student rates; whether a company can join; voting; how a membership ends; refunds (to be set by bye-laws).
   - Call to action.

2. /membership/apply: "Register your interest". Build the form's interface only (the sending is wired in Prompt 16): full name, email, phone (optional), city, "I am a" (student, working professional, faculty or researcher, representing an organisation, other), organisation or institution (optional), category of interest, areas of interest (multi-select from the eight programmes), a short message (optional), a required consent tick box with the privacy wording, and an optional tick box to receive updates. Labels above fields, clear error messages beside the field, correct input types and autocomplete attributes for mobile keyboards, and a success state.

Do not show any fee, any payment option, or any benefit that is not in the blueprint. Complete metadata. Run "pnpm check" and show me both pages at phone and desktop width.
```

**Done when:** the page matches the deed and shows no prices.

---

# Phase C: Publishing

## Prompt 11: Build Events

```text
Read sections 3.1 and 4.6 of docs/BLUEPRINT.md.

Build the events system on the events collection.

1. /events: upcoming events first, as dated cards showing a large day and month, title, type, mode (in person, online or hybrid), city, and a registration status badge that is computed from the dates so that it can never go stale: "Registration open", "Opening soon", "Registration closed", "Past". Filters for type and mode that work without a page reload and are reflected in the address. Below, a "Past events" list.

2. An honest empty state, used now because there are no events yet: "Our first programme calendar will be announced after registration", with a button to register interest and a link to the events and community programme.

3. /events/[slug]: title, date and time in Indian Standard Time, venue with a map link, mode, summary, full description, agenda, speakers (with Avatars), registration button (to the external registrationUrl, or to the contact form), an "Add to calendar" link that downloads an .ics file, and share links. After the event has passed, the page stays live and shows a "This event has taken place" notice with space for a summary, photographs and slides.

4. Create one example event file with draft: true, fully commented, as a template for adding real events. It must not appear on the site.

5. Create docs/HOW_TO_ADD_AN_EVENT.md in plain language.

Do not create any real-looking events. Complete metadata. Run "pnpm check" and show me the empty state, and temporarily show me the template event rendered so that I can review the design.
```

---

## Prompt 12: Build Communities: Special Interest Groups and chapters

```text
Read section 7.4 of docs/BLUEPRINT.md. The deed allows the Board to set up Special Interest Groups by industry or domain, and chapters in other states and cities. None exists yet.

Build /communities as a single, honest page:

1. Header explaining the two kinds of community in one sentence each.
2. "Special Interest Groups": what a SIG is, how one will be formed (constituted by the Board), and a list of proposed domains clearly labelled "Proposed, subject to Board approval": healthcare, agriculture, education, financial services, manufacturing, public sector and governance, generative AI, data engineering, responsible AI. Each has a "Register interest" control.
3. "Chapters": that ASSOCADS begins in West Bengal with Kolkata as its base, and that chapters in other cities and states will follow as the Board approves them. Add "Propose a chapter" as an action.
4. "Campus groups": a short note for colleges and universities, pointing to the partner page.
5. An interest form (interface only for now): name, email, city, which SIG or chapter, and whether they would like to help organise.
6. FAQs.

Structure the content so that when real SIGs and chapters exist they can be added as a collection with their own pages, without redesigning this page. Complete metadata. Run "pnpm check" and show me the page.
```

---

## Prompt 13: Build Insights (news) and the RSS feed

```text
Build the news section on the insights collection.

1. /insights: a list of published items, newest first, with category filters, each card showing category, title, summary, date and reading time. The first item is shown larger. Paginate at twelve.

2. An honest empty state, used now: "News and announcements will appear here", with a link to the guides.

3. /insights/[slug]: a comfortable reading layout at the reading width from the brand guide, with title, date, author, category, share links, the article body through the Prose component, and related items. Show "Published" and, when different, "Updated" dates.

4. /feed.xml: an RSS feed of insights and guides, linked from the head of every page.

5. One template article with draft: true, fully commented, and docs/HOW_TO_PUBLISH_NEWS.md in plain language.

6. A rule enforced in the content loader: an item with a publishedDate in the future is not shown. This prevents future-dated news appearing by mistake.

Do not write any news. Complete metadata. Run "pnpm check" and show me the empty state and the template article rendered.
```

---

## Prompt 14: Build Guides, the Glossary and the Resources hub

**Plan first.** This is the content that will bring most of the search traffic.

```text
Read sections 4.1, 4.2, 4.4 and 4.5 of docs/BLUEPRINT.md.

1. Guide template at /guides/[slug], designed to be quoted by search engines and AI assistants:
   - the title as a question or clear statement;
   - a "Short answer" box directly under the title containing the directAnswer field (40 to 60 words);
   - author, reviewer, published date and "last reviewed" date, visible;
   - an "On this page" contents list;
   - the body, with question-style headings, numbered steps, comparison tables and short self-contained paragraphs;
   - a "Key facts" list;
   - a "Sources" list with links to primary sources;
   - FAQs;
   - a soft call to action relevant to the reader;
   - related guides and glossary terms.

2. /guides: an index grouped by theme: careers, Kolkata and West Bengal, policy and governance, fundamentals.

3. Glossary: /glossary as an A to Z index with a quick filter, and /glossary/[term] pages with a one-sentence definition first, then a plain-English explanation, an example, why it matters, related terms and further reading.

4. /resources: a hub linking to guides, glossary, downloadable documents (from the documents collection, with unavailable ones shown as "To be published"), and a brand kit section offering the logo files from docs/logo/ and the brand guide.

5. Draft content. Write complete first drafts of the twelve guides in section 4.2 and twenty-five glossary entries, all with draft: true. Rules for the drafts:
   - Use only facts you can support with a primary or authoritative source, and list those sources with links. Check them online; do not rely on memory for figures, dates, laws or schemes.
   - For salary, course, company and event guides, cite published sources, give the date of the data, and do not recommend or rank commercial providers. For the Kolkata guides, list only organisations you have verified exist, and describe them neutrally.
   - For the DPDP Act, the IndiaAI Mission and AI regulation, link to the official government sources and add a line that the guide is general information and not legal advice.
   - Mark any statement you could not verify with [PLACEHOLDER: verify ...].
   - Set author and reviewedBy to placeholders. A guide may only be published after a named trustee has reviewed it.
   - Mention ASSOCADS only where it is naturally relevant, never as a claim of past activity.

6. Create docs/EDITORIAL_REVIEW.md: a checklist a trustee follows before changing draft to false, and a table listing all thirty-seven drafts with a reviewer column to fill in.

Complete metadata for every template. Run "pnpm check", and show me one guide and one glossary entry rendered in draft preview, together with the list of anything you could not verify.
```

**Done when:** 12 guides and 25 glossary entries exist as drafts, each with sources, awaiting a trustee's review.

---

# Phase D: Conversion

## Prompt 15: Build Partner, Support and Contact

```text
Read sections 7.7 and 8 of docs/BLUEPRINT.md. The rules about money and legal claims are strict.

1. /partner: "Partner with us". Sections for academic institutions, companies and startups, government bodies, and community and non-profit organisations; for each, what a partnership could involve, drawn from the deed objects. A "How partnerships work" sequence: conversation, proposal, written agreement approved by the Board. A statement that ASSOCADS lists partners publicly only after a written agreement. A partnership enquiry form (interface only): name, role, organisation, type of organisation, email, phone, what they would like to explore, message, consent.

2. /support: "Support ASSOCADS". An honest page for the pre-registration period:
   - why support matters and what funds are used for (solely for the trust's objects);
   - a status callout generated from the legal status helper: while pending, "ASSOCADS is not yet accepting donations. We will open giving once the trust is registered and its bank account is in place.";
   - ways to help now: volunteer, offer a venue, speak or mentor, introduce a partner, pledge support;
   - a "Pledge or sponsor" enquiry form (interface only);
   - "Good to know": that tax-exemption wording appears only when canMentionTaxExemption() allows it, and otherwise the page says plainly that donations do not currently qualify for a tax deduction; that ASSOCADS cannot accept contributions from foreign sources; that every receipt will be acknowledged in writing; and that audited accounts will be published annually.
   No bank details, no payment button, no QR code.

3. /contact: contact details from the site configuration (placeholders shown as such), expected reply time, a "What is it about?" choice (membership, partnership, events, media, something else) that routes the message, and a contact form (interface only): name, email, phone (optional), topic, message, consent. Do not embed a map until a registered office address exists.

Complete metadata and FAQs for each page. Run "pnpm check" and show me all three at phone width.
```

---

## Prompt 16: Make the forms work

**Plan first.** You will need two free accounts for this step: Resend (to send email) and Cloudflare Turnstile (to stop spam). Create them yourself and keep the keys ready. Do not paste keys into the chat.

```text
Read section 10 of docs/BLUEPRINT.md.

Wire up all five forms: membership interest, community interest, partnership enquiry, pledge or sponsor enquiry, and contact.

1. One shared, typed form system: a Zod schema per form, shared between the browser and the server; Server Actions for submission; progressive enhancement so that each form still submits with JavaScript switched off; inline validation messages tied to their fields with aria-describedby; a summary of errors that receives focus; a disabled and labelled submit button while sending; and a clear success message that receives focus.

2. Delivery through Resend: one plain, well-formatted email to the secretariat address for that form type, with reply-to set to the sender, and a short acknowledgement email to the sender. Addresses come from environment variables. Check the current Resend documentation for the correct usage.

3. Spam protection, in layers: a hidden honeypot field; a minimum time-to-submit check; Cloudflare Turnstile verified on the server; and a per-address rate limit. Choose the simplest rate-limit approach that works on Vercel without adding a paid service, and explain your choice.

4. Privacy: collect only the fields listed; show the consent wording next to the tick box, linking to /legal/privacy; never log message contents or personal details; never put personal data in an address or query string; do not store submissions anywhere other than the email that is sent.

5. Configuration: list every environment variable in .env.example with a comment, and never commit real values. When the keys are missing in development, the forms must still work by printing the message to the terminal, and must say so on screen. In production, if sending fails, show a polite message with the secretariat's email address as a fallback.

6. Tests: Playwright tests for each form covering a successful submission (with the email step mocked), a validation failure, and the honeypot.

7. Write docs/FORMS_SETUP.md telling me, step by step and in plain language, how to create the Resend and Turnstile accounts, verify the sending domain, and where to add each key locally and in Vercel. I will add the keys myself.

Run "pnpm check" and the tests, then walk me through testing one form by hand.
```

**Done when:** you submit the contact form on your own machine and see the message arrive (or, before keys are added, appear in the terminal).

---

## Prompt 17: Build the FAQ and legal pages

```text
Read sections 7 and 10 of docs/BLUEPRINT.md.

1. /faq: all questions from the faqs collection, grouped by category (About ASSOCADS, Membership, Programmes and events, Partnerships, Support and donations, Website and privacy), with a quick filter box, and each question linkable by its own anchor. Add any important questions that are still missing and can be answered truthfully from the blueprint.

2. /legal/privacy: a privacy notice in plain English, consistent with the Digital Personal Data Protection Act, 2023. Cover: who is responsible for the data; exactly what each form collects and why; that analytics are cookieless; the services that process data (Vercel for hosting, Resend for email, Cloudflare Turnstile for spam protection); how long data is kept; the reader's rights to access, correct, erase and withdraw consent; how to complain; and how to contact the trust about data. Use the dataProtectionEmail from the site configuration.

3. /legal/terms: terms of use for the website: acceptable use, intellectual property, links to other sites, no warranty, governing law (India) and jurisdiction (courts at Kolkata).

4. /legal/disclaimer: that guides are general information and not legal, financial or career advice; that plans may change; that the mention of any organisation does not imply endorsement.

5. /accessibility: an accessibility statement: the standard aimed for (WCAG 2.2 AA), what has been tested, known limitations, and how to report a problem.

At the top of each legal page add a visible note in a Callout: "[PLACEHOLDER: this page must be reviewed by the trust's legal advisor before launch]", and log it in docs/CONTENT_TODO.md. Show an effective date on each. Complete metadata. Run "pnpm check".
```

---

# Phase E: Ranking

## Prompt 18: Technical SEO

```text
Read sections 4.3 and 5 of docs/BLUEPRINT.md.

Audit and complete the technical SEO of the whole site.

1. Metadata. Create one helper, used by every route, that produces: a unique title under 60 characters in the pattern "Page | ASSOCADS"; a unique description under 155 characters; a canonical address built from NEXT_PUBLIC_SITE_URL; Open Graph and X card tags; and correct robots directives. Write a script that lists every route with its title, description and their lengths, and flags duplicates, missing values and anything too long. Fix everything it reports.

2. Share images. Generate an Open Graph image for every page at 1200 by 630 pixels using the brand: Ink background, the colour-on-dark logo, the page title in Inter Tight, and the node-lines motif. Guides, events and insights get their own titles automatically.

3. sitemap.xml generated from the routes and content, with last-modified dates, excluding drafts, the style guide and anything set to noindex. robots.txt that allows all reputable crawlers, points to the sitemap, and blocks only /styleguide and any preview paths. Preview deployments on Vercel must send noindex so that only the real domain is indexed.

4. Redirects. The old site was a single page with anchors. Add permanent redirects for any old paths, and make sure that visiting the home page with an old anchor (#about, #leaders, #programs, #plan, #goals, #membership, #events, #news, #contact, #faq) sends the visitor to the matching new page.

5. Headings and links. Verify by script that every page has exactly one h1, that heading levels never skip, that no link says "click here" or "read more" without context, that every image has suitable alt text, and that there are no broken internal links.

6. Internal linking. Every page must be reachable within three clicks of the home page, and every page must link to at least two related pages. Add a "Related" block where this is missing.

7. Addresses: lower case, hyphenated, no trailing slash, and one address per page.

8. Add a "pnpm seo:check" script that runs all of the above checks and add it to "pnpm check".

Show me the route report as a table and a list of what you changed.
```

---

## Prompt 19: Structured data

```text
Read section 4.6 of docs/BLUEPRINT.md.

Add JSON-LD structured data across the site, generated from the site configuration and content collections so that it can never disagree with what is visible on the page.

1. Build typed helper functions in src/lib/seo/schema for: Organization (typed as NGO), WebSite, BreadcrumbList, AboutPage, ContactPage, Person, Service, Event, Article, NewsArticle, DefinedTerm, DefinedTermSet and FAQPage. Use one stable @id for the organisation and refer to it from every other item.

2. Organization, on every page: name, alternateName "ASSOCADS", description, url, logo, foundingDate (year only until the registration date is known), areaServed (India), address (Kolkata, West Bengal, India; the full address only when it is in the configuration), contactPoint, knowsAbout (artificial intelligence, data science, machine learning, analytics, responsible AI), nonprofitStatus only when the legal status is "registered", and sameAs containing only the social links that are filled in.

3. Apply the page-level types exactly as mapped in section 4.6. Specific rules:
   - Person is emitted only for trustees with published: true and consentToPublish: true.
   - Event includes eventStatus, eventAttendanceMode, location or virtual location, organiser, and an offer only when there is real registration information.
   - Article includes author, reviewedBy where present, datePublished and dateModified.
   - FAQPage is emitted only on pages where those exact questions and answers are visible.
   - No Offer or price is emitted for membership while fees are not fixed.
   - Nothing is emitted that describes something not yet true: no aggregate ratings, no awards, no member counts.

4. Validation. Add a script that renders every route, extracts the JSON-LD, checks that it parses and that required properties are present, and checks that the values match the visible page. Add it to "pnpm seo:check".

5. Check the current Google Search Central documentation for which structured data types are presently eligible for rich results, and tell me which of ours are and which are there only to help machines understand the organisation.

Show me the JSON-LD for the home page, the trustees page, a guide and the template event.
```

---

## Prompt 20: The AEO and GEO layer

```text
Read sections 4.4 and 4.5 of docs/BLUEPRINT.md.

Make the site easy for answer engines and AI assistants to read, quote and attribute.

1. /llms.txt, generated at build time from the site configuration and content: a title, a one-paragraph description of ASSOCADS including its legal status from the helper, a "Key facts" list, and sections of links with one-line descriptions for: about and governance, programmes, membership, audiences, guides, glossary, and contact. Exclude drafts. Also generate /llms-full.txt containing the plain text of the About pages, the facts page, the programme pages, the membership page and the FAQ.

2. robots.txt: explicitly allow GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Bingbot and CCBot. Verify the current official names of these crawlers online before writing them.

3. Answer-first writing. Review every page built so far and make sure that: the first paragraph under the h1 states the page's main point in 40 to 60 words in a way that makes sense when read on its own; each section opens with its conclusion; definitions follow the form "X is ..."; processes are numbered lists; comparisons are tables; and no important fact is locked inside an image, a tab, a carousel or an accordion that is closed in the HTML.

4. Entity consistency. Verify that the organisation's name, short name, one-sentence description, location and founding year are word-for-word identical in the header, footer, About page, facts page, structured data, llms.txt and metadata. Put the canonical sentence in the site configuration and reference it everywhere.

5. Disambiguation. Make sure the facts page and the FAQ state clearly what ASSOCADS is and that it is not affiliated with the similarly named organisations listed in section 3.3 of the blueprint.

6. Freshness. Show a "Last updated" date on the facts page, governance page, membership page, guides and glossary entries, taken from the content, and reflect it in the sitemap and in dateModified.

7. Citations. On every guide, make sure sources are real links to primary sources and that any statistic states its source and date in the same sentence.

8. IndexNow. Add support so that new and changed addresses are submitted to Bing and other participating engines on each production deployment. Check the current IndexNow documentation. The key must come from an environment variable.

9. Write docs/GEO_OFFSITE_CHECKLIST.md from section 11 of the blueprint, as a checklist with an owner column and a date column for the founders to fill in, and add ten test questions the team should ask ChatGPT, Gemini, Perplexity, Claude and Google once a month to see whether ASSOCADS is mentioned and described correctly (for example: "What is ASSOCADS?", "Which professional associations for data science exist in India?", "Is there an AI community in Kolkata?").

Run "pnpm check" and show me llms.txt and a summary of what you changed on each page.
```

---

# Phase F: Quality

## Prompt 21: Motion and visual polish

```text
Read section 9 of docs/BLUEPRINT.md and section 5.1 of docs/BRAND_GUIDE.md.

Take the site from correct to excellent. The reference is the calm, precise feel of Apple's product pages, without copying them.

1. Motion, using CSS and the Intersection Observer where possible and avoiding a heavy animation library:
   - sections and cards fade in and rise 16px once, as they enter the viewport, with a short stagger inside grids;
   - the hero headline reveals line by line on first load;
   - buttons and cards respond to hover and press within 150ms;
   - menus and accordions open with a 300ms ease;
   - the header gains its border and blur smoothly on scroll;
   - page navigation uses the View Transitions API where the browser supports it, and nothing where it does not.
   With prefers-reduced-motion, all of this becomes instant, with no movement.

2. Rhythm. Go through every page at 390px and 1440px and correct: uneven vertical spacing between sections; headlines that wrap badly (use text-wrap: balance for headings and text-wrap: pretty for paragraphs); lines of body text longer than 75 characters; cards of unequal height in a row; inconsistent corner radii, icon sizes or button sizes; and any place where two accents compete.

3. Hierarchy. On every page, the eye should land first on the h1, then the lead, then the primary action. Reduce anything that competes with them.

4. Dark sections. Make sure every Ink section uses the dark-background colours from the brand guide for text, links and focus rings.

5. Details: a custom text selection colour, well-styled form focus states, an elegant 404 page, consistent arrow icons on links, smooth anchor scrolling that accounts for the sticky header, and a polished print stylesheet for the facts, governance and guide pages.

6. Empty and placeholder states must look intentional and tidy, not broken.

Take before and after screenshots of the home page, the membership page and a programme page at both widths. Tell me the ten most visible improvements. Run "pnpm check".
```

---

## Prompt 22: Accessibility and mobile audit

```text
Carry out a full accessibility and mobile audit to WCAG 2.2 level AA, then fix what you find.

1. Automated: add axe-core checks through Playwright for every route, at 390px and 1440px, and make them part of "pnpm test". Fix every violation.

2. Keyboard: go through every page using only the keyboard. Check a logical tab order, a visible focus ring on every interactive element, the skip link, the dropdowns, the mobile menu (focus trap and Escape), accordions, filters and every form. Nothing may be reachable only by mouse or by hover.

3. Screen reader semantics: correct landmarks; one h1; headings in order; lists marked up as lists; buttons and links used correctly; accessible names on icon-only controls; aria-current on navigation; form errors announced; status messages announced through live regions; decorative graphics hidden from assistive technology.

4. Colour and contrast: verify by script that every text and background combination in use appears in the approved pairings table of the brand guide, including hover, focus, disabled and placeholder states. Information must never be carried by colour alone.

5. Mobile, tested at 320, 360, 390, 414 and 768 pixels wide, and in landscape: no horizontal scrolling anywhere; touch targets at least 44 by 44 pixels with adequate spacing; body text at least 16px; inputs at least 16px so that iOS does not zoom; correct input types and autocomplete values; tables that reflow or scroll within their own container; safe-area insets respected on phones with a notch; and the sticky header never covering content that has received focus.

6. Zoom and text resizing: the site must remain usable at 200% zoom and with the browser's text size increased, with nothing cut off or overlapping.

7. Update /accessibility with what was actually tested and any known limitations.

Give me a table of the issues found, by page, with their severity and how each was fixed. Run "pnpm check" and "pnpm test".
```

---

## Prompt 23: Speed and Core Web Vitals

```text
Read section 4.3 of docs/BLUEPRINT.md. Many visitors will be on mid-range Android phones using mobile data, so speed on a phone matters more than speed on a laptop.

1. Measure first. Build for production and run Lighthouse in mobile mode with throttling against the home page, a programme page, the trustees page, a guide, the membership page and the contact page. Record the scores and the values for Largest Contentful Paint, Interaction to Next Paint or Total Blocking Time, and Cumulative Layout Shift.

2. Then improve, in this order:
   - JavaScript: confirm that pages are server components wherever possible; list every client component and justify or remove it; remove unused dependencies; load anything heavy only when it is needed; report the JavaScript sent on first load for each route and aim for the smallest practical figure.
   - Fonts: only the weights in use, subset to Latin, preloaded for above-the-fold text, with fallback metrics adjusted so that nothing shifts when the font loads.
   - Images: next/image everywhere with correct sizes attributes; AVIF and WebP; explicit dimensions; priority loading only for the main above-the-fold image; lazy loading for the rest; SVG for graphics.
   - Layout stability: reserve space for everything that loads late, including the status banner and avatars.
   - Third parties: none on first load apart from analytics. Turnstile loads only on pages with a form, and only when the form is approached.
   - Caching and static generation: confirm every page is statically generated and report any that are not, with the reason.

3. Set up Lighthouse CI with budgets (performance, accessibility, best practices and SEO all at least 95 on mobile) as a script, "pnpm lighthouse", and document how to run it.

4. Add a GitHub Actions workflow that runs lint, type checking, the build, the tests and the content and SEO checks on every pull request and on every push to main. Push it and confirm on GitHub that the first run passes.

Show me a before and after table of the scores and metrics for each page tested, and the first-load JavaScript for every route.
```

**Done when:** every tested page scores at least 95 in all four Lighthouse categories on mobile.

---

# Phase G: Launch

## Prompt 24: Analytics and search console preparation

```text
1. Add Vercel Web Analytics and Vercel Speed Insights using their official packages. Confirm from the current Vercel documentation that they use no cookies, and describe them accurately in the privacy notice. Do not add Google Analytics or any other tracker, and therefore do not add a cookie banner.

2. Track these as custom events, without any personal data: a "Join" button click (with its location on the page), each form's successful submission (form type only), a click on any external registration link for an event, and a document download.

3. Add support for search engine ownership verification through environment variables for Google Search Console and Bing Webmaster Tools, rendering the verification tags only when the values are set.

4. Write docs/LAUNCH_DAY_SEARCH_SETUP.md, in plain language with numbered steps, covering: verifying the domain in Google Search Console and submitting the sitemap; doing the same in Bing Webmaster Tools; requesting indexing of the ten most important pages; what to look at each week for the first two months; and how to read the Vercel analytics dashboard.

Run "pnpm check".
```

---

## Prompt 25: Connect Vercel to GitHub for automatic deployment

Before pasting this prompt, do two things yourself:

1. In a terminal, run `vercel login` and sign in. If the Vercel command-line tool is missing, ask Claude Code to install it first.
2. Sign in to Vercel in your browser with the same account, and make sure it is connected to your GitHub account `sandipdatta786` (Vercel dashboard, Settings, Git).

```text
Set up automatic deployment for this site: every push to the main branch of github.com/sandipdatta786/assocads-website must deploy to production on Vercel, and every pull request must get its own preview address. An older ASSOCADS site already exists on Vercel at assocads.vercel.app; do not modify, overwrite or delete that project.

1. Confirm that the local main branch is clean, that "pnpm check" passes, and that everything is pushed to origin (github.com/sandipdatta786/assocads-website).

2. Create and link a NEW Vercel project named "assocads-web" from this folder, then connect it to the GitHub repository sandipdatta786/assocads-website using Vercel's Git integration, with main as the production branch. Check the current Vercel documentation for the correct commands. If Vercel does not yet have permission to see that repository, stop and give me the exact link and clicks to grant the Vercel GitHub app access to that one repository only; I will do that in the browser and tell you when it is done.

3. Confirm the framework preset, build command, install command and Node.js version are detected correctly, and that the Vercel project and the GitHub Actions workflow use the same Node.js version.

4. Tell me exactly which environment variables to add in the Vercel dashboard for Production and for Preview, using .env.example as the list, and what each one is for. I will enter the values myself; never ask me to paste a secret into this chat. For now set NEXT_PUBLIC_SITE_URL to the vercel.app production address.

5. Add vercel.json or Next.js configuration for: security headers (Content-Security-Policy tuned to what the site actually loads, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and frame protection); long-lived caching for static assets; and the redirects from Prompt 18. Make sure preview deployments send a noindex header.

6. Prove the automatic pipeline works, in two steps:
   a. Create a branch, make a tiny visible change, push it and open a pull request. Confirm that Vercel posts a preview address on the pull request and that the GitHub Actions checks run. Open the preview and check: every route in the site map loads; the forms behave correctly with and without keys; the share image appears; /sitemap.xml, /robots.txt, /llms.txt and /feed.xml load; and the security headers are present.
   b. After I approve, merge the pull request into main and confirm that Vercel deploys production automatically, without any manual deploy command. Give me the production address.

7. In the GitHub repository settings, protect the main branch so that it cannot be force-pushed or deleted. Tell me what you set.

8. Write docs/DEPLOYMENT.md in plain language: how a change travels from my Mac to GitHub to the live site; how to see a deployment's status; how to roll back to an earlier version from the Vercel dashboard; how to change an environment variable; and how to connect the custom domain later.

If any Vercel or GitHub command fails because of sign-in or permissions, stop and tell me what to do rather than working around it.
```

**Done when:** pushing to `main` on GitHub publishes the new site on its own `vercel.app` address by itself, pull requests get preview links, and the old site is untouched.

**A note on Vercel plans:** Vercel's free Hobby plan is meant for personal, non-commercial projects. Check Vercel's current terms to see whether a registered trust's public website qualifies, or whether the Pro plan is needed, before the domain goes live.

---

## Prompt 26: The pre-launch audit

**Plan first.** Run this in a fresh conversation, so that it reviews the work with fresh eyes.

```text
You are the final reviewer before this website is made public for a charitable trust. Its reputation with universities, companies and government depends on every statement being true. Read CLAUDE.md, docs/BLUEPRINT.md and docs/BRAND_GUIDE.md first, then audit the production deployment and the code. Report findings before fixing anything.

1. Truthfulness. Read every page and every content file, word by word, against section 8 of the blueprint. List anything that: states or implies that the trust is registered or tax-exempt while the status is "pending"; names any organisation as a partner, member or supporter; gives a number, statistic, testimonial, award or past event; gives a fee; gives a trustee an office title; describes a plan as an achievement; or contains any personal detail beyond a trustee's name.

2. Placeholders. Run the content check and list every remaining placeholder, grouped into: must be filled before launch; acceptable at launch because it is clearly presented as "to be added"; and drafts that are correctly hidden. Then switch the placeholder check from a warning to a build failure for anything in the first group.

3. Privacy and security. Search the whole repository and its Git history for PAN numbers, Aadhaar numbers, home addresses, phone numbers, API keys and secrets. Confirm that .env files are ignored. Check the security headers and that the forms cannot be used to send email to arbitrary addresses.

4. Brand. Check every page against the brand guide: only the three typefaces; only palette colours; only approved pairings; the name written correctly everywhere; sentence-case headings; Indian English spelling; none of the banned hype words.

5. Function. Check every internal and external link, every form path including errors, the mobile menu, the filters, the 404 page, the redirects from the old anchors, the RSS feed and the calendar download.

6. Search readiness. Run the SEO checks, validate the structured data, confirm that the HTML of each page contains its full text without JavaScript, and confirm that only the production domain is indexable.

7. Quality. Run the full test suite, the accessibility checks and Lighthouse on mobile.

Present the findings as a table with page, issue, severity (blocker, should fix, nice to have) and proposed fix. Wait for my approval, then fix the blockers and the "should fix" items, and run every check again.

Finally, write docs/LAUNCH_CHECKLIST.md with two lists: what has been verified, and what the founders must still do or decide before the domain is connected.
```

**Done when:** there are no blockers, and you have read `docs/LAUNCH_CHECKLIST.md`.

---

## Prompt 27: Connect the domain

Use this only once the founders have approved the site.

```text
I am ready to connect our own domain to the new Vercel project "assocads-web". The domain is: [TYPE YOUR DOMAIN HERE, for example assocads.org].

1. Add the domain and its "www" form to the Vercel project, and tell me exactly which DNS records to create at my domain registrar, in a table with type, name and value. I will create them myself. Recommend which of the two forms should be the main address and set the other to redirect to it permanently.

2. Before I change anything, warn me about any existing email records (MX, SPF, DKIM, DMARC) on the domain that must be left untouched, and tell me how to check them.

3. Once I confirm that the records are in place, verify that the domain resolves, that the security certificate has been issued, and that the http, non-www and vercel.app addresses all redirect to the main address.

4. Tell me to change NEXT_PUBLIC_SITE_URL in Vercel to the main address, then redeploy and verify that canonical links, the sitemap, robots.txt, llms.txt, the share images and the structured data all use the new address.

5. Set up the Resend sending domain records so that form emails come from our own domain, and tell me which DNS records to add for that.

6. Remind me to follow docs/LAUNCH_DAY_SEARCH_SETUP.md, and tell me what to do with the old assocads.vercel.app project: I want it to redirect to the new domain rather than be deleted. Explain how, and wait for my go-ahead before changing it.
```

---

# Phase H: Everyday update recipes

Short prompts for after launch. Each one can be pasted on its own. Once you have approved the result, say "commit and push": the change goes to GitHub and Vercel publishes it automatically a minute or two later.

### The day the trust is registered

```text
ASSOCADS is now registered. Registration number: [NUMBER]. Date of registration: [DATE]. Registered office: [ADDRESS].
Update src/config/site.ts: set the legal status to "registered" and fill in these three values. Do not change the tax-exemption settings. Then search the whole site for any wording that still says or implies "in progress", "in formation" or "pending" and show me each place before changing it. Update the facts page's "Last updated" date, add a short news item announcing the registration for me to review as a draft, run "pnpm check", and show me the footer, the governance page and the facts page.
```

### Add a trustee's photograph and biography

```text
Update the trustee profile for [NAME]. Their photograph is at [FILE PATH]. Role: [ROLE]. Organisation: [ORGANISATION]. Biography: [TEXT]. Expertise: [LIST]. LinkedIn: [ADDRESS]. They have given written consent to publish.
Crop and optimise the photograph to the specification in the README, save it under public/images/trustees/, update the trustee's entry, set consentToPublish and published to true, tick the item in docs/CONTENT_TODO.md, run "pnpm check", and show me their card and profile page on a phone.
```

### Record the elected office bearers

```text
The Board has elected its office bearers: President [NAME]; Vice-President(s) [NAMES]; General Secretary [NAME]; Joint Secretary(ies) [NAMES]; Treasurer [NAME]. Term began on [DATE].
Add these office titles to the trustees collection, show office bearers first on the trustees page in that order, update the governance and facts pages, run "pnpm check", and show me the result.
```

### Publish membership fees

```text
The Board has adopted the bye-laws and fixed the membership fees: Ordinary [AMOUNT] per year; Life [AMOUNT] once; Associate [AMOUNT] per year. [Add any student category and its terms.]
Update the membership categories, the membership page, the comparison table, the related FAQs and the facts page. Add Offer structured data now that prices exist. Change the status callout to say how to apply. Do not add online payment. Run "pnpm check" and show me the membership page.
```

### Add an event

```text
Add a new event following docs/HOW_TO_ADD_AN_EVENT.md. Title: [TITLE]. Type: [TYPE]. Date and time: [DETAILS]. Mode: [IN PERSON / ONLINE / HYBRID]. Venue and city: [DETAILS]. Summary: [TEXT]. Speakers: [NAMES AND ROLES]. Registration link: [ADDRESS].
Everything here is confirmed. Create the event file, check that it appears on the events page and the home page with the correct status, validate its structured data, run "pnpm check", and show me the event page on a phone.
```

### Publish a news item

```text
Publish a news item following docs/HOW_TO_PUBLISH_NEWS.md. Here are the facts: [PASTE THE FACTS]. Write it in our voice in under 300 words, using only these facts. Show it to me as a draft first. After I approve it, publish it and run "pnpm check".
```

### Publish a reviewed guide

```text
[TRUSTEE NAME] has reviewed the guide "[TITLE]" and approved it with these changes: [CHANGES]. Apply the changes, set the author and reviewer, set today's date as the published and last-reviewed date, set draft to false, tick it off in docs/EDITORIAL_REVIEW.md, run "pnpm check", and show me the page.
```

### Add a partner, with permission

```text
We have a signed agreement with [ORGANISATION] and their written permission to show their name and logo. Their logo file is at [FILE PATH]. Create a partners collection if one does not exist, add this partner, and show a partners section on the home page and the partner page only when at least three partners exist; until then list them by name on the partner page only. Follow the logo rules in the brand guide. Run "pnpm check".
```

### Add a downloadable document

```text
Add this document to the resources and governance pages: [FILE PATH]. Title: [TITLE]. Description: [TEXT]. Category: [CATEGORY]. Date: [DATE]. Before adding it, read the document and warn me if it contains any personal data such as PAN or Aadhaar numbers, addresses or signatures; if it does, stop and tell me. Otherwise add it, mark it as available, run "pnpm check", and show me where it appears.
```

### Open donations (only after registration, a bank account, and a Board decision)

```text
The trust is registered and has a bank account, and the Board has decided to accept donations online. Plan, but do not yet build, the addition of Razorpay to the support page: the amounts, the donor details the law requires us to collect, receipts, the refusal of foreign contributions, how tax-exemption wording depends on the 80G setting, the refund policy page, and how we test in Razorpay's test mode. Check the current Razorpay documentation. Show me the plan and the list of decisions the Board needs to make.
```

### Monthly health check

```text
Carry out the monthly health check on a new branch with a pull request, so that I can review the Vercel preview before it goes live: update dependencies to their latest safe versions; run every check and test; run Lighthouse on mobile; look for broken external links; list events whose dates have passed and that need a summary; list guides whose "last reviewed" date is more than six months old; list the remaining items in docs/CONTENT_TODO.md; and give me a one-page summary of what needs attention.
```

---

## Appendix: what the founders need to supply

The site can be built and deployed without any of these, because each gap is a visible placeholder. It should not be connected to the real domain until the first seven are done.

| #   | Item                                                                                                      | Used in                 |
| --- | --------------------------------------------------------------------------------------------------------- | ----------------------- |
| 1   | Final domain name                                                                                         | Prompt 27               |
| 2   | Public email address for the secretariat, and one for data protection requests                            | Prompts 3, 16, 17       |
| 3   | Photograph, role, biography, LinkedIn link and written consent for each of the thirteen trustees          | Prompt 7, update recipe |
| 4   | Confirmation of each trustee's name spelling                                                              | Prompt 7                |
| 5   | Legal review of the privacy notice, terms and disclaimer                                                  | Prompt 17               |
| 6   | A trustee's review of at least four guides, so that the site does not launch with an empty Guides section | Prompt 14               |
| 7   | Official social media profiles                                                                            | Prompt 3                |
| 8   | Registration number, date and registered office                                                           | Update recipe           |
| 9   | Membership fees and any student category                                                                  | Update recipe           |
| 10  | The first real events                                                                                     | Update recipe           |
| 11  | Board adoption of the logo and a trademark check                                                          | Prompt 2                |
| 12  | Resend and Cloudflare Turnstile accounts                                                                  | Prompt 16               |
