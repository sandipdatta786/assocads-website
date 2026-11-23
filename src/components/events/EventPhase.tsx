"use client";

import type { ReactNode } from "react";
import { eventStatus, type EventDates, type EventStatus } from "@/lib/events";
import { useNow } from "./useNow";

/** Shows one of several slots depending on where the event stands right now. */
export function EventPhase({
  event,
  builtAt,
  past,
  closed,
  open,
  soon,
}: {
  event: EventDates;
  builtAt: number;
} & Partial<Record<EventStatus, ReactNode>>) {
  const status = eventStatus(event, useNow(builtAt));
  const slots = { past, closed, open, soon };
  return <>{slots[status] ?? null}</>;
}
