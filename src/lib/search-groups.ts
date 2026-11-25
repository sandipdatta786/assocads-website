/** Shared by the search index (server) and the search dialog (browser). */

/** One searchable item. Kept short: the whole index is downloaded the first
    time someone opens search. */
export type SearchEntry = {
  /** Group label, shown as a heading in the results. */
  g: string;
  /** Title. */
  t: string;
  /** A short line under the title, also searched. */
  d: string;
  /** Extra words that should match but are not shown, such as aliases. */
  k?: string;
  /** Address on this site. */
  h: string;
};

/** The order groups appear in the results. */
export const SEARCH_GROUPS = [
  "Pages",
  "Programmes",
  "Who it is for",
  "Events",
  "Insights",
  "Guides",
  "Knowledge Hub",
  "Glossary",
  "Questions",
  "People",
] as const;
