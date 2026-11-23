import type { ReactNode } from "react";
import { isValidElement } from "react";

/** "What does a data scientist do?" → "what-does-a-data-scientist-do". */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}

/** The plain text of rendered MDX children, for heading anchors. */
export function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node))
    return textOf(node.props.children);
  return "";
}

/** Strip inline Markdown so a source heading reads as it renders. */
function plain(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

/** The second-level headings of an MDX body, for "On this page".
    The ids match those given by the h2 component in src/mdx-components.tsx. */
export function outline(body: string): { id: string; text: string }[] {
  const seen = new Set<string>();
  const items: { id: string; text: string }[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (line.trim().startsWith("```")) inFence = !inFence;
    const match = !inFence && /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = plain(match[1]);
    const id = slugify(text);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    items.push({ id, text });
  }
  return items;
}
