import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "How to get in touch with ASSOCADS, the Association for AI and Data Science.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact"
        lead="How to get in touch with ASSOCADS."
        breadcrumbs={[{ label: "Contact" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
