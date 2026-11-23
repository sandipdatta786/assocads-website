import type { Metadata } from "next";
import { site } from "@/config/site";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AboutLinks } from "@/components/sections/AboutLinks";
import { CallToAction } from "@/components/sections/CallToAction";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Callout } from "@/components/ui/Callout";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import {
  bySlug,
  getInitiatives,
  getProgrammes,
  getSuccessMeasures,
} from "@/lib/content/loaders";
import { initiativeGroups } from "@/lib/content/schemas";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Our approach",
  description:
    "How ASSOCADS aims to differ from other associations: hands-on learning, practical certification, real problems solved together and AI for social good.",
  path: "/about/approach",
});

const gains = [
  { word: "Learn", text: "practical skills from people who use them" },
  { word: "Build", text: "working solutions to real problems" },
  { word: "Experience", text: "how AI is used inside organisations" },
  { word: "Contribute", text: "knowledge, code and research to the field" },
  { word: "Achieve", text: "recognition that reflects what you can do" },
];

const groupIntros: Record<(typeof initiativeGroups)[number]["slug"], string> = {
  learn: "Learning that leaves you with skills and work you can show.",
  build:
    "Mixed teams from industry and academia, working on problems that matter to someone.",
  share: "Knowledge that stays available long after an event ends.",
  serve: "Help for organisations and communities that need it most.",
};

export default function Page() {
  const initiatives = getInitiatives();
  const measures = getSuccessMeasures();
  const programmes = getProgrammes();

  return (
    <>
      <PageHeader
        eyebrow="Our approach"
        title="Building with AI, not just talking about it"
        lead={`${site.shortName} aims to help shape how AI and Data Science are learned, built, adopted and used to make a difference. This page sets out how its Founder Trustees want it to work, by building with AI rather than only talking about it, and the values they want it to stand for.`}
        breadcrumbs={[
          { label: "About", href: "/about" },
          { label: "Our approach" },
        ]}
      />

      {/* Beyond conferences */}
      <Section tone="cloud" aria-labelledby="beyond-heading">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-5 lg:col-span-6">
            <Eyebrow>What sets us apart</Eyebrow>
            <Heading level={2} id="beyond-heading">
              More than conferences and networking
            </Heading>
            <p className="text-body text-slate-600">
              Conferences, seminars, panels and networking events have their
              place, and ASSOCADS will hold them. But we do not want them to be
              what we are known for.
            </p>
            <p className="text-body text-slate-600">
              We want to create lasting, practical value that people associate
              with us. People should want to take part not only to attend events
              or join a network, but for what they can do here.
            </p>
          </div>
          <ul className="flex flex-col gap-3 lg:col-span-6">
            {gains.map((g) => (
              <li
                key={g.word}
                className="flex flex-col gap-1 rounded-m border border-line bg-paper px-5 py-4 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <span className="shrink-0 font-display text-h3 font-semibold text-indigo sm:w-40">
                  {g.word}
                </span>
                <span className="text-body text-slate-600">{g.text}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* The proposed initiatives */}
      <Section tone="paper" aria-labelledby="initiatives-heading">
        <Container>
          <SectionIntro
            id="initiatives-heading"
            eyebrow="Proposals"
            title={`${initiatives.length} ideas we plan to build on`}
            lead="Each belongs to one of our eight programmes. Partnerships with companies and colleges, and a growing membership, remain priorities alongside them."
          />
          <Callout
            variant="status"
            title="These are proposals, not services"
            className="mb-12 max-w-3xl lg:mb-16"
          >
            <p>
              None of these has started. After registration, the Board will
              weigh them, choose the most practical ones to begin with, and
              build on them step by step. Not everything will start at once.
            </p>
          </Callout>

          <div className="flex flex-col gap-14 lg:gap-20">
            {initiativeGroups.map((group) => {
              const items = initiatives.filter((i) => i.group === group.slug);
              if (items.length === 0) return null;
              return (
                <section
                  key={group.slug}
                  aria-labelledby={`group-${group.slug}`}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2 border-t border-line pt-6">
                    <h3
                      id={`group-${group.slug}`}
                      className="font-display text-h2 font-semibold text-ink"
                    >
                      {group.title}
                    </h3>
                    <p className="max-w-[34em] text-body text-slate-600">
                      {groupIntros[group.slug]}
                    </p>
                  </div>
                  <ul className="grid gap-4 md:grid-cols-2 lg:gap-6">
                    {items.map((item) => (
                      <li
                        key={item.slug}
                        id={item.slug}
                        className="flex scroll-mt-28 flex-col gap-4 rounded-l border border-line bg-paper p-6 sm:p-8"
                      >
                        <h4 className="font-display text-h3 font-semibold text-ink">
                          {item.title}
                        </h4>
                        <p className="text-body text-slate-600">
                          {item.summary}
                        </p>
                        <p className="border-l-2 border-indigo pl-4 text-body font-medium text-ink">
                          {item.outcome}
                        </p>
                        <Link
                          href={`/programmes/${item.programme}`}
                          className="group mt-auto inline-flex items-center gap-1.5 pt-2 text-small font-medium text-indigo"
                        >
                          <span className="group-hover:underline group-hover:underline-offset-4">
                            Part of {bySlug(programmes, item.programme)?.title}
                          </span>
                          <ArrowRight
                            aria-hidden="true"
                            size={16}
                            strokeWidth={1.5}
                            className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Practical certification, in detail */}
      <Section tone="ink" aria-labelledby="certification-heading">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-4 lg:col-span-5">
            <p className="font-mono text-eyebrow font-medium text-tone-faint uppercase">
              A closer look
            </p>
            <h2
              id="certification-heading"
              className="font-display text-h2 font-semibold text-tone-fg"
            >
              Certification that tests what you can do
            </h2>
            <p className="text-body text-slate-400">
              Many certifications rely on theory, multiple-choice examinations
              and product-specific skills. We propose certifications in two
              parts, so that candidates show what they know and how well they
              apply it.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-6">
            <li className="flex flex-col gap-3 rounded-l border border-tone-line p-6 sm:p-8">
              <span className="font-mono text-eyebrow font-medium text-indigo-bright">
                PART 1
              </span>
              <h3 className="font-display text-h3 font-semibold text-tone-fg">
                Theory
              </h3>
              <p className="text-body text-slate-400">
                An online, remotely proctored examination of the concepts,
                technologies and methods involved.
              </p>
            </li>
            <li className="flex flex-col gap-3 rounded-l border border-tone-line p-6 sm:p-8">
              <span className="font-mono text-eyebrow font-medium text-indigo-bright">
                PART 2
              </span>
              <h3 className="font-display text-h3 font-semibold text-tone-fg">
                Practical assessment
              </h3>
              <p className="text-body text-slate-400">
                A real-world problem or project, evaluated by experienced
                industry professionals against clearly defined criteria.
              </p>
            </li>
            <li className="text-body text-slate-400 sm:col-span-2">
              Our aim is rigorous standards, credible assessors and transparent
              criteria, so that over time employers can rely on these
              certifications when they hire for AI and Data Science roles.
            </li>
          </ol>
        </Container>
      </Section>

      {/* How we will judge success */}
      <Section tone="cloud" aria-labelledby="success-heading">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionIntro
              id="success-heading"
              eyebrow="Measuring success"
              title="What we want to be judged by"
              lead="Not only by how many conferences we hold, how many people attend or how many members we enrol, but by questions like these."
              stacked
            />
          </div>
          <ol className="flex flex-col lg:col-span-7">
            {measures.map((question, i) => (
              <li
                key={question}
                className="flex gap-5 border-b border-line py-5 first:border-t"
              >
                <span
                  aria-hidden="true"
                  className="w-6 shrink-0 font-mono text-small font-medium text-indigo"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-body text-ink">{question}</span>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* The larger idea */}
      <Section tone="paper" aria-labelledby="ecosystem-heading">
        <Container>
          <div className="flex max-w-4xl flex-col gap-6">
            <h2
              id="ecosystem-heading"
              className="font-display text-h2 font-semibold text-ink"
            >
              One place to learn, experiment, collaborate and solve real
              problems
            </h2>
            <p className="text-lead text-slate-600">
              We want ASSOCADS to grow into a community where industry
              professionals, technologists, researchers, academics, students,
              startups and businesses come together, because they see something
              useful happening here. When people hear our name, we want them to
              think of practical knowledge, real contributions and real-world
              impact.
            </p>
          </div>
        </Container>
      </Section>

      <AboutLinks current="/about/approach" tone="cloud" />

      <CallToAction
        title="Help us build it"
        text="If these ideas appeal to you, register your interest. If your organisation has a problem worth solving or could host a challenge, tell us."
      />
    </>
  );
}
