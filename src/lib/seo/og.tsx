import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

/**
 * The share image for every page: Ink background, the colour-on-dark logo,
 * the page title in Inter Tight, and the node-lines motif in Indigo Bright.
 * Each route has an opengraph-image.tsx that calls ogImage with its title.
 */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const INK = "#0b1020";
const PAPER = "#ffffff";
const INDIGO_BRIGHT = "#8791ff";
const MARIGOLD = "#f2a31b";
// Muted text on Ink, as in the site's ink tone.
const SLATE_400 = "#9aa1b2";

// The master logo file, never redrawn.
const logo = `data:image/png;base64,${await readFile(
  join(
    process.cwd(),
    "docs/logo/png/assocads-logo-horizontal-colour-on-dark.png",
  ),
  "base64",
)}`;

/** The brand typefaces as static font files, which the image renderer needs
    (it cannot read variable fonts or WOFF2). They are kept in the repository
    (src/assets/fonts, SIL Open Font Licence) so that the build never depends
    on the network. next/font loads the same families for the pages. Only
    approved weights: Inter Tight Bold for the title, JetBrains Mono Medium
    for the eyebrow, Inter Regular for the name line. */
async function fontFile(name: string): Promise<ArrayBuffer> {
  const file = await readFile(join(process.cwd(), "src/assets/fonts", name));
  return file.buffer.slice(
    file.byteOffset,
    file.byteOffset + file.byteLength,
  ) as ArrayBuffer;
}

/** Read once and cached for every share image. */
async function fonts(): Promise<[ArrayBuffer, ArrayBuffer, ArrayBuffer]> {
  "use cache";
  cacheLife("max");
  return Promise.all([
    fontFile("InterTight-700.ttf"),
    fontFile("JetBrainsMono-500.woff"),
    fontFile("Inter-400.woff"),
  ]);
}

const nodes: Array<[number, number]> = [
  [40, 210],
  [130, 120],
  [215, 185],
  [300, 70],
  [385, 150],
  [470, 60],
  [540, 170],
  [455, 240],
  [330, 250],
  [180, 270],
];
const links: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [7, 8],
  [8, 2],
  [8, 9],
  [9, 0],
  [1, 3],
];

function titleSize(title: string): number {
  if (title.length <= 28) return 80;
  if (title.length <= 52) return 66;
  if (title.length <= 80) return 56;
  return 48;
}

/** The share image for one page. */
export async function ogImage({
  title,
  eyebrow,
}: {
  title: string;
  /** A short label above the title, for example "Guide" or "Event". */
  eyebrow?: string;
}) {
  const [display, mono, body] = await fonts();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: INK,
        padding: 72,
        position: "relative",
        fontFamily: "Inter Tight",
      }}
    >
      <svg
        width="700"
        height="386"
        viewBox="0 0 580 320"
        style={{ position: "absolute", right: -40, top: 40 }}
      >
        <g stroke={INDIGO_BRIGHT} strokeWidth="1.2" opacity="0.45">
          {links.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={nodes[a][0]}
              y1={nodes[a][1]}
              x2={nodes[b][0]}
              y2={nodes[b][1]}
            />
          ))}
        </g>
        {nodes.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === 3 ? 7 : 4.5}
            fill={i === 3 ? MARIGOLD : INDIGO_BRIGHT}
            opacity={i === 3 ? 1 : 0.75}
          />
        ))}
      </svg>

      {/* eslint-disable-next-line @next/next/no-img-element -- rendered to an image, not a page */}
      <img src={logo} width={330} height={80} alt="" />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 900,
        }}
      >
        {eyebrow && (
          <div
            style={{
              color: INDIGO_BRIGHT,
              fontFamily: "JetBrains Mono",
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            color: PAPER,
            fontSize: titleSize(title),
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -1.5,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: SLATE_400,
            fontFamily: "Inter",
            fontSize: 26,
            fontWeight: 400,
          }}
        >
          {`${site.name} · ${site.location.city}, ${site.location.country}`}
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Inter Tight", data: display, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
        { name: "Inter", data: body, weight: 400, style: "normal" },
      ],
    },
  );
}
