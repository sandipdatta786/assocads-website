import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section, type Tone } from "@/components/ui/Section";
import { Heading, Lead } from "@/components/ui/Typography";
import { site } from "@/config/site";

type Action = { label: string; href: string };

type CallToActionProps = {
  title?: string;
  text?: ReactNode;
  primary?: Action;
  secondary?: Action;
  tone?: Tone;
};

/** The closing band reused at the bottom of pages. */
export function CallToAction({
  title = "Be part of ASSOCADS from the start",
  text = "Membership opens after registration. Register your interest now and we will tell you when it does.",
  primary = { label: "Register your interest", href: site.joinLink.href },
  secondary = { label: "Partner with us", href: "/partner" },
  tone = "tint",
}: CallToActionProps) {
  return (
    <Section tone={tone}>
      <Container className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="flex max-w-2xl flex-col gap-4">
          <Heading level={2}>{title}</Heading>
          {text && <Lead>{text}</Lead>}
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={primary.href} size="large">
            {primary.label}
          </ButtonLink>
          {secondary && (
            <ButtonLink href={secondary.href} size="large" variant="secondary">
              {secondary.label}
            </ButtonLink>
          )}
        </div>
      </Container>
    </Section>
  );
}
