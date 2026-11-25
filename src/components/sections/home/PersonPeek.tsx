"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { LinkedInLink } from "@/components/sections/trustees/LinkedInLink";

export type PersonDetails = {
  name: string;
  /** "Founder Trustee", "Founder Member", or the office the Board elected. */
  title: string;
  /** Capacity, when the title is an office: "Founder Trustee" and so on. */
  capacity?: string;
  committees: string[];
  /** Role and organisation, only when real. */
  work?: string;
  /** Only when real; never a placeholder. */
  bio?: string;
  linkedin?: string;
  /** Their own page, when they have one. */
  href?: string;
};

const WIDTH = 304; // the card's width in pixels (w-76)
const GAP = 8;
const OPEN_DELAY = 250;
const CLOSE_DELAY = 200;

/**
 * A person's tile on the homepage, with a small card of details that opens
 * on click, tap or Enter, and also on hover with a mouse. It uses the
 * browser's popover: Esc or a click elsewhere closes it, and only one is
 * open at a time. The card stays open while the pointer is over it, so its
 * links can be used (WCAG 1.4.13). Nothing opens on its own.
 */
export function PersonPeek({
  person,
  tile,
}: {
  person: PersonDetails;
  /** The tile: avatar, name and title. */
  tile: ReactNode;
}) {
  const id = useId();
  const popoverId = `peek-${id.replace(/:/g, "")}`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(0);

  useEffect(() => {
    const button = buttonRef.current;
    const card = cardRef.current;
    if (!button || !card) return;

    /** Below the tile, or above it when there is no room; kept on screen. */
    const place = () => {
      const r = button.getBoundingClientRect();
      const width = Math.min(WIDTH, innerWidth - 2 * GAP);
      const left = Math.min(Math.max(GAP, r.left), innerWidth - width - GAP);
      const height = card.offsetHeight;
      const below = r.bottom + GAP;
      const top =
        below + height <= innerHeight - GAP || r.top - GAP - height < GAP
          ? below
          : r.top - GAP - height;
      card.style.width = `${width}px`;
      card.style.left = `${left}px`;
      card.style.top = `${Math.max(GAP, top)}px`;
    };

    const onToggle = (event: Event) => {
      const open = (event as ToggleEvent).newState === "open";
      if (open) {
        place();
        addEventListener("scroll", place, { passive: true });
        addEventListener("resize", place);
      } else {
        removeEventListener("scroll", place);
        removeEventListener("resize", place);
      }
    };
    // Placed before it is drawn, then again once its height is known.
    card.addEventListener("beforetoggle", onToggle);
    card.addEventListener("toggle", onToggle);
    return () => {
      card.removeEventListener("beforetoggle", onToggle);
      card.removeEventListener("toggle", onToggle);
      removeEventListener("scroll", place);
      removeEventListener("resize", place);
      clearTimeout(timer.current);
    };
  }, []);

  // Hover, for a mouse only: touch and keyboard use the button itself.
  const later = (fn: () => void, ms: number) => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(fn, ms);
  };
  const onEnter = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    later(() => {
      const card = cardRef.current;
      if (card && !card.matches(":popover-open")) card.showPopover();
    }, OPEN_DELAY);
  };
  const onLeave = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    later(() => {
      const card = cardRef.current;
      // Stay open while it has keyboard focus inside it.
      if (
        card?.matches(":popover-open") &&
        !card.contains(document.activeElement)
      )
        card.hidePopover();
    }, CLOSE_DELAY);
  };

  const { name, title, capacity, committees, work, bio, linkedin, href } =
    person;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        popoverTarget={popoverId}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        className="group flex w-full min-w-0 cursor-pointer flex-col items-start gap-2 rounded-s text-left break-words sm:gap-3"
      >
        {tile}
      </button>
      <div
        ref={cardRef}
        id={popoverId}
        popover="auto"
        aria-label={name}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        className="m-0 flex-col gap-3 rounded-m border border-line bg-paper p-5 text-left text-small text-slate-600 shadow-card [&:popover-open]:flex"
      >
        <div className="flex flex-col gap-0.5">
          <p className="font-display text-body font-semibold text-ink">
            {name}
          </p>
          <p className="font-medium text-indigo">{title}</p>
          {capacity && <p>{capacity}</p>}
        </div>
        {committees.length > 0 && (
          <p>
            <span className="font-medium text-ink">
              {committees.length === 1 ? "Sub-committee: " : "Sub-committees: "}
            </span>
            {committees.join(", ")}
          </p>
        )}
        {work && <p className="font-medium text-ink">{work}</p>}
        {bio ? (
          <p className="line-clamp-4">{bio}</p>
        ) : (
          !work && <p>Profile to be added.</p>
        )}
        <div className="flex flex-wrap items-center gap-x-5">
          <Link
            href={href ?? "/about/trustees"}
            className="inline-flex min-h-11 items-center gap-1.5 font-medium text-indigo underline-offset-4 hover:underline"
          >
            {href ? "Full profile" : "All trustees"}
            <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} />
          </Link>
          {linkedin && <LinkedInLink href={linkedin} name={name} />}
        </div>
      </div>
    </>
  );
}
