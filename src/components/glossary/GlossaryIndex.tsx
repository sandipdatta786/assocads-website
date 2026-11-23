"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Search } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { inputClass } from "@/components/forms/fields";
import { cn } from "@/lib/cn";

export type GlossaryListItem = {
  slug: string;
  term: string;
  shortDefinition: string;
  aliases: string[];
  draft: boolean;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function letterOf(term: string): string {
  const first = term.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : "#";
}

/** The A to Z list. Every term is in the server-rendered HTML; the quick
    filter only narrows what is shown. */
export function GlossaryIndex({ terms }: { terms: GlossaryListItem[] }) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const matching = q
    ? terms.filter((t) =>
        [t.term, ...t.aliases, t.shortDefinition].some((text) =>
          text.toLowerCase().includes(q),
        ),
      )
    : terms;

  const letters = new Map<string, GlossaryListItem[]>();
  for (const t of matching) {
    const l = letterOf(t.term);
    letters.set(l, [...(letters.get(l) ?? []), t]);
  }
  const present = new Set(terms.map((t) => letterOf(t.term)));

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5 rounded-l bg-cloud p-5 sm:p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor={inputId} className="text-body font-medium text-ink">
            Find a term
          </label>
          <div className="relative sm:max-w-md">
            <Search
              aria-hidden="true"
              size={18}
              strokeWidth={1.5}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-600"
            />
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className={cn(inputClass, "pl-11")}
            />
          </div>
          <p aria-live="polite" className="text-small text-slate-600">
            {q
              ? matching.length === 1
                ? "1 term matches."
                : `${matching.length} terms match.`
              : `${terms.length} terms.`}
          </p>
        </div>
        <nav aria-label="Letters">
          <ul className="flex flex-wrap gap-1">
            {ALPHABET.map((l) => (
              <li key={l}>
                {present.has(l) && (!q || letters.has(l)) ? (
                  <a
                    href={`#letter-${l}`}
                    className="inline-flex size-11 items-center justify-center rounded-s font-mono text-small font-medium text-indigo hover:bg-paper"
                  >
                    {l}
                  </a>
                ) : (
                  <span
                    aria-hidden="true"
                    className="inline-flex size-11 items-center justify-center font-mono text-small text-slate-500"
                  >
                    {l}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {matching.length === 0 ? (
        <p className="text-body text-slate-600">
          No terms match “{query.trim()}”. Try a shorter word, or clear the box
          to see every term.
        </p>
      ) : (
        <div className="flex flex-col gap-12">
          {[...letters.entries()].map(([letter, items]) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              aria-labelledby={`heading-${letter}`}
              className="grid scroll-mt-24 gap-4 md:grid-cols-12 md:gap-8"
            >
              <h2
                id={`heading-${letter}`}
                className="font-display text-h2 font-semibold text-indigo md:col-span-1"
              >
                {letter}
              </h2>
              <ul className="flex flex-col border-t border-line md:col-span-11">
                {items.map((t) => (
                  <li key={t.slug} className="border-b border-line">
                    <Link
                      href={`/glossary/${t.slug}`}
                      className="group flex flex-col gap-1 py-5 md:flex-row md:gap-8"
                    >
                      <span className="flex shrink-0 flex-wrap items-center gap-2 md:w-64">
                        <span className="font-display text-h3 font-semibold text-ink group-hover:text-indigo group-hover:underline">
                          {t.term}
                        </span>
                        {t.draft && <Tag variant="marigold">Draft</Tag>}
                      </span>
                      <span className="text-body text-slate-600">
                        {t.shortDefinition}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
