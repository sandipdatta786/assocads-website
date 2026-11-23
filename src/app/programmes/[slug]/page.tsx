import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Tag";
import { Heading, Prose } from "@/components/ui/Typography";
import {
  bySlug,
  getAudiences,
  getDeedObjects,
  getProgrammes,
} from "@/lib/content/loaders";
import { loadMdxBody } from "@/lib/content/mdx";
import { contentIcon } from "@/lib/icons";
import { programmeStatusText } from "@/lib/programmes";
import { pageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return getProgrammes().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/programmes/[slug]">): Promise<Metadata> {
  const programme = bySlug(getProgrammes(), (await params).slug);
  if (!programme) return {};
  return pageMetadata({
    title: programme.seo.title,
    description: programme.seo.description,
    path: `/programmes/${programme.slug}`,
  });
}

export default async function ProgrammePage({
  params,
}: PageProps<"/programmes/[slug]">) {
  const { slug } = await params;
  const programmes = getProgrammes();
  const index = programmes.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const programme = programmes[index];

  const previous = programmes[index - 1];
  const next = programmes[index + 1];
  const objects = getDeedObjects().filter((o) =>
    programme.deedObjects.includes(o.number),
  );
  const audiences = getAudiences().filter((a) =>
    programme.audiences.includes(a.slug),
  );
  const related = programme.related
    .map((relatedSlug) => bySlug(programmes, relatedSlug))
    .filter((p) => p !== undefined);
  const Body = programme.body.trim()
    ? await loadMdxBody("programmes", programme.slug)
    : null;
  const halves = programme.includes.length > 1;

  return (
    <>
      <PageHeader
        eyebrow="Programme"
        title={programme.title}
        lead={programme.purpose}
        actions={
          <Badge
            status={programme.status === "active" ? "open" : "planned"}
            label={programme.status === "active" ? "Active" : "Planned"}
          />
        }
        breadcrumbs={[
          { label: "Programmes", href: "/programmes" },
          { label: programme.title },
        ]}
      />

      {/* What this will include */}
      <Section tone="cloud" aria-labelledby="includes-heading">
        <Container>
          <SectionIntro
            id="includes-heading"
            eyebrow="Plans"
            title="What this will include"
          />
          <p className="-mt-4 mb-10 max-w-[68ch] text-body text-slate-600 lg:-mt-8 lg:mb-14">
            {programme.summary}
          </p>
          <div
            className={
              halves ? "grid gap-4 md:grid-cols-2 lg:gap-6" : "flex flex-col"
            }
          >
            {programme.includes.map((group, groupIndex) => (
              <div
                key={group.title ?? groupIndex}
                className={
                  halves
                    ? "flex flex-col gap-5 rounded-l border border-line bg-paper p-6 sm:p-8"
                    : undefined
                }
              >
                {group.title && (
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-h3 font-semibold text-ink">
                      {group.title}
                    </h3>
                    {group.intro && (
                      <p className="text-body text-slate-600">{group.intro}</p>
                    )}
                  </div>
                )}
                <ul
                  className={
                    halves
                      ? "flex flex-col gap-3"
                      : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
                  }
                >
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className={
                        halves
                          ? "flex gap-3 text-body text-slate-600"
                          : "flex gap-3 rounded-m border border-line bg-paper p-5 text-body text-slate-600"
                      }
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] size-1.5 shrink-0 rounded-pill bg-indigo"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-10 text-small text-slate-600">
            Based on the trust deed:{" "}
            {objects.map((o, i) => (
              <span key={o.number}>
                {i > 0 && ", "}
                <Link
                  href={`/about/objects#object-${o.number}`}
                  className="font-medium text-indigo underline-offset-4 hover:underline"
                >
                  object {o.number}, {o.title.toLowerCase()}
                </Link>
              </span>
            ))}
            .
          </p>
        </Container>
      </Section>

      {/* Extra sections written in the MDX body, for programmes that need them */}
      {Body && (
        <Section tone="paper">
          <Container>
            <Prose>
              <Body />
            </Prose>
          </Container>
        </Section>
      )}

      {/* Who it is for */}
      <Section tone="paper" aria-labelledby="audiences-heading">
        <Container>
          <SectionIntro id="audiences-heading" title="Who it is for" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {audiences.map((audience) => (
              <li key={audience.slug}>
                <Link
                  href={`/for/${audience.slug}`}
                  className="group flex h-full flex-col gap-2 rounded-m border border-line bg-paper p-6 transition-colors duration-150 hover:border-indigo"
                >
                  <span className="flex items-center justify-between gap-3 font-display text-h3 font-semibold text-ink">
                    {audience.title}
                    <ArrowRight
                      aria-hidden="true"
                      size={20}
                      strokeWidth={1.5}
                      className="shrink-0 text-indigo transition-transform duration-150 group-hover:translate-x-0.5"
                    />
                  </span>
                  <span className="text-body text-slate-600">
                    {audience.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Status and how to get involved */}
      <Section tone="ink">
        <Container className="grid gap-12 md:grid-cols-2 lg:gap-16">
          <section
            aria-labelledby="status-heading"
            className="flex flex-col gap-4"
          >
            <p className="font-mono text-eyebrow font-medium text-tone-faint uppercase">
              Status
            </p>
            <Heading level={2} id="status-heading">
              {programme.status === "active" ? "Under way" : "Planned"}
            </Heading>
            <p className="text-body text-slate-400">
              {programmeStatusText(programme.status)}
            </p>
          </section>
          <section
            aria-labelledby="involved-heading"
            className="flex flex-col gap-4"
          >
            <p className="font-mono text-eyebrow font-medium text-tone-faint uppercase">
              Get involved
            </p>
            <Heading level={2} id="involved-heading">
              How to get involved
            </Heading>
            <p className="text-body text-slate-400">
              {programme.involvement.text}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {programme.involvement.actions.map((action, i) => (
                <ButtonLink
                  key={action.href}
                  href={action.href}
                  variant={i === 0 ? "primary" : "secondary"}
                >
                  {action.label}
                </ButtonLink>
              ))}
            </div>
          </section>
        </Container>
      </Section>

      {/* Questions */}
      <Section tone="cloud" aria-labelledby="programme-questions-heading">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionIntro
              id="programme-questions-heading"
              eyebrow="Questions"
              title="Questions about this programme"
              stacked
            />
          </div>
          <Accordion className="lg:col-span-8">
            {programme.faqs.map((faq) => (
              <AccordionItem key={faq.question} question={faq.question}>
                <p>{faq.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>

      {/* Related programmes, then previous and next */}
      <Section tone="paper" aria-labelledby="related-heading">
        <Container>
          <SectionIntro id="related-heading" title="Related programmes" />
          <ul className="grid gap-4 md:grid-cols-3 lg:gap-6">
            {related.map((p) => (
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

          <nav
            aria-label="Previous and next programme"
            className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={`/programmes/${previous.slug}`}
                className="group -m-2 flex flex-col gap-1 rounded-m p-2"
              >
                <span className="inline-flex items-center gap-1.5 text-small text-slate-600">
                  <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.5} />
                  Previous programme
                </span>
                <span className="font-display text-h3 font-semibold text-ink group-hover:text-indigo group-hover:underline">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" className="hidden sm:block" />
            )}
            {next && (
              <Link
                href={`/programmes/${next.slug}`}
                className="group -m-2 flex flex-col gap-1 rounded-m p-2 sm:items-end sm:text-right"
              >
                <span className="inline-flex items-center gap-1.5 text-small text-slate-600">
                  Next programme
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
                </span>
                <span className="font-display text-h3 font-semibold text-ink group-hover:text-indigo group-hover:underline">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        </Container>
      </Section>
    </>
  );
}
