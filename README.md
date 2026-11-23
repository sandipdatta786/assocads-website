# ASSOCADS website

The website of ASSOCADS, the Association for AI and Data Science.

## Run the site on your computer

You need Node.js 22 or later and pnpm.

```bash
pnpm install
```

```bash
pnpm dev
```

Then open http://localhost:3000 in a browser. The page refreshes by itself when a file changes.

Before saving work to GitHub, run the full check:

```bash
pnpm check
```

## How content is edited

There is no admin screen and no database. The site's words live in files in this folder, and changes are made by asking Claude Code to edit them.

| What                                                                         | Where                  |
| ---------------------------------------------------------------------------- | ---------------------- |
| Page content, events, news, guides, trustee profiles                         | `content/`             |
| Organisation facts: name, legal status, contact details, social links, menus | `src/config/site.ts`   |
| Images                                                                       | `public/`              |
| Logo master files                                                            | `docs/logo/`           |
| Things the founders still need to supply                                     | `docs/CONTENT_TODO.md` |

To make a change, open this folder in Claude Code, describe the change in plain language, look at the result in the browser, then say "commit and push".

## Trustee photographs

A trustee's photograph appears only after that trustee has agreed to publish it. Each photograph must be:

- **square**, at least **800 × 800 pixels**;
- **head and shoulders**, in colour;
- on a **plain, light background**;
- a **JPG** file;
- named with the trustee's slug from `content/trustees.json`, for example `amit-kumar-das.jpg`.

Put it in `public/images/trustees/`, then in `content/trustees.json` set that trustee's `photo` to `/images/trustees/[slug].jpg` and `consentToPublish` to `true`. The content check stops the build if a photo is set without consent or the file is missing.

To collect profiles, send each trustee the form in `docs/TRUSTEE_PROFILE_TEMPLATE.md`. A trustee gets an individual page at `/about/trustees/[slug]` once they are published, have given consent and have a real biography.

## How changes reach the live site

1. A change is made in this folder on your computer.
2. "Commit and push" sends it to GitHub: `github.com/sandipdatta786/assocads-website`.
3. Vercel sees the push to the `main` branch and publishes the site by itself.

## Project documents

| File                   | What it is                                                                        |
| ---------------------- | --------------------------------------------------------------------------------- |
| `docs/BLUEPRINT.md`    | Strategy, site map, facts the site may use, truthfulness rules, SEO specification |
| `docs/BRAND_GUIDE.md`  | Colours, typefaces, logo rules                                                    |
| `docs/PLAYBOOK.md`     | The step-by-step build prompts                                                    |
| `docs/CONTENT_TODO.md` | Outstanding content from the founders                                             |
| `CLAUDE.md`            | The rules Claude Code follows in this project                                     |

## Important

The trust deed must never be added to this folder. It contains personal identity numbers.
