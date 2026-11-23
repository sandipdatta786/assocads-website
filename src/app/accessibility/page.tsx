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
          <p>So far:</p>
          <ul>
            <li>
              each page has been checked at widths of 320, 360 and 1440 pixels,
              including that nothing scrolls sideways at 320 pixels;
            </li>
            <li>
              the colour pairs have been checked against the WCAG contrast
              ratios;
            </li>
            <li>
              automated tests check every form: that the list of problems
              receives focus, that each message is linked to its field, and that
              the contact form can be sent without JavaScript.
            </li>
          </ul>
          <p>
            Not yet done: an automated accessibility check of every page, a
            keyboard-only walkthrough of every page, testing with screen
            readers, and testing by disabled people. We plan to carry out a full
            audit to WCAG 2.2 level AA before launch, and we will update this
            statement with what it finds.
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
            in before the pages go live.
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
      eyebrow="About this website"
      title="Accessibility statement"
      lead={`How ${name} makes this website usable by everyone, what has been tested, and how to report a problem.`}
      breadcrumbs={[{ label: "Accessibility" }]}
      effective={legalDates.accessibility}
      reviewNote={
        <Placeholder needed="this page must be reviewed by the trust's legal advisor before launch" />
      }
      sections={sections}
    />
  );
}
