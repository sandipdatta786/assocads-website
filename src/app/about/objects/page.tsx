import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Aims and objects",
  description:
    "The sixteen objects in the ASSOCADS trust deed, written in plain English.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Aims and objects"
        lead="The sixteen objects in the ASSOCADS trust deed, written in plain English."
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Aims and objects" },
        ]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
