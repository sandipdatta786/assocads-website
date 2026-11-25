"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { embedUrl, thumbnailUrl } from "@/lib/youtube";

/**
 * A YouTube video that loads only when the visitor presses Play. Until then
 * the page shows the thumbnail (served by the site itself), so visiting the
 * page sends nothing to YouTube. The player is YouTube's privacy-enhanced
 * one (youtube-nocookie.com).
 */
export function VoicePlayer({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={embedUrl(id)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group absolute inset-0 size-full cursor-pointer"
    >
      <Image
        src={thumbnailUrl(id)}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-ink-fixed/20 transition-colors group-hover:bg-ink-fixed/35">
        <span className="flex size-16 items-center justify-center rounded-pill bg-tone-primary-bg text-tone-primary-fg shadow-card transition-transform group-hover:scale-105">
          <Play
            aria-hidden="true"
            size={28}
            strokeWidth={1.5}
            className="ml-1 fill-current"
          />
        </span>
      </span>
      <span className="sr-only">Play video: {title}</span>
    </button>
  );
}
