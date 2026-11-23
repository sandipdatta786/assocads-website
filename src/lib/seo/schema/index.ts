/**
 * Typed helpers for the site's JSON-LD structured data (blueprint section 4.6).
 * Render the result with the JsonLd component in src/components/seo.
 */
export * from "./core";
export * from "./organisation";
export {
  aboutPage,
  breadcrumbList,
  contactPage,
  faqPage,
  plainPage,
  type QuestionAndAnswer,
} from "./pages";
export * from "./content";
