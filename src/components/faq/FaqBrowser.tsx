"use client";

import { Link2, Search } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { inputClass } from "@/components/forms/fields";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { cn } from "@/lib/cn";

export type FaqGroup = {
  id: string;
  label: string;
  items: { id: string; question: string; answer: string }[];
};

/** Opens the question named in the address, for example /faq#who-can-join-assocads. */
function openFromHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (target instanceof HTMLDetailsElement) {
    target.open = true;
    target.scrollIntoView({ block: "start" });
    target.querySelector("summary")?.focus({ preventScroll: true });
  }
}

/** Every question is in the server-rendered HTML. The filter only narrows
    what is shown, and opens the questions that match. */
export function FaqBrowser({ groups }: { groups: FaqGroup[] }) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  const shown = groups
    .map((g) => ({
      ...g,
      items: q
        ? g.items.filter((i) =>
            `${i.question} ${i.answer}`.toLowerCase().includes(q),
          )
        : g.items,
    }))
    .filter((g) => g.items.length > 0);
  const count = shown.reduce((n, g) => n + g.items.length, 0);

  useEffect(() => {
    const onHash = () => {
      setQuery("");
      requestAnimationFrame(openFromHash);
    };
    openFromHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-5 rounded-l bg-cloud p-5 sm:p-6">
        <div className="flex flex-col gap-2">
          <label htmlFor={inputId} className="text-body font-medium text-ink">
            Find a question
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
              className={cn(inputClass, "pl-11")}
            />
          </div>
          <p aria-live="polite" className="text-small text-slate-600">
            {q
              ? count === 1
                ? "1 question matches."
                : `${count} questions match.`
              : `${total} questions in ${groups.length} groups.`}
          </p>
        </div>
        <nav aria-label="Question groups">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {shown.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="inline-flex min-h-11 items-center text-small font-medium text-indigo underline-offset-4 hover:underline"
                >
                  {g.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {shown.length === 0 ? (
        <p className="text-body text-slate-600">
          No questions match “{query.trim()}”. Try a shorter word, or clear the
          box to see every question.
        </p>
      ) : (
        shown.map((g) => (
          <section
            key={g.id}
            id={g.id}
            aria-labelledby={`${g.id}-heading`}
            className="grid scroll-mt-24 gap-4 lg:grid-cols-12 lg:gap-12"
          >
            <h2
              id={`${g.id}-heading`}
              className="font-display text-h3 font-semibold text-ink lg:col-span-4"
            >
              {g.label}
            </h2>
            <Accordion className="lg:col-span-8">
              {g.items.map((item) => (
                <AccordionItem
                  // A new key when filtering, so matches open and the rest
                  // return to closed when the box is cleared.
                  key={`${item.id}-${q ? "open" : "closed"}`}
                  id={item.id}
                  question={item.question}
                  defaultOpen={Boolean(q)}
                >
                  <p>{item.answer}</p>
                  <a
                    href={`#${item.id}`}
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-small font-medium text-indigo underline-offset-4 hover:underline"
                  >
                    <Link2 aria-hidden="true" size={16} strokeWidth={1.5} />
                    Link to this question
                  </a>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))
      )}
    </div>
  );
}
