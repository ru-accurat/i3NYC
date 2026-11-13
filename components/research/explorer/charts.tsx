"use client";

import { useEffect, useRef, useState } from "react";
import { pct } from "@/lib/research/format";
import { SERIES, heatFill } from "../theme";
import { groupBy, useExplorer, type JumpPatch } from "./explorer-context";

/* ── Tooltip layer ───────────────────────────────────────────────────────── */
// One floating tooltip for everything inside it that carries `data-tip`.
// Follows the pointer; on keyboard focus it sits under the focused mark.

export function DataTip({ children, className }: { children: React.ReactNode; className?: string }) {
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null);

  function fromPointer(e: React.PointerEvent) {
    const target = (e.target as Element).closest?.("[data-tip]") as HTMLElement | null;
    if (!target) return setTip(null);
    setTip({ text: target.dataset.tip ?? "", x: e.clientX + 12, y: e.clientY + 14 });
  }
  function fromFocus(e: React.FocusEvent) {
    const target = (e.target as Element).closest?.("[data-tip]") as HTMLElement | null;
    if (!target) return;
    const r = target.getBoundingClientRect();
    setTip({ text: target.dataset.tip ?? "", x: r.left, y: r.bottom + 8 });
  }

  return (
    <div
      className={className}
      onPointerMove={fromPointer}
      onPointerLeave={() => setTip(null)}
      onFocus={fromFocus}
      onBlur={() => setTip(null)}
    >
      {children}
      {tip && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50 max-w-[280px] rounded-md bg-foreground px-3 py-1.5 text-xs leading-relaxed text-background"
          style={{ left: Math.max(8, Math.min(tip.x, window.innerWidth - 288)), top: tip.y }}
        >
          {tip.text}
        </div>
      )}
    </div>
  );
}

/* ── Horizontal bars ─────────────────────────────────────────────────────── */

export interface BarRow {
  key: string;
  label: string;
  /** Small second line under the label. */
  sub?: string;
  /** Bar length as a share of the longest bar, 0–1. */
  fraction: number;
  /** Value printed at the end of the row. */
  display: string;
  /** Muted text after the value. */
  unit?: string;
  tip: string;
}

interface BarListProps {
  rows: BarRow[];
  onSelect?: (key: string) => void;
  /** Use the second series colour. */
  alt?: boolean;
}

export function BarList({ rows, onSelect, alt }: BarListProps) {
  const ROW =
    "grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-1.5 text-left text-sm md:grid-cols-[minmax(96px,200px)_minmax(0,1fr)_auto]";
  const body = (r: BarRow) => (
    <>
      <span className="col-span-2 min-w-0 leading-snug text-foreground/90 md:col-span-1">
        {r.label}
        {r.sub && <span className="ml-2 text-xs text-muted-foreground md:ml-0 md:block">{r.sub}</span>}
      </span>
      <span className="block h-2.5 bg-foreground/[0.06]" data-tip={onSelect ? undefined : r.tip}>
        <span
          className="block h-full rounded-r-[4px]"
          style={{ width: pct(r.fraction), backgroundColor: alt ? SERIES.secondary : SERIES.primary }}
        />
      </span>
      <span className="min-w-[4.5rem] text-right tabular-nums text-foreground/90">
        {r.display}
        {r.unit && <span className="text-xs text-muted-foreground"> {r.unit}</span>}
      </span>
    </>
  );

  return (
    <DataTip>
      {rows.map((r) =>
        onSelect ? (
          <button
            key={r.key}
            type="button"
            data-tip={r.tip}
            onClick={() => onSelect(r.key)}
            className={`${ROW} cursor-pointer rounded-md transition-colors hover:bg-primary/10`}
          >
            {body(r)}
          </button>
        ) : (
          <div key={r.key} className={ROW}>
            {body(r)}
          </div>
        )
      )}
    </DataTip>
  );
}

/* ── Lens toggle ─────────────────────────────────────────────────────────── */

export function LensToggle() {
  const { config, lens, setLens } = useExplorer();
  return (
    <div
      role="group"
      aria-label="Lens applied to every chart and to the database"
      className="flex flex-wrap items-center gap-2"
    >
      <span className="mr-1 text-xs tracking-wide text-muted-foreground">Lens</span>
      {config.lenses.map((l) => {
        const on = lens === l.key;
        return (
          <button
            key={l.key}
            type="button"
            aria-pressed={on}
            onClick={() => setLens(l.key)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              on
                ? "border-foreground bg-foreground text-background"
                : "border-border text-foreground/80 hover:border-primary/60 hover:text-foreground"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Cohort explorer: group by a dimension, measure it, click to list ────── */

const SELECT = "h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground";
const SELECT_LABEL = "flex flex-col gap-1.5 text-xs tracking-wide text-muted-foreground";

export function CohortExplorer() {
  const { config, base, jump } = useExplorer();
  const [group, setGroup] = useState(config.defaultGroup);
  const [measureKey, setMeasureKey] = useState(Object.keys(config.measures)[0]);
  const dim = config.dimensions[group];
  const measure = config.measures[measureKey];
  const [, plural] = config.noun;
  const isCount = !measure.coverage && measureKey === Object.keys(config.measures)[0];

  const rows = [...groupBy(base, group)].map(([k, v]) => ({
    k,
    v,
    x: measure.value(v),
    covered: measure.coverage ? v.filter((o) => o[measure.coverage as string] != null).length : v.length,
  }));
  if (dim.order && isCount) {
    const order = dim.order;
    rows.sort((a, b) => order.indexOf(a.k) - order.indexOf(b.k));
  } else {
    rows.sort((a, b) => (b.x || 0) - (a.x || 0));
  }
  const max = Math.max(1, ...rows.map((r) => r.x || 0));

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-4">
        <label className={SELECT_LABEL}>
          Group by
          <select value={group} onChange={(e) => setGroup(e.target.value)} className={SELECT}>
            {Object.entries(config.dimensions).map(([k, d]) => (
              <option key={k} value={k}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <label className={SELECT_LABEL}>
          Measure
          <select value={measureKey} onChange={(e) => setMeasureKey(e.target.value)} className={SELECT}>
            {Object.entries(config.measures).map(([k, m]) => (
              <option key={k} value={k}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <BarList
        rows={rows.map((r) => ({
          key: r.k,
          label: r.k,
          sub: `${r.v.length} co.`,
          fraction: (r.x || 0) / max,
          display: measure.format(r.x),
          tip: `${r.k}: ${measure.format(r.x)} (${measure.label.toLowerCase()}). ${
            measure.coverage
              ? `${r.covered} of ${r.v.length} ${plural} disclose this figure.`
              : `${r.v.length} ${plural}.`
          } Click to list them.`,
        }))}
        onSelect={(k) => jump(group === config.tabKey ? { tab: k } : { filters: { [group]: k } })}
      />
      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        {measure.coverage
          ? `Sums and medians use only the ${plural} that disclose the figure; hover a bar for coverage.`
          : `Click a bar to list the ${plural} in the database below.`}
      </p>
    </div>
  );
}

/* ── Heat matrix: counts by two fields, click a cell to list it ──────────── */

interface ExplorerMatrixProps {
  rowKey: string;
  rowOrder: string[];
  colKey: string;
  colOrder: string[];
  /** What clicking a cell does to the database. */
  jumpTo: (row: string, col: string) => JumpPatch;
  /** Restrict the matrix to a subset of the lens rows. */
  only?: (o: Record<string, unknown>) => boolean;
}

export function ExplorerMatrix({ rowKey, rowOrder, colKey, colOrder, jumpTo, only }: ExplorerMatrixProps) {
  const { base, jump, config } = useExplorer();
  const rows = only ? base.filter(only) : base;
  const [singular, plural] = config.noun;
  const count = (a: string, b: string) => rows.filter((o) => o[rowKey] === a && o[colKey] === b).length;
  const max = Math.max(1, ...rowOrder.flatMap((a) => colOrder.map((b) => count(a, b))));
  const TH = "px-1.5 pb-2 text-center align-bottom text-xs font-normal leading-tight text-muted-foreground";

  return (
    <DataTip className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-separate border-spacing-1 tabular-nums">
        <thead>
          <tr>
            <td />
            {colOrder.map((c) => (
              <th key={c} scope="col" className={TH}>
                {c}
              </th>
            ))}
            <th scope="col" className={TH}>
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {rowOrder.map((a) => (
            <tr key={a}>
              <th scope="row" className="pr-4 text-left text-sm font-normal text-foreground/80">
                {a}
              </th>
              {colOrder.map((b) => {
                const n = count(a, b);
                if (!n) {
                  return (
                    <td key={b} className="h-11 rounded-md bg-card text-center text-sm text-muted-foreground/40">
                      ·
                    </td>
                  );
                }
                return (
                  <td key={b} className="relative h-11 min-w-12 rounded-md bg-card">
                    <button
                      type="button"
                      onClick={() => jump(jumpTo(a, b))}
                      data-tip={`${a} × ${b}: ${n} ${n === 1 ? singular : plural}`}
                      aria-label={`${a}, ${b}: ${n} ${n === 1 ? singular : plural}. List them.`}
                      className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-md text-sm font-medium text-foreground transition-shadow hover:ring-1 hover:ring-foreground/60"
                      style={{ backgroundColor: heatFill(n, max) }}
                    >
                      {n}
                    </button>
                  </td>
                );
              })}
              <td className="h-11 px-2 text-center text-sm text-muted-foreground">
                {rows.filter((o) => o[rowKey] === a).length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DataTip>
  );
}

/* ── Scatter: founding year against a figure, log scale ──────────────────── */

export interface ScatterPoint {
  name: string;
  year: number;
  value: number;
  /** Drawn in the second series colour. */
  alt: boolean;
  tip: string;
}

interface ScatterProps {
  points: ScatterPoint[];
  /** Year domain; earlier years are clamped to `from`. */
  from: number;
  to: number;
  /** First labelled year (shown as "≤year") and the last one. */
  tickFrom: number;
  tickTo: number;
  formatValue: (v: number) => string;
  ariaLabel: string;
  marker?: { year: number; label: string };
  onSelect: (name: string) => void;
}

export function Scatter({ points, from, to, tickFrom, tickTo, formatValue, ariaLabel, marker, onSelect }: ScatterProps) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setWidth(Math.max(300, Math.round(el.clientWidth)));
    // Measure once after mount (a timer still fires in a background tab, where
    // resize observations can be held back), then follow resizes.
    const first = window.setTimeout(measure, 0);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      window.clearTimeout(first);
      ro.disconnect();
    };
  }, []);

  const W = width;
  const narrow = W < 560;
  const H = narrow ? 340 : 420;
  const m = { l: 52, r: 14, t: 14, b: 34 };

  let svg: React.ReactNode = null;
  if (W > 0 && points.length > 0) {
    const values = points.map((p) => p.value);
    const lo = Math.floor(Math.log10(Math.min(...values, 1)));
    const hi = Math.ceil(Math.log10(Math.max(...values, 10)));
    // Same-year points share an x; the small offset spreads neighbouring years.
    const X = (y: number) => m.l + ((Math.max(from, y) - from + ((y * 7919) % 10) / 14) / (to - from)) * (W - m.l - m.r);
    const Y = (v: number) => H - m.b - ((Math.log10(v) - lo) / (hi - lo)) * (H - m.t - m.b);
    const exps = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
    const years: number[] = [];
    for (let y = tickFrom; y <= tickTo; y += narrow ? 10 : 5) years.push(y);
    const labelled = new Set(
      [...points]
        .sort((a, b) => b.value - a.value)
        .slice(0, narrow ? 4 : 8)
        .map((p) => p.name)
    );

    svg = (
      <svg width={W} height={H} role="img" aria-label={ariaLabel} className="block">
        {exps.map((e) => {
          const y = Y(10 ** e);
          return (
            <g key={e}>
              <line x1={m.l} x2={W - m.r} y1={y} y2={y} className="stroke-border" />
              <text x={m.l - 6} y={y + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">
                {formatValue(10 ** e)}
              </text>
            </g>
          );
        })}
        {years.map((y) => (
          <text key={y} x={X(y)} y={H - 12} textAnchor="middle" className="fill-muted-foreground text-[11px]">
            {y === tickFrom ? `≤${y}` : y}
          </text>
        ))}
        {marker && (
          <g>
            <line
              x1={X(marker.year)}
              x2={X(marker.year)}
              y1={m.t}
              y2={H - m.b}
              className="stroke-muted-foreground/60"
              strokeDasharray="3 4"
            />
            <text x={X(marker.year) - 5} y={m.t + 10} textAnchor="end" className="fill-muted-foreground text-[11px]">
              {marker.label}
            </text>
          </g>
        )}
        {points.map((p) => {
          const cx = X(p.year);
          const cy = Y(p.value);
          const flip = cx > W - 130;
          return (
            <g key={p.name}>
              <circle
                tabIndex={0}
                role="button"
                aria-label={p.tip}
                cx={cx}
                cy={cy}
                r={5.5}
                fill={p.alt ? SERIES.secondary : SERIES.primary}
                fillOpacity={0.78}
                className="cursor-pointer stroke-background stroke-2 outline-none hover:fill-opacity-100 focus-visible:stroke-foreground"
                data-tip={p.tip}
                onClick={() => onSelect(p.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(p.name);
                  }
                }}
              />
              {labelled.has(p.name) && (
                <text
                  x={flip ? cx - 9 : cx + 9}
                  y={cy + 4}
                  textAnchor={flip ? "end" : "start"}
                  className="pointer-events-none fill-foreground/85 text-[11px]"
                >
                  {p.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <DataTip>
      <div ref={box} className="w-full rounded-2xl border border-border p-2" style={{ minHeight: H + 16 }}>
        {svg}
      </div>
    </DataTip>
  );
}

/** Two-entry legend for charts that split software from physical, grant from equity, etc. */
export function SeriesLegend({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-2">
        <i className="size-2.5 rounded-full" style={{ backgroundColor: SERIES.primary }} />
        {primary}
      </span>
      <span className="flex items-center gap-2">
        <i className="size-2.5 rounded-full" style={{ backgroundColor: SERIES.secondary }} />
        {secondary}
      </span>
    </div>
  );
}
