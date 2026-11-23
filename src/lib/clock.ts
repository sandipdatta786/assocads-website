import { cacheLife } from "next/cache";

/**
 * The time the page was built, refreshed daily. Cache Components does not
 * allow reading the clock while prerendering, so the time is cached; pages
 * pass it to client components, which then use the visitor's own clock.
 */
export async function builtAt(): Promise<number> {
  "use cache";
  cacheLife("days");
  return Date.now();
}
