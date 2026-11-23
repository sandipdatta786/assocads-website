import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms that apply when you use the ASSOCADS website.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of use"
        lead="The terms that apply when you use this website."
        breadcrumbs={[{ label: "Terms of use" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
