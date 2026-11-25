"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type ThemeChoice } from "@/lib/theme";

/* One store for every theme control on the page, so the header and footer
   controls always agree. */

const listeners = new Set<() => void>();
const DARK_QUERY = "(prefers-color-scheme: dark)";

function readChoice(): ThemeChoice {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function systemDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

/** Puts the theme for this choice on <html>. */
function apply(choice: ThemeChoice) {
  const dark = choice === "dark" || (choice === "system" && systemDark());
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

let started = false;
function start() {
  if (started) return;
  started = true;
  // Following the system: change with it.
  window.matchMedia(DARK_QUERY).addEventListener("change", () => {
    if (readChoice() === "system") apply("system");
    listeners.forEach((l) => l());
  });
  // Another tab changed the choice.
  window.addEventListener("storage", (e) => {
    if (e.key !== THEME_STORAGE_KEY) return;
    apply(readChoice());
    listeners.forEach((l) => l());
  });
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setThemeChoice(choice: ThemeChoice) {
  try {
    if (choice === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Storage blocked: the theme still changes for this page.
  }
  apply(choice);
  listeners.forEach((l) => l());
}

/** The visitor's choice, and the theme in use. Null before hydration. */
export function useTheme(): { choice: ThemeChoice; dark: boolean } | null {
  const choice = useSyncExternalStore(subscribe, readChoice, () => null);
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme === "dark",
    () => null,
  );
  return choice === null || dark === null ? null : { choice, dark };
}
