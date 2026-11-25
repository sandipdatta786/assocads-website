import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const tagVariants = {
  indigo: "bg-indigo-tint text-indigo-deep",
  marigold: "bg-marigold-tint text-amber-deep",
  neutral: "bg-cloud text-slate-600",
  outline: "border border-tone-line text-tone-muted",
} as const;

type TagProps = ComponentProps<"span"> & {
  variant?: keyof typeof tagVariants;
};

export function Tag({ variant = "indigo", className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-caption font-medium",
        tagVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

const statuses = {
  // Teal text has no dark pairing; in the dark theme the label is the
  // text colour and the teal dot carries the colour (3.6:1 on Ink).
  open: { label: "Open", dot: "bg-teal", text: "text-teal dark:text-ink" },
  upcoming: { label: "Upcoming", dot: "bg-indigo", text: "text-indigo" },
  closed: { label: "Closed", dot: "bg-slate-500", text: "text-slate-600" },
  planned: { label: "Planned", dot: "bg-amber-deep", text: "text-amber-deep" },
} as const;

type BadgeProps = Omit<ComponentProps<"span">, "children"> & {
  status: keyof typeof statuses;
  /** Overrides the default wording, for example "Registration open". */
  label?: string;
};

/** A status marker. The wording always carries the meaning, never colour alone. */
export function Badge({ status, label, className, ...props }: BadgeProps) {
  const s = statuses[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border border-line bg-paper px-3 py-1 text-caption font-medium",
        s.text,
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className={cn("size-2 rounded-pill", s.dot)} />
      {label ?? s.label}
    </span>
  );
}
