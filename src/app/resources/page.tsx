import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "ASSOCADS guides, glossary, documents and brand kit in one place.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Resources"
        lead="Guides, the glossary, documents and the brand kit, in one place."
        breadcrumbs={[{ label: "Resources" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
