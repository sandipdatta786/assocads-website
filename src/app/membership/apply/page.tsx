import type { Metadata } from "next";
import { RegisterInterestForm } from "@/components/forms/RegisterInterestForm";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { getProgrammes } from "@/lib/content/loaders";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Register your interest in membership",
  description:
    "Register your interest in ASSOCADS membership. Membership opens after registration, and we will write to you when applications open.",
  path: "/membership/apply",
});

export default function Page() {
  const programmes = getProgrammes().map((p) => ({
    value: p.slug,
    label: p.title,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Register your interest"
        lead="Membership opens after the trust is registered and the Board has adopted its bye-laws. Tell us you would like to join, and we will write to you when applications open. Registering interest is not an application for membership, and you can ask us to erase your details at any time."
        breadcrumbs={[
          { label: "Membership", href: "/membership" },
          { label: "Register your interest" },
        ]}
      />
      <Section tone="cloud" spacing="none" className="py-12 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="rounded-l bg-paper p-6 sm:p-10 lg:col-span-8">
            <RegisterInterestForm programmes={programmes} />
          </div>
          <aside
            aria-labelledby="apply-aside-heading"
            className="flex flex-col gap-4 lg:col-span-4"
          >
            <h2
              id="apply-aside-heading"
              className="font-display text-h3 font-semibold text-ink"
            >
              What happens next
            </h2>
            <ul className="flex flex-col gap-3 text-body text-slate-600">
              <li>
                Registering your interest is free and commits you to nothing.
              </li>
              <li>
                It is not an application. Applications open once the Board has
                fixed the fees.
              </li>
              <li>
                We use your details only to contact you about membership, and to
                send news if you ask for it.
              </li>
            </ul>
            <TextLink href="/membership">How membership works</TextLink>
          </aside>
        </Container>
      </Section>
    </>
  );
}
