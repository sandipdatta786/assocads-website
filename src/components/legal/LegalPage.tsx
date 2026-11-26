import type { ReactNode } from "react";
import { PageHeader } from "@/components/sections/PageHeader";
import {
  RelatedLinks,
  type RelatedLink,
} from "@/components/sections/RelatedLinks";
import { Callout, Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { isPlaceholderValue, placeholderNeed } from "@/config/site";
import { formatShortDate } from "@/lib/events";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** The pages about how the site and the trust treat visitors. Each legal
    page links to the others, and to the contact page. */
const SITE_INFORMATION: RelatedLink[] = [
  {
    label: "Privacy notice",
    href: "/legal/privacy",
    description: "What the forms collect, who processes it, and your rights.",
  },
  {
    label: "Terms of use",
    href: "/legal/terms",
    description: "The rules for using this website and its content.",
  },
  {
    label: "Disclaimer",
    href: "/legal/disclaimer",
    description: "General information, not advice. Plans may change.",
  },
  {
    label: "Code of Conduct",
    href: "/membership/code-of-conduct",
    description:
      "How we expect everyone to behave, and how to raise a concern.",
  },
  {
    label: "Accessibility statement",
    href: "/accessibility",
    description: "The standard we aim for, and how to report a problem.",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Questions about anything on these pages.",
  },
];

/** A setting such as an email address: a link when it is filled in, or a
    visible placeholder while it is missing. */
export function SettingLink({
  value,
  href,
}: {
  value: string;
  href?: (v: string) => string;
}) {
  if (isPlaceholderValue(value))
    return <Placeholder needed={placeholderNeed(value)} />;
  return href ? <a href={href(value)}>{value}</a> : <>{value}</>;
}

/** The shared layout for the privacy notice, terms, disclaimer and
    accessibility statement: a review note, the effective date, a contents
    list and numbered sections. */
export function LegalPage({
  eyebrow = "Legal",
  title,
  lead,
  breadcrumbs,
  effective,
  reviewNote,
  reviewTitle = "Draft for legal review",
  effectiveLabel = "Effective from",
  sections,
  path,
}: {
  eyebrow?: string;
  title: string;
  lead: string;
  breadcrumbs: { label: string; href?: string }[];
  /** ISO date, for example "2026-11-23". */
  effective: string;
  /** The "must be reviewed by the legal advisor" placeholder. Each page
      passes it itself, so that the pre-launch content check finds it.
      Leave it out once the advisor has approved the page. */
  reviewNote?: ReactNode;
  /** The review note's heading. */
  reviewTitle?: string;
  /** The words before the date, for a page not yet in force. */
  effectiveLabel?: string;
  sections: LegalSection[];
  /** This page's path, left out of the related pages. */
  path: string;
}) {
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        breadcrumbs={breadcrumbs}
      />
      <Container className="grid gap-10 pb-24 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-4 lg:col-span-8 lg:col-start-5 lg:row-start-1">
          {reviewNote && (
            <Callout variant="status" title={reviewTitle}>
              <div className="mt-2">{reviewNote}</div>
            </Callout>
          )}
          <p className="text-small text-slate-600">
            {effectiveLabel}{" "}
            <time dateTime={effective} className="font-medium text-ink">
              {formatShortDate(effective)}
            </time>
          </p>
        </div>

        <nav
          aria-labelledby="contents-heading"
          className="lg:col-span-4 lg:row-span-2 lg:row-start-1"
        >
          <div className="flex flex-col gap-3 rounded-l bg-cloud p-5 lg:sticky lg:top-24">
            <h2
              id="contents-heading"
              className="font-mono text-eyebrow font-medium text-slate-600 uppercase"
            >
              On this page
            </h2>
            <ol className="flex flex-col gap-1 text-small">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex min-h-11 items-center gap-2 font-medium text-indigo underline-offset-4 hover:underline lg:min-h-9"
                  >
                    <span className="w-5 shrink-0 font-mono text-caption text-slate-600">
                      {i + 1}
                    </span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="prose min-w-0 lg:col-span-8 lg:col-start-5 [&>section:first-child>h2]:mt-0">
          {sections.map((s, i) => (
            <section key={s.id} aria-labelledby={s.id} className="[&>*+*]:mt-5">
              <h2 id={s.id} className="scroll-mt-24 font-display">
                {i + 1}. {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </div>
      </Container>
      <RelatedLinks
        id="site-information"
        title="More about how this website works"
        links={SITE_INFORMATION.filter((l) => l.href !== path)}
        tone="cloud"
      />
    </>
  );
}
