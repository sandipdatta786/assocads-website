"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_THEME_CHOICE,
  THEME_STORAGE_KEY,
  isNightHour,
  type ThemeChoice,
} from "@/lib/theme";

/* One store for every theme control on the page, so the header and footer
   controls always agree. */

const listeners = new Set<() => void>();
const DARK_QUERY = "(prefers-color-scheme: dark)";

function readChoice(): ThemeChoice {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" || v === "system" || v === "time"
      ? v
      : DEFAULT_THEME_CHOICE;
  } catch {
    return DEFAULT_THEME_CHOICE;
  }
}

function systemDark(): boolean {
  return window.matchMedia(DARK_QUERY).matches;
}

/** Puts the theme for this choice on <html>. */
function apply(choice: ThemeChoice) {
  const dark =
    choice === "dark" ||
    (choice === "system" && systemDark()) ||
    (choice === "time" && isNightHour(new Date().getHours()));
  const next = dark ? "dark" : "light";
  if (document.documentElement.dataset.theme !== next)
    document.documentElement.dataset.theme = next;
}

/* Following the clock: check once a minute, and when the tab comes back
   into view, so the theme turns at 7 pm and 7 am without a reload. */
function followClock() {
  if (readChoice() !== "time") return;
  const before = document.documentElement.dataset.theme;
  apply("time");
  if (document.documentElement.dataset.theme !== before)
    listeners.forEach((l) => l());
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
  window.setInterval(followClock, 60_000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") followClock();
  });
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setThemeChoice(choice: ThemeChoice) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, choice);
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
