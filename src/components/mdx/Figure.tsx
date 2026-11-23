import Image from "next/image";
import { cn } from "@/lib/cn";

type FigureProps = {
  /** Path under public/, for example /images/events/meetup.jpg. */
  src: string;
  /** Describes what the image shows. Required for accessibility. */
  alt: string;
  width: number;
  height: number;
  caption?: string;
  className?: string;
};

/** An image with an optional caption, for MDX content.
    Photographs of people only with their consent (truthfulness rule 9). */
export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  className,
}: FigureProps) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 720px, 100vw"
        className="h-auto w-full rounded-m"
      />
      {caption && (
        <figcaption className="text-caption text-tone-faint">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
