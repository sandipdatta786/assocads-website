# How to publish news

News, announcements and reports appear on the Insights page (`/insights`), each with its own page, and in the RSS feed (`/feed.xml`). Each item is one file in `content/insights/`. The three newest also appear on the home page under "Announcements". You do not need to write any code.

**The easiest way is the admin editor at `/admin`**, which fills in this file for you and has every change reviewed before it goes live. See `docs/ADMIN_GUIDE.md`. This page explains how to edit the file directly.

## Before you start

Every item must follow the truthfulness rules in `CLAUDE.md`:

- Only real, confirmed facts. No invented figures, quotations, partners or awards.
- Plans are written as plans: "we plan to", "we aim to", "proposed".
- No organisation is named as a partner or supporter without written permission on file.
- Photographs of people appear only with their consent.
- While registration is in progress, never write that ASSOCADS is "registered", and never mention 80G or 12AB.

## Publish an item in six steps

1. **Copy the template.** In `content/insights/`, copy `example-news-template.mdx` and give the copy a short name in lower case with hyphens, for example `first-workshop-announced.mdx`.
2. **Set the slug.** At the top of the file, change `slug:` to the file name without `.mdx`, for example `slug: first-workshop-announced`. It becomes the address: `/insights/first-workshop-announced`.
3. **Fill in the details** between the two lines of dashes:
   - `title`: the headline, in sentence case.
   - `summary`: one or two sentences. Shown on cards, in search results and in the feed.
   - `category`: `announcement`, `news` or `report`.
   - `publishedDate`: the day it goes live, written as `2027-03-05`.
   - `author`: the writer's name as it should appear.
   - `image` and `imageAlt` (optional): a picture in `public/images/insights/` and a short description of it.
4. **Write the article** below the second line of dashes. Start with the most important point. Use `## ` for a heading and `- ` for a list item. Lines in `{/* ... */}` are notes for editors and never show on the page; delete them.
5. **Remove `draft: true`**, or change it to `draft: false`, when the item is ready.
6. **Check and publish.** Run `pnpm check`. If it passes, commit the file. The site rebuilds and the item appears within a few minutes.

## Preparing an item in advance

Give it a `publishedDate` in the future. It stays hidden everywhere (the Insights page, its own page and the feed) until that day in Indian Standard Time, and appears when the site next rebuilds, which happens at least once a day. This rule is built into the site, so an item dated in the future by mistake cannot appear early.

## Correcting a published item

Edit the file and add `updatedDate:` with the day of the change. The page then shows both "Published" and "Updated". Do not change `publishedDate` or the slug: other sites may already link to the address.

## Seeing a draft before it goes live

Run `pnpm dev` and open `http://localhost:3000/insights`. Drafts show on your own computer with a "Draft" notice, and never on the live site.

## If `pnpm check` fails

The message names the file and the field, for example `summary: Too big`. Fix that field and run it again. Common causes:

- The slug does not match the file name, or two items share a slug.
- The date is not written as `YYYY-MM-DD`.
- `updatedDate` is earlier than `publishedDate`.
- An image has no `imageAlt`.
