"use client";

import { useSyncExternalStore } from "react";

/* Query parameters kept in the address without a page reload. Next.js keeps
   its router in step with window.history.replaceState. */

const QUERY_EVENT = "assocads:query";

function subscribeQuery(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(QUERY_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(QUERY_EVENT, onChange);
  };
}

export function useQuery(): URLSearchParams {
  const search = useSyncExternalStore(
    subscribeQuery,
    () => window.location.search,
    () => "",
  );
  return new URLSearchParams(search);
}

export function setQuery(key: string, value: string | null) {
  const params = new URLSearchParams(window.location.search);
  if (value) params.set(key, value);
  else params.delete(key);
  const query = params.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${query ? `?${query}` : ""}`,
  );
  window.dispatchEvent(new Event(QUERY_EVENT));
}
