import Link from "next/link";
import { site } from "@/config/site";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProgrammeGrid } from "@/components/sections/programmes/ProgrammeGrid";
import { Questions } from "@/components/sections/Questions";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { getDeedObjects, getProgrammes } from "@/lib/content/loaders";
import { pageMetadata } from "@/lib/seo/metadata";
import { numberWord } from "@/lib/words";

export const metadata = pageMetadata({
  title: "Programmes",
  description:
    "The planned programmes of ASSOCADS: training, events, research, industry and academia, responsible AI, startups, policy, and AI for social good.",
  path: "/programmes",
});

export default function ProgrammesPage() {
  const programmes = getProgrammes();
  const objects = getDeedObjects();
  const objectTitle = (n: number) =>
    objects.find((o) => o.number === n)?.title ?? `Object ${n}`;
  const count = numberWord(programmes.length);
  const allPlanned = programmes.every((p) => p.status === "planned");
  const mapped = new Set(programmes.flatMap((p) => p.deedObjects));
  const unmapped = objects.filter((o) => !mapped.has(o.number));

  return (
    <>
      <PageHeader
        eyebrow="Programmes"
        title="Programmes"
        lead={`${site.shortName} groups the sixteen objects of its trust deed into ${count} programme areas, from training and research to responsible AI and policy. ${allPlanned ? "All of them are planned: each will begin after the trust is registered, and its page will say when." : "Each programme page says whether work has started."} Each page sets out what the programme aims to do and how it plans to work.`}
        breadcrumbs={[{ label: "Programmes" }]}
      />

      <Section tone="paper" spacing="none" className="pb-16 lg:pb-28">
        <Container>
          <h2 className="sr-only">All programmes</h2>
          <ProgrammeGrid />
        </Container>
      </Section>

      <Section tone="cloud" aria-labelledby="mapping-heading">
        <Container>
          <SectionIntro
            id="mapping-heading"
            eyebrow="From the trust deed"
            title="How the programmes map to the trust's objects"
            lead="Every programme carries out one or more objects of the trust deed. The numbers match the deed."
            action={
              <TextLink href="/about/objects">All sixteen objects</TextLink>
            }
          />
          <ul className="border-t border-line">
            {programmes.map((programme) => (
              <li
                key={programme.slug}
                className="grid gap-3 border-b border-line py-6 md:grid-cols-12 md:gap-8"
              >
                <h3 className="font-display text-h3 font-semibold text-ink md:col-span-4">
                  <Link
                    href={`/programmes/${programme.slug}`}
                    className="underline-offset-4 hover:text-indigo hover:underline"
                  >
                    {programme.title}
                  </Link>
                </h3>
                <ul className="flex flex-col gap-2 md:col-span-8">
                  {programme.deedObjects.map((n) => (
                    <li key={n} className="flex gap-3 text-body text-slate-600">
                      <span className="w-8 shrink-0 font-mono font-medium text-indigo">
                        {String(n).padStart(2, "0")}
                      </span>
                      <Link
                        href={`/about/objects#object-${n}`}
                        className="underline-offset-4 hover:text-indigo hover:underline"
                      >
                        <span className="sr-only">Object {n}: </span>
                        {objectTitle(n)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          {unmapped.length > 0 && (
            <p className="mt-8 max-w-[62ch] text-body text-slate-600">
              {unmapped.length === 1 ? "Object" : "Objects"}{" "}
              {unmapped
                .map((o) => `${o.number} (${o.title.toLowerCase()})`)
                .join(" and ")}{" "}
              {unmapped.length === 1 ? "supports" : "support"} every programme
              rather than one in particular.
            </p>
          )}
        </Container>
      </Section>

      <Questions page="/programmes" />
      <CallToAction />
    </>
  );
}
