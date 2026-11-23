import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Partner with us",
  description:
    "How universities, companies and government bodies can work with ASSOCADS.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="Partner with us"
        lead="How universities, companies and government bodies can work with ASSOCADS."
        breadcrumbs={[{ label: "Partner with us" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
