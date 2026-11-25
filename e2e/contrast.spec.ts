import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

/*
 * Every text and background combination in use must be one of the approved
 * pairings in docs/BRAND_GUIDE.md (section 2.3, and in the dark theme also
 * section 2.7), which is read here so the guide stays the one source of
 * truth. The dark theme is reached through the system setting, as most
 * visitors will reach it. Checked on every page at 390px, and
 * at 1440px also with links, buttons and fields forced into their hover and
 * focus states. Field placeholder text is included.
 */

const CHUNKS = 4;

/** Colour names and hex values from the palette tables, and the approved
    pairs as "text-hex on background-hex". */
function brand() {
  const md = readFileSync("docs/BRAND_GUIDE.md", "utf8");
  const hexByName = new Map<string, string>();
  for (const m of md.matchAll(
    /^\|\s*\*{0,2}([A-Za-z0-9 ]+?)\*{0,2}\s*\|\s*`(#[0-9A-Fa-f]{6})`/gm,
  )) {
    hexByName.set(
      m[1].replace(/^ASSOCADS /, "").toLowerCase(),
      m[2].toLowerCase(),
    );
  }
  const table = (from: string, to: string) =>
    md.slice(md.indexOf(from), md.indexOf(to, md.indexOf(from)));
  const approved = new Set<string>();
  const dark = new Set<string>();
  const hex = (cell: string) => {
    const inline = cell.match(/#[0-9A-Fa-f]{6}/)?.[0];
    if (inline) return inline.toLowerCase();
    return hexByName.get(cell.replace(/`.*`/, "").trim().toLowerCase());
  };
  const read = (section: string, into: Set<string>) => {
    for (const row of section.split("\n").filter((l) => l.startsWith("| "))) {
      const [text, background] = row.split("|").slice(1, 3);
      const t = hex(text);
      const b = hex(background);
      if (t && b) into.add(`${t} on ${b}`);
    }
  };
  read(table("### 2.3", "### 2.4"), approved);
  read(table("### 2.7", "### 2.8"), dark);
  const nameByHex = new Map([...hexByName].map(([n, h]) => [h, n]));
  return { approved, dark, nameByHex };
}

let cachedRoutes: string[] | undefined;
async function routes(page: Page): Promise<string[]> {
  if (cachedRoutes) return cachedRoutes;
  const xml = await (await page.request.get("/sitemap.xml")).text();
  cachedRoutes = [
    ...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => new URL(m[1]).pathname,
    ),
    "/no-such-page",
  ];
  return cachedRoutes;
}

const INTERACTIVE =
  "main a, main button, main summary, header a, header button, footer a, input, select, textarea";

/** Runs in the page: each visible text element's colour pair, as hex. */
function collectPairs({
  interactiveOnly,
  selector,
}: {
  interactiveOnly: boolean;
  selector: string;
}): [string, string][] {
  const ctx = document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true })!;
  type C = { r: number; g: number; b: number; a: number };
  const parse = (c: string): C => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  };
  const blend = (top: C, under: C): C => ({
    r: top.r * top.a + under.r * (1 - top.a),
    g: top.g * top.a + under.g * (1 - top.a),
    b: top.b * top.a + under.b * (1 - top.a),
    a: 1,
  });
  const hex = (c: C) =>
    "#" +
    [c.r, c.g, c.b]
      .map((v) => Math.round(v).toString(16).padStart(2, "0"))
      .join("");
  const background = (el: Element): C => {
    const layers: C[] = [];
    for (let e: Element | null = el; e; e = e.parentElement) {
      const c = parse(getComputedStyle(e).backgroundColor);
      if (c.a > 0) {
        layers.push(c);
        if (c.a >= 1) break;
      }
    }
    let base: C = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) base = blend(layers[i], base);
    return base;
  };
  const pair = (el: Element, pseudo?: string) => {
    const bg = background(el);
    const c = parse(getComputedStyle(el, pseudo).color);
    return `${hex(c.a < 1 ? blend(c, bg) : c)} on ${hex(bg)}`;
  };
  const visible = (el: Element) => {
    const r = el.getBoundingClientRect();
    return (
      r.width > 0 &&
      r.height > 0 &&
      getComputedStyle(el).visibility !== "hidden" &&
      !el.closest("svg, .sr-only, [aria-hidden='true']")
    );
  };
  const hasText = (el: Element) =>
    [...el.childNodes].some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
    );
  const label = (el: Element) =>
    `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 30)}"`;

  const out: [string, string][] = [];
  const elements = interactiveOnly
    ? [...document.querySelectorAll(selector)].flatMap((el) => [
        el,
        ...el.querySelectorAll("span, p, strong"),
      ])
    : [...document.querySelectorAll("body *")];
  for (const el of elements) {
    if (visible(el) && hasText(el)) out.push([pair(el), label(el)]);
  }
  if (!interactiveOnly) {
    for (const field of document.querySelectorAll(
      "input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea",
    )) {
      if (visible(field) && field.getAttribute("placeholder"))
        out.push([pair(field, "::placeholder"), `placeholder of ${field.id}`]);
    }
  }
  return out;
}

const { approved, dark, nameByHex } = brand();
/* In the dark theme, light islands (forms, the brand kit) still use the
   light pairings, so both tables apply. */
const allowed = {
  light: approved,
  dark: new Set([...approved, ...dark]),
} as const;
/* Translucent surfaces (the frosted header) are mixed in oklab, and the
   round trip back to sRGB can land one step away from the brand colour:
   #0b101f for Ink. Snap anything within two steps per channel. */
const brandHexes = [...nameByHex.keys()];
const snap = (pair: string) =>
  pair.replace(/#[0-9a-f]{6}/g, (h) => {
    const rgb = (x: string) =>
      [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));
    const c = rgb(h);
    return (
      brandHexes.find((b) => rgb(b).every((v, i) => Math.abs(v - c[i]) <= 2)) ??
      h
    );
  });
const named = (p: string) =>
  p.replace(/#[0-9a-f]{6}/g, (h) => nameByHex.get(h) ?? h);

test("the brand guide's pairings tables could be read", () => {
  expect(approved.size).toBeGreaterThan(20);
  expect(approved.has("#0b1020 on #ffffff")).toBe(true);
  expect(dark.size).toBeGreaterThan(5);
  expect(dark.has("#ffffff on #0b1020")).toBe(true);
});

for (const theme of ["light", "dark"] as const)
  for (let part = 0; part < CHUNKS; part++) {
    test(`${theme} theme: colour pairs on every page (part ${part + 1} of ${CHUNKS})`, async ({
      browser,
    }) => {
      test.setTimeout(300_000);
      const problems = new Set<string>();
      for (const width of [390, 1440]) {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          reducedMotion: "reduce",
          colorScheme: theme,
        });
        const page = await context.newPage();
        const cdp = await context.newCDPSession(page);
        const all = await routes(page);
        for (const path of all.filter((_, i) => i % CHUNKS === part)) {
          await page.goto(path, { waitUntil: "load" });
          const report = (rows: [string, string][], state = "") => {
            for (const [raw, where] of rows) {
              const p = snap(raw);
              if (!allowed[theme].has(p))
                problems.add(
                  `${named(p)}${state}: ${where} on ${path} at ${width}px`,
                );
            }
          };
          report(
            await page.evaluate(collectPairs, {
              interactiveOnly: false,
              selector: INTERACTIVE,
            }),
          );
          if (width !== 1440) continue;
          await cdp.send("DOM.enable");
          await cdp.send("CSS.enable");
          const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
          const { nodeIds } = await cdp.send("DOM.querySelectorAll", {
            nodeId: root.nodeId,
            selector: INTERACTIVE,
          });
          for (const state of [["hover"], ["focus", "focus-visible"]]) {
            for (const nodeId of nodeIds)
              await cdp.send("CSS.forcePseudoState", {
                nodeId,
                forcedPseudoClasses: state,
              });
            report(
              await page.evaluate(collectPairs, {
                interactiveOnly: true,
                selector: INTERACTIVE,
              }),
              ` (${state.at(-1)})`,
            );
            for (const nodeId of nodeIds)
              await cdp.send("CSS.forcePseudoState", {
                nodeId,
                forcedPseudoClasses: [],
              });
          }
        }
        await context.close();
      }
      const list = [...problems];
      expect(list, list.join("\n")).toEqual([]);
    });
  }
