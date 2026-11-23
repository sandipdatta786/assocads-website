/**
 * The old site was a single page with #anchors. The part after # never
 * reaches the server, so a tiny script on the home page sends visitors who
 * follow an old link, such as /#programs, to the matching new page.
 */
export const OLD_ANCHORS: Record<string, string> = {
  about: "/about",
  leaders: "/about/trustees",
  programs: "/programmes",
  plan: "/about/roadmap",
  goals: "/about/objects",
  membership: "/membership",
  events: "/events",
  news: "/insights",
  contact: "/contact",
  faq: "/faq",
};

// Runs as the page loads, and again if the address changes to an old anchor
// while the home page is open. It does nothing on any other page, where the
// same names may be real sections (the privacy notice has #contact).
const script = `(function(){var m=${JSON.stringify(OLD_ANCHORS)};function go(){if(location.pathname!=="/")return;var h=location.hash.slice(1).toLowerCase();if(Object.prototype.hasOwnProperty.call(m,h))location.replace(m[h]);}go();addEventListener("hashchange",go);})();`;

export function OldAnchorRedirect() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
