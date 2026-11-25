import { cacheLife } from "next/cache";
import { site } from "@/config/site";
import { builtAt } from "@/lib/clock";
import { getVoices } from "@/lib/content/loaders";
import type { Voice } from "@/lib/content/schemas";
import {
  channelVideos,
  thumbnailUrl,
  watchUrl,
  youtubeId,
} from "@/lib/youtube";

/** How each format is named on the site. */
export const voiceFormatLabels: Record<Voice["format"], string> = {
  video: "Video",
  short: "Short video",
  podcast: "Podcast",
  "fireside-chat": "Fireside chat",
  interview: "Interview",
  conversation: "Conversation",
  talk: "Talk",
};

export type VoiceItem = {
  key: string;
  title: string;
  summary: string;
  format: Voice["format"];
  publishedDate: string;
  /** Where it is watched or heard. */
  url: string;
  /** Set for YouTube videos, which can be played on the page. */
  youtubeId: string | null;
  people: Voice["people"];
  image: { src: string; alt: string } | null;
};

/** The first sentence or two of a YouTube description, as a summary. */
function shorten(text: string, max = 240): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const stop = cut.lastIndexOf(". ");
  return stop > 80
    ? cut.slice(0, stop + 1)
    : `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/**
 * Everything in ASSOCADS Voices, newest first: the entries in content/voices
 * and the latest videos on the YouTube channel (site.youtubeChannelId). When
 * both describe the same video, the entry wins, because it can give the
 * format and the people taking part.
 *
 * Cached for an hour, so a new upload appears within about an hour without a
 * rebuild.
 */
export async function voiceItems(): Promise<VoiceItem[]> {
  "use cache";
  cacheLife("hours");

  const now = await builtAt();
  const entries: VoiceItem[] = getVoices({ now }).map((v) => {
    const id = youtubeId(v.url);
    return {
      key: v.slug,
      title: v.title,
      summary: v.summary,
      format: v.format,
      publishedDate: v.publishedDate,
      url: v.url,
      youtubeId: id,
      people: v.people,
      image:
        v.image && v.imageAlt
          ? { src: v.image, alt: v.imageAlt }
          : id
            ? { src: thumbnailUrl(id), alt: "" }
            : null,
    };
  });

  const known = new Set(entries.map((e) => e.youtubeId).filter(Boolean));
  const fromChannel: VoiceItem[] = (await channelVideos(site.youtubeChannelId))
    .filter((v) => !known.has(v.id))
    .map((v) => ({
      key: `youtube-${v.id}`,
      title: v.title,
      summary: shorten(v.description),
      format: v.isShort ? "short" : "video",
      publishedDate: v.publishedDate,
      url: watchUrl(v.id),
      youtubeId: v.id,
      people: [],
      image: { src: thumbnailUrl(v.id), alt: "" },
    }));

  return [...entries, ...fromChannel].sort(
    (a, b) =>
      b.publishedDate.localeCompare(a.publishedDate) ||
      a.title.localeCompare(b.title),
  );
}
