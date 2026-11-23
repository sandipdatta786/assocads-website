import type { MDXContent } from "mdx/types";

export type MdxCollection =
  "programmes" | "audiences" | "events" | "insights" | "guides" | "glossary";

/**
 * The compiled body of one MDX file, ready to render as <Body />.
 * Front matter is stripped by remark-frontmatter; read it through the loaders.
 * Wrap the result in the Prose component for styling.
 */
export async function loadMdxBody(
  collection: MdxCollection,
  slug: string,
): Promise<MDXContent> {
  const mod = (await import(`../../../content/${collection}/${slug}.mdx`)) as {
    default: MDXContent;
  };
  return mod.default;
}
