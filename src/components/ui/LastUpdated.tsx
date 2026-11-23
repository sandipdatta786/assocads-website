import { cn } from "@/lib/cn";
import { formatLongDate } from "@/lib/publishing";

/**
 * "Last updated 23 November 2026". The same date goes into the sitemap and
 * the page's dateModified, so all three agree. data-page-date marks it as the
 * page's own date, which "pnpm seo:check" compares with the other two.
 */
export function LastUpdated({
  date,
  label = "Last updated",
  className,
}: {
  /** YYYY-MM-DD. */
  date: string;
  label?: string;
  className?: string;
}) {
  return (
    <p className={cn("font-mono text-small text-slate-600", className)}>
      {label}{" "}
      <time dateTime={date} data-page-date="">
        {formatLongDate(date)}
      </time>
    </p>
  );
}
