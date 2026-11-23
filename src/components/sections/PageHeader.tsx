import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { LastUpdated } from "@/components/ui/LastUpdated";
import { Section, type Tone } from "@/components/ui/Section";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  lead?: ReactNode;
  /** YYYY-MM-DD: shows "Last updated" under the lead. */
  updated?: string;
  /** Buttons or links shown under the lead. */
  actions?: ReactNode;
  /** Trail to this page. "Home" is added at the start automatically. */
  breadcrumbs?: Crumb[];
  tone?: Tone;
};

/** The top of every inner page. Holds the page's only h1. */
export function PageHeader({
  title,
  eyebrow,
  lead,
  updated,
  actions,
  breadcrumbs,
  tone = "paper",
}: PageHeaderProps) {
  return (
    <Section tone={tone} spacing="none" className="pt-6 pb-14 lg:pt-8 lg:pb-20">
      <Container>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, ...breadcrumbs]}
            className="mb-8 lg:mb-12"
          />
        )}
        <div className="flex max-w-[52rem] flex-col gap-5">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <Heading level={1} size="display-l">
            {title}
          </Heading>
          {lead && <Lead>{lead}</Lead>}
          {updated && <LastUpdated date={updated} />}
          {actions && (
            <div className="mt-3 flex flex-wrap gap-3">{actions}</div>
          )}
        </div>
      </Container>
    </Section>
  );
}
