import { useId } from "react";
import { cn } from "@/lib/cn";

/** A fine dot grid. Decorative only. Colour follows the section tone. */
export function DotGrid({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none size-full text-tone-link", className)}
    >
      <defs>
        <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="currentColor" opacity="0.35" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Node positions in the 580 x 320 viewBox, shared with the hero network. */
export const nodes: Array<[number, number]> = [
  [40, 210],
  [130, 120],
  [215, 185],
  [300, 70],
  [385, 150],
  [470, 60],
  [540, 170],
  [455, 240],
  [330, 250],
  [180, 270],
];
/** Pairs of node indexes that are joined by a line. */
export const links: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [7, 8],
  [8, 2],
  [8, 9],
  [9, 0],
  [1, 3],
];

/** Thin lines joining nodes, echoing the idea of a connected community.
    Decorative only. One node is marigold, as the single accent. */
export function NodeLines({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 580 320"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none size-full text-tone-link", className)}
    >
      <g stroke="currentColor" strokeWidth="1" opacity="0.4">
        {links.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
          />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === 3 ? 6 : 4}
          fill={i === 3 ? "var(--marigold)" : "currentColor"}
          opacity={i === 3 ? 1 : 0.7}
        />
      ))}
    </svg>
  );
}

/** Nodes that are not joined yet, drawn as dashed outlines. */
const pendingNodes = new Set([5, 6, 7]);

/** The connected-node motif with its last few nodes still dashed outlines:
    a network that is still being built. Used beside "nothing published yet"
    notes. Decorative only. */
export function PendingNodes({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 580 320"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none size-full text-tone-link", className)}
    >
      <g stroke="currentColor" strokeWidth="1" opacity="0.4">
        {links.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            strokeDasharray={
              pendingNodes.has(a) || pendingNodes.has(b) ? "4 6" : undefined
            }
          />
        ))}
      </g>
      {nodes.map(([x, y], i) =>
        pendingNodes.has(i) ? (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.7"
          />
        ) : (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === 3 ? 6 : 4}
            fill={i === 3 ? "var(--marigold)" : "currentColor"}
            opacity={i === 3 ? 1 : 0.7}
          />
        ),
      )}
    </svg>
  );
}
