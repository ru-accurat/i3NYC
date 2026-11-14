"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  filterPrograms,
  shortlistText,
  type ExplorerFilters,
  type NavigatorProgram,
} from "@/lib/research/navigator";
import {
  GHOST_BUTTON,
  LINK_BUTTON,
  NAV_STATUS_PILL,
  PILL,
  PRIMARY_BUTTON,
  copyText,
  useNavigator,
} from "./navigator-provider";

const FIELD = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";
const FIELD_LABEL = "flex min-w-0 flex-col gap-1.5 text-xs tracking-wide text-muted-foreground";
const TAG = "rounded border border-border px-2 py-0.5 text-xs text-muted-foreground";

/** Every program with search, four filters and a shortlist that can be copied. */
export function NavigatorExplorer() {
  const { data, filters, setFilter, resetFilters, saved, toggleSaved, reveal } = useNavigator();
  const rows = filterPrograms(data, filters);

  // The finder's "See details" clears the filters, then opens and scrolls to the card.
  useEffect(() => {
    if (!reveal) return;
    const card = document.getElementById(`program-${reveal.index}`);
    if (!card) return;
    const details = card.querySelector("details");
    if (details) details.open = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }, [reveal]);

  const select = (key: keyof ExplorerFilters, label: string, all: string, options: [string, string][]) => (
    <label className={FIELD_LABEL}>
      {label}
      <select value={filters[key]} onChange={(e) => setFilter(key, e.target.value)} className={FIELD}>
        <option value="">{all}</option>
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border p-4 lg:grid-cols-[2fr_repeat(4,1fr)]">
        <label className={`${FIELD_LABEL} col-span-2 lg:col-span-1`}>
          Search
          <input
            type="search"
            value={filters.q}
            onChange={(e) => setFilter("q", e.target.value)}
            placeholder="e.g. AI, climate, loan, Jersey City"
            className={`${FIELD} placeholder:text-muted-foreground/60`}
          />
        </label>
        {select("region", "Region", "All regions", Object.entries(data.REGIONS))}
        {select("type", "Type of support", "All types", Object.entries(data.TYPES))}
        {select("money", "Funding form", "Any form", Object.entries(data.MONEY))}
        {select(
          "status",
          "Status",
          "Any status",
          Object.entries(data.STAT).map(([key, [label]]) => [key, label])
        )}
      </div>

      <div className="mt-6 mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="text-xs tabular-nums text-muted-foreground" aria-live="polite">
          {rows.length} of {data.PROGRAMS.length} programs
        </p>
        <button type="button" onClick={resetFilters} className={LINK_BUTTON}>
          Reset filters
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No programs match these filters.{" "}
          <button type="button" onClick={resetFilters} className={LINK_BUTTON}>
            Reset filters
          </button>
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ program, index }) => (
            <ProgramCard
              key={index}
              id={`program-${index}`}
              program={program}
              saved={saved.includes(index)}
              onToggle={() => toggleSaved(index)}
            />
          ))}
        </div>
      )}

      <Shortlist />
    </div>
  );
}

interface ProgramCardProps {
  id: string;
  program: NavigatorProgram;
  saved: boolean;
  onToggle: () => void;
}

function ProgramCard({ id, program: p, saved, onToggle }: ProgramCardProps) {
  const { data } = useNavigator();
  return (
    <article
      id={id}
      className="grid min-w-0 scroll-mt-40 content-start gap-4 rounded-2xl border border-border p-6 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-light leading-snug tracking-tight">{p.n}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.o}</p>
        </div>
        <span className={`${PILL} ${NAV_STATUS_PILL[p.s]}`}>{data.STAT[p.s][0]}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className={TAG}>{data.REGIONS[p.r]}</span>
        <span className={TAG}>{data.TYPES[p.t]}</span>
        {p.m.map((m) => (
          <span key={m} className="rounded bg-primary/15 px-2 py-0.5 text-xs text-foreground/90">
            {data.MONEY[m]}
          </span>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-foreground/85">{p.b}</p>

      <details className="group border-t border-border pt-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm text-foreground/80 transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
          Who it&rsquo;s for, eligibility, timing
          <ChevronDown aria-hidden className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <dl className="mt-4 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[110px_1fr] sm:gap-y-3">
          <Row label="Who it's for" value={p.w} />
          <Row label="Eligibility" value={p.e} />
          <Row label="Timing" value={p.sl} />
          {p.k && <Row label="I3/NYC note" value={p.k} />}
        </dl>
      </details>

      <div className="flex flex-wrap items-center gap-2">
        <a href={p.u} target="_blank" rel="noopener noreferrer" className={PRIMARY_BUTTON}>
          {p.ul} ↗
        </a>
        <button type="button" aria-pressed={saved} onClick={onToggle} className={GHOST_BUTTON}>
          {saved ? "Saved" : "Save to shortlist"}
        </button>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="mt-2 text-xs tracking-wide text-muted-foreground first:mt-0 sm:mt-0 sm:pt-0.5">{label}</dt>
      <dd className="min-w-0 leading-relaxed break-words text-foreground/85">{value}</dd>
    </>
  );
}

type CopyState = "idle" | "copied" | "fallback";

/** The saved programs, shown once at least one is saved. */
function Shortlist() {
  const { data, saved, clearSaved } = useNavigator();
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // When the clipboard is refused, the text is shown selected so it can be copied by hand.
  useEffect(() => {
    if (copyState === "fallback") fallbackRef.current?.select();
  }, [copyState]);

  if (saved.length === 0) return null;
  const text = shortlistText(data, saved);

  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    if (await copyText(text)) {
      setCopyState("copied");
      timer.current = setTimeout(() => setCopyState("idle"), 2500);
    } else {
      setCopyState("fallback");
    }
  }

  function clear() {
    if (timer.current) clearTimeout(timer.current);
    setCopyState("idle");
    clearSaved();
  }

  return (
    <div className="mt-10 grid gap-4 rounded-2xl border border-primary/50 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-lg font-light tracking-tight">Your shortlist</h3>
        <span role="status" className="text-xs text-muted-foreground">
          {copyState === "copied" ? "Copied" : copyState === "fallback" ? "Select and copy the text below" : ""}
        </span>
      </div>
      <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/85">
        {saved.map((i) => (
          <li key={i}>
            {data.PROGRAMS[i].n} — {data.STAT[data.PROGRAMS[i].s][0]} ({data.PROGRAMS[i].sl})
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={copy} className={PRIMARY_BUTTON}>
          Copy shortlist
        </button>
        <button type="button" onClick={clear} className={GHOST_BUTTON}>
          Clear
        </button>
      </div>
      {copyState === "fallback" && (
        <textarea
          ref={fallbackRef}
          readOnly
          value={text}
          aria-label="Shortlist text"
          className="min-h-32 w-full rounded-md border border-input bg-background p-3 text-xs leading-relaxed text-foreground"
        />
      )}
    </div>
  );
}
