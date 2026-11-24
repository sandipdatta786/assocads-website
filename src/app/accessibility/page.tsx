import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalPage,
  SettingLink,
  type LegalSection,
} from "@/components/legal/LegalPage";
import { Placeholder } from "@/components/ui/Callout";
import { site } from "@/config/site";
import { legalDates } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Accessibility statement",
  description:
    "ASSOCADS aims for its website to meet WCAG 2.2 level AA. What has been tested, what is known not to work well yet, and how to report a problem.",
  path: "/accessibility",
});

export default function Page() {
  const name = site.shortName;
  const { contact } = site;

  const sections: LegalSection[] = [
    {
      id: "aim",
      title: "Our aim",
      body: (
        <p>
          {name} wants everyone to be able to use this website, including people
          who use a screen reader, a keyboard instead of a mouse, screen
          magnification, or a slow mobile connection. We aim to meet the{" "}
          <a href="https://www.w3.org/TR/WCAG22/">
            Web Content Accessibility Guidelines (WCAG) 2.2
          </a>{" "}
          at level AA.
        </p>
      ),
    },
    {
      id: "how-built",
      title: "How the website is built for access",
      body: (
        <ul>
          <li>
            Text and background colours come from a fixed set of pairs, each
            checked against the WCAG contrast ratio.
          </li>
          <li>
            Pages work on screens as narrow as 320 pixels without scrolling
            sideways, and text can be enlarged.
          </li>
          <li>
            Every page has one main heading and headings in order, a link to
            skip straight to the content, and a visible outline on whatever has
            keyboard focus.
          </li>
          <li>
            Expanding questions use the browser&rsquo;s own controls, so they
            work with a keyboard and without JavaScript.
          </li>
          <li>
            Form fields have visible labels. When something is missing, a list
            of problems appears at the top of the form and receives focus, and
            each message is linked to its field.
          </li>
          <li>Forms can be sent with JavaScript switched off.</li>
          <li>
            Animation is reduced when your device asks for reduced motion.
          </li>
        </ul>
      ),
    },
    {
      id: "tested",
      title: "What has been tested",
      body: (
        <>
          <p>
            In November 2026 we audited the website against WCAG 2.2 level AA
            and fixed what we found. These checks now run automatically before
            every change goes live:
          </p>
          <ul>
            <li>
              an automated accessibility check (axe-core) of every page, at
              phone width (390 pixels) and desktop width (1440 pixels);
            </li>
            <li>
              that no page scrolls sideways at widths of 320, 360, 390, 414 and
              768 pixels, on phones held sideways, or with text enlarged to
              200%;
            </li>
            <li>
              that buttons, links and form controls on phones are at least 44 by
              44 pixels, and that text in form fields is at least 16 pixels, so
              that phones do not zoom in;
            </li>
            <li>
              keyboard use: the skip link, the menus (including that focus stays
              inside the mobile menu and that Escape closes it), the expanding
              questions, a visible outline on everything that can receive focus,
              and that the sticky header never hides it;
            </li>
            <li>
              every form: that the list of problems receives focus, that each
              message is linked to its field, and that the contact form can be
              sent without JavaScript.
            </li>
          </ul>
          <p>
            We also checked by script that every combination of text and
            background colour in use, including when hovered, focused or empty,
            is one of the approved pairs in our brand guide, each of which meets
            the WCAG contrast ratio.
          </p>
          <p>
            Not yet done: testing with screen readers (such as NVDA, VoiceOver
            and TalkBack), testing in browsers other than Chrome, and testing by
            disabled people. We plan to do these before launch and will update
            this statement with what they find.
          </p>
        </>
      ),
    },
    {
      id: "limitations",
      title: "Known limitations",
      body: (
        <ul>
          <li>
            Some pages still show marked gaps, written as &ldquo;[PLACEHOLDER:
            …]&rdquo;, where information is not yet available. These are filled
            in before the site launches on its own domain.
          </li>
          <li>
            The security check on forms, Cloudflare Turnstile, usually finishes
            without any action. If it asks you to do something you cannot do,
            email us instead, using the address below.
          </li>
          <li>
            Documents such as reports and policies are not yet published. When
            they are, we aim to publish them as accessible pages or tagged PDF
            files.
          </li>
          <li>
            Some notes and lists of sources use a smaller text size (15 pixels).
            Main text is 17 pixels. All text can be enlarged with your browser.
          </li>
          <li>
            Wide tables in our guides scroll sideways inside their own box on
            phones. Links inside table cells are smaller than 44 pixels, but at
            least 24 pixels, as WCAG 2.2 requires.
          </li>
          <li>
            Links to other websites lead to pages we do not control, which may
            not meet the same standard.
          </li>
        </ul>
      ),
    },
    {
      id: "report",
      title: "Report a problem",
      body: (
        <>
          <p>
            If something on this website is hard to use, or you need information
            in a different format, please tell us. Say which page it was on and
            what happened, and, if you can, which device, browser and assistive
            technology you use.
          </p>
          <ul>
            <li>
              Use the <Link href="/contact">contact form</Link> and choose
              &ldquo;Something else&rdquo;.
            </li>
            <li>
              Or email{" "}
              <SettingLink value={contact.email} href={(v) => `mailto:${v}`} />.
            </li>
          </ul>
          <p>
            We aim to reply <SettingLink value={contact.replyTime} />.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalPage
      path="/accessibility"
      eyebrow="About this website"
      title="Accessibility statement"
      lead={`${name} aims for this website to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA, so that it works with a screen reader, a keyboard, screen magnification or a slow mobile connection. This statement explains how the site is built for access, what has been tested, its known limitations and how to report a problem.`}
      breadcrumbs={[{ label: "Accessibility" }]}
      effective={legalDates.accessibility}
      reviewNote={
        <Placeholder needed="this page must be reviewed by the trust's legal advisor before launch" />
      }
      sections={sections}
    />
  );
}
