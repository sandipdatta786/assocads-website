"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

/** The current time to the minute. The server, and the first render in the
    browser, use the time the page was built; the browser then uses its own
    clock, so dates never go stale on a cached page. */
export function useNow(builtAt: number): number {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => builtAt,
  );
}
