import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPage,
  SettingLink,
  type LegalSection,
} from "@/components/legal/LegalPage";
import { Placeholder } from "@/components/ui/Callout";
import { legalStatusLine, site } from "@/config/site";
import { legalDates } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy notice",
  description:
    "How ASSOCADS handles personal data under India's Digital Personal Data Protection Act, 2023: what each form collects, who processes it, and your rights.",
  path: "/legal/privacy",
});

const mailto = (v: string) => `mailto:${v}`;

/** What each form asks for, and why. Keep in step with src/lib/forms/schemas.ts. */
const forms: {
  name: string;
  href: string;
  collects: string;
  why: string;
}[] = [
  {
    name: "Register your interest in membership",
    href: "/membership/apply",
    collects:
      "Your name, email address, city, which description fits you best, the membership category you are interested in, and your consent. Optional: phone number, organisation (required only if you represent one), areas of interest, a message, and whether you would like occasional news.",
    why: "To tell you when membership opens, to understand which categories and areas people want, and, only if you tick that box, to send you occasional news.",
  },
  {
    name: "Communities interest",
    href: "/communities",
    collects:
      "Your name, email address, city, the group or chapter you are interested in, the place for a chapter you propose, whether you would like to help organise, and your consent.",
    why: "To contact you when a group or chapter you chose begins, and to see where there is enough interest to start one.",
  },
  {
    name: "Partnership enquiry",
    href: "/partner",
    collects:
      "Your name, role, organisation and its type, email address, what you would like to explore, a message, and your consent. Optional: phone number.",
    why: "To reply to your enquiry and discuss working together.",
  },
  {
    name: "Pledge or sponsor",
    href: "/support",
    collects:
      "Your name, email address, how you would like to help, a message, and your consent. Optional: organisation and phone number. No payment details are collected.",
    why: "To reply to your offer and discuss it with you.",
  },
  {
    name: "Contact",
    href: "/contact",
    collects:
      "Your name, email address, what your message is about, the message, and your consent. Optional: phone number.",
    why: "To reply to you. The topic you choose decides who in ASSOCADS receives the message.",
  },
];

export default function Page() {
  const { contact, legal } = site;
  const dataEmail = (
    <SettingLink value={contact.dataProtectionEmail} href={mailto} />
  );

  const sections: LegalSection[] = [
    {
      id: "summary",
      title: "In short",
      body: (
        <ul>
          <li>
            We collect only what you type into a form on this website, and use
            it only for the purpose the form describes.
          </li>
          <li>
            Each form is emailed to our secretariat. The website keeps no copy
            in a database.
          </li>
          <li>
            We do not sell your data or use it for advertising. {site.shortName}{" "}
            sets no cookies.
          </li>
          <li>
            You can ask to see, correct or erase your data, and withdraw your
            consent, at any time: write to {dataEmail}.
          </li>
        </ul>
      ),
    },
    {
      id: "who-we-are",
      title: "Who is responsible for your data",
      body: (
        <>
          <p>
            The {site.name} ({site.shortName}) decides why and how your data is
            used, so it is the &ldquo;Data Fiduciary&rdquo; under the Digital
            Personal Data Protection Act, 2023. {legalStatusLine()}
          </p>
          <p>
            Registered office: <SettingLink value={legal.registeredOffice} />
          </p>
          <p>Questions about your data: {dataEmail}</p>
        </>
      ),
    },
    {
      id: "what-we-collect",
      title: "What each form collects, and why",
      body: (
        <>
          <p>
            You do not have to give us any personal data to read this website.
            We collect personal data only when you send one of these forms, and
            only with your consent, which you give by ticking the box on the
            form.
          </p>
          {forms.map((f) => (
            <div key={f.href}>
              <h3>
                <Link href={f.href}>{f.name}</Link>
              </h3>
              <dl className="mt-3 flex flex-col gap-3">
                <div>
                  <dt className="font-semibold">What it collects</dt>
                  <dd>{f.collects}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Why</dt>
                  <dd>{f.why}</dd>
                </div>
              </dl>
            </div>
          ))}
          <p>
            After you send a form, you receive a short email confirming that we
            have it. Please do not send sensitive information, such as identity
            numbers, health details or bank details, through a form.
          </p>
        </>
      ),
    },
    {
      id: "automatic",
      title: "Information collected automatically",
      body: (
        <>
          <ul>
            <li>
              <strong>Your internet address, when you send a form.</strong> We
              use it to limit how many forms one connection can send, which
              keeps out automated spam. It is kept only in the server&rsquo;s
              memory, in a scrambled form that cannot be read back, for at most
              ten minutes. It is also passed to the spam check described below.
            </li>
            <li>
              <strong>The time a form appeared.</strong> A form sent within a
              few seconds is likely to be automated. This time is not linked to
              you and is not kept.
            </li>
            <li>
              <strong>Technical logs.</strong> Our hosting provider records
              standard details of each request, such as the internet address,
              the page requested and the type of browser, to run and protect the
              website. Our own logs record only which form was sent and whether
              it was delivered, never what you typed.
            </li>
            <li>
              <strong>Your browser&rsquo;s session storage.</strong> If you
              close the notice at the top of the page, your browser remembers
              this until you close the tab. Nothing is sent to us.
            </li>
          </ul>
          <p>
            <strong>Visitor statistics.</strong> The website does not use any
            analytics or tracking tools at present, and sets no cookies. If we
            add visitor statistics, we plan to use a service that works without
            cookies, such as Vercel Web Analytics, and we will update this
            notice before we do.
          </p>
        </>
      ),
    },
    {
      id: "processors",
      title: "Services that process data for us",
      body: (
        <>
          <p>
            These services handle data on our behalf and only to provide their
            service to us. Some of them may process data on servers outside
            India.
          </p>
          <ul>
            <li>
              <strong>Vercel</strong> hosts the website and runs the forms.
            </li>
            <li>
              <strong>Resend</strong> delivers the emails sent by the forms:
              your message to our secretariat, and the confirmation to you.
            </li>
            <li>
              <strong>Cloudflare Turnstile</strong> checks that a form is sent
              by a person and not an automated program. To do this it uses
              technical details such as your internet address and information
              about your browser.
            </li>
            <li>
              <strong>Our email provider</strong> holds the secretariat&rsquo;s
              mailbox, where form messages arrive:{" "}
              <Placeholder needed="name of the email service used for the secretariat mailbox" />
            </li>
          </ul>
          <p>
            Inside {site.shortName}, a message is read only by the trustees and
            volunteers who need it to reply. We share personal data with anyone
            else only if you ask us to, or if the law requires it.
          </p>
        </>
      ),
    },
    {
      id: "consent",
      title: "Your consent, and withdrawing it",
      body: (
        <>
          <p>
            We use your data because you consented to it when you ticked the box
            on the form. You can withdraw your consent at any time, as easily as
            you gave it, by writing to {dataEmail}. We will then stop using your
            data and erase it, unless the law requires us to keep it.
            Withdrawing consent does not affect what we did with your data
            before you withdrew it.
          </p>
          <p>
            If you asked for occasional news when registering your interest, you
            can stop it at any time in the same way.
          </p>
        </>
      ),
    },
    {
      id: "how-long",
      title: "How long we keep your data",
      body: (
        <>
          <p>
            We keep form messages only for as long as we need them for the
            purpose of the form, and then delete them:{" "}
            <Placeholder needed="retention periods agreed by the Board, for example how long enquiries and expressions of interest are kept" />
          </p>
          <ul>
            <li>
              The scrambled internet address used for the spam limit: at most
              ten minutes.
            </li>
            <li>
              Hosting logs and email delivery records: for the limited periods
              set by Vercel and Resend for their services.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "your-rights",
      title: "Your rights",
      body: (
        <>
          <p>
            Under the Digital Personal Data Protection Act, 2023, you have the
            right to:
          </p>
          <ul>
            <li>
              <strong>access</strong> a summary of the personal data we hold
              about you, what we do with it, and who we have shared it with;
            </li>
            <li>
              <strong>correct</strong> data that is wrong, and complete or
              update data that is incomplete or out of date;
            </li>
            <li>
              <strong>erase</strong> your data, when it is no longer needed or
              you withdraw consent, unless the law requires us to keep it;
            </li>
            <li>
              <strong>withdraw your consent</strong> at any time;
            </li>
            <li>
              <strong>have a complaint answered</strong> by us, as described
              below;
            </li>
            <li>
              <strong>nominate</strong> someone to exercise these rights for you
              if you die or become unable to do so.
            </li>
          </ul>
          <p>
            To use any of these rights, write to {dataEmail}. Use the email
            address you gave on the form, so that we can find your details, and
            say what you would like us to do. We will confirm that we have
            received your request.
          </p>
        </>
      ),
    },
    {
      id: "children",
      title: "Children",
      body: (
        <p>
          Our forms are meant for people aged eighteen or over. If you are under
          eighteen, please ask a parent or guardian to contact us for you. If we
          learn that we have received a child&rsquo;s data without a
          parent&rsquo;s or guardian&rsquo;s consent, we will delete it.
        </p>
      ),
    },
    {
      id: "security",
      title: "Keeping your data safe",
      body: (
        <p>
          The website is served only over an encrypted connection. Form messages
          are not stored on the website. The keys for our email and spam
          services are kept secret and never placed in the website&rsquo;s code,
          and access to the secretariat&rsquo;s mailbox is limited to the people
          who need it.
        </p>
      ),
    },
    {
      id: "complaints",
      title: "How to complain",
      body: (
        <>
          <p>
            If you are unhappy with how we have handled your data, please write
            to {dataEmail} first, so that we can put it right.
          </p>
          <p>
            If you are not satisfied with our answer, you may complain to the
            Data Protection Board of India, set up under the Digital Personal
            Data Protection Act, 2023.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      title: "Changes to this notice",
      body: (
        <p>
          We will update this notice when we change how we handle data, for
          example if we add a new service. The date at the top of the page shows
          when the current version took effect.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact us about your data",
      body: (
        <>
          <p>Email: {dataEmail}</p>
          <p>
            Post: {site.name}, <SettingLink value={legal.registeredOffice} />
          </p>
          <p>
            For anything else, use the <Link href="/contact">contact form</Link>
            .
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalPage
      path="/legal/privacy"
      title="Privacy notice"
      lead={`How ${site.shortName} collects, uses and protects personal data, and how you can see, correct or erase what we hold about you.`}
      breadcrumbs={[{ label: "Privacy notice" }]}
      effective={legalDates.privacy}
      reviewNote={
        <Placeholder needed="this page must be reviewed by the trust's legal advisor before launch" />
      }
      sections={sections}
    />
  );
}
