import Link from "next/link";
import { AboutLinks } from "@/components/sections/AboutLinks";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { WithPlaceholders } from "@/components/ui/WithPlaceholders";
import { site } from "@/config/site";
import { keyFacts } from "@/lib/facts";
import { pageMetadata } from "@/lib/seo/metadata";
import { aboutPage } from "@/lib/seo/schema";

export const metadata = pageMetadata({
  title: "At a glance",
  description:
    "Short, dated facts about ASSOCADS, the Association for AI and Data Science: what it is, its legal status, where it is based and who runs it.",
  path: "/about/facts",
});

const linkClass = "font-medium text-indigo underline-offset-4 hover:underline";

export default function FactsPage() {
  const facts = keyFacts();

  return (
    <>
      <JsonLd
        items={[
          aboutPage({
            path: "/about/facts",
            name: "ASSOCADS at a glance",
            description: String(metadata.description),
            dateModified: site.updated.facts,
          }),
        ]}
      />
      <PageHeader
        updated={site.updated.facts}
        eyebrow="About"
        title="ASSOCADS at a glance"
        lead={`${site.description} This page sets out short, dated facts about its legal status, location, trustees and plans, and the organisations it is not connected with, each written to be quoted on its own.`}
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "At a glance" },
        ]}
      />

      <Section tone="paper" spacing="none" className="pb-16 lg:pb-28">
        <Container>
          <dl className="border-t-2 border-ink">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="grid gap-2 border-b border-line py-6 md:grid-cols-12 md:gap-8"
              >
                <dt className="font-display text-h3 font-semibold text-ink md:col-span-4 lg:col-span-3">
                  {fact.label}
                </dt>
                <dd className="max-w-[68ch] text-body text-slate-600 md:col-span-8 lg:col-span-9">
                  <WithPlaceholders text={fact.text} />
                  {fact.link && (
                    <>
                      {" "}
                      <Link href={fact.link.href} className={linkClass}>
                        {fact.link.label}
                      </Link>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Questions page="/about/facts" />
      <AboutLinks current="/about/facts" />
      <CallToAction />
    </>
  );
}
