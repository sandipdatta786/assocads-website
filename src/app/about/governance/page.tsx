import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Governance",
  description:
    "How ASSOCADS is run: its Board of Trustees, the principles that bind the trust, and its documents.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Governance"
        lead="How the trust is run: the Board of Trustees, the principles that bind it, and its documents."
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Governance" },
        ]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
