"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Grids whose items reveal one after another rather than as one block. */
const GRID = /(^|\s)(grid|flex-wrap)(\s|$)/;
/** Stagger within a grid stops growing after this many items. */
const MAX_STAGGER = 6;

/**
 * Sections and cards fade in and rise 16px once, as they enter the viewport
 * (brand guide 5.1). Only content below the fold is hidden, and only after
 * this script runs, so nothing flashes on load and everything is visible
 * without JavaScript. With "reduce motion" set, it does nothing.
 *
 * Targets: each block inside a section's container on the current page,
 * except the page header (the first section). A block that is a grid
 * reveals item by item with a short stagger.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const sections = [
      ...document.querySelectorAll<HTMLElement>("main section[data-tone]"),
    ].filter((s) => !s.parentElement?.closest("section[data-tone]"));
    const targets: { el: HTMLElement; index: number }[] = [];
    for (const section of sections.slice(1)) {
      if (section.closest("[data-no-reveal]")) continue;
      const container = section.firstElementChild;
      if (!container) continue;
      for (const block of container.children) {
        if (!(block instanceof HTMLElement)) continue;
        const items = [...block.children].filter(
          (c): c is HTMLElement => c instanceof HTMLElement,
        );
        if (GRID.test(block.className) && items.length > 1) {
          items.forEach((el, i) =>
            targets.push({ el, index: Math.min(i, MAX_STAGGER) }),
          );
        } else {
          targets.push({ el: block, index: 0 });
        }
      }
    }

    const fold = window.innerHeight;
    const pending = targets.filter(
      ({ el }) => el.getBoundingClientRect().top > fold,
    );
    if (pending.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          el.classList.add("reveal-run");
          requestAnimationFrame(() => el.classList.remove("reveal-pending"));
          el.addEventListener(
            "transitionend",
            () => {
              el.classList.remove("reveal-run");
              el.style.removeProperty("--reveal-index");
            },
            { once: true },
          );
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    for (const { el, index } of pending) {
      el.style.setProperty("--reveal-index", String(index));
      el.classList.add("reveal-pending");
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
      for (const { el } of pending) {
        el.classList.remove("reveal-pending", "reveal-run");
        el.style.removeProperty("--reveal-index");
      }
    };
  }, [pathname]);

  return null;
}
