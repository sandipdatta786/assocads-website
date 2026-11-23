import { graph, type SchemaNode } from "@/lib/seo/schema";

/**
 * JSON-LD structured data for search engines and AI assistants.
 * Build the items with the helpers in src/lib/seo/schema.
 */
export function JsonLd({ items }: { items: (SchemaNode | null)[] }) {
  const nodes = items.filter((n): n is SchemaNode => n !== null);
  if (nodes.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // "<" is escaped so no value can close the script element.
        __html: JSON.stringify(graph(nodes)).replace(/</g, "\\u003c"),
      }}
    />
  );
}
