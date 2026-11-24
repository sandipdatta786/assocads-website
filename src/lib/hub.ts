import type { HubEntry } from "@/lib/content/schemas";

/** How each kind of Knowledge Hub entry is named and described on the site. */
export const hubKindLabels: Record<HubEntry["kind"], string> = {
  article: "Article",
  "white-paper": "White paper",
  research: "Research publication",
  "case-study": "Case study",
  "industry-insight": "Industry insight",
  tool: "AI tool",
  framework: "Framework",
  "regulation-update": "Regulation update",
};

/** The order the sections appear on the Knowledge Hub page. */
export const hubKindOrder: HubEntry["kind"][] = [
  "regulation-update",
  "research",
  "white-paper",
  "framework",
  "tool",
  "case-study",
  "industry-insight",
  "article",
];

export const hubKindDescriptions: Record<HubEntry["kind"], string> = {
  article:
    "Explanations written for students, professionals and organisations.",
  "white-paper":
    "Longer reports on a single question, with the evidence behind them.",
  research:
    "Research publications from ASSOCADS and from others, with links to the originals.",
  "case-study":
    "What happened when an organisation used AI or data, and what it learned.",
  "industry-insight":
    "Trends and practical observations from people working in the field.",
  tool: "AI and data tools worth knowing about. Listed for information, not endorsed.",
  framework: "Frameworks and standards for building and governing AI systems.",
  "regulation-update":
    "What has changed in AI and data regulation, and what it means in practice.",
};
