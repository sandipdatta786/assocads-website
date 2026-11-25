import type { ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { PendingNodes } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { RelatedLink } from "@/lib/related";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  /** h2 on a page of its own, h3 inside a home page section. */
  headingLevel?: 2 | 3;
  /** The panel colour: Cloud on a Paper section, Paper on a Cloud section. */
  surface?: "cloud" | "paper";
  /** One or two honest sentences on what will appear here and when. */
  children: ReactNode;
  /** Buttons and text links, for example "Register your interest". */
  actions?: ReactNode;
  /** Sections that already have content; see relatedWithContent. */
  related?: RelatedLink[];
  className?: string;
};

/**
 * The shared "nothing published yet" panel. It says plainly that nothing is
 * here yet (truthfulness rule 1), offers one useful next step, and points to
 * sections that already have content. The graphic, from tablet width up
 * so it never sits behind text on a phone, is the node motif with its last
 * nodes still dashed outlines.
 */
export function EmptyState({
  icon,
  title,
  headingLevel = 2,
  surface = "cloud",
  children,
  actions,
  related = [],
  className,
}: EmptyStateProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const RelatedHeading = headingLevel === 2 ? "h3" : "h4";
  return (
    <div className={cn("flex flex-col gap-4 lg:gap-6", className)}>
      <div
        className={cn(
          "relative isolate flex flex-col gap-6 overflow-hidden rounded-l border border-line p-8 sm:p-10 lg:p-14",
          surface === "cloud" ? "bg-cloud" : "bg-paper",
        )}
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 [mask-image:linear-gradient(to_right,transparent,black_70%)] opacity-70 md:block"
        >
          <PendingNodes />
        </div>
        <Icon icon={icon} size={32} className="text-indigo" />
        <div className="flex max-w-2xl flex-col gap-4">
          <Heading
            className={cn(
              "font-display font-semibold text-ink",
              headingLevel === 2 ? "text-h2" : "text-h3",
            )}
          >
            {title}
          </Heading>
          <div className="text-body text-slate-600">{children}</div>
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {actions}
          </div>
        )}
      </div>
      {related.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {related.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="card-link flex h-full flex-col gap-3 rounded-m border border-line bg-paper p-6 sm:p-8"
              >
                <RelatedHeading className="font-display text-h3 font-semibold text-ink">
                  {link.title}
                </RelatedHeading>
                <span className="text-body text-slate-600">{link.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
