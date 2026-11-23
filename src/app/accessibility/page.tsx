import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "How ASSOCADS makes its website usable by everyone, and how to report a problem.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Accessibility"
        lead="Our commitment to making this website usable by everyone, and how to report a problem."
        breadcrumbs={[{ label: "Accessibility" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
