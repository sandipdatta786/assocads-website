import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { formatLongDate } from "@/lib/publishing";
import { hubKindLabels } from "@/lib/hub";
import type { HubEntry } from "@/lib/content/schemas";

/** One Knowledge Hub entry as a card. */
export function HubCard({ entry }: { entry: HubEntry }) {
  return (
    <Link
      href={`/knowledge-hub/${entry.slug}`}
      className="card-link flex h-full flex-col gap-3 rounded-m border border-line bg-paper p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Tag variant="neutral">{hubKindLabels[entry.kind]}</Tag>
        <time
          dateTime={entry.publishedDate}
          className="text-small text-slate-600"
        >
          {formatLongDate(entry.publishedDate)}
        </time>
      </div>
      <h3 className="font-display text-h3 font-semibold text-ink">
        {entry.title}
      </h3>
      <p className="text-body text-slate-600">{entry.summary}</p>
    </Link>
  );
}
