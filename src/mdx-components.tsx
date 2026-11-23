import type { MDXComponents } from "mdx/types";
import { Figure } from "@/components/mdx/Figure";
import { Table } from "@/components/mdx/Table";
import { Callout, Placeholder, StatBlock } from "@/components/ui/Callout";

/**
 * The approved components that MDX content may use, plus the mapping that
 * makes every Markdown table scroll inside its own box on phones.
 * Add a component here only when content genuinely needs it.
 */
const components = {
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
