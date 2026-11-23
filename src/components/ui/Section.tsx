import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type Tone = "paper" | "cloud" | "ink" | "tint";

type SectionProps = ComponentProps<"section"> & {
  /** The surface colour. Components inside pick up matching text colours. */
  tone?: Tone;
  /** "none" removes the vertical padding, for sections that manage their own. */
  spacing?: "normal" | "tight" | "none";
};

export function Section({
  tone = "paper",
  spacing = "normal",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      data-tone={tone}
      className={cn(
        "bg-tone-bg text-tone-fg",
        spacing === "normal" && "py-16 lg:py-28",
        spacing === "tight" && "py-10 lg:py-16",
        className,
      )}
      {...props}
    />
  );
}
