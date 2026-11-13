"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import {
  EMPTY_FILTERS,
  type ExplorerFilters,
  type FinderAnswers,
  type NavigatorData,
  type StatusKey,
} from "@/lib/research/navigator";

/* ── Shared look ─────────────────────────────────────────────────────────── */

export const PILL = "inline-block rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap";

// Status colours are reserved for status and always ship with their label.
export const NAV_STATUS_PILL: Record<StatusKey, string> = {
  open: "bg-emerald-400/10 text-emerald-300",
  soon: "bg-amber-400/10 text-amber-200",
  closed: "bg-rose-400/10 text-rose-300",
};

export const LINK_BUTTON =
  "text-sm text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-foreground";

export const PRIMARY_BUTTON =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80";

export const GHOST_BUTTON =
  "inline-flex h-9 items-center justify-center rounded-full border border-border px-5 text-sm text-foreground/80 transition-colors hover:border-foreground hover:text-foreground aria-pressed:border-primary/60 aria-pressed:bg-primary/15 aria-pressed:text-foreground";

/* ── Shortlist store (localStorage, with an in-memory fallback) ──────────── */

const STORAGE_KEY = "i3nyc-shortlist";
const listeners = new Set<() => void>();
// Set once the shortlist is written this session, so a blocked or full
// localStorage still leaves a working shortlist until the page is closed.
let memory: string | null = null;

function readShortlist(): string {
  if (memory !== null) return memory;
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function writeShortlist(value: number[]) {
  memory = JSON.stringify(value);
  try {
    localStorage.setItem(STORAGE_KEY, memory);
  } catch {
    // Private mode or blocked storage: the in-memory copy carries the session.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function parseShortlist(raw: string, count: number): number[] {
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter((i): i is number => Number.isInteger(i) && i >= 0 && i < count);
  } catch {
    return [];
  }
}

/** Copies text to the clipboard; resolves false when the browser refuses. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* ── Context ─────────────────────────────────────────────────────────────── */

interface NavigatorContextValue {
  data: NavigatorData;
  filters: ExplorerFilters;
  setFilter: (key: keyof ExplorerFilters, value: string) => void;
  resetFilters: () => void;
  saved: number[];
  toggleSaved: (index: number) => void;
  clearSaved: () => void;
  /** Program the finder asked to reveal; `tick` changes on every request. */
  reveal: { index: number; tick: number } | null;
  /** Finder → "See details": clear the filters and open that program's card. */
  showProgram: (index: number) => void;
  /** Finder → "Show these filters in the full list". */
  showInExplorer: (answers: FinderAnswers) => void;
}

const NavigatorContext = createContext<NavigatorContextValue | null>(null);

export function useNavigator(): NavigatorContextValue {
  const ctx = useContext(NavigatorContext);
  if (!ctx) throw new Error("useNavigator must be used inside <NavigatorProvider>");
  return ctx;
}

/** Holds the state the finder and the explorer share. */
export function NavigatorProvider({ data, children }: { data: NavigatorData; children: React.ReactNode }) {
  const [filters, setFilters] = useState<ExplorerFilters>(EMPTY_FILTERS);
  const [reveal, setReveal] = useState<{ index: number; tick: number } | null>(null);

  const raw = useSyncExternalStore(subscribe, readShortlist, () => "[]");
  const count = data.PROGRAMS.length;
  const saved = useMemo(() => parseShortlist(raw, count), [raw, count]);

  const setFilter = useCallback(
    (key: keyof ExplorerFilters, value: string) => setFilters((f) => ({ ...f, [key]: value })),
    []
  );
  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const toggleSaved = useCallback(
    (index: number) => {
      const current = parseShortlist(readShortlist(), count);
      writeShortlist(current.includes(index) ? current.filter((i) => i !== index) : [...current, index]);
    },
    [count]
  );
  const clearSaved = useCallback(() => writeShortlist([]), []);

  const showProgram = useCallback((index: number) => {
    setFilters(EMPTY_FILTERS);
    setReveal((r) => ({ index, tick: (r?.tick ?? 0) + 1 }));
  }, []);

  const showInExplorer = useCallback((answers: FinderAnswers) => {
    // Only New Jersey and Connecticut map onto a single region filter.
    const region = answers.place === "nj" || answers.place === "ct" ? answers.place : "";
    setFilters({ ...EMPTY_FILTERS, region });
    document.getElementById("explorer")?.scrollIntoView();
  }, []);

  const value = useMemo(
    () => ({
      data,
      filters,
      setFilter,
      resetFilters,
      saved,
      toggleSaved,
      clearSaved,
      reveal,
      showProgram,
      showInExplorer,
    }),
    [data, filters, setFilter, resetFilters, saved, toggleSaved, clearSaved, reveal, showProgram, showInExplorer]
  );

  return <NavigatorContext.Provider value={value}>{children}</NavigatorContext.Provider>;
}
