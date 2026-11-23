import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Questions",
  description:
    "Answers to common questions about ASSOCADS, its legal status, membership, money and governance.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Questions"
        title="Questions"
        lead="Answers about ASSOCADS, its legal status, membership, money and governance."
        breadcrumbs={[{ label: "Questions" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
