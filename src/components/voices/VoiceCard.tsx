import Image from "next/image";
import { ExternalLink, Mic } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";
import { formatLongDate } from "@/lib/publishing";
import { voiceFormatLabels, type VoiceItem } from "@/lib/voices";
import { VoicePlayer } from "./VoicePlayer";

/** One video or podcast in ASSOCADS Voices. */
export function VoiceCard({
  item,
  headingLevel = 2,
}: {
  item: VoiceItem;
  headingLevel?: 2 | 3 | 4;
}) {
  const Heading = `h${headingLevel}` as const;
  const people = item.people
    .map((p) => {
      const detail = [p.role, p.organisation].filter(Boolean).join(", ");
      return detail ? `${p.name} (${detail})` : p.name;
    })
    .join("; ");
  const onYouTube = Boolean(item.youtubeId);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-m border border-line bg-paper">
      <div className="relative aspect-video bg-cloud">
        {item.youtubeId ? (
          <VoicePlayer id={item.youtubeId} title={item.title} />
        ) : item.image ? (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-indigo">
            <Icon icon={Mic} size={40} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Tag variant="indigo">{voiceFormatLabels[item.format]}</Tag>
          <time
            dateTime={item.publishedDate}
            className="text-small text-slate-600"
          >
            {formatLongDate(item.publishedDate)}
          </time>
        </div>
        <Heading className="font-display text-h3 font-semibold text-ink">
          {item.title}
        </Heading>
        {people && (
          <p className="text-small text-slate-600">
            <span className="font-medium text-ink">With </span>
            {people}
          </p>
        )}
        {item.summary && (
          <p className="text-body text-slate-600">{item.summary}</p>
        )}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex min-h-11 w-fit items-center gap-1.5 font-medium text-tone-link underline-offset-4 hover:underline"
        >
          {onYouTube ? "Watch on YouTube" : "Listen or watch"}
          <ExternalLink aria-hidden="true" size={16} strokeWidth={1.5} />
          <span className="sr-only">: {item.title} (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
