import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "News and announcements from ASSOCADS, the Association for AI and Data Science.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Insights"
        lead="News and announcements from ASSOCADS."
        breadcrumbs={[{ label: "Insights" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
