import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Communities",
  description:
    "ASSOCADS Special Interest Groups and chapters, and how to tell us what interests you.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="Communities"
        lead="Special Interest Groups and chapters that the Board may set up under the trust deed."
        breadcrumbs={[{ label: "Communities" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
