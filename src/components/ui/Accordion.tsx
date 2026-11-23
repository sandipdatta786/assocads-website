import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AccordionItemProps = {
  question: string;
  children: ReactNode;
  /** Sets an anchor so the question can be linked to directly. */
  id?: string;
  defaultOpen?: boolean;
};

/** Built on the native details element, so it works without JavaScript and
    its content stays in the HTML for search engines. */
export function AccordionItem({
  question,
  children,
  id,
  defaultOpen,
}: AccordionItemProps) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="group border-b border-tone-line"
    >
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium text-tone-fg [&::-webkit-details-marker]:hidden">
        <span>{question}</span>
        <Plus
          aria-hidden="true"
          size={20}
          strokeWidth={1.5}
          className="shrink-0 text-tone-faint transition-transform duration-300 ease-out group-open:rotate-45"
        />
      </summary>
      <div className="max-w-[68ch] pb-6 text-tone-muted">{children}</div>
    </details>
  );
}

export function Accordion({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("border-t border-tone-line", className)}>{children}</div>
  );
}
