import { organisationRef, url, websiteRef, type SchemaNode } from "./core";

export type Crumb = { label: string; href?: string };

/**
 * The breadcrumb trail, built from the same items the visible breadcrumbs
 * show. The last item is the current page, which has no link.
 */
export function breadcrumbList(items: Crumb[]): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href && i < items.length - 1 ? url(item.href) : undefined,
    })),
  };
}

type PageInput = {
  /** The page's path, for example "/about". */
  path: string;
  /** The page's h1. */
  name: string;
  description: string;
  /** YYYY-MM-DD: the "Last updated" date the page shows. */
  dateModified?: string;
  /** The @id of the page's main subject, such as a glossary term. */
  mainEntity?: string;
};

function webPage(
  type: string,
  { path, name, description, dateModified, mainEntity }: PageInput,
) {
  return {
    "@type": type,
    "@id": url(path),
    url: url(path),
    name,
    description,
    dateModified,
    inLanguage: "en-IN",
    isPartOf: websiteRef,
    mainEntity: mainEntity ? { "@id": mainEntity } : undefined,
  };
}

/** An ordinary page, published by the organisation. */
export function plainPage(page: PageInput): SchemaNode {
  return { ...webPage("WebPage", page), publisher: organisationRef };
}

/** An About page: about the organisation. */
export function aboutPage(page: PageInput): SchemaNode {
  return {
    ...webPage("AboutPage", page),
    about: organisationRef,
    publisher: organisationRef,
  };
}

/** The Contact page. Its main subject is the organisation, which carries the ContactPoint. */
export function contactPage(page: PageInput): SchemaNode {
  return {
    ...webPage("ContactPage", page),
    about: organisationRef,
    mainEntity: organisationRef,
    publisher: organisationRef,
  };
}

export type QuestionAndAnswer = { question: string; answer: string };

/**
 * Questions and answers, exactly as the page shows them. Emit this only from
 * the component that renders the same list.
 */
export function faqPage(path: string, faqs: QuestionAndAnswer[]): SchemaNode {
  return {
    "@type": "FAQPage",
    "@id": `${url(path)}#questions`,
    url: url(path),
    isPartOf: websiteRef,
    publisher: organisationRef,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
