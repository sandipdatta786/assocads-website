"use client";

import { useEffect, useState } from "react";

export type DotTarget = {
  /** The id of the section's heading. */
  id: string;
  /** A short name for the section, shown beside its dot. */
  label: string;
};

/**
 * "On this page" for the long homepage, on wide screens only: a column of
 * dots fixed to the right edge, one per section. Each dot is a link with
 * its section's name, shown on hover or focus, and the dot of the section
 * being read is marked. Nothing moves unless the visitor scrolls.
 */
export function SectionDots({ sections }: { sections: DotTarget[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = new Map<Element, string>();
    for (const { id } of sections) {
      const section = document.getElementById(id)?.closest("section");
      if (section) targets.set(section, id);
    }
    // A section counts as being read when it crosses the middle of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActive(targets.get(entry.target) ?? null);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const el of targets.keys()) observer.observe(el);
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="On this page"
      className="fixed top-1/2 right-3 z-30 hidden -translate-y-1/2 xl:block print:hidden"
    >
      <ol className="flex flex-col items-center rounded-pill border border-line bg-paper py-1.5">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className="group relative flex size-7 items-center justify-center rounded-full"
            >
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-slate-500 transition-[scale,background-color] duration-150 ease-out group-hover:bg-ink group-aria-[current]:scale-150 group-aria-[current]:bg-indigo"
              />
              <span className="pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded-s border border-line bg-paper px-2.5 py-1 text-caption font-medium whitespace-nowrap text-ink opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
                {label}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
