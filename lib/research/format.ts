// Number helpers shared by the research pages. Money figures in the datasets
// are in millions of the page's currency; null means "not disclosed".

export type Num = number | null | undefined;

/** $ millions, as the NYC applets print them: $7.6B, $117M, $4.5M. */
export function fmtUsdM(v: Num): string {
  if (v == null) return "n/d";
  if (v >= 1000) return "$" + (v / 1000).toFixed(1).replace(/\.0$/, "") + "B";
  return "$" + (v >= 100 ? Math.round(v) : +v.toFixed(1)) + "M";
}

/** € millions, as the Italy applet prints them: €1.39B, €117M, €500K. */
export function fmtEurM(v: Num): string {
  if (v == null) return "n/d";
  if (v >= 1000) return "€" + (v / 1000).toFixed(2).replace(/\.?0+$/, "") + "B";
  if (v < 1) return "€" + Math.round(v * 1000) + "K";
  return "€" + (v >= 100 ? Math.round(v) : +v.toFixed(1)) + "M";
}

export function fmtInt(v: Num): string {
  return v == null ? "n/d" : Math.round(v).toLocaleString("en-US");
}

export function median(values: Num[]): number | null {
  const a = values.filter((v): v is number => v != null).sort((x, y) => x - y);
  if (!a.length) return null;
  const m = a.length >> 1;
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

export function sum(values: Num[]): number {
  return values.reduce<number>((s, v) => s + (v || 0), 0);
}

export function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Rounds to two decimals so inline styles match between server and browser. */
export function pct(fraction: number): string {
  return `${Math.round(fraction * 10000) / 100}%`;
}
