import Image from "next/image";
import { cn } from "@/lib/cn";

/* The logo files in public/brand are the master files from docs/logo with the
   built-in margin trimmed. Never redraw or retype the logo. Rules for size and
   clear space are in docs/BRAND_GUIDE.md, section 4. */

const files = {
  horizontal: { name: "logo-horizontal", width: 513, height: 94.5 },
  compact: { name: "logo-compact", width: 513, height: 94.5 },
  symbol: { name: "symbol", width: 342, height: 260 },
} as const;

type LogoProps = {
  /** "horizontal" includes the descriptor line; "compact" omits it. */
  layout?: keyof typeof files;
  /** "auto" follows the tone of the section the logo sits in. */
  version?: "auto" | "colour" | "colour-on-dark";
  /** Rendered height in pixels. Width follows the artwork. */
  height?: number;
  className?: string;
};

export function Logo({
  layout = "horizontal",
  version = "auto",
  height = 40,
  className,
}: LogoProps) {
  const file = files[layout];
  const width = Math.round((height * file.width) / file.height);
  const light = version !== "colour-on-dark";
  const dark = version !== "colour";

  return (
    <span
      role="img"
      aria-label="ASSOCADS, Association for AI and Data Science"
      className={cn("inline-block shrink-0", className)}
      style={{ width, height }}
    >
      {light && (
        <Image
          src={`/brand/${file.name}.svg`}
          alt=""
          width={width}
          height={height}
          unoptimized
          className={cn("size-full", version === "auto" && "logo-on-light")}
        />
      )}
      {dark && (
        <Image
          src={`/brand/${file.name}-on-dark.svg`}
          alt=""
          width={width}
          height={height}
          unoptimized
          className={cn("size-full", version === "auto" && "logo-on-dark")}
        />
      )}
    </span>
  );
}
