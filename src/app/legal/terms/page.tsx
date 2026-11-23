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
  title: "Terms of use",
  description:
    "The terms for using the ASSOCADS website: acceptable use, ownership of content, links to other sites, no warranty, and Indian law with courts at Kolkata.",
  path: "/legal/terms",
});

export default function Page() {
  const name = site.shortName;

  const sections: LegalSection[] = [
    {
      id: "about",
      title: "About these terms",
      body: (
        <>
          <p>
            These terms apply to everyone who uses this website, which is run by
            the {site.name} ({name}). {legalStatusLine()} By using the website,
            you accept these terms. If you do not accept them, please do not use
            the website.
          </p>
          <p>
            How we handle personal data is explained separately in the{" "}
            <Link href="/legal/privacy">privacy notice</Link>.
          </p>
        </>
      ),
    },
    {
      id: "acceptable-use",
      title: "Using the website",
      body: (
        <>
          <p>You may use this website for any lawful purpose. You must not:</p>
          <ul>
            <li>break any law in India, or anywhere else, by using it;</li>
            <li>
              try to gain access to parts of the website, or the systems behind
              it, that are not meant to be public;
            </li>
            <li>
              introduce viruses or other harmful code, or try to disrupt the
              website, for example by sending requests at a rate that affects
              other visitors;
            </li>
            <li>
              send spam, false information, or messages that are abusive,
              threatening or unlawful through its forms;
            </li>
            <li>
              pretend to be someone else, or suggest that you act for {name}{" "}
              when you do not.
            </li>
          </ul>
          <p>
            We may block access by anyone who breaks these rules, and report
            unlawful use to the authorities.
          </p>
        </>
      ),
    },
    {
      id: "intellectual-property",
      title: "Content and intellectual property",
      body: (
        <>
          <p>
            Unless a page says otherwise, the text, guides, glossary entries,
            images, design and logo on this website belong to {name}.
          </p>
          <ul>
            <li>
              You may read, print and save pages for your own use, and share
              links to them freely.
            </li>
            <li>
              You may quote short extracts, provided you name {name} as the
              source and link to the page you quote.
            </li>
            <li>
              For any other use, such as republishing a whole guide or using our
              material in a paid product, please ask us first through the{" "}
              <Link href="/contact">contact form</Link>.
            </li>
            <li>
              The {name} name and logo may be used only to refer to {name}{" "}
              accurately. They must never be used to suggest a partnership,
              membership or endorsement without our written permission.
            </li>
          </ul>
          <p>
            Some material belongs to others, such as the typefaces, which are
            used under the SIL Open Font Licence, and the sources cited in our
            guides. Their own terms apply to them.
          </p>
        </>
      ),
    },
    {
      id: "links",
      title: "Links to other websites",
      body: (
        <p>
          This website links to other websites, for example to the sources
          behind a guide. We do not control those websites and are not
          responsible for their content, availability or privacy practices. A
          link does not mean that we endorse a website or the organisation
          behind it. The <Link href="/legal/disclaimer">disclaimer</Link> says
          more about this.
        </p>
      ),
    },
    {
      id: "no-warranty",
      title: "No warranty",
      body: (
        <>
          <p>
            We work to keep this website accurate and available, but we provide
            it &ldquo;as is&rdquo;. We do not promise that it will always be
            available, free of errors or free of harmful code, or that its
            information is complete or up to date.
          </p>
          <p>
            The guides and other information on this website are general
            information, not professional advice. Plans described on the website
            may change. See the <Link href="/legal/disclaimer">disclaimer</Link>
            .
          </p>
        </>
      ),
    },
    {
      id: "liability",
      title: "Limits on our responsibility",
      body: (
        <p>
          As far as the law allows, {name} and its trustees are not responsible
          for any loss or damage that results from using this website or relying
          on its content, including loss of data, income or opportunity. Nothing
          in these terms limits any responsibility that cannot be limited under
          Indian law.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to these terms",
      body: (
        <p>
          We may update these terms from time to time. The date at the top of
          the page shows when the current version took effect. The version on
          the website when you use it is the one that applies.
        </p>
      ),
    },
    {
      id: "law",
      title: "Governing law and jurisdiction",
      body: (
        <p>
          These terms are governed by the laws of India. The courts at Kolkata,
          West Bengal, have exclusive jurisdiction over any dispute arising from
          them or from the use of this website.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact",
      body: (
        <p>
          Questions about these terms: use the{" "}
          <Link href="/contact">contact form</Link>, or email{" "}
          <SettingLink value={site.contact.email} href={(v) => `mailto:${v}`} />
          .
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      title="Terms of use"
      lead={`The rules for using the ${name} website and its content.`}
      breadcrumbs={[{ label: "Terms of use" }]}
      effective={legalDates.terms}
      reviewNote={
        <Placeholder needed="this page must be reviewed by the trust's legal advisor before launch" />
      }
      sections={sections}
    />
  );
}
