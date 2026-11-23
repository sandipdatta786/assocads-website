import { AboutLinks } from "@/components/sections/AboutLinks";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/Decor";
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
/** A comparison, so it is a table (blueprint 4.4). */
const differences = [
  {
    aspect: "Who can join",
    others: "Industry trade bodies count companies as their members.",
    assocads:
      "A professional body open to individuals, including students, as well as organisations.",
  },
  {
    aspect: "What it is",
    others: "Commercial certification providers sell credentials.",
    assocads:
      "A public charitable trust with named trustees, governed by a trust deed and run for public benefit.",
  },
  {
    aspect: "What it covers",
    others: "Some societies focus on one field or one conference.",
    assocads:
      "AI, Data Science and Analytics across academia, industry, startups and government: membership, training, research, startups, policy and social good.",
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
        lead={`${site.description} ${site.mission}`}
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
            lead={`${site.shortName} is a public charitable trust open to individuals and broad by design, which sets it apart from trade bodies, certification providers and single-field societies.`}
          />
          <div className="overflow-hidden rounded-l border border-line bg-paper">
            <table className="w-full border-collapse text-left text-small">
              <caption className="sr-only">
                How ASSOCADS compares with other kinds of organisation in the
                field
              </caption>
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-line">
                  <th scope="col" className="w-1/5 p-5 font-semibold text-ink">
                    Question
                  </th>
                  <th scope="col" className="p-5 font-semibold text-ink">
                    Others in the field
                  </th>
                  <th scope="col" className="p-5 font-semibold text-ink">
                    {site.shortName}
                  </th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {differences.map((d) => (
                  <tr
                    key={d.aspect}
                    className="block border-b border-line last:border-b-0 md:table-row"
                  >
                    <th
                      scope="row"
                      className="block p-5 pb-3 align-top font-display text-body font-semibold text-ink md:table-cell md:pb-5"
                    >
                      {d.aspect}
                    </th>
                    <td className="block px-5 pb-4 align-top text-slate-600 md:table-cell md:p-5">
                      <span
                        aria-hidden="true"
                        className="mb-1 block font-mono text-eyebrow font-medium text-slate-600 uppercase md:hidden"
                      >
                        Others in the field
                      </span>
                      {d.others}
                    </td>
                    <td className="block px-5 pb-4 align-top text-ink text-slate-600 md:table-cell md:p-5">
                      <span
                        aria-hidden="true"
                        className="mb-1 block font-mono text-eyebrow font-medium text-slate-600 uppercase md:hidden"
                      >
                        {site.shortName}
                      </span>
                      {d.assocads}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
