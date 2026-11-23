import Link from "next/link";
import { SectionIntro } from "@/components/sections/SectionIntro";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { cn } from "@/lib/cn";
import { getProgrammes } from "@/lib/content/loaders";
import { contentIcon } from "@/lib/icons";

export function WhatWeDo() {
  const programmes = getProgrammes();

  return (
    <Section tone="paper" aria-labelledby="programmes-heading">
      <Container>
        <SectionIntro
          id="programmes-heading"
          eyebrow="What we do"
          title="Eight areas of work"
          lead="Each programme comes from the objects in our trust deed. All eight are planned, and each page will say when work begins."
          action={<TextLink href="/programmes">All programmes</TextLink>}
        />
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:gap-6">
          {programmes.map((programme, index) => {
            const featured = index === 0;
            return (
              <li
                key={programme.slug}
                className={cn(
                  "min-w-0 md:col-span-3",
                  featured ? "lg:col-span-4" : "lg:col-span-2",
                )}
              >
                <Link
                  href={`/programmes/${programme.slug}`}
                  className={cn(
                    "group relative isolate flex h-full flex-col gap-5 overflow-hidden rounded-m border border-line p-6 transition-colors duration-150 hover:border-indigo sm:p-8",
                    featured ? "bg-indigo-tint" : "bg-paper",
                  )}
                >
                  {featured && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 [mask-image:linear-gradient(to_right,transparent,black)] lg:block"
                    >
                      <DotGrid />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <Icon
                      icon={contentIcon(programme.icon)}
                      size={28}
                      className="text-indigo"
                    />
                    <Badge
                      status={
                        programme.status === "active" ? "open" : "planned"
                      }
                      label={
                        programme.status === "active" ? "Active" : "Planned"
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-h3 font-semibold text-ink group-hover:text-indigo">
                      {programme.title}
                    </h3>
                    <p
                      className={cn(
                        "text-body text-slate-600",
                        featured && "max-w-md",
                      )}
                    >
                      {programme.tagline}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
