/**
 * Light and dark themes. The visitor's choice is kept in local storage
 * under THEME_STORAGE_KEY ("time", "system", "light" or "dark"). With no
 * saved choice the site uses "time": dark from NIGHT_FROM_HOUR until
 * DAY_FROM_HOUR on the visitor's own clock, light in between. "system"
 * follows the system setting. The clock is read in the browser only and
 * nothing is sent anywhere. <html data-theme> always holds the theme in
 * use, set before the first paint by themeScript so nothing flashes.
 */
export const THEME_STORAGE_KEY = "assocads:theme";

export type ThemeChoice = "time" | "system" | "light" | "dark";

/** The choice when nothing has been saved. */
export const DEFAULT_THEME_CHOICE: ThemeChoice = "time";

/** Local hours (0–23): dark from 19:00, light again from 07:00. */
export const NIGHT_FROM_HOUR = 19;
export const DAY_FROM_HOUR = 7;

export function isNightHour(hour: number): boolean {
  return hour >= NIGHT_FROM_HOUR || hour < DAY_FROM_HOUR;
}

/** Runs in <head> before the page is drawn. Kept tiny and dependency-free. */
export const themeScript = `try{var m=${JSON.stringify(DEFAULT_THEME_CHOICE)};try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(s!==null)m=s}catch(e){}var h=new Date().getHours(),d=m==="dark"||(m==="light"?false:m==="system"?matchMedia("(prefers-color-scheme: dark)").matches:h>=${NIGHT_FROM_HOUR}||h<${DAY_FROM_HOUR});document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}`;
