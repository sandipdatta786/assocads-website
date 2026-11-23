import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Founder Trustees",
  description:
    "The thirteen Founder Trustees who form the first Board of ASSOCADS.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Founder Trustees"
        lead="The thirteen Founder Trustees who form the first Board of ASSOCADS."
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Founder Trustees" },
        ]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
