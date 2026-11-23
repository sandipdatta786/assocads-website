# Setting up the website forms

The site has five forms:

- membership interest (/membership/apply)
- communities (/communities)
- partnership enquiry (/partner)
- pledge or sponsor (/support)
- contact (/contact)

Each one sends a plain email to the secretariat, and a short acknowledgement to the person who filled it in. Nothing is stored anywhere else.

Two free services make this work:

- **Resend** sends the emails.
- **Cloudflare Turnstile** checks that a real person is sending the form, without a puzzle in most cases.

You create both accounts yourself and add the keys yourself. **Never paste a key into a chat, an email or a file that goes into Git.**

## How the forms behave before you add keys

| Where                    | No keys                                                                        | Keys added                            |
| ------------------------ | ------------------------------------------------------------------------------ | ------------------------------------- |
| Your own machine         | Each message is printed in the terminal, and the page says "Development mode". | Emails are really sent.               |
| Vercel (preview or live) | Visitors see a polite "could not send" message with the public email address.  | Emails are sent, and spam is checked. |

So nothing breaks while you set this up.

## Part 1: Resend (sending email)

### 1. Create the account

1. Go to [resend.com](https://resend.com) and sign up with the organisation's email address.
2. Confirm your email address when Resend asks.

### 2. Verify the sending domain

Emails must come from an address on a domain you own, for example `forms@assocads.org`. Resend needs proof that you own it.

1. In Resend, open **Domains** and choose **Add domain**.
2. Type the domain, for example `assocads.org`. Choose the region closest to India that Resend offers.
3. Resend shows a short list of DNS records (usually TXT and MX records, for SPF and DKIM).
4. Sign in to wherever the domain is registered (your domain registrar or DNS host). Add each record exactly as Resend shows it.
5. Back in Resend, choose **Verify**. It can take from a few minutes to a few hours. When it has worked, the domain shows as **Verified**.

> Until a domain is verified, Resend only lets you send to your own Resend account address. That is enough for a first test, using `onboarding@resend.dev` as the sender.

### 3. Create an API key

1. In Resend, open **API Keys** and choose **Create API key**.
2. Name it `assocads-website`, and give it **Sending access** only.
3. Copy the key. It starts with `re_`, and Resend shows it only once.

## Part 2: Cloudflare Turnstile (spam protection)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign up, or sign in. A free account is enough. The domain does not need to be on Cloudflare.
2. In the left menu, open **Turnstile**, then choose **Add widget**.
3. Name it `ASSOCADS website`.
4. Under **Hostnames**, add:
   - `assocads-website.vercel.app`
   - your own domain, when you have one (for example `assocads.org`)
   - `localhost`, if you want to test it on your own machine
5. Widget mode: choose **Managed**.
6. Choose **Create**. Cloudflare shows two keys:
   - the **Site key**, which is public;
   - the **Secret key**, which must stay secret.

## Part 3: Add the keys on your own machine

1. In the project folder, copy `.env.example` to a new file called `.env.local`. It is already ignored by Git, so it will never be committed.
2. Open `.env.local` and fill in:

   | Name                             | What to put                                                                                          |
   | -------------------------------- | ---------------------------------------------------------------------------------------------------- |
   | `RESEND_API_KEY`                 | The Resend key starting with `re_`                                                                   |
   | `FORMS_FROM`                     | The sender, for example `ASSOCADS <forms@assocads.org>`, or `onboarding@resend.dev` for a first test |
   | `FORMS_TO`                       | The secretariat address that should receive every form                                               |
   | `FORMS_TO_…`                     | Optional: a different address for one kind of message. Leave blank to use `FORMS_TO`                 |
   | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | The Turnstile site key                                                                               |
   | `TURNSTILE_SECRET_KEY`           | The Turnstile secret key                                                                             |

3. Stop the local site, if it is running, and start it again with `pnpm dev`. Keys are read when the site starts.

## Part 4: Add the keys in Vercel

1. Open the project **assocads-website** in [vercel.com](https://vercel.com). Do not touch the older `assocads` project.
2. Go to **Settings → Environment Variables**.
3. Add each name from the table above with its value. Tick **Production** and **Preview** for each one.
4. Redeploy, so that the new values take effect. Open **Deployments**, choose the latest one, then **⋯ → Redeploy**. The Turnstile site key is built into the pages, so a redeploy is required.

## Part 5: Check that it works

1. Open `/contact` on the live site.
2. Fill in the form with your own email address, choose a topic, and send it.
3. You should see "Thank you". Within a minute, two emails should arrive:
   - the message itself, at the secretariat address, with **Reply** going to the sender;
   - the acknowledgement, at the address you typed.
4. If you see "Sorry, we could not send this", open the deployment's **Logs** in Vercel. Lines starting with `[forms]` say which setting is missing. They never include what the visitor typed.

## How spam is kept out

- **A hidden field** that people never see. Automated senders tend to fill it in. When they do, they are told the form was sent, but nothing is sent.
- **A minimum time:** a form sent within three seconds of appearing is refused.
- **Turnstile**, checked on the server for every submission.
- **A rate limit:** at most five submissions from one internet address in ten minutes.
  - The count is kept in the server's memory, so it needs no database or paid service.
  - Its limit: Vercel may run several copies of the site at once, and each keeps its own count. Turnstile catches automated senders first, so this is enough for now.
  - If spam ever gets through, add a rate-limit rule in Vercel's Firewall, or move the count to a shared store such as Upstash Redis.

People who have switched off JavaScript can still fill in and send a form, and the server checks their answers. But Turnstile needs JavaScript, so instead of sending, the page asks them to switch it on, or to email the public address.

## Running the automated tests

```bash
pnpm test:e2e
```

The tests build and start the site with a test-only setting (`FORMS_TEST_OUTBOX`). It writes each email to a temporary folder instead of sending it. No keys are needed, and nothing is sent. This setting is ignored on Vercel.
