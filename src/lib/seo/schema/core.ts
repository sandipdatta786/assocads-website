/**
 * The building blocks for JSON-LD. Every helper in src/lib/seo/schema builds
 * its values from src/config/site.ts and the content collections, the same
 * sources the visible page uses, so the two cannot disagree.
 */
import { isPlaceholderValue, site } from "@/config/site";

/** A reference to another item by its @id. */
export type Ref = { "@id": string };

/** One item in the JSON-LD graph. */
export type SchemaNode = {
  "@type": string | string[];
  "@id"?: string;
  [property: string]: unknown;
};

/** The organisation's one stable identifier. Every other item refers to it. */
export const ORGANISATION_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

export const organisationRef: Ref = { "@id": ORGANISATION_ID };
export const websiteRef: Ref = { "@id": WEBSITE_ID };

/** The absolute address of a path on this site. */
export function url(path: string): string {
  return path === "/" ? `${site.url}/` : `${site.url}${path}`;
}

/** A value that is filled in: not empty and not a [PLACEHOLDER: ...]. */
export function real(value: string | undefined | null): value is string {
  return Boolean(value?.trim()) && !isPlaceholderValue(value!.trim());
}

/** A schema.org enumeration value, for example EventScheduled. */
export const enumValue = (name: string) => `https://schema.org/${name}`;

/**
 * Removes empty values, and stops the build if a placeholder has slipped
 * through: structured data must never describe something not yet supplied.
 */
export function clean<T>(value: T, where = "structured data"): T {
  if (typeof value === "string") {
    if (value.includes("[PLACEHOLDER")) {
      throw new Error(`${where} contains a placeholder: ${value}`);
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value
      .map((v) => clean(v, where))
      .filter((v) => v !== undefined && v !== "") as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) {
      if (v === undefined || v === null || v === "") continue;
      if (Array.isArray(v) && v.length === 0) continue;
      out[key] = clean(v, `${where} › ${key}`);
    }
    return out as T;
  }
  return value;
}

/** A complete JSON-LD document holding one or more items. */
export function graph(nodes: SchemaNode[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.map((n) => clean(n, String(n["@type"]))),
  };
}
