import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Events",
  description: "ASSOCADS conferences, workshops, meetups and hackathons.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Events"
        lead="Conferences, workshops, meetups and hackathons. No events have been announced yet."
        breadcrumbs={[{ label: "Events" }]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
