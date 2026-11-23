import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical guides on data science careers, Kolkata and AI policy, each reviewed by a named trustee.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Guides"
        lead="Practical guides on careers, Kolkata and AI policy, each reviewed by a named trustee."
        breadcrumbs={[
          { label: "Resources", href: "/resources" },
          { label: "Guides" },
        ]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
