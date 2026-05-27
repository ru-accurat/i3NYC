"use client";

import { useEffect, useRef, useState } from "react";

interface RevealOnScrollProps {
  children: React.ReactNode;
  /** Threshold for triggering the reveal. Default 0.05. */
  threshold?: number;
  /** Pre-trigger offset on the bottom of the viewport (px). Default 80. */
  rootMarginBottom?: number;
  /** Optional delay before the reveal (ms). Default 0. */
  delayMs?: number;
}

/**
 * Lightweight scroll-into-view reveal: fades + lifts content 8px up over
 * ~500ms when its top edge enters the viewport. One-shot — once revealed,
 * stays revealed (no re-trigger on scroll up).
 *
 * Respects `prefers-reduced-motion: reduce` via globals.css — the
 * transition-duration is overridden to 0.001ms there.
 *
 * Renders children with a `[data-reveal]` attribute that flips from
 * "off" to "on". CSS handles the actual transition (in this file's
 * inline style block scoped via the attribute selector — simpler than
 * adding a globals.css rule for one component).
 */
export function RevealOnScroll({
  children,
  threshold = 0.05,
  rootMarginBottom = 80,
  delayMs = 0,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the element is already in view on mount (e.g. very tall hero), reveal immediately.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      if (delayMs > 0) {
        const t = window.setTimeout(() => setRevealed(true), delayMs);
        return () => window.clearTimeout(t);
      }
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (delayMs > 0) {
              window.setTimeout(() => setRevealed(true), delayMs);
            } else {
              setRevealed(true);
            }
            observer.disconnect();
            break;
          }
        }
      },
      {
        threshold,
        rootMargin: `0px 0px -${rootMarginBottom}px 0px`,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMarginBottom, delayMs]);

  return (
    <div
      ref={ref}
      data-reveal={revealed ? "on" : "off"}
      className="reveal-on-scroll"
    >
      {children}
    </div>
  );
}
