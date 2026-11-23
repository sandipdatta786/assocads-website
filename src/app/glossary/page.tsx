import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Plain-English definitions of terms in artificial intelligence and data science.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Glossary"
        lead="Plain-English definitions of terms in AI and data science."
        breadcrumbs={[
          { label: "Resources", href: "/resources" },
          { label: "Glossary" },
        ]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
