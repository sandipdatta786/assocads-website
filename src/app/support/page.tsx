import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Support ASSOCADS",
  description:
    "How you can support ASSOCADS, and what it can and cannot accept before registration.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="Support ASSOCADS"
        lead="How you can support our work, and what we can and cannot accept before registration."
        breadcrumbs={[{ label: "Support ASSOCADS" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
