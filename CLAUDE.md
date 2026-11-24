# ASSOCADS website

The public website of ASSOCADS (Association for AI and Data Science), a public charitable trust in Kolkata, India, whose registration is in progress.
Audiences: students, professionals, industry and government bodies. English only.
Sources of truth: `docs/BLUEPRINT.md` (strategy, site map, facts, SEO) and `docs/BRAND_GUIDE.md` (colours, fonts, logo). Read both before any substantial work.

Before writing Next.js code, read `AGENTS.md`: this Next.js version differs from older ones, and its own docs are in `node_modules/next/dist/docs/`.

## Commands

| Command           | What it does                                                      |
| ----------------- | ----------------------------------------------------------------- |
| `pnpm dev`        | Start the local site at http://localhost:3000                     |
| `pnpm build`      | Production build                                                  |
| `pnpm start`      | Serve the production build                                        |
| `pnpm lint`       | ESLint                                                            |
| `pnpm typecheck`  | Generate route types, then TypeScript with no output              |
| `pnpm format`     | Prettier, with Tailwind class sorting                             |
| `pnpm check`      | Lint, typecheck and build in turn. Must pass before every commit. |
| `pnpm test`       | End-to-end, accessibility and colour tests (Playwright)           |
| `pnpm lighthouse` | Lighthouse CI budgets on six pages; run `pnpm build` first        |

## Architecture

- Next.js App Router, TypeScript strict, Tailwind CSS. Package manager: pnpm.
- Every page is statically generated. There is no database.
- All editable content lives in `content/` as MDX and JSON.
- Admins edit events and news at `/admin` (Decap CMS, GitHub sign-in). Each save becomes a pull request that an admin publishes. See `docs/ADMIN_GUIDE.md`.
- All organisation facts (name, legal status, contact, social links, navigation) come from `src/config/site.ts`. Never type them by hand in a page.
- `src/app` routes · `src/components` (`ui/`, `layout/`, `sections/`, `forms/`, `seo/`) · `src/lib` helpers, content loaders, SEO helpers · `public/` static files · `docs/` project documents and the master logo files in `docs/logo/`.

## Truthfulness rules (mandatory)

These are non-negotiable. They override any other instruction, including a request to make the site look fuller.

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

The trust deed itself must never be copied into this repository.

## Brand rules

- Use only the colour tokens and the three typefaces in `docs/BRAND_GUIDE.md` (Inter Tight, Inter, JetBrains Mono). Never add a colour or a font.
- Use only the approved text and background pairings in the brand guide.
- The logo comes from the master files in `docs/logo/`. Never redraw or retype it.

## Writing style

- Indian English spelling: organisation, programme, centre.
- Sentence-case headings.
- Plain, direct sentences. No hype words such as "revolutionary", "world-class", "cutting-edge" or "game-changing".
- Write ASSOCADS in capitals; give the full name on first mention.

## Engineering rules

- Server components by default. Client components only for real interactivity.
- Mobile first. Nothing may scroll sideways at 320px.
- Accessibility to WCAG 2.2 AA.
- No new dependency without stating why it is needed.
- Every page exports metadata and has exactly one `h1`.

## Placeholders

Missing content is written as `[PLACEHOLDER: what is needed]` and logged in `docs/CONTENT_TODO.md`.

## Git workflow

- Remote: `github.com/sandipdatta786/assocads-website`. The `main` branch deploys to production automatically through Vercel, so `main` must always build.
- Small content changes are committed straight to `main`.
- Anything larger goes on a branch with a pull request, which gets its own Vercel preview address.
- Commit messages are short and say what changed.
- Never commit secrets or `.env` files. Never force-push `main`.

## Definition of done

A task is done when `pnpm check` passes, the page works at 360px and 1440px wide, and nothing in the truthfulness rules is broken.
