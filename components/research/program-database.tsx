"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Access, Program, ProgramMapLabels, Status } from "@/lib/research/program-map";
import { STATUS_PILL } from "./theme";

interface ProgramDatabaseProps {
  programs: Program[];
  groups: string[];
  stages: string[];
  topics: string[];
  labels: ProgramMapLabels;
  /** One-line meaning of each status, shown as a key above the list. */
  statusKey: Record<Status, string>;
}

const ACCESS_ORDER: Access[] = ["Open", "Mixed", "Affiliates"];
const STATUS_ORDER: Status[] = ["Active", "Listed", "Paused", "Unconfirmed"];

const FIELD = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";
const FIELD_LABEL = "flex min-w-0 flex-1 basis-40 flex-col gap-1.5 text-xs tracking-wide text-muted-foreground";
const PILL = "inline-block rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap";

export function ProgramDatabase({ programs, groups, stages, topics, labels, statusKey }: ProgramDatabaseProps) {
  const [topic, setTopic] = useState("");
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [type, setType] = useState("");
  const [stage, setStage] = useState("");
  const [access, setAccess] = useState("");
  const [status, setStatus] = useState("");

  const types = useMemo(() => [...new Set(programs.map((p) => p.t))].sort(), [programs]);
  // Search looks at every field of a program, as the original did.
  const haystacks = useMemo(() => programs.map((p) => JSON.stringify(p).toLowerCase()), [programs]);

  const q = query.trim().toLowerCase();
  const stageIndex = stage ? stages.indexOf(stage) : -1;
  const rows = programs.filter(
    (p, i) =>
      (!topic || p.k.includes(topic)) &&
      (!group || p.g === group) &&
      (!type || p.t === type) &&
      (stageIndex < 0 || p.s.includes(stageIndex)) &&
      (!access || p.a === access) &&
      (!status || p.st === status) &&
      (!q || haystacks[i].includes(q))
  );

  function reset() {
    setTopic("");
    setQuery("");
    setGroup("");
    setType("");
    setStage("");
    setAccess("");
    setStatus("");
  }

  const topicTabs = [
    { value: "", label: "All topics", count: programs.length },
    ...topics.map((t) => ({ value: t, label: t, count: programs.filter((p) => p.k.includes(t)).length })),
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        {STATUS_ORDER.map((s) => (
          <span key={s} className="flex items-center gap-2">
            <span className={`${PILL} ${STATUS_PILL[s]}`}>{labels.status[s]}</span>
            {statusKey[s]}
          </span>
        ))}
      </div>

      <div role="group" aria-label="Topic" className="mb-4 flex flex-wrap gap-2">
        {topicTabs.map((t) => {
          const on = topic === t.value;
          return (
            <button
              key={t.value}
              type="button"
              aria-pressed={on}
              onClick={() => setTopic(t.value)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                on
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground/80 hover:border-primary/60 hover:text-foreground"
              }`}
            >
              {t.label}
              <span className={`ml-1.5 text-xs tabular-nums ${on ? "text-background/70" : "text-muted-foreground"}`}>
                {t.count}
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, alumni, keyword"
            className={`${FIELD} placeholder:text-muted-foreground/60`}
          />
        </label>
        <label className={FIELD_LABEL}>
          {labels.group}
          <select value={group} onChange={(e) => setGroup(e.target.value)} className={FIELD}>
            <option value="">{labels.allGroups}</option>
            {groups.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className={FIELD_LABEL}>
          Program type
          <select value={type} onChange={(e) => setType(e.target.value)} className={FIELD}>
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className={FIELD_LABEL}>
          Stage
          <select value={stage} onChange={(e) => setStage(e.target.value)} className={FIELD}>
            <option value="">All stages</option>
            {stages.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className={FIELD_LABEL}>
          Access
          <select value={access} onChange={(e) => setAccess(e.target.value)} className={FIELD}>
            <option value="">Any access</option>
            {ACCESS_ORDER.map((a) => (
              <option key={a} value={a}>
                {labels.access[a]}
              </option>
            ))}
          </select>
        </label>
        <label className={FIELD_LABEL}>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={FIELD}>
            <option value="">Any status</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {labels.status[s]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={reset}
          className="h-10 rounded-md border border-border px-4 text-sm text-foreground/80 transition-colors hover:border-foreground hover:text-foreground"
        >
          Reset
        </button>
      </div>

      <p className="mt-6 mb-2 text-xs text-muted-foreground" aria-live="polite">
        {rows.length} of {programs.length} programs{topic ? ` in ${topic}` : ""}
      </p>

      {rows.length === 0 ? (
        <p className="border-t border-border py-8 text-sm text-muted-foreground">
          No program matches these filters. Reset to see all {programs.length}.
        </p>
      ) : (
        <div className="border-b border-border">
          {rows.map((p) => (
            <ProgramRow key={p.n} program={p} stages={stages} labels={labels} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProgramRow({ program: p, stages, labels }: { program: Program; stages: string[]; labels: ProgramMapLabels }) {
  return (
    <details className="group border-t border-border">
      <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-1 py-4 transition-colors hover:bg-primary/5 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_auto_auto] [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 font-medium text-foreground">
          {p.n}
          <span className="block text-sm font-normal text-muted-foreground">{p.i}</span>
        </span>
        <span className="hidden min-w-0 text-xs leading-relaxed text-muted-foreground md:block">
          {p.t}
          <br />
          {p.s.map((i) => stages[i]).join(" · ")}
        </span>
        <span className="order-3 col-span-2 min-w-0 text-sm text-foreground/80 md:order-none md:col-span-1">{p.f}</span>
        <span className="flex flex-col items-end gap-1">
          <span className={`${PILL} ${STATUS_PILL[p.st]}`}>{labels.status[p.st]}</span>
          <span className={`${PILL} border border-border ${p.a === "Open" ? "text-foreground/90" : "text-muted-foreground"}`}>
            {labels.access[p.a]}
          </span>
        </span>
        <ChevronDown
          aria-hidden
          className="hidden size-4 text-muted-foreground transition-transform group-open:rotate-180 md:block"
        />
      </summary>

      <dl className="grid gap-x-10 gap-y-5 px-1 pt-2 pb-8 text-sm md:grid-cols-2 lg:grid-cols-3">
        <Field label="Who can apply" value={p.w} />
        <Field label="International founders" value={p.intl} />
        <Field label="Funding" value={p.f} />
        <Field label={labels.terms} value={p.e} />
        <Field label="Duration" value={p.du} />
        <Field label="Application window" value={p.ap} />
        <Field label="Cohort and selectivity" value={p.co} />
        <Field label="Location" value={p.pl} />
        <Field label="Track record" value={p.m} />
        <Field label="Program and benefits" value={p.b} wide />
        <Field label="Success cases" value={p.ss} wide />
        <Field label={`Status evidence (checked ${labels.checked})`} value={p.sv} wide />
        <div>
          <dt className={DT}>Topics</dt>
          <dd className="flex flex-wrap gap-1.5">
            {p.k.map((k) => (
              <span key={k} className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
                {k}
              </span>
            ))}
          </dd>
        </div>
        <div className="md:col-span-2">
          <dt className={DT}>Reference links</dt>
          <dd className="flex flex-wrap gap-x-4 gap-y-1">
            {p.links.map(([label, url]) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </dd>
        </div>
      </dl>
    </details>
  );
}

const DT = "mb-1.5 text-xs tracking-wide text-muted-foreground";

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "md:col-span-2 lg:col-span-3" : undefined}>
      <dt className={DT}>{label}</dt>
      <dd className="min-w-0 leading-relaxed break-words text-foreground/85">{value}</dd>
    </div>
  );
}
