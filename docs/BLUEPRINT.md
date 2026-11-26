# ASSOCADS Website Blueprint

**Version 1.0 · November 2026**

This is the strategy and specification behind the new website. The build prompts in `ASSOCADS_Website_Build_Playbook.md` refer to it constantly, so copy it into the website repository as `docs/BLUEPRINT.md` before starting.

Sources: the reconciled trust deed (Final_ASSOCADS_Trust_Deed_Reconciled_Redraft), a review of the current site at assocads.vercel.app, a review of nine comparable association sites, and Google India search-volume data, all gathered in November 2026.

---

## 1. Decisions already made

| Topic            | Decision                                                                                                                                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Audiences        | Students, professionals, industry, government bodies                                                                                                                                                             |
| Language         | English only                                                                                                                                                                                                     |
| Founding team    | The seven Founder Trustees and five founder members, with placeholder photos and biographies                                                                                                                     |
| Features         | Membership enquiry, partnership enquiry, support and donations page, events, news and articles, downloadable documents, contact form                                                                             |
| Brand            | New colour and type system, set out in `docs/BRAND_GUIDE.md`                                                                                                                                                     |
| Content updates  | Made by asking Claude Code to edit files in the repository. No separate content management system.                                                                                                               |
| Code and hosting | Code in a private GitHub repository, `github.com/sandipdatta786/assocads-website`, mirrored on the local machine. Vercel deploys automatically from the `main` branch. The owned domain is connected at the end. |
| Legal status     | Registration expected by the end of November 2026. The site launches in "registration in progress" mode and switches with one setting.                                                                           |

---

## 2. What is wrong with the current site

| #   | Finding                                                                                                                                                                                                 | Why it matters                                                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The whole site is one page, about 26,000 pixels tall, built as a client-rendered app. The HTML sent to a search engine contains an empty `<div id="root">` and nothing else.                            | Search engines and AI assistants that do not run JavaScript see a blank page. There is one URL, so only one page can ever rank.                                              |
| 2   | No canonical link, no Open Graph tags, no structured data, no sitemap.                                                                                                                                  | Poor sharing previews and no rich results.                                                                                                                                   |
| 3   | It says "We are a registered non-profit" and "All contributions qualify for 80G tax exemptions".                                                                                                        | Neither is true yet. Registration is pending, and 80G is a separate approval that can only be applied for afterwards.                                                        |
| 4   | A scrolling wall shows Jadavpur University, IIT Kharagpur, ISI Kolkata, TCS, Infosys, Wipro, Cognizant, NASSCOM East, the Government of West Bengal IT department and others as "member organisations". | These imply endorsements that do not exist. This is the single biggest reputational and legal risk on the site.                                                              |
| 5   | News items dated in the future report things that have not happened, such as "Over 60 colleges complete five-day practical AI teacher training".                                                        | Invented news destroys credibility with exactly the audiences the trust needs.                                                                                               |
| 6   | Life membership is described as giving a "permanent governing seat" and "governing council voting".                                                                                                     | The deed says the opposite: membership gives no right to take part in management or to vote (clause 34.4).                                                                   |
| 7   | Membership fees are shown as rupee ranges.                                                                                                                                                              | Under the deed, fees are fixed by the Board through bye-laws, which are adopted at the first Board meeting after registration.                                               |
| 8   | Seventeen office roles are listed, each linking to a LinkedIn search.                                                                                                                                   | The deed provides for a President, up to two Vice-Presidents, a General Secretary, up to two Joint Secretaries and a Treasurer, elected after registration. Nobody is named. |
| 9   | Fonts are "Anthropic Serif" and "VC Henrietta".                                                                                                                                                         | Both are proprietary and unlicensed for this use.                                                                                                                            |
| 10  | Every footer link under "Trust and governance" points nowhere.                                                                                                                                          | Reads as unfinished.                                                                                                                                                         |
| 11  | The site speaks only about West Bengal as "the state".                                                                                                                                                  | The deed describes a body for India, beginning with West Bengal.                                                                                                             |

**Worth keeping as ideas:** the "five areas of work" structure, the "two ways in" split between individuals and organisations, the phased roadmap, the plain-spoken tone of the body copy, and the FAQ.

---

## 3. What the best comparable sites do

Sites reviewed: Royal Statistical Society, AAAI, Partnership on AI, BCS (The Chartered Institute for IT), IAMAI, ADaSci, Data Security Council of India, AI Singapore and Mila. Six others blocked automated reading or were broken, including the Computer Society of India, whose security certificate had expired.

### 3.1 Ten patterns to adopt

1. **Five to eight navigation items** with a persistent "Join" button at top right (RSS, BCS, ADaSci).
2. **A one-sentence mission in the hero with two calls to action** (BCS, Mila, Partnership on AI).
3. **Audience routing straight after the hero**: individuals, organisations, government, students (BCS, AI Singapore).
4. **Dated event cards with a registration status** high on the home page (AAAI, DSCI, Mila).
5. **Membership as its own section**, with grades, fees and questions on separate pages (RSS).
6. **Communities in clear groupings**: topic groups, local chapters, special interest groups (RSS, DSCI).
7. **Verifiable credentials**: a public register or certificate checker (BCS, ADaSci). A later phase for ASSOCADS.
8. **Transparency in the footer**: registration number, address, annual reports, governance (RSS, Partnership on AI).
9. **Proof**: three or four real numbers, a logo wall and named testimonials (ADaSci, BCS). ASSOCADS adds these only when they are true.
10. **A steady publishing stream**: news, reports and a newsletter (RSS, DSCI).

### 3.2 Weaknesses of Indian association sites that ASSOCADS can beat

- Basic hygiene failures: expired certificates, pages that block or hide content from search engines and AI tools, stale copyright years, typing errors, dead menu links, past events still marked "registrations open".
- No clear statement of what the organisation is (IAMAI and DSCI have no hero message).
- Membership hidden: no join button, grades or fees on the home page.
- Twelve-item navigation bars.
- Leadership not named anywhere obvious.
- No eastern India presence at all on any Indian site reviewed.

### 3.3 Where ASSOCADS sits

| Organisation                                 | What it is                                                                       | How ASSOCADS differs                                                                                                   |
| -------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| ADaSci (Association of Data Scientists)      | A commercial credentialing business run by a media company, priced in US dollars | ASSOCADS is a public charitable trust with named trustees, governed by a deed, focused on community and public benefit |
| Artificial Intelligence Association of India | Launched November 2025, with a creative-industry focus                           | ASSOCADS covers data science and AI across academia, industry, startups and government                                 |
| Analytics Society of India, Kolkata chapter  | An academic analytics society that runs a conference                             | ASSOCADS is broader: membership, training, startups, policy and social good                                            |
| NASSCOM, IAMAI, DSCI                         | Industry trade bodies whose members are companies                                | ASSOCADS is a professional body open to individuals, including students                                                |

The site must make this positioning obvious and must include a plain "ASSOCADS is not affiliated with…" answer in the FAQ, because search engines and AI assistants will otherwise confuse the similar names.

**Name check:** no organisation was found using "ASSOCADS" or the exact name "Association for AI and Data Science". Trademark and registrar databases were not checked.

---

## 4. Search strategy

### 4.1 What the data says (Google India, monthly searches)

| Cluster                     | Example searches and monthly volume                                                                                                                                                                       | Difficulty              | What to publish                                                                                                      |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Association and brand**   | "artificial intelligence association" 30 · "data science membership" 10 · "professional body for data science" 10 · "ai conference india" 210                                                             | Very low                | Home, About, Membership. Tiny volume, but ASSOCADS must own every one of these and its own name.                     |
| **Kolkata and West Bengal** | "ai course in kolkata" 1,900 · "data science course in kolkata" 1,000 · "data science jobs in kolkata" 320 · "ai jobs in kolkata" 170 · "ai companies in kolkata" 170 · "hackathon kolkata" 30            | Close to zero           | Independent local guides and the events calendar. The fastest wins available.                                        |
| **Careers**                 | "data scientist salary in india" 8,100 · "data science internship" 6,600 · "how to become a data scientist" 5,400 · "data science roadmap" 4,400 · "ai for students" 1,600 · "data science career" 1,000  | Low (0 to 17)           | Career guides aimed at students. Best ratio of volume to difficulty.                                                 |
| **Policy and governance**   | "dpdp act" 49,500 · "india ai mission" 8,100 · "ai ethics" 8,100 · "ai governance" 2,900 · "responsible ai" 2,400 · "ai summit india" 2,400 · "ai startups in india" 1,900 · "ai regulation in india" 170 | Low to medium (1 to 54) | Plain-English explainers aimed at industry and government readers. Builds authority for the policy role in the deed. |
| **Core explainers**         | "what is artificial intelligence" 49,500 · "what is machine learning" 40,500 · "what is data science" 22,200 · "what is generative ai" 14,800                                                             | Medium (36 to 57)       | Glossary entries. Hard to rank at first, but they are what AI assistants quote.                                      |

**The central lesson:** almost nobody searches for "AI association". Traffic will come from being genuinely useful on careers, Kolkata-specific questions and policy explainers. The association pages convert that traffic into members.

### 4.2 Launch content plan

Twelve evergreen guides, each reviewed and signed by a named trustee before it is published:

1. How to become a data scientist in India: a step-by-step guide
2. Data science roadmap for students
3. Data scientist salary in India: what the public data shows
4. How to find a data science or AI internship
5. AI and data science courses in Kolkata: an independent guide
6. AI and data science companies and employers in Kolkata
7. AI and data science events, meetups and hackathons in Kolkata
8. The DPDP Act explained for data teams
9. The IndiaAI Mission explained
10. AI governance and regulation in India: where things stand
11. What is responsible AI? A practical introduction
12. AI for social good in India: healthcare, agriculture and education

Plus twenty-five glossary entries, starting with artificial intelligence, machine learning, data science, generative AI, large language model, responsible AI, AI governance, data analytics, deep learning, MLOps, and the remaining fifteen chosen from the same family.

### 4.3 Technical SEO requirements

- Every page is rendered to complete HTML on the server. No content depends on JavaScript.
- One unique title (under 60 characters) and description (under 155 characters) per page, a canonical link, and Open Graph and X card tags with a generated share image.
- One `<h1>` per page, headings in order, descriptive link text, descriptive `alt` text.
- `sitemap.xml`, `robots.txt` and an RSS feed, all generated automatically.
- Clean lower-case URLs with hyphens and no trailing slash. Old `#anchor` links redirect to the new pages.
- Core Web Vitals on a mid-range phone on 4G: Largest Contentful Paint under 2.5 seconds, Interaction to Next Paint under 200 milliseconds, Cumulative Layout Shift under 0.1.
- Lighthouse scores of at least 95 for performance, accessibility, best practices and SEO.

### 4.4 AEO: being the answer in answer boxes and voice results

- Every guide and glossary page opens with a 40 to 60 word direct answer under the heading, before any detail.
- Headings are phrased as the questions people ask.
- Question-and-answer blocks on every major page, marked up as `FAQPage` only where the questions are visibly on the page.
- Definitions use the form "X is…". Steps use numbered lists. Comparisons use tables.
- Every guide shows an author, a reviewer, a published date and a "last reviewed" date.

### 4.5 GEO: being cited by ChatGPT, Gemini, Perplexity, Claude and Google AI answers

- **Clear entity:** one consistent name, description, founding year, location and set of official profile links on every channel, expressed in `Organization` structured data with `sameAs` links.
- **A facts page** at `/about/facts`: short, dated, quotable statements about what ASSOCADS is, who runs it and its legal status.
- **`/llms.txt`**: a plain-text summary of the organisation and a map of its most important pages.
- **AI crawlers allowed** in `robots.txt`: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, Bingbot and CCBot.
- **Quotable content:** self-contained paragraphs, original statistics with their sources, and named people.
- **Disambiguation:** an explicit statement of what ASSOCADS is not.
- **Off-site signals**, which matter as much as the site itself: see section 11.

### 4.6 Structured data by page type

| Page            | Schema types                                                                        |
| --------------- | ----------------------------------------------------------------------------------- |
| Every page      | `Organization` (as `NGO`), `WebSite`, `BreadcrumbList`                              |
| Home            | plus `FAQPage` if questions are shown                                               |
| About, facts    | `AboutPage`                                                                         |
| Trustees        | `Person` for each trustee who has a published biography, linked to the organisation |
| Programme pages | `Service` or `EducationalOccupationalProgram` where it fits                         |
| Events          | `Event` with date, place, mode, status, organiser and offer                         |
| Guides and news | `Article` or `NewsArticle` with author, reviewer and dates                          |
| Glossary        | `DefinedTerm` inside a `DefinedTermSet`                                             |
| Membership      | `FAQPage`; `Offer` only once fees are fixed                                         |
| Contact         | `ContactPage` with `ContactPoint`                                                   |

---

## 5. Site map

**Navigation:** About · Programmes · Membership · Events · Insights · Resources · and a "Join" button. Contact, Partner, Support and legal links live in the footer.

| URL                                                                     | Page                   | Purpose                                                                                |
| ----------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------- |
| `/`                                                                     | Home                   | Say what ASSOCADS is in one sentence, route each audience, show what is happening next |
| `/about`                                                                | About                  | The story, vision and why it exists                                                    |
| `/about/objects`                                                        | Aims and objects       | The sixteen objects from the deed, in plain English                                    |
| `/about/governance`                                                     | Governance             | How the trust is run, its principles and policies, documents                           |
| `/about/trustees`                                                       | Founder Trustees       | Trustee and founder member cards with office, sub-committee and photo placeholders     |
| `/about/roadmap`                                                        | Roadmap                | Near, mid and long-term plans, clearly labelled as plans                               |
| `/about/facts`                                                          | ASSOCADS at a glance   | Dated, quotable facts for journalists and AI assistants                                |
| `/programmes`                                                           | Programmes             | Overview of the eight areas of work                                                    |
| `/programmes/[slug]`                                                    | Eight programme pages  | See section 6                                                                          |
| `/for/students`                                                         | For students           | Benefits, how to join, guides, events                                                  |
| `/for/professionals`                                                    | For professionals      | Including faculty and researchers                                                      |
| `/for/industry`                                                         | For industry           | Hiring, training, research partnerships, sponsorship                                   |
| `/for/government`                                                       | For government bodies  | Policy support, capacity building, AI for public good                                  |
| `/membership`                                                           | Membership             | The approved categories and fees, tenure, concessions, rules, questions                |
| `/membership/apply`                                                     | Register your interest | Form                                                                                   |
| `/events` and `/events/[slug]`                                          | Events                 | Upcoming and past, with filters                                                        |
| `/communities`                                                          | Communities            | Special Interest Groups and chapters, with an interest form                            |
| `/insights` and `/insights/[slug]`                                      | Insights               | News and announcements                                                                 |
| `/guides` and `/guides/[slug]`                                          | Guides                 | The evergreen articles in section 4.2                                                  |
| `/glossary` and `/glossary/[term]`                                      | Glossary               | Definitions                                                                            |
| `/resources`                                                            | Resources              | Hub for guides, glossary, downloads and the brand kit                                  |
| `/partner`                                                              | Partner with us        | Institutions, companies and government                                                 |
| `/support`                                                              | Support ASSOCADS       | Donations and sponsorship, in a truthful pre-registration form                         |
| `/contact`                                                              | Contact                | Form and details                                                                       |
| `/faq`                                                                  | Questions              | All questions in one place                                                             |
| `/legal/privacy`, `/legal/terms`, `/legal/disclaimer`, `/accessibility` | Legal                  | Required policies                                                                      |
| `/llms.txt`, `/sitemap.xml`, `/robots.txt`, `/feed.xml`                 | Machine files          | For search engines and AI assistants                                                   |

---

## 6. Programme areas, mapped to the deed

| Slug                         | Programme                           | Deed objects | Summary                                                                                               |
| ---------------------------- | ----------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| `training-and-certification` | Training and certification          | 2, 14        | Workshops, bootcamps, faculty development, mentoring, internships, certification                      |
| `events-and-community`       | Events and community                | 1, 2         | Conferences, seminars, meetups, hackathons                                                            |
| `research-and-publications`  | Research and publications           | 3, 5, 11, 15 | Reports, white papers, benchmark datasets, open-source work, Centres of Excellence                    |
| `industry-and-academia`      | Industry and academia collaboration | 4, 9         | Knowledge exchange, workforce readiness, national and international partnerships                      |
| `responsible-ai`             | Responsible AI                      | 6            | Fairness, accountability, privacy, security, governance, public awareness                             |
| `startups-and-innovation`    | Startups and innovation             | 7            | Mentoring, incubation, investor engagement, market access                                             |
| `policy-and-advisory`        | Policy and advisory                 | 10           | Standards, frameworks, guidance to governments and institutions                                       |
| `awards-and-ai-for-good`     | Recognition and AI for social good  | 8, 12        | Awards and fellowships; projects in healthcare, agriculture, education, governance and sustainability |

Every programme page states plainly whether activity has started, and otherwise says "planned".

---

## 7. Facts from the trust deed that the site may use

**Never copy the deed itself into the repository.** It contains PAN numbers, Aadhaar numbers, fathers' names and home addresses. Only the sanitised facts below go into the site.

### 7.1 Identity

- Name: Association for AI and Data Science, in short ASSOCADS.
- Nature: a public charitable trust; non-political, non-religious, not-for-profit, irrevocable.
- Made at Kolkata in 2026. Registered office: in West Bengal, address to be confirmed.
- Scope: a collaborative ecosystem for AI, Data Science and Analytics professionals across India, beginning with West Bengal, connecting industry, academia, startups, government and society.
- Vision: an ecosystem enabler connecting talent, knowledge, innovation and opportunity, with the long-term aim of evolving into an apex professional body for AI and Data Science.

### 7.2 The sixteen objects, in short

1. Build an inclusive ecosystem for AI, Data Science, Machine Learning and Analytics that brings together students, professionals, academics, researchers, industry, entrepreneurs, investors, institutions and government.
2. Run educational and capacity-building activities: conferences, seminars, workshops, bootcamps, hackathons, meetups, training, certification, faculty development, mentoring, career guidance, internships and apprenticeships.
3. Establish and support centres, labs, academies, libraries, knowledge repositories, innovation hubs, incubation centres and Centres of Excellence.
4. Foster collaboration between academia, industry, government, civil society and international institutions.
5. Undertake and publish research, journals, case studies, benchmark datasets, technical reports and white papers.
6. Promote responsible, ethical, transparent and trustworthy AI and Data Science.
7. Support innovation, incubation and entrepreneurship, including mentoring, investor engagement and market access.
8. Recognise excellence through awards, fellowships, certifications and accreditations.
9. Collaborate with national and international organisations and take part in global initiatives.
10. Contribute to policies, standards, frameworks and best practices, and advise governments, institutions and industry.
11. Promote collaborative, open-source and community-driven initiatives.
12. Design and support AI-for-Social-Good initiatives in healthcare, agriculture, education, governance, sustainability, climate resilience, public welfare, accessibility, rural development and social inclusion.
13. Establish or support the institutions, facilities and infrastructure needed for these objects.
14. Provide training and advisory services across industry domains, directly or through Special Interest Groups.
15. Create, protect and disseminate intellectual property.
16. Undertake other lawful activities that support these objects, always on a not-for-profit basis.

### 7.3 Principles that bind the trust

Compliance with law; open to all without discrimination; not-for-profit; responsible AI; data protection; conflict-of-interest rules; academic integrity; proper approvals; a societal focus; and an intention to apply for 12AB and 80G registration.

### 7.4 Governance

- A Board of Trustees of between seven and fifteen people. The first Board has seven Founder Trustees. Five founder members serve on its sub-committees but are not on the Board.
- Trustees are honorary and receive no remuneration for acting as trustees.
- Office bearers, elected by the Board for two-year terms: one President, up to two Vice-Presidents, one General Secretary, up to two Joint Secretaries, one Treasurer. **The Board has elected its first office bearers (section 7.5).** The date of the resolution is still to be supplied.
- The Board meets at least once every quarter.
- Accounts are audited every year by a Chartered Accountant, and the Board adopts an annual report. The financial year runs from 1 April to 31 March.
- The Board may set up chapters in other states and cities, Special Interest Groups by industry or domain, and advisory councils.
- On dissolution, assets pass to a similar charitable institution and never to trustees or members.

### 7.5 Founder Trustees, founder members and office bearers

In the order the Board has set. Supplied by the founders on 24 November 2026; for capacities, offices and sub-committees this list replaces the deed.

| #   | Name               | Capacity                    | Office            | Sub-committee                        |
| --- | ------------------ | --------------------------- | ----------------- | ------------------------------------ |
| 1   | Amit Kumar Das     | Settlor and Founder Trustee | General Secretary |                                      |
| 2   | Abhijit Pal        | Settlor and Founder Trustee | Vice-President    |                                      |
| 3   | Prasun Nandy       | Settlor and Founder Trustee | Vice-President    |                                      |
| 4   | Rahul Bhattacharya | Founder Trustee             | President         |                                      |
| 5   | Deb Kumar Majumder | Founder Trustee             |                   | Strategic collaboration and policies |
| 6   | Biswajeet Chaki    | Founder Trustee             | Treasurer         | Branding and communication           |
| 7   | Sandip Datta       | Founder Trustee             | Joint Secretary   | Branding and communication           |
| 8   | Sayan Guha         | Founder Member              | Joint Secretary   | Branding and communication           |
| 9   | Sudip Dasgupta     | Founder Member              |                   | Branding and communication           |
| 10  | Agnimitra Biswas   | Founder Member              |                   | Strategic collaboration and policies |
| 11  | Ayan Chakraborty   | Founder Member              |                   | Membership                           |
| 12  | Eshwar Boini       | Founder Member              |                   | Membership                           |

Each card carries placeholders for: photograph, current role and organisation, a short biography of about sixty words, areas of expertise, and a LinkedIn link. Name spellings must be confirmed against each trustee's PAN card before launch.

### 7.6 Membership

| Category         | Who                                              | Terms in the deed                                                                 |
| ---------------- | ------------------------------------------------ | --------------------------------------------------------------------------------- |
| Ordinary Member  | An individual aged eighteen or over              | Pays an annual subscription fixed by the Board                                    |
| Life Member      | An individual                                    | Pays a one-time amount fixed by the Board and is recommended by two trustees      |
| Associate Member | An institution, organisation, society or company | Pays a fee fixed by the Board and is represented by a nominated official          |
| Honorary Member  | A person of eminence                             | Admitted without fee by a two-thirds Board resolution, for three years, renewable |

- Admission is by application, approval by the Board or a committee, and payment of the fee.
- Members may take part in programmes, Special Interest Groups, events and publications as the Board decides.
- Membership gives no share in the trust's funds and **no right to manage the trust or to vote**, unless bye-laws later provide otherwise.
- **Membership framework approved, November 2026.** The Board approved a membership framework with fees: eight individual categories (Community, Student, Academic, three Professional bands, Independent, Public-interest), six organisational categories with bands, tenure options, honorary recognition, concessions and joining rules. The website shows this framework, from `content/membership.json`, and `site.governance.feesFixed` is true. The table above records what the deed itself says. The framework has no Life membership, and describes honorary recognition differently from the deed's Honorary Member; the founders should make sure the bye-laws reconcile the two.

### 7.7 Money

- The trust may receive donations, grants, corporate social responsibility contributions, sponsorships, membership subscriptions and programme fees.
- **It cannot accept foreign contributions** until it holds registration or permission under the Foreign Contribution (Regulation) Act.
- 12AB and 80G are intentions, not facts, until granted.

---

## 8. Truthfulness rules for every page

These are non-negotiable and are written into the project's `CLAUDE.md`.

1. **Nothing invented.** No statistics, member counts, events, news, testimonials, partners, awards or quotations that are not real and supplied by the founders.
2. **No third-party names or logos** as partners, members or supporters without written permission on file.
3. **Legal status comes from one setting.** While it is `pending`, the site says "registration in progress" and never "registered". 80G and 12AB are never mentioned as available until the setting says they are granted.
4. **Plans are worded as plans**: "we plan to", "we aim to", "proposed".
5. **No office titles for trustees** until the Board elects them.
6. **No fees shown** until the Board fixes them.
7. **No personal data from the deed**: no PAN, Aadhaar, father's name, religion or home address, anywhere, including code comments and commit messages.
8. **Missing content is a visible placeholder**, written as `[PLACEHOLDER: what is needed]`, and listed in `docs/CONTENT_TODO.md`. A check before launch fails the build if any placeholder remains on a page meant to be live.
9. **Photographs of people** appear only with their consent.
10. **Guides and articles** are published only after a named trustee has reviewed them.

---

## 9. Design direction: what "Apple-inspired" means here

- **One idea per screen.** A large, confident headline, one supporting sentence, one or two actions, and a great deal of empty space.
- **Typography does the work.** Big, tight headlines in Inter Tight; calm body text in Inter.
- **Restraint with colour.** Mostly white and near-black, with indigo marking what matters. See the brand guide.
- **Alternating light and dark full-width sections** to create rhythm down the page.
- **"Bento" grids** of rounded cards of different sizes to present programmes and benefits.
- **A translucent, blurred navigation bar** that stays at the top, with a full-screen menu on phones.
- **Quiet motion**: content fades and rises into place once. Nothing bounces, loops or auto-plays.
- **Real content over decoration.** Until real photographs exist, use abstract dot-grid and connected-node graphics, not stock photos.
- It is inspired by Apple's clarity. It does not copy Apple's layouts, images, icons or the San Francisco typeface.

---

## 10. Technical approach

| Layer     | Choice                                                                                                                     | Reason                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Framework | Next.js, latest stable, App Router, TypeScript                                                                             | Server-rendered HTML for search engines; first-class on Vercel        |
| Styling   | Tailwind CSS, latest stable, driven by the brand tokens                                                                    | Consistent and fast to change                                         |
| Content   | MDX and JSON files in a `content/` folder, validated with Zod                                                              | Easy for Claude Code to edit; no database or login to maintain        |
| Rendering | Static generation for every page                                                                                           | Fastest possible and cheapest to host                                 |
| Fonts     | `next/font` with Inter, Inter Tight and JetBrains Mono, self-hosted                                                        | No layout shift and no third-party requests                           |
| Images    | `next/image`, AVIF and WebP                                                                                                | Small files on mobile data                                            |
| Forms     | Server Actions, validated with Zod, emailed through Resend, protected by a honeypot, a rate limit and Cloudflare Turnstile | No database needed at launch                                          |
| Analytics | Vercel Web Analytics and Speed Insights                                                                                    | Cookieless, so no consent banner is required                          |
| Payments  | None at launch                                                                                                             | No bank account, fees or registration yet. Added later with Razorpay. |
| Quality   | ESLint, Prettier, TypeScript strict, Playwright smoke tests, axe accessibility checks, Lighthouse CI                       | Problems are caught before visitors see them                          |

**Privacy:** forms collect only what is needed, show a short consent notice consistent with the Digital Personal Data Protection Act, 2023, and name a contact for data requests.

---

## 11. Work outside the website that drives ranking and AI citations

These cannot be done by code and need a named owner on the founding team.

| Task                                                                                                                          | When                     |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Confirm who controls the domain, and that the chosen address is the one printed everywhere                                    | Before launch            |
| Create official profiles with identical name, description and link: LinkedIn page, YouTube, X, Instagram, GitHub organisation | Before launch            |
| Google Search Console and Bing Webmaster Tools: verify the domain and submit the sitemap                                      | Launch day               |
| Google Business Profile for the registered office                                                                             | After registration       |
| Get listed and linked by each trustee's employer or university profile, and by each trustee's own LinkedIn profile            | First month              |
| Register on NGO Darpan (NITI Aayog)                                                                                           | After registration       |
| Press note on registration to Kolkata and technology media                                                                    | After registration       |
| A Wikidata entry, once there are independent published sources                                                                | After press coverage     |
| Ask every partner institution with a signed agreement to link to the site                                                     | As agreements are signed |
| Publish one guide or news item every week, and one original data report every year                                            | Ongoing                  |
| Record every real event with photographs, a written summary and slides                                                        | Ongoing                  |

---

## 12. Information still needed from the founders

| Item                                                                                                    | Needed for                            |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Final domain name                                                                                       | Canonical addresses, email addresses  |
| Registered office address                                                                               | Footer, contact page, structured data |
| Public email addresses and a phone number, if any                                                       | Contact page                          |
| For each trustee: photograph, current role, sixty-word biography, LinkedIn link, and consent to publish | Trustees page                         |
| Registration number and date                                                                            | Switch from "pending" to "registered" |
| Membership fees and any student category                                                                | Membership page                       |
| Real upcoming events with date, venue and registration method                                           | Events                                |
| Official social media links                                                                             | Footer and structured data            |
| Signed permissions for any partner names or logos                                                       | Partner section                       |
| Board adoption of the logo in `docs/logo/`, and a trademark check                                       | Header, favicon, share images         |
| Bank details and 80G status                                                                             | Donations, later                      |
