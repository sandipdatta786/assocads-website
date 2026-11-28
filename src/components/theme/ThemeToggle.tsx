"use client";

import { Monitor, Moon, Sun, SunMoon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ThemeChoice } from "@/lib/theme";
import { setThemeChoice, useTheme } from "./themeStore";

/** The header's switch: one button, pressed when the dark theme is on. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const dark = theme?.dark ?? false;
  return (
    <button
      type="button"
      aria-pressed={theme ? dark : undefined}
      aria-label="Dark theme"
      title={dark ? "Use the light theme" : "Use the dark theme"}
      onClick={() => setThemeChoice(dark ? "light" : "dark")}
      className={cn(
        "size-11 shrink-0 items-center justify-center rounded-pill text-ink transition-colors duration-150 hover:bg-cloud",
        // Display comes from className, so the header can hide it on phones.
        className ?? "inline-flex",
      )}
    >
      {/* Both icons are drawn and CSS picks one, so the right one shows
          before JavaScript runs. */}
      <Moon
        aria-hidden="true"
        size={20}
        strokeWidth={1.75}
        className="dark:hidden"
      />
      <Sun
        aria-hidden="true"
        size={20}
        strokeWidth={1.75}
        className="hidden dark:block"
      />
    </button>
  );
}

const choices: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
  { value: "time", label: "Time of day", icon: SunMoon },
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

/** The footer's choice of Time of day (the default: dark from 7 pm to
    7 am on the visitor's clock), System, Light or Dark. */
export function ThemeChoices() {
  const theme = useTheme();
  return (
    <div
      role="group"
      aria-labelledby="theme-choices-label"
      className="flex flex-wrap items-center gap-3"
    >
      <span id="theme-choices-label" className="text-small text-tone-muted">
        Theme
      </span>
      <div className="grid grid-cols-2 rounded-l border border-tone-line p-0.5 sm:flex sm:rounded-pill">
        {choices.map(({ value, label, icon: Icon }) => {
          const on = theme?.choice === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={theme ? on : undefined}
              title={
                value === "time"
                  ? "Dark from 7 pm to 7 am, by your device's clock"
                  : undefined
              }
              onClick={() => setThemeChoice(value)}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 rounded-pill px-3.5 text-small font-medium transition-colors duration-150",
                on
                  ? "bg-tone-fg text-tone-invert"
                  : "text-tone-muted hover:text-tone-fg",
              )}
            >
              <Icon aria-hidden="true" size={16} strokeWidth={1.75} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
