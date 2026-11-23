"use client";

import { cn } from "@/lib/cn";

/** A row of toggle chips: one "all" chip and one per option. */
export function FilterGroup<T extends string>({
  label,
  allLabel,
  options,
  value,
  onChange,
}: {
  label: string;
  allLabel: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (value: T | null) => void;
}) {
  const chip =
    "min-h-11 rounded-pill border px-4 text-small font-medium transition-colors duration-150";
  const on = "border-ink bg-ink text-paper";
  const off = "border-slate-500 bg-paper text-ink hover:border-ink";
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={value === null}
        onClick={() => onChange(null)}
        className={cn(chip, value === null ? on : off)}
      >
        {allLabel}
      </button>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(value === o.value ? null : o.value)}
          className={cn(chip, value === o.value ? on : off)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
