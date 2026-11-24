# Launch day: search engines and analytics

What to do once the site is live on its own domain (Prompt 27), so Google and Bing know it exists and you can see how it is used. Allow about an hour on launch day, then fifteen minutes a week.

Throughout, `https://<domain>` means the site's final address, for example `https://example.org`. Do this on the final domain, not on `assocads-website.vercel.app`.

You will need: a Google account and a Microsoft account that the trust controls (not personal ones, if possible), access to the Vercel project, and access to wherever the domain's DNS is managed.

---

## 1. Verify the site in Google Search Console and submit the sitemap

There are two ways to prove you own the site. Choose one.

**Option A: Domain property (recommended).** It covers every version of the address (with and without `www`, `http` and `https`) and needs no change to the site.

1. Go to https://search.google.com/search-console and sign in.
2. Choose **Add property**, then **Domain**, and type the domain without `https://`, for example `example.org`.
3. Google shows a **TXT record**. Copy it.
4. At your domain's DNS provider, add a TXT record for the bare domain (often written `@`) with that value.
5. Back in Search Console, choose **Verify**. DNS changes can take from a few minutes to a day. If it fails, wait an hour and try again.

**Option B: URL-prefix property with an HTML tag.** Use this if you cannot change DNS.

1. In Search Console choose **Add property**, then **URL prefix**, and type `https://<domain>`.
2. Under **Other verification methods**, choose **HTML tag**. Google shows a tag like `<meta name="google-site-verification" content="abc123..." />`.
3. Copy only the part inside `content="..."`.
4. In Vercel, open the project, then **Settings → Environment Variables**. Add `GOOGLE_SITE_VERIFICATION` with that value, for **Production**.
5. Redeploy: **Deployments**, the latest production deployment, **⋯ → Redeploy**. The tag appears only after a new deployment.
6. Back in Search Console, choose **Verify**.

**Then submit the sitemap (either option):**

1. In Search Console, open the property and choose **Sitemaps** in the left menu.
2. Under **Add a new sitemap**, type `sitemap.xml` and choose **Submit**.
3. The status should become **Success** within a day. It lists how many pages it found (about 74 at the time of writing).

## 2. Do the same in Bing Webmaster Tools

Bing also feeds Copilot, DuckDuckGo and several AI assistants.

**The quick way: import from Google.**

1. Go to https://www.bing.com/webmasters and sign in.
2. Choose **Import** under "Import your sites from GSC", sign in with the same Google account, and allow access.
3. Select the site and choose **Import**. Bing verifies it and copies the sitemap. Nothing else is needed.

**The manual way, if you prefer:**

1. Choose **Add your site manually** and type `https://<domain>`.
2. Choose **HTML Meta Tag**. Bing shows `<meta name="msvalidate.01" content="ABC123..." />`.
3. Copy only the `content` value. In Vercel add `BING_SITE_VERIFICATION` with it, for **Production**, then redeploy as in step 1.
4. Choose **Verify**.
5. Open **Sitemaps**, choose **Submit sitemap**, and enter `https://<domain>/sitemap.xml`.

Also set the `SITE_URL` repository variable described in `docs/INDEXNOW.md`, so new and changed pages are sent to Bing as soon as they are deployed.

## 3. Ask for the ten most important pages to be indexed

Search engines will find every page through the sitemap, but asking directly speeds up the first visit.

**In Google Search Console**, for each address below:

1. Paste the full address into the search bar at the top ("Inspect any URL").
2. Wait for the result, then choose **Request indexing**.
3. Google allows only about ten requests a day, so do these ten on launch day and leave the rest to the sitemap.

**In Bing Webmaster Tools:** open **URL Submission**, paste all ten addresses (one per line) and choose **Submit**.

The ten pages:

1. `https://<domain>/`
2. `https://<domain>/about`
3. `https://<domain>/about/trustees`
4. `https://<domain>/about/facts`
5. `https://<domain>/membership`
6. `https://<domain>/programmes`
7. `https://<domain>/events`
8. `https://<domain>/for/students`
9. `https://<domain>/for/professionals`
10. `https://<domain>/contact`

## 4. What to look at each week for the first two months

Set a fifteen-minute reminder for the same day each week. Write what you see in a shared note, so changes are easy to spot.

**Google Search Console**

1. **Pages** (under Indexing). Check how many pages are **Indexed** and how many are **Not indexed**. In the first weeks the number indexed should rise. For any page listed under a reason such as "Crawled – currently not indexed", open it; new sites often wait a few weeks, so act only if an important page stays there for a month.
2. **Performance**. Look at **Total impressions** (how often the site appeared in results) and **Total clicks**. Then open the **Queries** tab: these are the searches that showed the site. Expect very small numbers at first; what matters is that they grow.
3. **Experience → Core Web Vitals**. Should say "Good" once Google has enough visits, which may take a month or more.
4. **Security & Manual actions**. Should say "No issues detected". If it ever does not, tell the developer the same day.
5. Read any email from Search Console.

**Bing Webmaster Tools**

1. **Search Performance**: impressions and clicks, as for Google.
2. **Site Explorer** or **URL Inspection**: check the home page and one or two others are indexed.

**Vercel** (see section 5)

1. Visitors and page views for the week, compared with the week before.
2. The top pages and top referrers.
3. Speed Insights: the overall score should stay green.

**After two months**, monthly checks are enough, unless something changes.

## 5. How to read the Vercel analytics dashboard

Open https://vercel.com, choose the `assocads-website` project, then **Analytics** in the left menu. If it shows an **Enable** button, choose it and redeploy once; data starts after that. Use the time selector at the top right (for example **Last 7 days**). Make sure the environment filter shows **Production**, so test previews are left out.

**Web Analytics**

- **Visitors**: roughly the number of different people. Each person is counted once a day without cookies, so someone who visits on three days counts three times.
- **Page views**: every page opened. Page views divided by visitors shows how many pages a typical visitor reads.
- **Bounce rate**: the share of visitors who opened one page and left. High on a single news item is normal; high on the home page suggests the next step is not clear.
- **Pages**: which pages are read most. Check that Membership, Programmes and Events appear near the top.
- **Referrers**: the websites people came from, such as Google, LinkedIn or a partner site. A new referrer often means someone linked to ASSOCADS.
- **Countries, Devices, Browsers, Operating systems**: who is visiting and how. Most visitors are expected to be on phones, which is why the site is built mobile first.
- **Events**: the actions the site counts, with no personal data:
  - **Join click**: someone clicked a link to the Join page. Its **location** shows where it was (for example `header`, `menu`, `footer`, or a section of a page) and **page** shows which page. This shows which buttons work.
  - **Form sent**: a form was sent successfully. **form** shows which one (`membership`, `community`, `partner`, `support` or `contact`).
  - **Event registration click**: someone clicked **Register** on an event page. **event** shows which event.
  - **Download**: someone downloaded a file, such as a document or logo. **file** shows which.

  Custom events need Vercel's Pro plan. On the free Hobby plan the **Events** panel stays empty, while visitors and page views are still counted.

**Speed Insights**

Choose **Speed Insights** in the left menu. It shows a **Real Experience Score** from 0 to 100, based on real visitors' devices:

- 90 or more (green) is good. Below 50 (red) needs the developer.
- **LCP** (how long the main content takes to appear), **INP** (how quickly the page responds to a tap or click) and **CLS** (how much the page jumps while loading) are the three Core Web Vitals Google uses. Each is green, amber or red.
- Switch between **Mobile** and **Desktop** at the top; mobile matters most.
- Choose a page in the list to see which pages are slow. `docs/PERFORMANCE.md` explains the speed budgets the site is built to.

What the analytics collect, and why no cookie banner is needed, is described in the privacy notice at `/legal/privacy`.
