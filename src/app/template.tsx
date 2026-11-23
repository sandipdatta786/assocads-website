import { ViewTransition, type ReactNode } from "react";

/**
 * A template remounts on every navigation, so the page content gets a short
 * crossfade through the View Transitions API (classes in globals.css).
 * Browsers without the API change page as normal.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
