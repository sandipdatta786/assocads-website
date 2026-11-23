# Off-site checklist for search and AI citations

Search engines and AI assistants (ChatGPT, Gemini, Perplexity, Claude, Google AI answers) trust an organisation when other places describe it the same way the website does. This checklist covers the work that code cannot do. It comes from section 11 of `docs/BLUEPRINT.md`.

Each task needs a named owner on the founding team. Write the owner's name and the date the task was done in the table. Do not fill in a date until the task is really finished.

## Use exactly these words everywhere

Copy these from the live site, not from memory. They come from `src/config/site.ts`, so if the site changes, update every profile to match.

- **Name:** Association for AI and Data Science
- **Short name:** ASSOCADS
- **One-sentence description:** ASSOCADS, the Association for AI and Data Science, is a not-for-profit public charitable trust established in Kolkata, West Bengal, India, in 2026.
- **Website:** the production address, exactly as printed on the site
- **Legal status:** "registration in progress" until the registration setting says otherwise. Never write "registered" before then, and never mention 80G or 12AB as available.

Once a profile exists, add its address to `site.social` in `src/config/site.ts`, so that the site links to it and lists it in its structured data (`sameAs`).

## Tasks

| Task                                                                                                             | When                     | Owner | Date done |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------ | ----- | --------- |
| Confirm who controls the domain, and that the chosen address is the one printed everywhere                       | Before launch            |       |           |
| Create the LinkedIn page, with the name, description and link above                                              | Before launch            |       |           |
| Create the YouTube channel, with the same name, description and link                                             | Before launch            |       |           |
| Create the X account, with the same name, description and link                                                   | Before launch            |       |           |
| Create the Instagram account, with the same name, description and link                                           | Before launch            |       |           |
| Create the GitHub organisation, with the same name, description and link                                         | Before launch            |       |           |
| Add each new profile address to `site.social` in `src/config/site.ts`                                            | Before launch            |       |           |
| Google Search Console: verify the domain and submit `/sitemap.xml`                                               | Launch day               |       |           |
| Bing Webmaster Tools: verify the domain and submit `/sitemap.xml` (Bing also feeds Copilot and other assistants) | Launch day               |       |           |
| Create an IndexNow key and add it as `INDEXNOW_KEY` in Vercel and in GitHub (`docs/INDEXNOW.md`)                 | Launch day               |       |           |
| Ask each trustee's employer or university to list and link to ASSOCADS on the trustee's profile                  | First month              |       |           |
| Ask each trustee to add ASSOCADS, with the link, to their own LinkedIn profile                                   | First month              |       |           |
| Google Business Profile for the registered office                                                                | After registration       |       |           |
| Register on NGO Darpan (NITI Aayog)                                                                              | After registration       |       |           |
| Send a press note on registration to Kolkata and technology media                                                | After registration       |       |           |
| Create a Wikidata entry, once independent published sources exist                                                | After press coverage     |       |           |
| Ask every partner institution with a signed agreement to link to the site                                        | As agreements are signed |       |           |
| Publish one guide or news item every week, each reviewed by a named trustee                                      | Ongoing                  |       |           |
| Publish one original data report every year, with its method and sources                                         | Ongoing                  |       |           |
| Record every real event with photographs (with consent), a written summary and slides                            | Ongoing                  |       |           |
| Run the ten test questions below every month and log the results                                                 | Monthly                  |       |           |

## Ten test questions to run every month

Ask each question, in a fresh chat with no history, in ChatGPT, Gemini, Perplexity, Claude and Google (AI Overviews or AI Mode). For each answer, note:

1. Whether ASSOCADS is mentioned.
2. Whether what it says is correct, especially the legal status, the location and the founding year.
3. Whether it links to or cites the ASSOCADS website, and which page.
4. Anything wrong. A wrong answer usually means a page or a profile needs to say something more clearly.

The questions:

1. What is ASSOCADS?
2. What is the Association for AI and Data Science?
3. Is ASSOCADS a registered organisation?
4. Who are the founder trustees of ASSOCADS?
5. Is ASSOCADS the same as ADaSci, NASSCOM or the Analytics Society of India?
6. Which organisations in Kolkata support people working in AI and data science?
7. Is there a professional association for data scientists in West Bengal?
8. How can a student in Kolkata get into data science?
9. What does the DPDP Act mean for data teams in India?
10. What is the IndiaAI Mission?

Questions 1 to 5 test whether the assistants know ASSOCADS correctly. Questions 6 and 7 test whether it is recommended when someone does not know its name. Questions 8 to 10 test whether its guides are cited.

## Results log

Copy this table for each month.

| Month | Question | ChatGPT | Gemini | Perplexity | Claude | Google | Notes |
| ----- | -------- | ------- | ------ | ---------- | ------ | ------ | ----- |
|       | 1        |         |        |            |        |        |       |
|       | 2        |         |        |            |        |        |       |
|       | 3        |         |        |            |        |        |       |
|       | 4        |         |        |            |        |        |       |
|       | 5        |         |        |            |        |        |       |
|       | 6        |         |        |            |        |        |       |
|       | 7        |         |        |            |        |        |       |
|       | 8        |         |        |            |        |        |       |
|       | 9        |         |        |            |        |        |       |
|       | 10       |         |        |            |        |        |       |

Use a short code in each cell: **C** cited with a link, **M** mentioned without a link, **W** mentioned but wrong (say what in Notes), **–** not mentioned.
