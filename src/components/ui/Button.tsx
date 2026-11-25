import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill text-center font-medium " +
  "transition-[color,background-color,border-color,transform] duration-150 ease-out max-w-full select-none active:scale-[0.97] " +
  "disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60";

const variants = {
  primary:
    "bg-tone-primary-bg text-tone-primary-fg hover:bg-tone-primary-hover " +
    "in-data-[tone=ink]:hover:text-ink",
  secondary:
    "border border-tone-fg text-tone-fg hover:bg-tone-fg hover:text-tone-invert",
  ghost: "text-tone-link hover:underline underline-offset-4",
  marigold:
    "bg-marigold text-ink-fixed hover:bg-ink-fixed hover:text-marigold " +
    "in-data-[tone=ink]:hover:bg-paper in-data-[tone=ink]:hover:text-ink",
} as const;

const sizes = {
  medium: "min-h-11 px-5 py-2 text-small",
  large: "min-h-12 px-7 py-2.5 text-body",
} as const;

type Shared = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({
  variant = "primary",
  size = "medium",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & Shared) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "medium",
  className,
  ...props
}: ComponentProps<typeof Link> & Shared) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
