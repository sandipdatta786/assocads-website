import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: `${site.shortName} | ${site.name}` },
  description: site.description,
};

export default function HomePage() {
  return (
    <>
      <PageHeader
        eyebrow={site.shortName}
        title={site.name}
        lead={site.description}
        actions={
          <>
            <ButtonLink href="/about" size="large">
              About ASSOCADS
            </ButtonLink>
            <ButtonLink
              href={site.joinLink.href}
              size="large"
              variant="secondary"
            >
              Register your interest
            </ButtonLink>
          </>
        }
      />
      <Container className="pb-24">
        <Placeholder needed="home page content, built in a later playbook step" />
      </Container>
    </>
  );
}
