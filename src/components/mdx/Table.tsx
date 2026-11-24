import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/** The plain text inside a React node. */
function text(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(text).join("");
  if (isValidElement<{ children?: ReactNode }>(node))
    return text(node.props.children);
  return "";
}

/** The column headings of a table (its first row of th cells). */
function headings(node: ReactNode): string[] {
  for (const child of Children.toArray(node)) {
    if (!isValidElement<{ children?: ReactNode }>(child)) continue;
    if (child.type === "th") return [text(child.props.children).trim()];
    if (child.type === "tr") {
      const cells = Children.toArray(child.props.children).filter(
        (c) => isValidElement(c) && c.type === "th",
      );
      if (cells.length) return cells.map((c) => text(c).trim());
    }
    const found = headings(child.props.children);
    if (found.length) return found;
  }
  return [];
}

/** A table that scrolls sideways inside its own box on narrow screens,
    so the page itself never scrolls sideways. The box can take keyboard
    focus so that it can be scrolled, and is named after the table's
    column headings, so that two tables on one page have different names. */
export function Table({
  className,
  children,
  ...props
}: ComponentProps<"table">) {
  const cols = headings(children).filter(Boolean);
  const label = cols.length ? `Table: ${cols.join(", ")}` : "Table";
  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-label={label}>
      <table className={cn(className)} {...props}>
        {children}
      </table>
    </div>
  );
}
