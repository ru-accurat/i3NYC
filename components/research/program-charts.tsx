"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatUsd, type Program, type SuccessCase } from "@/lib/research/program-map";
import { SERIES, heatFill } from "./theme";

/* ── Coverage matrix: programs per group and stage ───────────────────────── */

interface CoverageMatrixProps {
  programs: Program[];
  groups: string[];
  stages: string[];
}

export function CoverageMatrix({ programs, groups, stages }: CoverageMatrixProps) {
  const cells = groups.map((g) =>
    stages.map((_, si) => programs.filter((p) => p.g === g && p.s.includes(si)))
  );
  const max = Math.max(1, ...cells.flat().map((list) => list.length));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-1 tabular-nums">
        <thead>
          <tr>
            <td />
            {stages.map((s) => (
              <th
                key={s}
                scope="col"
                className="px-2 pb-2 text-center text-xs font-normal tracking-wide text-muted-foreground"
              >
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.map((g, gi) => (
            <tr key={g}>
              <th scope="row" className="pr-6 text-left text-sm font-normal whitespace-nowrap text-foreground/80">
                {g}
              </th>
              {stages.map((s, si) => {
                const list = cells[gi][si];
                if (list.length === 0) {
                  return (
                    <td key={s} className="h-12 rounded-md bg-card text-center text-sm text-muted-foreground/50">
                      –
                    </td>
                  );
                }
                return (
                  <td key={s} className="relative h-12 rounded-md bg-card">
                    <Tooltip>
                      <TooltipTrigger
                        aria-label={`${g}, ${s}: ${list.length} ${list.length === 1 ? "program" : "programs"}`}
                        className="absolute inset-0 flex cursor-default items-center justify-center rounded-md text-sm font-medium text-foreground"
                        style={{ backgroundColor: heatFill(list.length, max) }}
                      >
                        {list.length}
                      </TooltipTrigger>
                      <TooltipContent className="block max-w-xs px-3 py-2 leading-relaxed">
                        <span className="block font-medium">
                          {g} · {s}
                        </span>
                        {list.map((p) => (
                          <span key={p.n} className="block opacity-80">
                            {p.n}
                          </span>
                        ))}
                      </TooltipContent>
                    </Tooltip>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Funding ladder: per-team money on a log scale ───────────────────────── */

interface FundingLadderProps {
  programs: Program[];
  /** Axis bounds in USD; both should be powers of ten times the same digit. */
  min: number;
  max: number;
  /** Colour every bar as an investment and drop the legend (single series). */
  allInvestment?: boolean;
}

export function FundingLadder({ programs, min, max, allInvestment = false }: FundingLadderProps) {
  const lo = Math.log10(min);
  const hi = Math.log10(max);
  // Rounded so the server-rendered style matches what the browser normalises to.
  const x = (v: number) => Math.round(((Math.log10(v) - lo) / (hi - lo)) * 10000) / 100;

  const ticks: number[] = [];
  for (let v = min; v <= max * 1.001; v *= 10) ticks.push(v);

  const rows = programs
    .filter((p): p is Program & { lo: number; hi: number } => Boolean(p.lo && p.hi))
    .sort((a, b) => a.hi - b.hi || a.lo - b.lo);

  const ROW = "grid grid-cols-1 items-center gap-x-6 gap-y-1 md:grid-cols-[minmax(180px,300px)_1fr]";

  return (
    <div>
      {!allInvestment && (
        <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <i className="h-2 w-6 rounded-full" style={{ backgroundColor: SERIES.primary }} />
            Grant or prize (non-dilutive)
          </span>
          <span className="flex items-center gap-2">
            <i className="h-2 w-6 rounded-full" style={{ backgroundColor: SERIES.secondary }} />
            Investment (equity or note), tagged &ldquo;equity&rdquo;
          </span>
        </div>
      )}

      <div className="grid gap-3 md:gap-1.5">
        {rows.map((p) => {
          const left = x(p.lo);
          const width = Math.round(Math.max(x(p.hi) - left, 0) * 100) / 100;
          const investment = allInvestment || Boolean(p.eq);
          const amount = p.lo === p.hi ? formatUsd(p.lo) : `${formatUsd(p.lo)}–${formatUsd(p.hi)}`;
          const label = amount + (p.eq && !allInvestment ? " · equity" : "");
          // Put the value on whichever side of the bar has room.
          const labelStyle =
            left + width > 72
              ? { right: `calc(${(100 - left).toFixed(2)}% + 10px)` }
              : { left: `calc(${(left + width).toFixed(2)}% + 14px)` };

          return (
            <div key={p.n} className={ROW}>
              <div className="min-w-0 text-sm leading-snug text-foreground/90">
                {p.n}
                <span className="block text-xs text-muted-foreground">{p.i}</span>
              </div>
              <div className="relative h-7">
                {ticks.map((t) => (
                  <i key={t} className="absolute inset-y-0 w-px bg-border" style={{ left: `${x(t)}%` }} />
                ))}
                <Tooltip>
                  <TooltipTrigger
                    aria-label={`${p.n}: ${label}`}
                    className="absolute top-1/2 h-2.5 min-w-2.5 -translate-y-1/2 cursor-default rounded-full"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: investment ? SERIES.secondary : SERIES.primary,
                    }}
                  />
                  <TooltipContent className="block max-w-xs px-3 py-2 leading-relaxed">
                    <span className="block font-medium">
                      {p.n}: {label}
                    </span>
                    <span className="block opacity-80">{p.e}</span>
                  </TooltipContent>
                </Tooltip>
                <span
                  className="absolute top-1/2 -translate-y-1/2 text-xs whitespace-nowrap tabular-nums text-foreground/80"
                  style={labelStyle}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`${ROW} mt-2`}>
        <div className="hidden md:block" />
        <div className="relative h-5 text-xs tabular-nums text-muted-foreground">
          {ticks.map((t, i) => (
            <span
              key={t}
              className="absolute top-0"
              style={
                i === 0
                  ? { left: 0 }
                  : i === ticks.length - 1
                    ? { right: 0 }
                    : { left: `${x(t)}%`, transform: "translateX(-50%)" }
              }
            >
              {formatUsd(t)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Success cases ───────────────────────────────────────────────────────── */

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function CasesTable({ cases }: { cases: SuccessCase[] }) {
  const TH = "px-4 py-3 text-left text-xs font-normal tracking-wide text-muted-foreground";
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-border bg-background/50">
            <th className={TH}>Company</th>
            <th className={TH}>Program</th>
            <th className={TH}>Outcome</th>
            <th className={TH}>As of</th>
            <th className={TH}>Source</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(([company, program, outcome, asOf, url]) => (
            <tr key={company + program} className="border-b border-border/50 align-top transition-colors last:border-0 hover:bg-primary/5">
              <td className="px-4 py-3 font-medium text-foreground">{company}</td>
              <td className="px-4 py-3 text-muted-foreground">{program}</td>
              <td className="px-4 py-3 text-foreground/80">{outcome}</td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{asOf}</td>
              <td className="px-4 py-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                >
                  {hostname(url)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
