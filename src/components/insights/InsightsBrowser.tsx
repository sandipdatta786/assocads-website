"use client";

import Link from "next/link";
import { useRef } from "react";
import { FilterGroup } from "@/components/ui/FilterGroup";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import { formatLongDate, insightCategoryLabels } from "@/lib/publishing";
import { setQuery, useQuery } from "@/lib/query";

export const PAGE_SIZE = 12;

type Category = keyof typeof insightCategoryLabels;

export type InsightListItem = {
  slug: string;
  title: string;
  summary: string;
  category: Category;
  publishedDate: string;
  readingMinutes: number;
};

function Meta({
  item,
  featured,
}: {
  item: InsightListItem;
  featured: boolean;
}) {
  // Slate 600 is not an approved pairing on Indigo Tint, so the featured
  // card uses Ink.
  return (
    <span
      className={cn(
        "flex flex-wrap gap-x-2 text-small",
        featured ? "text-ink" : "text-slate-600",
      )}
    >
      <time dateTime={item.publishedDate}>
        {formatLongDate(item.publishedDate)}
      </time>
      <span aria-hidden="true">·</span>
      <span>{item.readingMinutes} min read</span>
    </span>
  );
}

export function InsightCard({
  item,
  featured = false,
}: {
  item: InsightListItem;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "group card-link relative flex h-full flex-col gap-4 rounded-m border p-6",
        featured
          ? "border-transparent bg-indigo-tint sm:p-10 lg:p-12"
          : "border-line bg-paper",
      )}
    >
      <Tag variant={featured ? "neutral" : "indigo"} className="w-fit">
        {insightCategoryLabels[item.category]}
      </Tag>
      <h3
        className={cn(
          "font-display font-semibold text-ink group-hover:text-indigo",
          featured ? "max-w-[28ch] text-h2" : "text-h3",
        )}
      >
        <Link
          href={`/insights/${item.slug}`}
          className="after:absolute after:inset-0 after:rounded-l"
        >
          {item.title}
        </Link>
      </h3>
      <p
        className={cn(
          featured
            ? "max-w-[34em] text-lead text-ink"
            : "text-body text-slate-600",
        )}
      >
        {item.summary}
      </p>
      <div className="mt-auto pt-2">
        <Meta item={item} featured={featured} />
      </div>
    </article>
  );
}

export function InsightsBrowser({ items }: { items: InsightListItem[] }) {
  const query = useQuery();
  const listRef = useRef<HTMLDivElement>(null);

  const options = Object.entries(insightCategoryLabels)
    .filter(([value]) => items.some((i) => i.category === value))
    .map(([value, label]) => ({ value: value as Category, label }));
  const param = query.get("category");
  const category = options.some((o) => o.value === param)
    ? (param as Category)
    : null;

  const matching = category
    ? items.filter((i) => i.category === category)
    : items;
  const pages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const requested = Number.parseInt(query.get("page") ?? "1", 10);
  const page =
    Number.isFinite(requested) && requested >= 1 && requested <= pages
      ? requested
      : 1;
  const shown = matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const [first, ...rest] = shown;
  const featureFirst = page === 1 && first !== undefined;

  function goTo(next: number) {
    setQuery("page", next === 1 ? null : String(next));
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    listRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    listRef.current?.focus({ preventScroll: true });
  }

  const pageButton =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill border px-4 text-small font-medium transition-colors duration-150";

  return (
    <div className="flex flex-col gap-10">
      {options.length > 1 && (
        <div className="flex flex-col gap-3 rounded-l bg-cloud p-5 sm:p-6">
          <FilterGroup
            label="Filter by category"
            allLabel="All"
            options={options}
            value={category}
            onChange={(v) => {
              setQuery("category", v);
              setQuery("page", null);
            }}
          />
          <p aria-live="polite" className="text-small text-slate-600">
            {matching.length === 1 ? "1 item" : `${matching.length} items`}
            {pages > 1 ? `, page ${page} of ${pages}.` : "."}
          </p>
        </div>
      )}

      <div
        ref={listRef}
        tabIndex={-1}
        className="flex scroll-mt-24 flex-col gap-6 outline-none"
      >
        <h2 className="sr-only">
          {category ? insightCategoryLabels[category] : "All items"}
          {pages > 1 ? `, page ${page}` : ""}
        </h2>
        {featureFirst && <InsightCard item={first} featured />}
        {(featureFirst ? rest : shown).length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {(featureFirst ? rest : shown).map((item) => (
              <li key={item.slug}>
                <InsightCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {pages > 1 && (
        <nav aria-label="Pages" className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => goTo(page - 1)}
            className={cn(
              pageButton,
              "border-ink text-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:border-line disabled:text-slate-500",
            )}
          >
            Previous
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-current={n === page ? "page" : undefined}
              aria-label={`Page ${n}`}
              onClick={() => goTo(n)}
              className={cn(
                pageButton,
                n === page
                  ? "border-ink bg-ink text-paper"
                  : "border-slate-500 text-ink hover:border-ink",
              )}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={page === pages}
            onClick={() => goTo(page + 1)}
            className={cn(
              pageButton,
              "border-ink text-ink hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:border-line disabled:text-slate-500",
            )}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
