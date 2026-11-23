import Link from "next/link";
import { DotGrid } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";
import { getProgrammes } from "@/lib/content/loaders";
import { contentIcon } from "@/lib/icons";

/** The eight programmes as a bento grid. The first card is wider and tinted. */
export function ProgrammeGrid() {
  const programmes = getProgrammes();

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:gap-6">
      {programmes.map((programme, index) => {
        const featured = index === 0;
        return (
          <li
            key={programme.slug}
            className={cn(
              "min-w-0 md:col-span-3",
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
                    "text-body text-slate-600",
                    featured && "max-w-md",
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
