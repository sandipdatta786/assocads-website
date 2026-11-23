import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type Crumb = { label: string; href?: string };

/** The last item is the current page and is not a link. */
export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-caption text-tone-faint">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-11 items-center underline-offset-4 hover:text-tone-fg hover:underline",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className="inline-flex min-h-11 items-center text-tone-fg"
                >
                  {item.label}
                </span>
              )}
              {!last && (
                <ChevronRight aria-hidden="true" size={14} strokeWidth={1.5} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
