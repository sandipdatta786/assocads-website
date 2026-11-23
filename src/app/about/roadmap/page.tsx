import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "What ASSOCADS plans to do in the near, middle and long term.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Roadmap"
        lead="What we plan to do in the near, middle and long term. Everything on this page is a plan."
        breadcrumbs={[{ label: "About", href: "/about" }, { label: "Roadmap" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
