import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How ASSOCADS collects, uses and protects personal data.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy notice"
        lead="How ASSOCADS collects, uses and protects personal data."
        breadcrumbs={[{ label: "Privacy notice" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
