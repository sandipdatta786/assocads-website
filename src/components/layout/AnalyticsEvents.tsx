"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/** Where on the page a link sits, in a few plain words. */
function locationOf(link: Element): string {
  const marked = link.closest<HTMLElement>("[data-track-location]");
  if (marked) return marked.dataset.trackLocation!;
  if (link.closest("[role='dialog']")) return "menu";
  if (link.closest("header")) return "header";
  if (link.closest("footer")) return "footer";
  const section = link.closest("section");
  const label =
    section?.getAttribute("aria-labelledby")?.replace(/-heading$/, "") ??
    section?.getAttribute("aria-label");
  return label ? label.toLowerCase() : "page";
}

/**
 * One listener for the whole site, so the pages stay server components.
 * It reports link clicks only, never what anyone types.
 * - Join: any link to the Join page.
 * - Event registration: a link marked data-track="event-registration".
 * - Download: any link with the download attribute.
 */
export function AnalyticsEvents({ joinHref }: { joinHref: string }) {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const url = new URL(link.href, location.href);
      const page = location.pathname;

      if (link.dataset.track === "event-registration") {
        trackEvent("Event registration click", {
          event: link.dataset.trackEvent ?? page,
        });
      } else if (link.hasAttribute("download")) {
        trackEvent("Download", {
          // A data: link (the calendar file) has no useful path.
          file: url.protocol === "data:" ? "calendar file" : url.pathname,
          page,
        });
      } else if (url.origin === location.origin && url.pathname === joinHref) {
        trackEvent("Join click", { location: locationOf(link), page });
      }
    }
    // Capture, so the click is seen before the page changes.
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, [joinHref]);

  return null;
}
