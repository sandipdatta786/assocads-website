import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type TextLinkProps = ComponentProps<typeof Link> & {
  /** Show a trailing arrow. On by default. */
  arrow?: boolean;
};

export function TextLink({
  arrow = true,
  className,
  children,
  ...props
}: TextLinkProps) {
  return (
    <Link
      className={cn(
        "group inline-flex min-h-11 items-center gap-1.5 font-medium text-tone-link underline-offset-4 hover:underline",
        className,
      )}
      {...props}
    >
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          size={16}
          strokeWidth={1.5}
          className="transition-transform duration-150 ease-out group-hover:translate-x-0.5"
        />
      )}
    </Link>
  );
}
