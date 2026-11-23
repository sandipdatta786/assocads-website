import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { themeLabels } from "@/lib/guides";
import { formatLongDate } from "@/lib/publishing";

export type GuideCardData = {
  slug: string;
  title: string;
  summary: string;
  theme: keyof typeof themeLabels;
  lastReviewed: string;
  draft?: boolean;
};

export function GuideCard({
  guide,
  showTheme = false,
}: {
  guide: GuideCardData;
  showTheme?: boolean;
}) {
  return (
    <article className="group relative flex h-full flex-col gap-3 rounded-l border border-line bg-paper p-6 transition-colors duration-150 hover:border-indigo">
      {(showTheme || guide.draft) && (
        <div className="flex flex-wrap gap-2">
          {showTheme && <Tag className="w-fit">{themeLabels[guide.theme]}</Tag>}
          {guide.draft && (
            <Tag variant="marigold" className="w-fit">
              Draft
            </Tag>
          )}
        </div>
      )}
      <h3 className="font-display text-h3 font-semibold text-ink group-hover:text-indigo">
        <Link
          href={`/guides/${guide.slug}`}
          className="after:absolute after:inset-0 after:rounded-l"
        >
          {guide.title}
        </Link>
      </h3>
      <p className="text-body text-slate-600">{guide.summary}</p>
      <p className="mt-auto pt-2 text-small text-slate-600">
        Last reviewed{" "}
        <time dateTime={guide.lastReviewed}>
          {formatLongDate(guide.lastReviewed)}
        </time>
      </p>
    </article>
  );
}
