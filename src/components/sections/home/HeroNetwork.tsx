"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { links, nodes } from "@/components/ui/Decor";
import { cn } from "@/lib/cn";

/** How far from the pointer, in viewBox units, a node starts to respond. */
const REACH = 150;
/** The largest share of the distance a node moves towards the pointer. */
const PULL = 0.14;
/** The marigold accent node, as in NodeLines. */
const ACCENT = 3;

/**
 * The hero's connected-node graphic. It draws itself in once on load (CSS,
 * brand guide 5.1), then, on devices with a fine pointer, nearby nodes lean
 * gently towards the pointer and their lines brighten. Nothing moves on its
 * own: the animation frame loop runs only until the nodes settle after a
 * pointer movement. Decorative only, and still under reduced motion.
 */
export function HeroNetwork({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const section = svg?.closest("section");
    if (!svg || !section) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lineEls = [...svg.querySelectorAll<SVGLineElement>("[data-link]")];
    const nodeEls = [...svg.querySelectorAll<SVGCircleElement>("[data-node]")];
    const current = nodes.map(([x, y]) => ({ x, y, glow: 0 }));
    const target = nodes.map(([x, y]) => ({ x, y, glow: 0 }));
    let frame = 0;

    const render = () => {
      let moving = false;
      current.forEach((c, i) => {
        const t = target[i];
        c.x += (t.x - c.x) * 0.18;
        c.y += (t.y - c.y) * 0.18;
        c.glow += (t.glow - c.glow) * 0.18;
        if (
          Math.abs(t.x - c.x) > 0.05 ||
          Math.abs(t.y - c.y) > 0.05 ||
          Math.abs(t.glow - c.glow) > 0.005
        ) {
          moving = true;
        }
        const el = nodeEls[i];
        el.setAttribute("cx", c.x.toFixed(2));
        el.setAttribute("cy", c.y.toFixed(2));
        el.style.setProperty("--glow", c.glow.toFixed(3));
      });
      links.forEach(([a, b], i) => {
        const el = lineEls[i];
        el.setAttribute("x1", current[a].x.toFixed(2));
        el.setAttribute("y1", current[a].y.toFixed(2));
        el.setAttribute("x2", current[b].x.toFixed(2));
        el.setAttribute("y2", current[b].y.toFixed(2));
        el.style.setProperty(
          "--glow",
          Math.max(current[a].glow, current[b].glow).toFixed(3),
        );
      });
      frame = moving ? requestAnimationFrame(render) : 0;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      const matrix = svg.getScreenCTM();
      if (!matrix) return;
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
        matrix.inverse(),
      );
      nodes.forEach(([x, y], i) => {
        const dx = point.x - x;
        const dy = point.y - y;
        const strength = Math.max(0, 1 - Math.hypot(dx, dy) / REACH);
        target[i].x = x + dx * PULL * strength;
        target[i].y = y + dy * PULL * strength;
        target[i].glow = strength;
      });
      schedule();
    };

    const onLeave = () => {
      nodes.forEach(([x, y], i) => {
        target[i].x = x;
        target[i].y = y;
        target[i].glow = 0;
      });
      schedule();
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox="0 0 580 320"
      preserveAspectRatio="xMidYMid slice"
      className={cn(
        "hero-network pointer-events-none size-full text-tone-link",
        className,
      )}
    >
      <g stroke="currentColor" strokeWidth="1">
        {links.map(([a, b], i) => (
          <line
            key={`${a}-${b}`}
            data-link=""
            pathLength={1}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            style={{ "--i": i } as CSSProperties}
          />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          data-node=""
          data-accent={i === ACCENT ? "" : undefined}
          cx={x}
          cy={y}
          r={i === ACCENT ? 6 : 4}
          fill={i === ACCENT ? "var(--marigold)" : "currentColor"}
          style={{ "--i": i } as CSSProperties}
        />
      ))}
    </svg>
  );
}
