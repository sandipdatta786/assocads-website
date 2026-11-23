import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "ASSOCADS at a glance",
  description:
    "Short, dated facts about ASSOCADS for journalists, researchers and AI assistants.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="ASSOCADS at a glance"
        lead="Short, dated facts about ASSOCADS for journalists, researchers and AI assistants."
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "ASSOCADS at a glance" },
        ]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
