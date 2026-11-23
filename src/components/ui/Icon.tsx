import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type IconProps = {
  /** A Lucide icon component, for example `GraduationCap`. */
  icon: LucideIcon;
  size?: number;
  className?: string;
  /** Give a label only when the icon carries meaning on its own. */
  label?: string;
};

/** Lucide icons at the brand's 1.5px stroke. Decorative unless a label is given. */
export function Icon({ icon: Glyph, size = 24, className, label }: IconProps) {
  return (
    <Glyph
      size={size}
      strokeWidth={1.5}
      className={cn("shrink-0", className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-tone-line", className)} />;
}
