import Link from "next/link";
import { DotGrid } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import { getProgrammes } from "@/lib/content/loaders";
import { contentIcon } from "@/lib/icons";

/** The eight programmes as a bento grid. The first card is wider and tinted.
    With `rail`, phones get a row of cards to swipe through instead, each
    snapping into place, with the next card peeking in at the edge. */
export function ProgrammeGrid({ rail = false }: { rail?: boolean }) {
  const programmes = getProgrammes();

  return (
    <ul
      className={cn(
        "gap-4 md:grid md:grid-cols-6 lg:gap-6",
        rail
          ? "-mx-5 flex snap-x snap-mandatory scroll-px-5 overflow-x-auto overscroll-x-contain px-5 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:overflow-visible md:px-0 md:pb-0"
          : "grid grid-cols-1",
      )}
    >
      {programmes.map((programme, index) => {
        const featured = index === 0;
        return (
          <li
            key={programme.slug}
            className={cn(
              "min-w-0 md:col-span-3",
              rail &&
                "w-[85%] max-w-sm shrink-0 snap-start md:w-auto md:max-w-none",
              featured ? "lg:col-span-4" : "lg:col-span-2",
            )}
          >
            <Link
              href={`/programmes/${programme.slug}`}
              className={cn(
                "group card-link relative isolate flex h-full flex-col gap-5 overflow-hidden rounded-m border border-line p-6 sm:p-8",
                featured ? "bg-indigo-tint" : "bg-paper",
              )}
            >
              {featured && (
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 [mask-image:linear-gradient(to_right,transparent,black)] lg:block"
                >
                  <DotGrid />
                </div>
              )}
              <div className="flex items-start justify-between gap-4">
                <Icon
                  icon={contentIcon(programme.icon)}
                  size={28}
                  className="text-indigo"
                />
                <Badge
                  status={programme.status === "active" ? "open" : "planned"}
                  label={programme.status === "active" ? "Active" : "Planned"}
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-h3 font-semibold text-ink group-hover:text-indigo">
                  {programme.title}
                </h3>
                <p
                  className={cn(
                    "text-body",
                    // Ink on Indigo Tint is the approved pairing for body text.
                    featured ? "max-w-md text-ink" : "text-slate-600",
                  )}
                >
                  {programme.tagline}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
