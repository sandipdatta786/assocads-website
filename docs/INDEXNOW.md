# IndexNow

IndexNow lets a website tell search engines straight away that an address is new or has changed, instead of waiting to be crawled. Bing, Yandex, Naver, Seznam and other engines share submissions with each other. Bing's index also feeds Copilot and several other AI assistants. Google does not use IndexNow; it reads the sitemap.

## How it works on this site

1. Vercel deploys `main` to production and marks the commit on GitHub with a "Vercel" status.
2. `.github/workflows/indexnow.yml` runs when that status turns to success on a commit in `main`.
3. It runs `scripts/indexnow.ts`, which:
   - checks that `/indexnow-key.txt` on the live site serves the key;
   - reads the live `/sitemap.xml`;
   - picks every address whose `<lastmod>` is on or after the date of the deployed commit;
   - sends them in one request to `https://api.indexnow.org/indexnow`, with the key and the key file's address.
4. The answer is printed in the workflow's log: 200 or 202 means it was received.

If no key is set, the workflow does nothing and still passes.

## Setting it up (founders, once)

The key is not a password: it is published at `/indexnow-key.txt` so the engines can check it. It is still kept out of the repository, so it can be changed without a code change.

1. Make a key: 32 letters and digits is a good choice. For example, run `openssl rand -hex 16` in a terminal, or use Bing's key generator at https://www.bing.com/indexnow/getstarted.
2. In Vercel, open the `assocads-website` project, then **Settings → Environment Variables**. Add `INDEXNOW_KEY` with the key, for **Production** only. Then redeploy.
3. Check that `https://<the production address>/indexnow-key.txt` shows the key.
4. In GitHub, open the repository, then **Settings → Secrets and variables → Actions**. Add a repository secret named `INDEXNOW_KEY` with the same key.
5. Optional: if the site moves to its own domain, add a repository **variable** (not a secret) named `SITE_URL` with the new origin, for example `https://example.org`. Until then the workflow uses `https://assocads-website.vercel.app`.

Do not paste the key into a chat, an issue or a commit.

## Running it by hand

```bash
INDEXNOW_KEY=… SITE_URL=https://assocads-website.vercel.app SINCE=2026-11-24 DRY_RUN=1 pnpm indexnow
```

`DRY_RUN=1` lists the addresses without sending them. Leave out `SINCE` to submit every address in the sitemap, which is useful once, after setting the key for the first time.

## Answers from IndexNow

| Code | Meaning                                                   |
| ---- | --------------------------------------------------------- |
| 200  | Received                                                  |
| 202  | Received; the key is still being checked                  |
| 400  | The request was not in the right format                   |
| 403  | The key is not valid, or the key file was not found       |
| 422  | An address is not on this host, or the key does not match |
| 429  | Too many requests; try again later                        |
