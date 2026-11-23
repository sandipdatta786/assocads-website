import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { GuideCard } from "@/components/guides/GuideCard";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { builtAt } from "@/lib/clock";
import { getGuides } from "@/lib/content/loaders";
import { themeDescriptions, themeLabels, themeOrder } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Guides on AI and Data Science careers and policy",
  description:
    "Independent guides on data science careers, courses and employers in Kolkata, and Indian AI policy. Each is sourced and reviewed by a named trustee.",
  path: "/guides",
});

export default async function Page() {
  const guides = getGuides({ now: await builtAt() });
  const groups = themeOrder
    .map((theme) => ({
      theme,
      guides: guides
        .filter((g) => g.theme === theme)
        .sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .filter((g) => g.guides.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Guides"
        lead="Practical, sourced guides on careers, Kolkata and AI policy. Every guide lists its sources and is reviewed by a named trustee before it is published."
        breadcrumbs={[
          { label: "Resources", href: "/resources" },
          { label: "Guides" },
        ]}
      />

      {groups.length > 0 ? (
        <>
          {groups.length > 1 && (
            <Section tone="paper" spacing="none" className="pb-10">
              <Container>
                <nav aria-label="Themes">
                  <ul className="flex flex-wrap gap-2">
                    {groups.map((g) => (
                      <li key={g.theme}>
                        <a
                          href={`#${g.theme}`}
                          className="inline-flex min-h-11 items-center rounded-pill border border-slate-500 px-4 text-small font-medium text-ink transition-colors duration-150 hover:border-ink"
                        >
                          {themeLabels[g.theme]}
                          <span className="ml-2 text-slate-600">
                            {g.guides.length}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Container>
            </Section>
          )}
          {groups.map((g, i) => (
            <Section
              key={g.theme}
              id={g.theme}
              tone={i % 2 === 0 ? "cloud" : "paper"}
              aria-labelledby={`${g.theme}-heading`}
              className="scroll-mt-20"
            >
              <Container>
                <SectionIntro
                  id={`${g.theme}-heading`}
                  title={themeLabels[g.theme]}
                  lead={themeDescriptions[g.theme]}
                />
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {g.guides.map((guide) => (
                    <li key={guide.slug}>
                      <GuideCard guide={guide} />
                    </li>
                  ))}
                </ul>
              </Container>
            </Section>
          ))}
        </>
      ) : (
        <Section tone="paper" spacing="none" className="pb-16 lg:pb-28">
          <Container>
            <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-l border border-line bg-cloud p-8 sm:p-10 lg:p-14">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 -z-10 w-1/2 [mask-image:linear-gradient(to_right,transparent,black)] opacity-60"
              >
                <DotGrid />
              </div>
              <Icon icon={BookOpen} size={32} className="text-indigo" />
              <div className="flex max-w-2xl flex-col gap-4">
                <h2 className="font-display text-h2 font-semibold text-ink">
                  The first guides are in preparation
                </h2>
                <p className="text-body text-slate-600">
                  Each guide lists its sources and is published only after a
                  named trustee has reviewed it. They will appear here under
                  four themes:{" "}
                  {themeOrder.map((t) => themeLabels[t]).join(", ")}.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <TextLink href="/glossary">Glossary</TextLink>
                <TextLink href="/insights">Insights</TextLink>
              </div>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
