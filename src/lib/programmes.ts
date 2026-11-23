import { isRegistered, site } from "@/config/site";
import { numberWord } from "@/lib/words";

/** The honest "Status" paragraph for a programme, from its status and the legal status. */
export function programmeStatusText(status: "active" | "planned"): string {
  if (status === "active") {
    return "This programme has started. What is happening now is listed on this page.";
  }
  return isRegistered()
    ? "This programme is planned and has not started yet. When it will begin, and how it will work, will be published on this page."
    : "This programme is planned and has not started yet. It will begin after ASSOCADS is registered, and details will be published on this page.";
}

/**
 * The answer-first opening paragraph of a programme page: what the programme
 * is, what it aims to do and whether it has started, composed from content.
 */
export function programmeLead(
  p: { title: string; purpose: string; status: "active" | "planned" },
  count: number,
): string {
  const aim = p.purpose.replace(/^To /, "to ");
  if (p.status === "active") {
    return `${p.title} is one of the ${numberWord(count)} programme areas of ${site.shortName}. It aims ${aim} ${programmeStatusText(p.status)}`;
  }
  const start = isRegistered()
    ? "It has not started yet; this page will say when it begins."
    : "It has not started yet, and will begin after the trust is registered.";
  return `${p.title} is one of the ${numberWord(count)} planned programme areas of ${site.shortName}. It aims ${aim} ${start}`;
}
