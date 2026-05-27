"use client";

import { useEffect, useRef } from "react";

/**
 * Abstract animated network graph background.
 *
 * Renders a set of soft drifting nodes with edges that fade in/out by
 * proximity. The cursor (tracked globally) gently repels nearby nodes and
 * brightens edges within its influence radius. Purely decorative — the
 * SVG is `aria-hidden` and `pointer-events-none`, so it never blocks
 * clicks on underlying content.
 *
 * Performance: positions are stored in refs, and the RAF loop mutates the
 * SVG element attributes directly (no React re-renders per frame). Edge
 * elements are pre-allocated up to a sensible cap and toggled via
 * stroke-opacity, avoiding DOM churn.
 *
 * Accessibility: when `prefers-reduced-motion: reduce` is set, the loop
 * is skipped — nodes render at their initial seed-stable positions only.
 *
 * Layout: the component absolutely positions itself to fill its first
 * non-static ancestor (intended use: place inside `relative overflow-hidden`).
 */

interface NetworkBackgroundProps {
  /** Number of nodes to render. Default 50. */
  nodeCount?: number;
  /** Pixel distance at which an edge between two nodes becomes visible. Default 180. */
  edgeProximity?: number;
  /** Pixel radius around the cursor that influences nodes. Default 150. */
  cursorInfluenceRadius?: number;
  /** Wrapper opacity (the whole atmosphere). Default 0.25. */
  opacity?: number;
  /** PRNG seed — change to get a different node layout. Default 42. */
  seed?: number;
  /** Hard cap on number of <line> elements pre-allocated. Default 300. */
  maxEdges?: number;
  /** Optional extra class names on the wrapper. */
  className?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// Deterministic PRNG so layouts don't jitter on reload.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function NetworkBackground({
  nodeCount = 50,
  edgeProximity = 180,
  cursorInfluenceRadius = 150,
  opacity = 0.25,
  seed = 42,
  maxEdges = 300,
  className,
}: NetworkBackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const circlesRef = useRef<(SVGCircleElement | null)[]>([]);
  const linesRef = useRef<(SVGLineElement | null)[]>([]);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -10000, y: -10000, active: false });
  const dimsRef = useRef({ w: 0, h: 0 });
  const rafIdRef = useRef<number | null>(null);

  // Mount: seed nodes, wire listeners, run the loop.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rng = mulberry32(seed);

    const measure = () => {
      const rect = wrapper.getBoundingClientRect();
      dimsRef.current = { w: rect.width, h: rect.height };
    };

    const initNodes = () => {
      const { w, h } = dimsRef.current;
      nodesRef.current = Array.from({ length: nodeCount }, () => ({
        x: rng() * w,
        y: rng() * h,
        // Slow drift — ~0.15 px/frame at 60fps → very gentle.
        vx: (rng() - 0.5) * 0.3,
        vy: (rng() - 0.5) * 0.3,
      }));
    };

    measure();
    initNodes();

    // Initial paint so static (reduced-motion) renders look correct.
    paint();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mouse tracking (window-level so we still react even though the SVG
    // itself has pointer-events: none).
    const onMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      mouseRef.current = { x, y, active: inside };
    };
    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const onResize = () => {
      const prev = dimsRef.current;
      measure();
      const next = dimsRef.current;
      if (prev.w > 0 && prev.h > 0 && (next.w !== prev.w || next.h !== prev.h)) {
        // Re-map existing positions so nodes stay roughly in place when the viewport changes.
        const sx = next.w / prev.w;
        const sy = next.h / prev.h;
        for (const n of nodesRef.current) {
          n.x *= sx;
          n.y *= sy;
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);

    if (!reduce) {
      const tick = () => {
        step();
        paint();
        rafIdRef.current = requestAnimationFrame(tick);
      };
      rafIdRef.current = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };

    function step() {
      const nodes = nodesRef.current;
      const { w, h } = dimsRef.current;
      const mouse = mouseRef.current;
      const repelR = cursorInfluenceRadius;
      const repelStrength = 1.4; // px push at the very center of the influence circle
      const padding = 4;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        // Soft bounce off the viewport edges.
        if (n.x < padding) {
          n.x = padding;
          n.vx = Math.abs(n.vx);
        } else if (n.x > w - padding) {
          n.x = w - padding;
          n.vx = -Math.abs(n.vx);
        }
        if (n.y < padding) {
          n.y = padding;
          n.vy = Math.abs(n.vy);
        } else if (n.y > h - padding) {
          n.y = h - padding;
          n.vy = -Math.abs(n.vy);
        }

        // Cursor repel — soft easing toward zero at the edge of the radius.
        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < repelR * repelR && d2 > 0.0001) {
            const d = Math.sqrt(d2);
            const t = 1 - d / repelR; // 1 at center, 0 at edge
            const f = t * t * repelStrength; // ease-in
            n.x += (dx / d) * f;
            n.y += (dy / d) * f;
          }
        }
      }
    }

    function paint() {
      const nodes = nodesRef.current;
      const circles = circlesRef.current;
      const lines = linesRef.current;
      const mouse = mouseRef.current;
      const proxy = edgeProximity;
      const proxy2 = proxy * proxy;
      const cursorR = cursorInfluenceRadius;

      // Update circle positions.
      for (let i = 0; i < nodes.length; i++) {
        const c = circles[i];
        if (!c) continue;
        c.setAttribute("cx", String(nodes[i].x));
        c.setAttribute("cy", String(nodes[i].y));
      }

      // Update edge positions/opacities. Iterate pairs, fill up to maxEdges.
      let li = 0;
      for (let i = 0; i < nodes.length && li < lines.length; i++) {
        for (let j = i + 1; j < nodes.length && li < lines.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > proxy2) continue;

          const d = Math.sqrt(d2);
          // Closer pairs → more visible (0.05 → 0.30).
          let alpha = (1 - d / proxy) * 0.30 + 0.04;

          // Cursor proximity brightens the segment briefly.
          if (mouse.active) {
            const mx = (nodes[i].x + nodes[j].x) * 0.5 - mouse.x;
            const my = (nodes[i].y + nodes[j].y) * 0.5 - mouse.y;
            const md = Math.sqrt(mx * mx + my * my);
            if (md < cursorR) {
              alpha += (1 - md / cursorR) * 0.25;
            }
          }

          if (alpha > 0.55) alpha = 0.55;

          const line = lines[li];
          if (line) {
            line.setAttribute("x1", String(nodes[i].x));
            line.setAttribute("y1", String(nodes[i].y));
            line.setAttribute("x2", String(nodes[j].x));
            line.setAttribute("y2", String(nodes[j].y));
            line.setAttribute("stroke-opacity", alpha.toFixed(3));
          }
          li++;
        }
      }

      // Hide any unused lines (so the count doesn't fluctuate visually).
      for (let k = li; k < lines.length; k++) {
        const line = lines[k];
        if (line) line.setAttribute("stroke-opacity", "0");
      }
    }
  }, [nodeCount, edgeProximity, cursorInfluenceRadius, seed, maxEdges]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={
        "pointer-events-none absolute inset-0 overflow-hidden" +
        (className ? " " + className : "")
      }
      style={{ opacity }}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        {/* Edges layer — drawn under nodes. */}
        <g stroke="rgb(115, 55, 225)" strokeWidth={1} fill="none">
          {Array.from({ length: maxEdges }).map((_, i) => (
            <line
              key={`edge-${i}`}
              ref={(el) => {
                linesRef.current[i] = el;
              }}
              x1={0}
              y1={0}
              x2={0}
              y2={0}
              strokeOpacity={0}
            />
          ))}
        </g>
        {/* Nodes layer. */}
        <g fill="rgb(245, 245, 245)">
          {Array.from({ length: nodeCount }).map((_, i) => (
            <circle
              key={`node-${i}`}
              ref={(el) => {
                circlesRef.current[i] = el;
              }}
              cx={0}
              cy={0}
              r={1.6}
              fillOpacity={0.55}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
