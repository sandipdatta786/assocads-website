# Editorial review: guides and glossary

Every guide and glossary entry starts as a draft (`draft: true`). A draft is visible only on a local copy of the site (`pnpm dev`) and never on the live site. It is published only after a **named Founder Trustee** has reviewed it, as truthfulness rule 10 in `CLAUDE.md` requires. The site enforces this: a guide that is not a draft must name a reviewer who appears in `content/trustees.json`, or the build fails.

The first drafts were researched and written with AI assistance on 23 November 2026. Treat every statement as unchecked until you have checked it.

## How to review one item

1. Run `pnpm dev` and open the item at `http://localhost:3000/guides/<slug>` or `http://localhost:3000/glossary/<slug>`. Read it as a visitor would.
2. Open the file in `content/guides/` or `content/glossary/` and work through the checklist below.
3. Make your corrections in the file.
4. Fill in the front matter (see "Publishing" below), run `pnpm check`, and commit.
5. Record your name and the date in the table at the end of this document.

## Checklist

### Accuracy

- [ ] Every `[PLACEHOLDER: verify ...]` has been resolved: either checked against a source and rewritten, or the statement removed. **None may remain.**
- [ ] Every source in `sources` (or `furtherReading`) opens, is the official or most authoritative source available, and says what the text claims.
- [ ] Every figure, date, amount, section number and name has been checked against its source today, not from memory.
- [ ] Figures that change (salaries, fees, budgets, lists of courses, employers or events) carry a date, and `dataAsOf` is set to the date of the data.
- [ ] Every item in `keyFacts` is supported by a listed source.
- [ ] The short answer (`directAnswer`, 40 to 60 words) or the definition (`shortDefinition`) is correct and stands on its own.

### Fairness and independence

- [ ] No commercial course, training company, salary website, product or employer is recommended or ranked.
- [ ] Organisations named in Kolkata guides exist, are described neutrally in one line, and link to their official site.
- [ ] No organisation is presented as a partner, member or supporter of ASSOCADS (rule 2).
- [ ] Where sources disagree, the text says so and shows the range.

### Law, policy and government schemes

- [ ] For the DPDP Act, the IndiaAI Mission and AI regulation guides, `legalNotice: true` is set, so the page shows "General information, not legal advice".
- [ ] The text separates what is law, what is official guidance and what is only proposed.
- [ ] Links go to the official text: the Gazette, India Code, MeitY, PIB or IndiaAI.
- [ ] Commencement dates of laws and rules are checked against the latest official notification.

### ASSOCADS and the truthfulness rules

- [ ] ASSOCADS is mentioned only where naturally relevant, and never as having done something it has not.
- [ ] Plans are worded as plans: "we plan to", "we aim to", "proposed".
- [ ] While registration is in progress, nothing says ASSOCADS is "registered", and 80G and 12AB are not mentioned.
- [ ] No invented statistics, quotations, testimonials, partners or awards.
- [ ] No personal data, and no photograph of a person without consent.

### Writing

- [ ] Indian English spelling (organisation, programme, centre), sentence-case headings, plain sentences, no hype words.
- [ ] Headings in guides are phrased as questions people ask.
- [ ] Paragraphs make sense when quoted on their own.
- [ ] Text is in our own words, with no copied passages from sources.

### Links

- [ ] `relatedGuides`, `glossaryTerms` and `related` point to items that are also being published, or will be soon. A link to a draft shows nothing on the live site, which is harmless but unhelpful.

## Publishing

In the front matter of a **guide**:

```yaml
author: "Full name of the writer"
reviewedBy: "Founder Trustee name, exactly as in content/trustees.json"
lastReviewed: "YYYY-MM-DD" # the day you finished the review
publishedDate: "YYYY-MM-DD" # the day it should go live; a future date keeps it hidden until then
draft: false # or delete the line
```

In the front matter of a **glossary entry**:

```yaml
lastReviewed: "YYYY-MM-DD"
draft: false
```

Then run `pnpm check`. If it passes, commit. The item appears on the live site within a few minutes.

## Reviewing again

Guides with figures or lists (salaries, courses, employers, events, government schemes) should be reviewed **at least every six months**, and policy guides whenever the law or rules change. Each time, work through the checklist, update `lastReviewed` (and `dataAsOf` if the data changed), and add a line to the table.

## The drafts

| #   | Type     | File                                                             | Theme        | Reviewer     | Date reviewed    | Published |
| --- | -------- | ---------------------------------------------------------------- | ------------ | ------------ | ---------------- | --------- |
| 1   | Guide    | `content/guides/how-to-become-a-data-scientist-in-india.mdx`     | Careers      | Sandip Datta | 23 November 2026 | Yes       |
| 2   | Guide    | `content/guides/data-science-roadmap-for-students.mdx`           | Careers      | Sandip Datta | 23 November 2026 | Yes       |
| 3   | Guide    | `content/guides/data-scientist-salary-in-india.mdx`              | Careers      | Sandip Datta | 23 November 2026 | Yes       |
| 4   | Guide    | `content/guides/how-to-find-a-data-science-or-ai-internship.mdx` | Careers      | Sandip Datta | 23 November 2026 | Yes       |
| 5   | Guide    | `content/guides/ai-and-data-science-courses-in-kolkata.mdx`      | Kolkata      | Sandip Datta | 23 November 2026 | Yes       |
| 6   | Guide    | `content/guides/ai-and-data-science-employers-in-kolkata.mdx`    | Kolkata      | Sandip Datta | 23 November 2026 | Yes       |
| 7   | Guide    | `content/guides/ai-and-data-science-events-in-kolkata.mdx`       | Kolkata      | Sandip Datta | 23 November 2026 | Yes       |
| 8   | Guide    | `content/guides/dpdp-act-explained-for-data-teams.mdx`           | Policy       | Sandip Datta | 23 November 2026 | Yes       |
| 9   | Guide    | `content/guides/indiaai-mission-explained.mdx`                   | Policy       | Sandip Datta | 23 November 2026 | Yes       |
| 10  | Guide    | `content/guides/ai-governance-and-regulation-in-india.mdx`       | Policy       | Sandip Datta | 23 November 2026 | Yes       |
| 11  | Guide    | `content/guides/what-is-responsible-ai.mdx`                      | Fundamentals | Sandip Datta | 23 November 2026 | Yes       |
| 12  | Guide    | `content/guides/ai-for-social-good-in-india.mdx`                 | Fundamentals | Sandip Datta | 23 November 2026 | Yes       |
| 13  | Glossary | `content/glossary/artificial-intelligence.mdx`                   |              | Sandip Datta | 23 November 2026 | Yes       |
| 14  | Glossary | `content/glossary/machine-learning.mdx`                          |              | Sandip Datta | 23 November 2026 | Yes       |
| 15  | Glossary | `content/glossary/data-science.mdx`                              |              | Sandip Datta | 23 November 2026 | Yes       |
| 16  | Glossary | `content/glossary/generative-ai.mdx`                             |              | Sandip Datta | 23 November 2026 | Yes       |
| 17  | Glossary | `content/glossary/large-language-model.mdx`                      |              | Sandip Datta | 23 November 2026 | Yes       |
| 18  | Glossary | `content/glossary/responsible-ai.mdx`                            |              | Sandip Datta | 23 November 2026 | Yes       |
| 19  | Glossary | `content/glossary/ai-governance.mdx`                             |              | Sandip Datta | 23 November 2026 | Yes       |
| 20  | Glossary | `content/glossary/data-analytics.mdx`                            |              | Sandip Datta | 23 November 2026 | Yes       |
| 21  | Glossary | `content/glossary/deep-learning.mdx`                             |              | Sandip Datta | 23 November 2026 | Yes       |
| 22  | Glossary | `content/glossary/mlops.mdx`                                     |              | Sandip Datta | 23 November 2026 | Yes       |
| 23  | Glossary | `content/glossary/neural-network.mdx`                            |              | Sandip Datta | 23 November 2026 | Yes       |
| 24  | Glossary | `content/glossary/natural-language-processing.mdx`               |              | Sandip Datta | 23 November 2026 | Yes       |
| 25  | Glossary | `content/glossary/computer-vision.mdx`                           |              | Sandip Datta | 23 November 2026 | Yes       |
| 26  | Glossary | `content/glossary/supervised-learning.mdx`                       |              | Sandip Datta | 23 November 2026 | Yes       |
| 27  | Glossary | `content/glossary/unsupervised-learning.mdx`                     |              | Sandip Datta | 23 November 2026 | Yes       |
| 28  | Glossary | `content/glossary/reinforcement-learning.mdx`                    |              | Sandip Datta | 23 November 2026 | Yes       |
| 29  | Glossary | `content/glossary/training-data.mdx`                             |              | Sandip Datta | 23 November 2026 | Yes       |
| 30  | Glossary | `content/glossary/algorithmic-bias.mdx`                          |              | Sandip Datta | 23 November 2026 | Yes       |
| 31  | Glossary | `content/glossary/explainable-ai.mdx`                            |              | Sandip Datta | 23 November 2026 | Yes       |
| 32  | Glossary | `content/glossary/big-data.mdx`                                  |              | Sandip Datta | 23 November 2026 | Yes       |
| 33  | Glossary | `content/glossary/data-engineering.mdx`                          |              | Sandip Datta | 23 November 2026 | Yes       |
| 34  | Glossary | `content/glossary/overfitting.mdx`                               |              | Sandip Datta | 23 November 2026 | Yes       |
| 35  | Glossary | `content/glossary/prompt-engineering.mdx`                        |              | Sandip Datta | 23 November 2026 | Yes       |
| 36  | Glossary | `content/glossary/ai-agent.mdx`                                  |              | Sandip Datta | 23 November 2026 | Yes       |
| 37  | Glossary | `content/glossary/personal-data.mdx`                             |              | Sandip Datta | 23 November 2026 | Yes       |
