import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FORM_ID } from "@/components/forms/communityInterest";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Tag";
import { Prose } from "@/components/ui/Typography";
import { bySlug, getCommunities } from "@/lib/content/loaders";
import { loadMdxBody } from "@/lib/content/mdx";
import { pageMetadata } from "@/lib/seo/metadata";

/* Every community is listed here so the route always has a path to prerender;
   only groups and chapters the Board has set up ("active") have a page. */
export function generateStaticParams() {
  return getCommunities({ includeDrafts: true }).map((c) => ({ slug: c.slug }));
}

function activeCommunity(slug: string) {
  const community = bySlug(getCommunities(), slug);
  return community?.status === "active" ? community : undefined;
}

export async function generateMetadata({
  params,
}: PageProps<"/communities/[slug]">): Promise<Metadata> {
  const community = activeCommunity((await params).slug);
  if (!community) return {};
  return pageMetadata({
    title: community.name,
    description: community.summary,
    path: `/communities/${community.slug}`,
  });
}

export default async function CommunityPage({
  params,
}: PageProps<"/communities/[slug]">) {
  const { slug } = await params;
  const community = activeCommunity(slug);
  if (!community) notFound();

  const Body = community.body.trim()
    ? await loadMdxBody("communities", community.slug)
    : null;
  const place = [community.city, community.state].filter(Boolean).join(", ");

  return (
    <>
      <PageHeader
        eyebrow={
          community.kind === "sig" ? "Special Interest Group" : "Chapter"
        }
        title={community.name}
        lead={community.summary}
        actions={
          <div className="flex flex-col items-start gap-4">
            <Badge
              status="open"
              label={place ? `Active · ${place}` : "Active"}
            />
            <ButtonLink
              href={`/communities?interest=${community.slug}#${FORM_ID}`}
              size="large"
            >
              Register your interest
            </ButtonLink>
          </div>
        }
        breadcrumbs={[
          { label: "Communities", href: "/communities" },
          { label: community.name },
        ]}
      />
      {Body && (
        <Section tone="cloud">
          <Container>
            <Prose>
              <Body />
            </Prose>
          </Container>
        </Section>
      )}
    </>
  );
}
