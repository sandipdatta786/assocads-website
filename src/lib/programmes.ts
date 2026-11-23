import { isRegistered } from "@/config/site";

/** The honest "Status" paragraph for a programme, from its status and the legal status. */
export function programmeStatusText(status: "active" | "planned"): string {
  if (status === "active") {
    return "This programme has started. What is happening now is listed on this page.";
  }
  return isRegistered()
    ? "This programme is planned and has not started yet. When it will begin, and how it will work, will be published on this page."
    : "This programme is planned and has not started yet. It will begin after ASSOCADS is registered, and details will be published on this page.";
}
