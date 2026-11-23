import Image from "next/image";
import { cn } from "@/lib/cn";

type AvatarProps = {
  name: string;
  /** Path under public/, for example "/images/trustees/name.jpg". */
  photo?: string | null;
  /** Width in pixels, or "fill" to fill the width of its container as a square. */
  size?: number | "fill";
  /** For size "fill": the image sizes hint, for example "(min-width: 900px) 33vw, 100vw". */
  sizes?: string;
  /** Set when the name is also shown as text beside the avatar,
      so screen readers do not hear it twice. */
  decorative?: boolean;
  className?: string;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

const frame = "rounded-m border border-line bg-cloud";

/** Shows a photograph, or the person's initials on a Cloud tile when no
    photograph has been supplied. */
export function Avatar({
  name,
  photo,
  size = 96,
  sizes = "100vw",
  decorative = false,
  className,
}: AvatarProps) {
  const alt = decorative ? "" : name;
  const fill = size === "fill";

  if (photo && fill) {
    return (
      <div
        className={cn(
          "relative aspect-square w-full overflow-hidden",
          frame,
          className,
        )}
      >
        <Image
          src={photo}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    );
  }

  if (photo) {
    return (
      <Image
        src={photo}
        alt={alt}
        width={size as number}
        height={size as number}
        className={cn("aspect-square shrink-0 object-cover", frame, className)}
      />
    );
  }

  const label = {
    role: decorative ? undefined : "img",
    "aria-label": decorative ? undefined : name,
    "aria-hidden": decorative || undefined,
  } as const;

  if (fill) {
    // The container query unit sizes the initials to the tile's width.
    return (
      <div className={cn("@container w-full", className)}>
        <span
          {...label}
          className={cn(
            "grid aspect-square w-full place-items-center font-display text-[30cqw] font-semibold text-slate-600",
            frame,
          )}
        >
          {initials(name)}
        </span>
      </div>
    );
  }

  return (
    <span
      {...label}
      style={{ width: size, height: size, fontSize: (size as number) * 0.34 }}
      className={cn(
        "inline-grid shrink-0 place-items-center font-display font-semibold text-slate-600",
        frame,
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
