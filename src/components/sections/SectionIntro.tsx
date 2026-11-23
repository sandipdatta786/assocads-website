import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";

/** The eyebrow, h2 and lead that open a page section. */
export function SectionIntro({
  eyebrow,
  title,
  lead,
  action,
  id,
  stacked = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  /** A link shown beside the heading on wide screens and below it on phones. */
  action?: ReactNode;
  /** Id for the heading, so the section can be labelled by it. */
  id?: string;
  /** Keep the action under the heading on wide screens too. */
  stacked?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 lg:mb-14",
        !stacked && "lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="flex max-w-2xl flex-col gap-4">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Heading level={2} id={id}>
          {title}
        </Heading>
        {lead && <Lead>{lead}</Lead>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
