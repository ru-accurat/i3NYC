"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { hostname } from "@/lib/research/format";
import { LINK } from "../rich";
import { DATABASE_ID, useExplorer, type Row } from "./explorer-context";

const PAGE = 30;
const FIELD = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";
const FIELD_LABEL = "flex min-w-0 flex-1 basis-40 flex-col gap-1.5 text-xs tracking-wide text-muted-foreground";

export const PILL = "inline-block rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap";
export const PILL_NEUTRAL = `${PILL} border border-border text-foreground/80`;
export const PILL_MUTED = `${PILL} border border-border text-muted-foreground`;
/** Matches the second series colour used for the same entities in the charts. */
export const PILL_ALT = `${PILL} bg-[#1FA58F]/15 text-[#7FE0BC]`;
export const PILL_WARN = `${PILL} bg-amber-400/10 text-amber-200`;
export const PILL_GOOD = `${PILL} bg-emerald-400/10 text-emerald-300`;
export const PILL_BAD = `${PILL} bg-rose-400/10 text-rose-300`;

export interface RowSummary {
  title: string;
  subtitle?: string;
  /** Second column: sector, founding year and the like. */
  meta: React.ReactNode;
  /** Third column: stage, funding and the like. */
  facts: React.ReactNode;
  pills: React.ReactNode;
}

interface CompanyDatabaseProps {
  searchPlaceholder: string;
  summary: (o: Row) => RowSummary;
  /** Rendered only while the row is open. */
  detail: (o: Row) => React.ReactNode;
  /** Text after "N of M companies". */
  countSuffix?: (rows: Row[]) => string;
  /** Label of the pill-tab group, for assistive tech. */
  tabsLabel: string;
}

export function CompanyDatabase({ searchPlaceholder, summary, detail, countSuffix, tabsLabel }: CompanyDatabaseProps) {
  const x = useExplorer();
  const { config, all, base } = x;
  const [, plural] = config.noun;

  // Options come from every row so a lens never hides a choice.
  const options = useMemo(() => {
    const out: Record<string, string[]> = {};
    for (const f of config.filters) {
      const values = [...new Set(all.map((o) => String(o[f.key])))];
      const order = config.dimensions[f.key]?.order;
      if (order) values.sort((a, b) => order.indexOf(a) - order.indexOf(b));
      else values.sort();
      out[f.key] = values;
    }
    return out;
  }, [all, config]);

  const rows = useMemo(() => {
    const active = Object.entries(x.filters).filter(([, v]) => v);
    const r = base.filter(
      (o) =>
        (x.tab === "All" || o[config.tabKey] === x.tab) &&
        active.every(([k, v]) => String(o[k]) === v) &&
        (!x.query || o.q.includes(x.query))
    );
    const s = x.sort;
    const n = (o: Row, fallback: number) => (typeof o[s] === "number" && o[s] ? (o[s] as number) : fallback);
    r.sort((a, b) => (s === "n" ? a.n.localeCompare(b.n) : s === "y" ? n(b, 0) - n(a, 0) : n(b, -1) - n(a, -1)));
    return r;
  }, [base, config.tabKey, x.tab, x.filters, x.query, x.sort]);

  const shown = x.showAll ? rows : rows.slice(0, PAGE);
  const lensLabel = x.lens !== config.lenses[0].key ? config.lenses.find((l) => l.key === x.lens)?.label : null;
  const tabs = ["All", ...config.tabOrder];

  return (
    <div>
      <div role="group" aria-label={tabsLabel} className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const on = x.tab === t;
          const count = t === "All" ? base.length : base.filter((o) => o[config.tabKey] === t).length;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => x.setTab(t)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                on
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground/80 hover:border-primary/60 hover:text-foreground"
              }`}
            >
              {t}
              <span className={`ml-1.5 text-xs tabular-nums ${on ? "text-background/70" : "text-muted-foreground"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border p-4">
        <label className={FIELD_LABEL}>
          Search
          <input
            type="search"
            value={x.query}
            onChange={(e) => x.setQuery(e.target.value.toLowerCase())}
            placeholder={searchPlaceholder}
            className={`${FIELD} placeholder:text-muted-foreground/60`}
          />
        </label>
        {config.filters.map((f) => (
          <label key={f.key} className={FIELD_LABEL}>
            {f.label}
            <select value={x.filters[f.key] ?? ""} onChange={(e) => x.setFilter(f.key, e.target.value)} className={FIELD}>
              <option value="">All</option>
              {options[f.key].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
        ))}
        <label className={FIELD_LABEL}>
          Sort by
          <select value={x.sort} onChange={(e) => x.setSort(e.target.value)} className={FIELD}>
            {config.sorts.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={x.reset}
          className="h-10 rounded-md border border-border px-4 text-sm text-foreground/80 transition-colors hover:border-foreground hover:text-foreground"
        >
          Reset
        </button>
      </div>

      <p className="mt-6 mb-2 text-xs leading-relaxed text-muted-foreground" aria-live="polite">
        {rows.length} of {all.length} {plural}
        {lensLabel ? ` (lens: ${lensLabel})` : ""}
        {countSuffix ? countSuffix(rows) : ""}
      </p>

      {rows.length === 0 ? (
        <p className="border-t border-border py-8 text-sm text-muted-foreground">No company matches these filters.</p>
      ) : (
        <div className="border-b border-border">
          {shown.map((o) => {
            const s = summary(o);
            const open = x.opened.has(o.n);
            return (
              <details
                key={o.n}
                open={open}
                onToggle={(e) => x.setOpen(o.n, (e.currentTarget as HTMLDetailsElement).open)}
                className="group border-t border-border"
              >
                <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 px-1 py-4 transition-colors hover:bg-primary/5 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1.3fr)_auto_auto] [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 font-medium text-foreground">
                    {s.title}
                    {s.subtitle && (
                      <span className="block text-sm leading-snug font-normal text-muted-foreground">{s.subtitle}</span>
                    )}
                  </span>
                  <span className="hidden min-w-0 text-xs leading-relaxed text-muted-foreground md:block">{s.meta}</span>
                  <span className="order-3 col-span-2 min-w-0 text-sm leading-relaxed text-foreground/80 md:order-none md:col-span-1 [&_b]:font-medium [&_b]:text-foreground">
                    {s.facts}
                  </span>
                  <span className="flex flex-col items-end gap-1">{s.pills}</span>
                  <ChevronDown
                    aria-hidden
                    className="mt-1 hidden size-4 text-muted-foreground transition-transform group-open:rotate-180 md:block"
                  />
                </summary>
                {open && detail(o)}
              </details>
            );
          })}
        </div>
      )}

      {!x.showAll && rows.length > PAGE && (
        <button
          type="button"
          onClick={() => x.setShowAll(true)}
          className="mt-6 h-10 rounded-md border border-border px-4 text-sm text-foreground/80 transition-colors hover:border-foreground hover:text-foreground"
        >
          Show all {rows.length} {plural}
        </button>
      )}
    </div>
  );
}

/* ── Building blocks for the expanded row ────────────────────────────────── */

export function DetailGrid({ children }: { children: React.ReactNode }) {
  return <dl className="grid gap-x-10 gap-y-5 px-1 pt-2 pb-8 text-sm md:grid-cols-2 lg:grid-cols-3">{children}</dl>;
}

/** One labelled fact; renders nothing when the value is empty. */
export function DetailItem({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  if (children == null || children === "" || children === false) return null;
  return (
    <div className={wide ? "md:col-span-2 lg:col-span-3" : undefined}>
      <dt className="mb-1.5 text-xs tracking-wide text-muted-foreground">{label}</dt>
      <dd className="min-w-0 leading-relaxed break-words text-foreground/85 [&_b]:font-medium [&_b]:text-foreground [&_small]:mt-1 [&_small]:block [&_small]:text-xs [&_small]:text-muted-foreground">
        {children}
      </dd>
    </div>
  );
}

export function DetailBullets({ items }: { items?: string[] | null }) {
  if (!items?.length) return null;
  return (
    <ul className="list-disc space-y-1 pl-4 marker:text-muted-foreground/60">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

/** Source notes that may contain a URL: linked by hostname when they do. */
export function SourceLinks({ sources, site }: { sources?: string[] | null; site?: string | null }) {
  const parts: React.ReactNode[] = (sources ?? []).map((u, i) => {
    const m = String(u).match(/https?:\/\/\S+/);
    if (!m) return <span key={i}>{u}</span>;
    const url = m[0].replace(/[),.;]+$/, "");
    return (
      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className={LINK}>
        {hostname(url)}
      </a>
    );
  });
  if (site) {
    parts.push(
      <a key="site" href={site} target="_blank" rel="noopener noreferrer" className={LINK}>
        company site
      </a>
    );
  }
  if (!parts.length) return null;
  return <span className="flex flex-wrap gap-x-3 gap-y-1">{parts}</span>;
}

export { DATABASE_ID };
