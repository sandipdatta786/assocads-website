import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Register your interest",
  description:
    "Register your interest in ASSOCADS membership and we will contact you when it opens.",
};

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Register your interest"
        lead="Tell us you would like to join, and we will contact you when membership opens."
        breadcrumbs={[
          { label: "Membership", href: "/membership" },
          { label: "Register your interest" },
        ]}
      />
      <Container className="pb-24">
        <Placeholder needed="page content, built in a later playbook step" />
      </Container>
    </>
  );
}
