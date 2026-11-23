import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/sections/PageHeader";
import { Placeholder } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { bySlug, getAudiences } from "@/lib/content/loaders";

export function generateStaticParams() {
  return getAudiences().map((a) => ({ audience: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/for/[audience]">): Promise<Metadata> {
  const audience = bySlug(getAudiences(), (await params).audience);
  if (!audience) return {};
  return { title: audience.title, description: audience.summary };
}

export default async function AudiencePage({
  params,
}: PageProps<"/for/[audience]">) {
  const audience = bySlug(getAudiences(), (await params).audience);
  if (!audience) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Who we serve"
        title={audience.title}
        lead={audience.summary}
        breadcrumbs={[{ label: audience.title }]}
      />
      <Container className="pb-24">
        <Placeholder needed="audience page content, built in a later playbook step" />
      </Container>
    </>
  );
}
