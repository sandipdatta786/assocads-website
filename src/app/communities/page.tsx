import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, MapPin } from "lucide-react";
import {
  CommunityInterestForm,
  InterestLink,
} from "@/components/forms/CommunityInterestForm";
import { FORM_ID, PROPOSE_CHAPTER } from "@/components/forms/communityInterest";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/config/site";
import { getCommunities } from "@/lib/content/loaders";
import type { Community } from "@/lib/content/schemas";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Special Interest Groups and chapters",
  description:
    "ASSOCADS Special Interest Groups by industry or domain, and chapters in other cities and states. See the proposed groups and register your interest.",
  path: "/communities",
});

const interestButton =
  "inline-flex min-h-11 items-center gap-1.5 text-small font-medium text-indigo underline-offset-4 hover:underline";

function CommunityCard({ community }: { community: Community }) {
  const active = community.status === "active";
  const place = [community.city, community.state].filter(Boolean).join(", ");
  return (
    <div className="flex h-full flex-col gap-3 rounded-l border border-line bg-paper p-6">
      <Badge
        status={active ? "open" : "planned"}
        label={active ? "Active" : "Proposed"}
        className="w-fit"
      />
      <h3 className="font-display text-h3 font-semibold text-ink">
        {active ? (
          <Link
            href={`/communities/${community.slug}`}
            className="hover:text-indigo hover:underline"
          >
            {community.name}
          </Link>
        ) : (
          community.name
        )}
      </h3>
      {place && <p className="text-small text-slate-600">{place}</p>}
      <p className="text-body text-slate-600">{community.summary}</p>
      <div className="mt-auto pt-2">
        <InterestLink value={community.slug} className={interestButton}>
          Register interest
          <span className="sr-only"> in {community.name}</span>
          <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
        </InterestLink>
      </div>
    </div>
  );
}

export default function Page() {
  const communities = getCommunities();
  const sigs = communities.filter((c) => c.kind === "sig");
  const chapters = communities.filter((c) => c.kind === "chapter");
  const activeChapters = chapters.filter((c) => c.status === "active");
  const anyProposed = sigs.some((c) => c.status === "proposed");

  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="Communities"
        lead={`${site.shortName} plans to form two kinds of community. Special Interest Groups will bring together people who work in one industry or domain, and chapters will bring together people in one city or state. None has been formed yet. Tell us which you would join, and whether you would help to run it.`}
        actions={
          <ButtonLink href={`#${FORM_ID}`} size="large">
            Register your interest
          </ButtonLink>
        }
        breadcrumbs={[{ label: "Communities" }]}
      />

      {/* Special Interest Groups */}
      <Section tone="cloud" aria-labelledby="sigs-heading">
        <Container>
          <SectionIntro
            id="sigs-heading"
            eyebrow="By industry or domain"
            title="Special Interest Groups"
            lead="A Special Interest Group is a community of practitioners, researchers and students in one field. The trust deed allows ASSOCADS to offer training and advice through these groups."
          />
          <div className="-mt-4 mb-10 grid gap-6 lg:-mt-6 lg:mb-14 lg:grid-cols-2">
            <p className="text-body text-slate-600">
              Each group is constituted by the Board of Trustees, which decides
              its scope and how it is run. No group has been formed yet. The
              list below shows the fields we propose to start with.
            </p>
            {anyProposed && (
              <Callout
                variant="status"
                title="Proposed, subject to Board approval"
              >
                <p>
                  These groups do not exist yet. Registering your interest helps
                  the Board decide which to set up first.
                </p>
              </Callout>
            )}
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {sigs.map((c) => (
              <li key={c.slug}>
                <CommunityCard community={c} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Chapters */}
      <Section tone="paper" aria-labelledby="chapters-heading">
        <Container>
          <SectionIntro
            id="chapters-heading"
            eyebrow="By city or state"
            title="Chapters"
          />
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-5 lg:col-span-7">
              <p className="text-lead text-slate-600">
                ASSOCADS begins in {site.location.state}, with{" "}
                {site.location.city} as its base. Chapters in other cities and
                states will follow as the Board approves them.
              </p>
              <p className="text-body text-slate-600">
                The trust deed allows the Board to set up chapters across India.
                If you would like one where you live or work, propose it and
                tell us whether you would help organise it.
              </p>
              <div>
                <InterestLink
                  value={PROPOSE_CHAPTER}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-pill border border-ink px-5 text-small font-medium whitespace-nowrap text-ink transition-colors duration-150 hover:bg-ink hover:text-paper"
                >
                  Propose a chapter
                </InterestLink>
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="flex gap-4 rounded-l border border-line bg-cloud p-6">
                <Icon
                  icon={MapPin}
                  size={24}
                  className="shrink-0 text-indigo"
                />
                <div className="flex flex-col gap-1">
                  <p className="font-display text-h3 font-semibold text-ink">
                    {site.location.city}
                  </p>
                  <p className="text-body text-slate-600">
                    Where ASSOCADS is based, and where its first activities are
                    planned.
                  </p>
                </div>
              </div>
              {activeChapters.length > 0 && (
                <ul className="flex flex-col gap-4">
                  {activeChapters.map((c) => (
                    <li key={c.slug}>
                      <CommunityCard community={c} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Campus groups */}
      <Section tone="ink" spacing="tight" aria-labelledby="campus-heading">
        <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="flex max-w-2xl gap-5">
            <Icon
              icon={GraduationCap}
              size={32}
              className="shrink-0 text-indigo-bright"
            />
            <div className="flex flex-col gap-2">
              <h2
                id="campus-heading"
                className="font-display text-h3 font-semibold text-tone-fg"
              >
                Campus groups
              </h2>
              <p className="text-body text-slate-400">
                Colleges and universities that would like an ASSOCADS group for
                their students and faculty can talk to us about a partnership.
              </p>
            </div>
          </div>
          <ButtonLink
            href="/partner"
            variant="secondary"
            className="w-fit shrink-0"
          >
            Partner with us
          </ButtonLink>
        </Container>
      </Section>

      {/* Interest form */}
      <Section
        tone="cloud"
        aria-labelledby="interest-heading"
        id={FORM_ID}
        className="scroll-mt-20"
      >
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionIntro
              id="interest-heading"
              eyebrow="Tell us"
              title="Register your interest"
              lead="Tell us which group or chapter you would join, and whether you would help to run it."
              stacked
            />
          </div>
          <div
            data-theme="light"
            className="rounded-l bg-paper p-6 sm:p-10 lg:col-span-8"
          >
            <CommunityInterestForm
              groups={sigs.map((c) => ({ value: c.slug, label: c.name }))}
              chapters={activeChapters.map((c) => ({
                value: c.slug,
                label: c.name,
              }))}
            />
          </div>
        </Container>
      </Section>

      <Questions
        page="/communities"
        title="Questions about communities"
        tone="paper"
      />

      <Section tone="tint" spacing="tight">
        <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body text-ink">
            Membership is separate from groups and chapters.
          </p>
          <TextLink href="/membership">How membership works</TextLink>
        </Container>
      </Section>
    </>
  );
}
