import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "The four kinds of ASSOCADS membership set out in the trust deed, and how to register your interest.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Membership"
        lead="The four kinds of membership set out in the trust deed. Fees have not been fixed yet."
        breadcrumbs={[{ label: "Membership" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
