import type { Status } from "@/lib/research/program-map";

// Chart colours for the research pages, chosen for the site's dark surface
// (rgb 31 31 36). The pair passes lightness band, colour-blind separation and
// 3:1 contrast against that surface; text never takes a series colour.
export const SERIES = {
  /** Non-dilutive money, and the single hue for magnitude (heatmap) */
  primary: "#8F5CFF",
  /** Investment (equity or note) */
  secondary: "#1FA58F",
} as const;

/** Heatmap fill for `count` out of the largest cell `max`. */
export function heatFill(count: number, max: number): string {
  const alpha = 0.16 + 0.6 * (count / max);
  return `rgb(143 92 255 / ${alpha.toFixed(2)})`;
}

// Status colours are reserved for status and always ship with their label.
export const STATUS_PILL: Record<Status, string> = {
  Active: "bg-emerald-400/10 text-emerald-300",
  Listed: "bg-amber-400/10 text-amber-200",
  Paused: "bg-rose-400/10 text-rose-300",
  Unconfirmed: "bg-foreground/8 text-muted-foreground",
};
