import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import {
  bySlug,
  getAudiences,
  getGlossary,
  getGuides,
  getProgrammes,
} from "@/lib/content/loaders";
import { contentIcon } from "@/lib/icons";
import { builtAt } from "@/lib/clock";
import { pageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return getAudiences().map((a) => ({ audience: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/for/[audience]">): Promise<Metadata> {
  const audience = bySlug(getAudiences(), (await params).audience);
  if (!audience) return {};
  return pageMetadata({
    title: audience.seo.title,
    description: audience.seo.description,
    path: `/for/${audience.slug}`,
  });
}

/** The closing call to action, matched to what each audience is most likely to do next. */
const closingActions: Record<
  string,
  Parameters<typeof CallToAction>[0] | undefined
> = {
  industry: {
    title: "Work with ASSOCADS",
    text: "Tell us what your organisation is looking for. We will reply and talk it through.",
    primary: { label: "Partner with us", href: "/partner" },
    secondary: { label: "Contact us", href: "/contact" },
  },
  government: {
    title: "Talk to ASSOCADS",
    text: "Tell us about your department and the question you are working on.",
    primary: { label: "Contact us", href: "/contact" },
    secondary: {
      label: "Policy and advisory",
      href: "/programmes/policy-and-advisory",
    },
  },
};

export default async function AudiencePage({
  params,
}: PageProps<"/for/[audience]">) {
  const { audience: audienceSlug } = await params;
  const audience = bySlug(getAudiences(), audienceSlug);
  if (!audience) notFound();

  const programmes = getProgrammes();
  const programmeTitle = (slug: string) =>
    bySlug(programmes, slug)?.title ?? slug;
  const relevant = audience.programmes
    .map((slug) => bySlug(programmes, slug))
    .filter((p) => p !== undefined);
  const guides = getGuides({ now: await builtAt() }).filter((g) =>
    g.audiences.includes(audience.slug),
  );
  const terms = getGlossary().filter((t) =>
    t.audiences.includes(audience.slug),
  );
  const hasReading = guides.length > 0 || terms.length > 0;

  return (
    <>
      <PageHeader
        eyebrow={audience.title}
        title={audience.headline}
        lead={audience.lead}
        actions={
          <ButtonLink href={audience.primaryAction.href} size="large">
            {audience.primaryAction.label}
          </ButtonLink>
        }
        breadcrumbs={[{ label: audience.title }]}
      />

      {/* What you can expect */}
      <Section tone="cloud" aria-labelledby="expect-heading">
        <Container>
          <SectionIntro
            id="expect-heading"
            eyebrow="Plans"
            title="What you can expect"
          />
          <p className="-mt-4 mb-10 max-w-[68ch] text-body text-slate-600 lg:-mt-8 lg:mb-14">
            ASSOCADS is new, and its registration is in progress. These are
            plans, each part of one of our programmes. None has started yet.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {audience.benefits.map((benefit) => (
              <li key={benefit.title}>
                <Link
                  href={`/programmes/${benefit.programme}`}
                  className="group flex h-full flex-col gap-3 rounded-m border border-line bg-paper p-6 transition-colors duration-150 hover:border-indigo"
                >
                  <span className="font-display text-h3 font-semibold text-ink">
                    {benefit.title}
                  </span>
                  <span className="text-body text-slate-600">
                    {benefit.text}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-small font-medium text-indigo">
                    {programmeTitle(benefit.programme)}
                    <ArrowRight
                      aria-hidden="true"
                      size={16}
                      strokeWidth={1.5}
                      className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {audience.notice && (
            <Callout title={audience.notice.title} className="mt-10 max-w-3xl">
              <p>{audience.notice.text}</p>
            </Callout>
          )}
        </Container>
      </Section>

      {/* How to take part */}
      <Section tone="paper" aria-labelledby="steps-heading">
        <Container>
          <SectionIntro id="steps-heading" title="How to take part" />
          <ol className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
            {audience.steps.map((step, i) => (
              <li
                key={step.title}
                className="flex flex-col gap-3 border-t border-line pt-6"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-eyebrow font-medium text-indigo"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-h3 font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="text-body text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <ButtonLink href={audience.primaryAction.href}>
              {audience.primaryAction.label}
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* The most relevant programmes */}
      <Section tone="cloud" aria-labelledby="programmes-heading">
        <Container>
          <SectionIntro
            id="programmes-heading"
            title="Programmes for you"
            action={<TextLink href="/programmes">All programmes</TextLink>}
          />
          <ul
            className={
              relevant.length === 4
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
                : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            }
          >
            {relevant.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/programmes/${p.slug}`}
                  className="group flex h-full flex-col gap-4 rounded-m border border-line bg-paper p-6 transition-colors duration-150 hover:border-indigo"
                >
                  <Icon
                    icon={contentIcon(p.icon)}
                    size={24}
                    className="text-indigo"
                  />
                  <span className="font-display text-h3 font-semibold text-ink group-hover:text-indigo">
                    {p.title}
                  </span>
                  <span className="text-body text-slate-600">{p.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Guides and glossary entries, only once reviewed ones are published */}
      {hasReading && (
        <Section tone="paper" aria-labelledby="reading-heading">
          <Container>
            <SectionIntro id="reading-heading" title="Useful reading" />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {guides.map((g) => (
                <li key={`guide-${g.slug}`}>
                  <Link
                    href={`/guides#${g.slug}`}
                    className="group flex h-full flex-col gap-2 rounded-m border border-line bg-paper p-6 transition-colors duration-150 hover:border-indigo"
                  >
                    <span className="font-mono text-caption text-slate-600 uppercase">
                      Guide
                    </span>
                    <span className="font-display text-h3 font-semibold text-ink group-hover:text-indigo">
                      {g.title}
                    </span>
                    <span className="text-body text-slate-600">
                      {g.summary}
                    </span>
                  </Link>
                </li>
              ))}
              {terms.map((t) => (
                <li key={`term-${t.slug}`}>
                  <Link
                    href={`/glossary#${t.slug}`}
                    className="group flex h-full flex-col gap-2 rounded-m border border-line bg-paper p-6 transition-colors duration-150 hover:border-indigo"
                  >
                    <span className="font-mono text-caption text-slate-600 uppercase">
                      Glossary
                    </span>
                    <span className="font-display text-h3 font-semibold text-ink group-hover:text-indigo">
                      {t.term}
                    </span>
                    <span className="text-body text-slate-600">
                      {t.shortDefinition}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Questions */}
      <Section
        tone={hasReading ? "cloud" : "paper"}
        aria-labelledby="audience-questions-heading"
      >
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionIntro
              id="audience-questions-heading"
              eyebrow="Questions"
              title="Your questions"
              stacked
            />
          </div>
          <Accordion className="lg:col-span-8">
            {audience.faqs.map((faq) => (
              <AccordionItem key={faq.question} question={faq.question}>
                <p>{faq.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>

      <CallToAction {...closingActions[audience.slug]} />
    </>
  );
}
