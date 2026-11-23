import { Building2, HandHeart, Layers } from "lucide-react";
import { AboutLinks } from "@/components/sections/AboutLinks";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { Heading } from "@/components/ui/Typography";
import { site } from "@/config/site";
import { getTrustees } from "@/lib/content/loaders";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { aboutPage } from "@/lib/seo/schema";
import { numberWord } from "@/lib/words";

export const metadata = pageMetadata({
  title: "About ASSOCADS",
  description:
    "Why ASSOCADS, the Association for AI and Data Science, was set up in Kolkata, what it aims to become, and how it differs from trade bodies and certifiers.",
  path: "/about",
});

/* Positioning from docs/BLUEPRINT.md, section 3.3, described by kind of
   organisation. The named organisations appear only in the FAQ below. */
const differences = [
  {
    icon: HandHeart,
    title: "Open to individuals",
    text: "Industry trade bodies count companies as their members. ASSOCADS is a professional body open to individuals, including students.",
  },
  {
    icon: Building2,
    title: "A public trust, not a business",
    text: "Commercial certification providers sell credentials. ASSOCADS is a public charitable trust with named trustees, governed by a trust deed and run for public benefit.",
  },
  {
    icon: Layers,
    title: "Broad by design",
    text: "Some societies focus on one field or one conference. ASSOCADS covers AI, Data Science and Analytics across academia, industry, startups and government: membership, training, research, startups, policy and social good.",
  },
];

export default function AboutPage() {
  const trusteeCount = numberWord(getTrustees().length);

  return (
    <>
      <JsonLd
        items={[
          aboutPage({
            path: "/about",
            name: "About ASSOCADS",
            description: String(metadata.description),
          }),
        ]}
      />
      <PageHeader
        eyebrow="About"
        title="About ASSOCADS"
        lead={`The ${site.name} is a not-for-profit public charitable trust, set up in ${site.location.city} in ${site.foundingYear}, to connect the people and institutions working in AI and Data Science in India.`}
        breadcrumbs={[{ label: "About" }]}
      />

      {/* Why it exists */}
      <Section tone="cloud" aria-labelledby="why-heading">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionIntro
              id="why-heading"
              eyebrow="Why it exists"
              title="One shared home for AI and Data Science"
              stacked
            />
          </div>
          <div className="flex flex-col gap-5 text-body text-slate-600 lg:col-span-7">
            <p>
              Work in AI, Data Science and Analytics happens in many places at
              once: in classrooms and research labs, in companies and startups,
              and in government departments. {site.shortName} was set up to
              connect them, so that students, professionals, academics,
              entrepreneurs, investors, institutions and government can learn,
              meet, research and build together.
            </p>
            <p>
              It is a not-for-profit public charitable trust. It is
              non-political, non-religious and open to everyone without
              discrimination, and its assets can never be shared among its
              trustees or members.
            </p>
          </div>
        </Container>
      </Section>

      {/* Who started it */}
      <Section tone="paper" aria-labelledby="founders-heading">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionIntro
              id="founders-heading"
              eyebrow="Who started it"
              title={`Founded by ${trusteeCount} trustees in ${site.location.city}`}
              action={
                <TextLink href="/about/trustees">Meet the trustees</TextLink>
              }
              stacked
            />
          </div>
          <div className="flex flex-col gap-5 text-body text-slate-600 lg:col-span-7">
            <p>
              {site.shortName} was started in {site.foundingYear} by{" "}
              {trusteeCount} Founder Trustees: professionals, academics and
              entrepreneurs in AI, Data Science and Analytics. Together they
              form its first Board of Trustees.
            </p>
            <p>
              They serve without payment. The Board will elect its office
              bearers from among the trustees at its first meeting after
              registration.
            </p>
          </div>
        </Container>
      </Section>

      {/* Vision and scope */}
      <Section tone="ink" aria-labelledby="vision-heading">
        <Container className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 opacity-40 lg:block"
          >
            <DotGrid />
          </div>
          <div className="relative grid gap-12 md:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-5">
              <p className="font-mono text-eyebrow font-medium text-tone-faint uppercase">
                Vision
              </p>
              <Heading level={2} id="vision-heading">
                An ecosystem enabler, and in time an apex professional body
              </Heading>
              <p className="text-body text-slate-400">
                {site.shortName} aims to connect talent, knowledge, innovation
                and opportunity. In the long term, it aims to grow into an apex
                professional body for AI and Data Science.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <p className="font-mono text-eyebrow font-medium text-tone-faint uppercase">
                Scope
              </p>
              <Heading level={2}>
                Across India, beginning with {site.location.state}
              </Heading>
              <p className="text-body text-slate-400">
                {site.shortName} is building a collaborative ecosystem for AI,
                Data Science and Analytics professionals across India, beginning
                with {site.location.state}. It aims to connect industry,
                academia, startups, government and society.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* How it differs */}
      <Section tone="paper" aria-labelledby="differs-heading">
        <Container>
          <SectionIntro
            id="differs-heading"
            eyebrow="Where we sit"
            title="How ASSOCADS is different"
            lead="Several organisations work in this field. Here is where ASSOCADS fits."
          />
          <ul className="grid gap-4 md:grid-cols-3 lg:gap-6">
            {differences.map((item) => (
              <li
                key={item.title}
                className="flex flex-col gap-4 rounded-l border border-line bg-paper p-6 sm:p-8"
              >
                <Icon icon={item.icon} size={28} className="text-indigo" />
                <h3 className="font-display text-h3 font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="text-body text-slate-600">{item.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/about/approach">Read our approach</ButtonLink>
            <ButtonLink href="/about/objects" variant="secondary">
              Read our aims and objects
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <Questions page="/about" title="Common questions" />
      <AboutLinks current="/about" />
      <CallToAction />
    </>
  );
}
