import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "The limits of the information published on the ASSOCADS website.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Disclaimer"
        lead="The limits of the information published on this website."
        breadcrumbs={[{ label: "Disclaimer" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
