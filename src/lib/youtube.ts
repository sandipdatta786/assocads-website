/**
 * YouTube helpers for ASSOCADS Voices.
 *
 * The channel's latest videos come from its public feed
 * (https://www.youtube.com/feeds/videos.xml?channel_id=...), which needs no
 * API key and lists the 15 most recent uploads. It is read on the server
 * only; visitors' browsers contact YouTube only when someone presses Play.
 */

export type ChannelVideo = {
  id: string;
  title: string;
  /** YYYY-MM-DD, in Indian Standard Time. */
  publishedDate: string;
  description: string;
  isShort: boolean;
};

/** The video ID in a YouTube address, or null if it is not one. */
export function youtubeId(address: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(address);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^(www|m|music)\./, "");
  const valid = (id: string | null | undefined) =>
    id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;

  if (host === "youtu.be") return valid(parsed.pathname.slice(1));
  if (host !== "youtube.com" && host !== "youtube-nocookie.com") return null;
  if (parsed.pathname === "/watch") return valid(parsed.searchParams.get("v"));
  const match = parsed.pathname.match(/^\/(shorts|embed|live)\/([^/?#]+)/);
  return valid(match?.[2]);
}

/** YouTube's own thumbnail, 480×360. Fetched by the site's image service,
    not by the visitor's browser. */
export function thumbnailUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function watchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/** The privacy-enhanced player, which sets no cookies until a video plays. */
export function embedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

function decode(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (whole, code: string) => {
    if (code[0] === "#") {
      const n =
        code[1] === "x" || code[1] === "X"
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : whole;
    }
    return ENTITIES[code.toLowerCase()] ?? whole;
  });
}

function tag(xml: string, name: string): string {
  const match = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return match ? decode(match[1].trim()) : "";
}

/** The date in Kolkata of an ISO timestamp. */
function kolkataDate(timestamp: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp));
}

/** Reads the entries of a channel feed. Exported for testing. */
export function parseChannelFeed(xml: string): ChannelVideo[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  const videos: ChannelVideo[] = [];
  for (const entry of entries) {
    const id = tag(entry, "yt:videoId");
    const published = tag(entry, "published");
    if (!/^[A-Za-z0-9_-]{11}$/.test(id) || Number.isNaN(Date.parse(published)))
      continue;
    const link = entry.match(/<link[^>]*href="([^"]+)"/)?.[1] ?? "";
    videos.push({
      id,
      title: tag(entry, "title"),
      publishedDate: kolkataDate(published),
      description: tag(entry, "media:description"),
      isShort: link.includes("/shorts/"),
    });
  }
  return videos;
}

/**
 * The channel's latest videos, or an empty list if the channel is not set or
 * YouTube cannot be reached. A failure never stops the site from building.
 */
export async function channelVideos(
  channelId: string,
): Promise<ChannelVideo[]> {
  if (!/^UC[A-Za-z0-9_-]{22}$/.test(channelId)) return [];
  try {
    const response = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) {
      console.warn(
        `YouTube feed returned ${response.status}; showing no channel videos.`,
      );
      return [];
    }
    return parseChannelFeed(await response.text());
  } catch (error) {
    console.warn(`YouTube feed could not be read: ${(error as Error).message}`);
    return [];
  }
}
