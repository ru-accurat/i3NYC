"use client";

import { useState } from "react";
import { DEFAULT_ANSWERS, finderResults, type Choice, type FinderAnswers } from "@/lib/research/navigator";
import { LINK_BUTTON, NAV_STATUS_PILL, PILL, useNavigator } from "./navigator-provider";

const QUESTIONS: { key: keyof FinderAnswers; label: string }[] = [
  { key: "profile", label: "1 · Who are you?" },
  { key: "sector", label: "2 · Your sector" },
  { key: "place", label: "3 · Where would you land?" },
];

/** Three questions that rank the programs; results update on every answer. */
export function NavigatorFinder() {
  const { data, showProgram, showInExplorer } = useNavigator();
  const [answers, setAnswers] = useState<FinderAnswers>(DEFAULT_ANSWERS);
  const results = finderResults(data.PROGRAMS, answers);

  return (
    <div className="grid gap-8 rounded-2xl border border-border p-6 md:p-8">
      {QUESTIONS.map((q) => (
        <div key={q.key} className="grid gap-3">
          <span id={`finder-${q.key}`} className="text-sm font-medium text-foreground">
            {q.label}
          </span>
          <div role="group" aria-labelledby={`finder-${q.key}`} className="flex flex-wrap gap-2">
            {data.Q[q.key].map(([value, label]: Choice) => {
              const on = answers[q.key] === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setAnswers((a) => ({ ...a, [q.key]: value }))}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    on
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground/80 hover:border-primary/60 hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="grid gap-4 border-t border-border pt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="text-xl font-light tracking-tight">Your best starting points</h3>
          <button type="button" onClick={() => showInExplorer(answers)} className={LINK_BUTTON}>
            Show these filters in the full list
          </button>
        </div>

        {results.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No direct match for this combination. Try &ldquo;Any sector&rdquo; or another region, or write to I3/NYC.
          </p>
        ) : (
          <div aria-live="polite" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map(({ program: p, index }) => (
              <div key={index} className="grid min-w-0 content-start gap-2 rounded-xl border border-border bg-card/50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <b className="min-w-0 font-medium text-foreground">{p.n}</b>
                  <span className={`${PILL} ${NAV_STATUS_PILL[p.s]}`}>{data.STAT[p.s][0]}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {data.REGIONS[p.r]} · {data.TYPES[p.t]}
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">{p.b}</span>
                <button type="button" onClick={() => showProgram(index)} className={`${LINK_BUTTON} justify-self-start`}>
                  See details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
