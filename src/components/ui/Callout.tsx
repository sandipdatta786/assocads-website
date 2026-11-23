import { Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CalloutProps = {
  /** "note" for helpful information; "status" for notices such as registration. */
  variant?: "note" | "status";
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Callout({
  variant = "note",
  title,
  children,
  className,
}: CalloutProps) {
  const Glyph = variant === "note" ? Info : TriangleAlert;
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-s p-4 text-ink sm:p-5",
        variant === "note" ? "bg-indigo-tint" : "bg-marigold-tint",
        className,
      )}
    >
      <Glyph
        aria-hidden="true"
        size={20}
        strokeWidth={1.5}
        className={cn(
          "mt-1 shrink-0",
          variant === "note" ? "text-indigo-deep" : "text-amber-deep",
        )}
      />
      <div className="min-w-0 text-body">
        {title && <p className="font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

/** A clearly marked gap for content the founders have not supplied yet.
    Every use must also be listed in docs/CONTENT_TODO.md. */
export function Placeholder({
  needed,
  className,
}: {
  /** What is missing, for example "registered office address". */
  needed: string;
  className?: string;
}) {
  return (
    <span
      data-placeholder
      className={cn(
        "inline-block max-w-full rounded-s border border-dashed border-slate-500 bg-cloud px-3 py-2 font-mono text-caption break-words text-slate-600 in-data-[tone=ink]:border-slate-400 in-data-[tone=ink]:bg-night in-data-[tone=ink]:text-slate-400",
        className,
      )}
    >
      [PLACEHOLDER: {needed}]
    </span>
  );
}

/** One real figure with its label. Only for numbers that are true today. */
export function StatBlock({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="font-display text-display-l font-bold text-tone-fg">
        {value}
      </span>
      <span className="font-mono text-eyebrow font-medium text-tone-faint uppercase">
        {label}
      </span>
    </div>
  );
}
