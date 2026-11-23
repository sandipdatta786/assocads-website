import type { Metadata } from "next";
import { site } from "@/config/site";
import { FaqBrowser, type FaqGroup } from "@/components/faq/FaqBrowser";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { faqAnchor, faqCategories } from "@/lib/content/faqs";
import { getFaqs } from "@/lib/content/loaders";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { faqPage } from "@/lib/seo/schema";

export const metadata: Metadata = pageMetadata({
  title: "Frequently asked questions",
  description:
    "Answers about ASSOCADS: its legal status, membership, programmes and events, partnerships, donations, and how the website handles your data.",
  path: "/faq",
});

export default function Page() {
  const faqs = getFaqs();
  const groups: FaqGroup[] = faqCategories
    .map((c) => ({
      id: c.value,
      label: c.label,
      items: faqs
        .filter((f) => f.category === c.value)
        .map((f) => ({
          id: faqAnchor(f.question),
          question: f.question,
          answer: f.answer,
        })),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      {/* Every question shown on this page, in the order shown. */}
      <JsonLd
        items={[
          faqPage(
            "/faq",
            groups.flatMap((g) => g.items),
          ),
        ]}
      />
      <PageHeader
        eyebrow="Questions"
        title="Frequently asked questions"
        lead={`This page answers the questions people ask most often about ${site.shortName}, the ${site.name}: what it is, its legal status, who can join, what it plans to do, how to partner with or support it, and how this website treats your data. Each answer is short and stands on its own.`}
        breadcrumbs={[{ label: "Questions" }]}
      />
      <Container className="pb-24">
        <FaqBrowser groups={groups} />
      </Container>
      <CallToAction
        title="Did not find your answer?"
        text="Send us your question. Choose a topic on the form so that it reaches the right person."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Read the key facts", href: "/about/facts" }}
      />
    </>
  );
}
