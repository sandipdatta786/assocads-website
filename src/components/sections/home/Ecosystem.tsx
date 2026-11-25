import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { site } from "@/config/site";

/* The five communities, placed around the shared centre. Positions are in the
   SVG's own coordinates (viewBox 0 0 480 480). */
const communities = [
  {
    title: "Students",
    text: "Learning, projects and a first step into the field.",
    href: "/for/students",
    x: 240,
    y: 70,
  },
  {
    title: "Professionals and researchers",
    text: "Practice, research and sharing what they learn.",
    href: "/for/professionals",
    x: 410,
    y: 200,
  },
  {
    title: "Academia",
    text: "Universities and colleges we plan to work with on training and research.",
    href: "/partner",
    x: 350,
    y: 390,
  },
  {
    title: "Industry and startups",
    text: "Hiring, practical problems and new ideas.",
    href: "/for/industry",
    x: 130,
    y: 390,
  },
  {
    title: "Government and institutions",
    text: "Policy, public good and capacity building.",
    href: "/for/government",
    x: 70,
    y: 200,
  },
];

const CENTRE = { x: 240, y: 240 };

export function Ecosystem() {
  return (
    <Section tone="cloud" aria-labelledby="ecosystem-heading">
      <Container className="flex flex-col gap-10">
        <SectionIntro
          id="ecosystem-heading"
          eyebrow="The ecosystem"
          title="Five communities, one shared purpose"
          lead={`${site.shortName} connects these groups around a common mission: to advance Artificial Intelligence and Data Science in India.`}
        />
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <svg
            viewBox="0 0 480 480"
            aria-hidden="true"
            focusable="false"
            className="mx-auto w-full max-w-[460px]"
          >
            {communities.map((c) => (
              <line
                key={c.title}
                x1={CENTRE.x}
                y1={CENTRE.y}
                x2={c.x}
                y2={c.y}
                stroke="var(--indigo)"
                strokeOpacity="0.35"
                strokeWidth="1.5"
              />
            ))}
            {communities.map((c) => (
              <circle
                key={`node-${c.title}`}
                cx={c.x}
                cy={c.y}
                r="12"
                fill="var(--paper)"
                stroke="var(--indigo)"
                strokeWidth="1.5"
              />
            ))}
            <circle cx={CENTRE.x} cy={CENTRE.y} r="46" fill="var(--indigo)" />
            <text
              x={CENTRE.x}
              y={CENTRE.y + 4}
              textAnchor="middle"
              fill="var(--paper)"
              fontFamily="var(--font-mono)"
              fontSize="13"
              fontWeight="500"
              letterSpacing="1"
            >
              ASSOCADS
            </text>
          </svg>
          <ul className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {communities.map((c) => (
              <li
                key={c.title}
                className={
                  c.title === "Government and institutions"
                    ? "sm:col-span-2"
                    : undefined
                }
              >
                <Link
                  href={c.href}
                  className="group card-link flex h-full flex-col gap-2 rounded-m border border-tone-line bg-paper p-6"
                >
                  <span className="flex items-center justify-between gap-3 font-display text-h3 font-semibold text-ink">
                    {c.title}
                    <ArrowRight
                      aria-hidden="true"
                      size={20}
                      strokeWidth={1.5}
                      className="shrink-0 text-indigo transition-transform duration-150 group-hover:translate-x-0.5"
                    />
                  </span>
                  <span className="text-small text-slate-600">{c.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
