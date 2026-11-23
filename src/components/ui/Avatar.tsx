import Image from "next/image";
import { cn } from "@/lib/cn";

type AvatarProps = {
  name: string;
  /** Path under public/, for example "/images/trustees/name.jpg". */
  photo?: string | null;
  size?: number;
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

/** Shows a photograph, or the person's initials on a Cloud tile when no
    photograph has been supplied. */
export function Avatar({
  name,
  photo,
  size = 96,
  decorative = false,
  className,
}: AvatarProps) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={decorative ? "" : name}
        width={size}
        height={size}
        className={cn(
          "aspect-square shrink-0 rounded-m border border-line bg-cloud object-cover",
          className,
        )}
      />
    );
  }
  return (
    <span
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-m border border-line bg-cloud font-display font-semibold text-slate-600",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
