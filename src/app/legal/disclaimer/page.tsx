import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { Placeholder } from "@/components/ui/Callout";
import {
  canMentionTaxExemption,
  legalStatusLine,
  site,
  taxStatusLine,
} from "@/config/site";
import { faqAnchor } from "@/lib/content/faqs";
import { getFaqs } from "@/lib/content/loaders";
import { legalDates } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Disclaimer",
  description:
    "ASSOCADS guides are general information, not legal, financial or career advice. Plans may change, and mentioning an organisation is not an endorsement.",
  path: "/legal/disclaimer",
});

export default function Page() {
  const name = site.shortName;
  const affiliation = getFaqs().find((f) =>
    f.question.startsWith(`Is ${name} affiliated`),
  );

  const sections: LegalSection[] = [
    {
      id: "general-information",
      title: "General information, not advice",
      body: (
        <>
          <p>
            The <Link href="/guides">guides</Link>,{" "}
            <Link href="/glossary">glossary</Link>,{" "}
            <Link href="/insights">insights</Link> and other information on this
            website are general information about artificial intelligence, data
            science and related careers and policy. They are not legal,
            financial, tax, investment or career advice, and they do not take
            your own circumstances into account.
          </p>
          <p>
            Before you make a decision that matters, such as a choice of course,
            job, investment or legal step, take advice from a qualified
            professional who knows your situation.
          </p>
          <p>
            Every guide is reviewed by a named trustee before it is published,
            and shows when it was last reviewed. Laws, schemes, courses and
            technologies change quickly, so a guide may be out of date by the
            time you read it. Where a guide cites a source, the source is the
            authority.
          </p>
        </>
      ),
    },
    {
      id: "plans",
      title: "Plans may change",
      body: (
        <>
          <p>
            {legalStatusLine()} Much of this website describes what {name} plans
            to do: its programmes, events, communities, membership categories
            and the way it will be run. These plans depend on registration, on
            decisions of the Board of Trustees, and on resources, and they may
            change or be withdrawn.
          </p>
          <p>
            Nothing described as a plan is an offer or a promise. Membership,
            fees, programmes and events are confirmed only when the website says
            so.
          </p>
        </>
      ),
    },
    {
      id: "no-endorsement",
      title: "No endorsement",
      body: (
        <>
          <p>
            When this website mentions or links to an organisation, product,
            course, tool, government scheme or person, it does so for
            information only. It does not mean that {name} endorses them, or
            that they endorse, support, fund or are affiliated with {name}.
          </p>
          <p>
            {name} names an organisation as a partner, member or supporter only
            with that organisation&rsquo;s written permission.
            {affiliation && (
              <>
                {" "}
                See also:{" "}
                <Link href={`/faq#${faqAnchor(affiliation.question)}`}>
                  {affiliation.question}
                </Link>
              </>
            )}
          </p>
        </>
      ),
    },
    {
      id: "tax",
      title: "Tax and donations",
      body: (
        <p>
          {canMentionTaxExemption("eightyG")
            ? taxStatusLine().replace(/^Yes\. /, "")
            : `${taxStatusLine().replace(/^Not at present\. /, "")} Nothing on this website should be read as a claim that a payment to ${name} qualifies for a tax deduction.`}
        </p>
      ),
    },
    {
      id: "corrections",
      title: "Corrections",
      body: (
        <p>
          If you find a mistake on this website, please tell us through the{" "}
          <Link href="/contact">contact form</Link>, so that we can correct it.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Disclaimer"
      lead={`What the information on the ${name} website is, and what it is not.`}
      breadcrumbs={[{ label: "Disclaimer" }]}
      effective={legalDates.disclaimer}
      reviewNote={
        <Placeholder needed="this page must be reviewed by the trust's legal advisor before launch" />
      }
      sections={sections}
    />
  );
}
