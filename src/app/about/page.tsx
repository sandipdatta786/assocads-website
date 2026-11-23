import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About ASSOCADS",
  description:
    "Why ASSOCADS, the Association for AI and Data Science, was set up, what it aims to do and how it is run.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About ASSOCADS"
        lead="Why the Association for AI and Data Science was set up, what it aims to do, and how it is run."
        breadcrumbs={[{ label: "About ASSOCADS" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
