import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { LinkedInLink } from "@/components/sections/trustees/LinkedInLink";
import { filled } from "@/components/sections/trustees/TrusteeCard";
import { Avatar } from "@/components/ui/Avatar";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import { getTrustees, hasTrusteeProfile } from "@/lib/content/loaders";
import type { Trustee } from "@/lib/content/schemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { person } from "@/lib/seo/schema";

/** A trustee with their own page, or undefined. */
function profileFor(slug: string): Trustee | undefined {
  return getTrustees().find((t) => t.slug === slug && hasTrusteeProfile(t));
}

/**
 * Pages exist only for trustees who are published, have given consent and
 * have supplied a biography. Cache Components needs at least one path to
 * prerender, so while nobody qualifies the first trustee's path is
 * prerendered, and it renders "not found" like every other path without a profile.
 */
export function generateStaticParams() {
  const trustees = getTrustees();
  const withProfiles = trustees.filter(hasTrusteeProfile);
  const slugs = (
    withProfiles.length > 0 ? withProfiles : trustees.slice(0, 1)
  ).map((t) => t.slug);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/about/trustees/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const trustee = profileFor(slug);
  if (!trustee) return {};
  return pageMetadata({
    title: trustee.name,
    description: `${trustee.name}, ${trustee.capacity} of ${site.shortName}, the ${site.name}. ${trustee.role}, ${trustee.organisation}.`,
    path: `/about/trustees/${trustee.slug}`,
  });
}

/** Answer-first: who the trustee is, in the trust and outside it. */
function trusteeLead(trustee: NonNullable<ReturnType<typeof profileFor>>) {
  const work = filled([trustee.role, trustee.organisation]).join(", ");
  return [
    `${trustee.name} is a ${trustee.capacity} of ${site.shortName}, the ${site.name}, a not-for-profit public charitable trust in ${site.location.city}.`,
    work && `Current role: ${work}.`,
    "Trustees serve in an honorary capacity, without payment.",
    trustee.officeTitle
      ? ""
      : "Office titles will be given only when the Board of Trustees elects them.",
  ]
    .filter(Boolean)
    .join(" ");
}

export default async function TrusteeProfilePage({
  params,
}: PageProps<"/about/trustees/[slug]">) {
  const { slug } = await params;
  const trustee = profileFor(slug);
  if (!trustee) notFound();

  const expertise = filled(trustee.expertise);
  const linkedin = filled([trustee.linkedin])[0];

  return (
    <>
      <JsonLd items={[person(trustee)]} />
      <PageHeader
        eyebrow={trustee.capacity}
        title={trustee.name}
        lead={trusteeLead(trustee)}
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Founder Trustees", href: "/about/trustees" },
          { label: trustee.name },
        ]}
      />
      <Section tone="paper" spacing="none" className="pb-16 lg:pb-28">
        <Container className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <Avatar
              name={trustee.name}
              photo={trustee.consentToPublish ? trustee.photo : null}
              size="fill"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          </div>
          <div className="flex flex-col gap-6 md:col-span-8">
            {trustee.officeTitle && (
              <p className="font-medium text-ink">{trustee.officeTitle}</p>
            )}
            <p className="max-w-[34em] text-lead text-slate-600">
              {trustee.bio}
            </p>
            {expertise.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2 className="font-display text-h3 font-semibold text-ink">
                  Areas of expertise
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {expertise.map((area) => (
                    <li key={area}>
                      <Tag variant="neutral">{area}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {linkedin && <LinkedInLink href={linkedin} name={trustee.name} />}
            <TextLink href="/about/trustees">All Founder Trustees</TextLink>
          </div>
        </Container>
      </Section>
      <CallToAction />
    </>
  );
}
