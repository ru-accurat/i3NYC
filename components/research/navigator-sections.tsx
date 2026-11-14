import type { NavigatorEvent } from "@/lib/research/navigator";

const PILL = "inline-block rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap";

/* ── What changed: rule cards ────────────────────────────────────────────── */

export interface RuleCard {
  title: string;
  body: string;
  /** A rule that opens a route rather than closing one */
  good?: boolean;
}

export function NavigatorRules({ rules }: { rules: RuleCard[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {rules.map((rule) => (
        <div key={rule.title} className="grid content-start gap-3 rounded-2xl border border-border p-6">
          <span
            className={`${PILL} justify-self-start ${
              rule.good ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"
            }`}
          >
            {rule.good ? "Open route" : "Restriction"}
          </span>
          <h3 className="text-lg font-light leading-snug tracking-tight">{rule.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{rule.body}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Calendar ────────────────────────────────────────────────────────────── */

interface NavigatorCalendarProps {
  events: NavigatorEvent[];
  /** ISO date the page was compiled; earlier events are marked as past. */
  asOf: string;
}

export function NavigatorCalendar({ events, asOf }: NavigatorCalendarProps) {
  return (
    <ol className="ml-1.5 max-w-4xl border-l border-border">
      {events.map((e) => {
        const past = e.d < asOf;
        return (
          <li key={e.d + e.n} className="relative grid gap-x-8 gap-y-1 py-4 pl-7 sm:grid-cols-[150px_1fr]">
            <i
              aria-hidden
              className={`absolute top-[22px] -left-[6px] size-[11px] rounded-full border-2 bg-background ${
                past ? "border-border" : "border-primary"
              }`}
            />
            <span className="text-sm font-medium tabular-nums text-foreground">{e.dl}</span>
            <div className="min-w-0">
              <span className="block text-xs tracking-wide text-muted-foreground uppercase">{e.pl}</span>
              <b className="mt-1 block font-medium text-foreground">{e.n}</b>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{e.x}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Landing path ────────────────────────────────────────────────────────── */

export interface PathStep {
  when: string;
  title: string;
  body: string;
}

export function NavigatorPath({ steps }: { steps: PathStep[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li key={step.title} className="grid content-start gap-2 rounded-2xl border border-border p-6">
          <span className="font-mono text-3xl font-light tracking-tight text-primary-text">{i + 1}</span>
          <span className="mt-2 text-xs tracking-wide text-muted-foreground uppercase">{step.when}</span>
          <b className="font-medium text-foreground">{step.title}</b>
          <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
