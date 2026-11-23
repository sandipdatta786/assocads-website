import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** A table that scrolls sideways inside its own box on narrow screens,
    so the page itself never scrolls sideways. */
export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Table">
      <table className={cn(className)} {...props} />
    </div>
  );
}
