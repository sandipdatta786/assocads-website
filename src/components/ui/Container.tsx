import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = ComponentProps<"div"> & {
  /** "content" is the 1200px page width; "reading" is the 720px text column. */
  width?: "content" | "reading";
};

export function Container({
  width = "content",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        width === "content" ? "max-w-content" : "max-w-reading",
        className,
      )}
      {...props}
    />
  );
}
