"use client";

import { X } from "lucide-react";

/** Hides the status banner for the rest of the browser session. */
export function DismissBanner({ storageKey }: { storageKey: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          sessionStorage.setItem(storageKey, "1");
        } catch {
          // Storage can be unavailable in private windows; hiding still works.
        }
        document.documentElement.dataset.statusBannerDismissed = "";
      }}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill text-ink hover:bg-paper"
    >
      <X aria-hidden="true" size={18} strokeWidth={1.5} />
      <span className="sr-only">Dismiss notice</span>
    </button>
  );
}
