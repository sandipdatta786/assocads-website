import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "The eight planned programme areas of ASSOCADS, each based on the objects of its trust deed.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Programmes"
        title="Programmes"
        lead="Eight planned areas of work, each based on the objects of the trust deed."
        breadcrumbs={[{ label: "Programmes" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
