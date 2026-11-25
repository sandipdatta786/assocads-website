/**
 * Light and dark themes. The visitor's choice is kept in local storage
 * under THEME_STORAGE_KEY ("light" or "dark"); with no choice the site
 * follows the system setting. <html data-theme> always holds the theme in
 * use, set before the first paint by themeScript so nothing flashes.
 */
export const THEME_STORAGE_KEY = "assocads:theme";

export type ThemeChoice = "system" | "light" | "dark";

/** Runs in <head> before the page is drawn. Kept tiny and dependency-free. */
export const themeScript = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});document.documentElement.dataset.theme=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light"}catch(e){}`;
