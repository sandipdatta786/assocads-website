"use client";

import { Badge } from "@/components/ui/Tag";
import {
  eventStatus,
  statusBadge,
  statusLabels,
  type EventDates,
} from "@/lib/events";
import { useNow } from "./useNow";

export function EventStatusBadge({
  event,
  builtAt,
  className,
}: {
  event: EventDates;
  builtAt: number;
  className?: string;
}) {
  const status = eventStatus(event, useNow(builtAt));
  return (
    <Badge
      status={statusBadge[status]}
      label={statusLabels[status]}
      className={className}
    />
  );
}
