import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentProps<"div"> & {
  /** Adds the single soft brand shadow. Use sparingly. */
  raised?: boolean;
  radius?: "s" | "m" | "l";
};

export function Card({
  raised = false,
  radius = "m",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "border border-tone-line bg-tone-card p-6 text-tone-fg sm:p-8",
        radius === "s" && "rounded-s",
        radius === "m" && "rounded-m",
        radius === "l" && "rounded-l",
        raised && "shadow-card",
        className,
      )}
      {...props}
    />
  );
}

/** A grid of cards of different widths. Stacks to one column on phones. */
export function BentoGrid({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-6 lg:gap-6",
        className,
      )}
      {...props}
    />
  );
}

const spans = {
  2: "md:col-span-3 lg:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-6 lg:col-span-4",
  6: "md:col-span-6",
} as const;

type BentoCellProps = CardProps & {
  /** Width in sixths of the grid on large screens. */
  span?: keyof typeof spans;
};

export function BentoCell({ span = 2, className, ...props }: BentoCellProps) {
  return <Card className={cn("min-w-0", spans[span], className)} {...props} />;
}
