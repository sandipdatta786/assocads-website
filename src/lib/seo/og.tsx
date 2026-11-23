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

/** Inter Tight in TrueType, which the image renderer needs. next/font
    loads the same family for the pages. */
async function interTight(weight: 500 | 700): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@${weight}`,
  ).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
  if (!url) throw new Error(`Inter Tight ${weight} not found for share images`);
  return fetch(url).then((r) => r.arrayBuffer());
}

/** Fetched once and cached, so that prerendering the images does not wait
    on the network for every page. */
async function fonts(): Promise<[ArrayBuffer, ArrayBuffer]> {
  "use cache";
  cacheLife("max");
  return Promise.all([interTight(500), interTight(700)]);
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
  const [medium, bold] = await fonts();
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
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: 3,
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
        <div style={{ color: SLATE_400, fontSize: 26, fontWeight: 500 }}>
          {`${site.name} · ${site.location.city}, ${site.location.country}`}
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Inter Tight", data: medium, weight: 500, style: "normal" },
        { name: "Inter Tight", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
