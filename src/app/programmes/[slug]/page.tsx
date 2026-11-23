import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { bySlug, getProgrammes } from "@/lib/content/loaders";

export function generateStaticParams() {
  return getProgrammes().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/programmes/[slug]">): Promise<Metadata> {
  const programme = bySlug(getProgrammes(), (await params).slug);
  if (!programme) return {};
  return { title: programme.title, description: programme.tagline };
}

export default async function ProgrammePage({
  params,
}: PageProps<"/programmes/[slug]">) {
  const programme = bySlug(getProgrammes(), (await params).slug);
  if (!programme) notFound();

  return (
    <>
      <PageHeader
        eyebrow={
          programme.status === "planned" ? "Programme · Planned" : "Programme"
        }
        title={programme.title}
        lead={programme.tagline}
        breadcrumbs={[
          { label: "Programmes", href: "/programmes" },
          { label: programme.title },
        ]}
      />
      <Container className="pb-24">
        <Placeholder needed="programme page content, built in a later playbook step" />
      </Container>
    </>
  );
}
