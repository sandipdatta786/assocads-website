import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { Figure } from "@/components/mdx/Figure";
import { Table } from "@/components/mdx/Table";
import { Callout, Placeholder, StatBlock } from "@/components/ui/Callout";
import { slugify, textOf } from "@/lib/headings";

/* Headings get an id from their text, so "On this page" can link to them
   and anyone can link to a section. outline() in src/lib/headings.ts makes
   the same ids from the source. */
function H2({ children, ...props }: ComponentProps<"h2">) {
  return (
    <h2 id={slugify(textOf(children))} className="scroll-mt-24" {...props}>
      {children}
    </h2>
  );
}

function H3({ children, ...props }: ComponentProps<"h3">) {
  return (
    <h3 id={slugify(textOf(children))} className="scroll-mt-24" {...props}>
      {children}
    </h3>
  );
}

/**
 * The approved components that MDX content may use, plus the mapping that
 * makes every Markdown table scroll inside its own box on phones.
 * Add a component here only when content genuinely needs it.
 */
const components = {
  h2: H2,
  h3: H3,
  table: Table,
  Callout,
  Placeholder,
  StatBlock,
  Table,
  Figure,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
