import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const headingSizes = {
  "display-xl": "text-display-xl font-bold",
  "display-l": "text-display-l font-bold",
  h2: "text-h2 font-semibold",
  h3: "text-h3 font-semibold",
} as const;

type HeadingProps = ComponentProps<"h1"> & {
  /** The semantic level. Each page has exactly one level 1. */
  level: 1 | 2 | 3 | 4;
  /** The visual size. Defaults to the size that matches the level. */
  size?: keyof typeof headingSizes;
};

export function Heading({ level, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  const visual =
    size ?? (level === 1 ? "display-l" : level === 2 ? "h2" : "h3");
  return (
    <Tag
      className={cn(
        "font-display text-tone-fg",
        headingSizes[visual],
        className,
      )}
      {...props}
    />
  );
}

export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-mono text-eyebrow font-medium text-tone-faint uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function Lead({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("max-w-[34em] text-lead text-tone-muted", className)}
      {...props}
    />
  );
}

/** Wrapper for long-form MDX content. Styles live in globals.css under .prose. */
export function Prose({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("prose", className)} {...props} />;
}
