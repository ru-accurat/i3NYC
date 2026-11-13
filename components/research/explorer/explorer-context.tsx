"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Shared state for the "company explorer" research pages: one lens applied to
// every chart, and one database whose filters the charts can drive ("click a
// bar to list that cohort"). Each page supplies its rows and an ExplorerConfig.

/** A company (or other profiled entity). `q` is its lower-cased search text. */
export type Row = { n: string; q: string } & Record<string, unknown>;

export interface Measure {
  label: string;
  value: (rows: Row[]) => number | null;
  format: (v: number | null) => string;
  /** Field whose presence counts as "discloses this figure"; omit for plain counts. */
  coverage?: string;
}

export interface ExplorerConfig {
  lenses: { key: string; label: string; test: (o: Row) => boolean }[];
  /** Fields a chart can group by, with an optional fixed display order. */
  dimensions: Record<string, { label: string; order?: string[] }>;
  measures: Record<string, Measure>;
  defaultGroup: string;
  /** Field shown as the row of pill tabs above the database. */
  tabKey: string;
  tabOrder: string[];
  /** Selects shown in the database filter bar, in order. */
  filters: { key: string; label: string }[];
  sorts: { key: string; label: string }[];
  defaultSort: string;
  /** Singular and plural noun for a row, e.g. ["company", "companies"]. */
  noun: [string, string];
}

export interface JumpPatch {
  tab?: string;
  filters?: Record<string, string>;
  q?: string;
}

interface ExplorerValue {
  config: ExplorerConfig;
  /** Every row, ignoring the lens. */
  all: Row[];
  /** Rows passing the current lens. */
  base: Row[];
  lens: string;
  setLens: (key: string) => void;
  tab: string;
  filters: Record<string, string>;
  query: string;
  sort: string;
  showAll: boolean;
  opened: ReadonlySet<string>;
  setTab: (tab: string) => void;
  setFilter: (key: string, value: string) => void;
  setQuery: (q: string) => void;
  setSort: (key: string) => void;
  setShowAll: (v: boolean) => void;
  setOpen: (name: string, open: boolean) => void;
  reset: () => void;
  /** Clears the database filters, applies the patch and scrolls to the database. */
  jump: (patch: JumpPatch) => void;
  /** Jumps to the database and opens one row. */
  openRow: (name: string) => void;
}

const ExplorerContext = createContext<ExplorerValue | null>(null);

export function useExplorer(): ExplorerValue {
  const value = useContext(ExplorerContext);
  if (!value) throw new Error("useExplorer must be used inside an ExplorerProvider");
  return value;
}

export const DATABASE_ID = "database";

function scrollToDatabase() {
  document.getElementById(DATABASE_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ExplorerProvider({
  rows,
  config,
  children,
}: {
  rows: Row[];
  config: ExplorerConfig;
  children: React.ReactNode;
}) {
  const [lens, setLens] = useState(config.lenses[0].key);
  const [tab, setTabState] = useState("All");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [query, setQueryState] = useState("");
  const [sort, setSortState] = useState(config.defaultSort);
  const [showAll, setShowAll] = useState(false);
  const [opened, setOpened] = useState<ReadonlySet<string>>(new Set());

  const base = useMemo(() => {
    const test = config.lenses.find((l) => l.key === lens)?.test ?? (() => true);
    return rows.filter(test);
  }, [rows, config, lens]);

  const setTab = useCallback((t: string) => {
    setTabState(t);
    setShowAll(false);
  }, []);
  const setFilter = useCallback((key: string, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setShowAll(false);
  }, []);
  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    setShowAll(false);
  }, []);
  const setSort = useCallback((key: string) => {
    setSortState(key);
    setShowAll(false);
  }, []);
  const setOpen = useCallback((name: string, open: boolean) => {
    setOpened((prev) => {
      if (prev.has(name) === open) return prev;
      const next = new Set(prev);
      if (open) next.add(name);
      else next.delete(name);
      return next;
    });
  }, []);
  const reset = useCallback(() => {
    setTabState("All");
    setFilters({});
    setQueryState("");
    setShowAll(false);
  }, []);
  const jump = useCallback((patch: JumpPatch) => {
    setTabState(patch.tab ?? "All");
    setFilters(patch.filters ?? {});
    setQueryState(patch.q ?? "");
    setShowAll(false);
    scrollToDatabase();
  }, []);
  const openRow = useCallback(
    (name: string) => {
      jump({ q: name.toLowerCase() });
      setOpened(new Set([name]));
    },
    [jump]
  );

  const value = useMemo<ExplorerValue>(
    () => ({
      config,
      all: rows,
      base,
      lens,
      setLens,
      tab,
      filters,
      query,
      sort,
      showAll,
      opened,
      setTab,
      setFilter,
      setQuery,
      setSort,
      setShowAll,
      setOpen,
      reset,
      jump,
      openRow,
    }),
    [config, rows, base, lens, tab, filters, query, sort, showAll, opened, setTab, setFilter, setQuery, setSort, setOpen, reset, jump, openRow]
  );

  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>;
}

/** Groups rows by a field, keeping first-seen order. */
export function groupBy(rows: Row[], key: string): Map<string, Row[]> {
  const m = new Map<string, Row[]>();
  for (const o of rows) {
    const k = String(o[key]);
    const list = m.get(k);
    if (list) list.push(o);
    else m.set(k, [o]);
  }
  return m;
}

export function num(o: Row, key: string): number | null {
  const v = o[key];
  return typeof v === "number" ? v : null;
}

export function str(o: Row, key: string): string {
  const v = o[key];
  return v == null ? "" : String(v);
}
