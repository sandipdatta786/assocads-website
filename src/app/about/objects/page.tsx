import Link from "next/link";
import { AboutLinks } from "@/components/sections/AboutLinks";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { Questions } from "@/components/sections/Questions";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Typography";
import { getDeedObjects, getProgrammes } from "@/lib/content/loaders";
import { objectGroups } from "@/lib/content/schemas";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Aims and objects",
  description:
    "The sixteen objects in the ASSOCADS trust deed, in plain English: community, learning, research, collaboration, policy, innovation and social good.",
  path: "/about/objects",
});

export default function ObjectsPage() {
  const objects = getDeedObjects();
  const programmes = getProgrammes();
  /** The programme that carries out each object, for a "See" link. */
  const programmeFor = (n: number) =>
    programmes.filter((p) => p.deedObjects.includes(n));

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Aims and objects"
        lead="The trust deed sets out sixteen objects: the purposes ASSOCADS exists to pursue. Together they commit it to building a community for AI and Data Science in India that learns, researches, innovates and works for public good, always on a not-for-profit basis."
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Aims and objects" },
        ]}
      />

      <Section tone="paper" spacing="none" className="pb-16 lg:pb-28">
        <Container>
          <Callout className="mb-12 max-w-3xl lg:mb-16">
            These objects are taken from the ASSOCADS trust deed and written
            here in plain English. The numbers match the deed, so each object
            can be cited. The deed itself remains the authoritative text.
          </Callout>

          <div className="flex flex-col gap-14 lg:gap-20">
            {objectGroups.map((group) => {
              const items = objects.filter((o) => o.group === group.slug);
              if (items.length === 0) return null;
              return (
                <section
                  key={group.slug}
                  aria-labelledby={`group-${group.slug}`}
                  className="grid gap-6 border-t-2 border-ink pt-8 lg:grid-cols-12 lg:gap-12"
                >
                  <Heading
                    level={2}
                    id={`group-${group.slug}`}
                    className="lg:col-span-4"
                  >
                    {group.title}
                  </Heading>
                  <ul className="flex flex-col gap-8 lg:col-span-8">
                    {items.map((object) => (
                      <li
                        key={object.number}
                        id={`object-${object.number}`}
                        className="grid scroll-mt-28 grid-cols-[3rem_1fr] gap-x-4 sm:grid-cols-[4rem_1fr]"
                      >
                        <span
                          aria-hidden="true"
                          className="font-mono text-h3 font-medium text-indigo"
                        >
                          {String(object.number).padStart(2, "0")}
                        </span>
                        <div className="flex flex-col gap-2">
                          <h3 className="font-display text-h3 font-semibold text-ink">
                            <span className="sr-only">
                              Object {object.number}:{" "}
                            </span>
                            {object.title}
                          </h3>
                          <p className="text-body text-slate-600">
                            {object.text}
                          </p>
                          {programmeFor(object.number).length > 0 && (
                            <p className="text-small text-slate-600">
                              Programme:{" "}
                              {programmeFor(object.number).map((p, i) => (
                                <span key={p.slug}>
                                  {i > 0 && ", "}
                                  <Link
                                    href={`/programmes/${p.slug}`}
                                    className="font-medium text-indigo underline-offset-4 hover:underline"
                                  >
                                    {p.title}
                                  </Link>
                                </span>
                              ))}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </Container>
      </Section>

      <Questions page="/about/objects" />
      <AboutLinks current="/about/objects" />
      <CallToAction />
    </>
  );
}
