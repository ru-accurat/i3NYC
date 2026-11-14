"use client";

import { useMemo, useState } from "react";
import { fmtEurM, fmtInt, fmtUsdM, median, sum, type Num } from "@/lib/research/format";
import { KpiGrid } from "../research-layout";
import { LINK } from "../rich";
import { BarList, ExplorerMatrix, Scatter, SeriesLegend } from "../explorer/charts";
import {
  CompanyDatabase,
  DetailBullets,
  DetailGrid,
  DetailItem,
  PILL_ALT,
  PILL_MUTED,
  PILL_NEUTRAL,
  PILL_WARN,
  SourceLinks,
} from "../explorer/company-database";
import { DataTable } from "../explorer/data-table";
import { ExplorerProvider, useExplorer, type ExplorerConfig, type Row } from "../explorer/explorer-context";

// The "AI company census" engine, shared by the NYC and Italy pages. The two
// differ only in currency, a few labels and the scatter's year range.

export interface AiCompany {
  n: string;
  w: string | null;
  sec: string;
  cat: string | null;
  sub: string | null;
  phys: boolean;
  nat: boolean;
  rolet?: string | null;
  loc: string | null;
  area: string;
  y: number | null;
  coh: string;
  emp: number | null;
  empt: string | null;
  rev?: number | null;
  revt?: string | null;
  revb?: string | null;
  stg: string;
  stgt: string | null;
  lr: number | null;
  lrd: string | null;
  lry: number | null;
  leads: string | null;
  val: number | null;
  tot: number | null;
  llm: string;
  llmt: string | null;
  mod: string | null;
  seg: string;
  segt: string | null;
  st: string | null;
  one: string | null;
  prob: string | null;
  icp: string | null;
  buyer?: string | null;
  bm: string | null;
  inv: string | null;
  part: string | null;
  imp: string | null;
  acad: string | null;
  uc: string | null;
  ii: string[] | null;
  ev: string[] | null;
  src: string[] | null;
  conf: string;
  conft?: string | null;
}

/** A company plus the fields the engine derives from it. */
type CensusRow = AiCompany & { cl: string; type: string; age: number | null; q: string };

export type CensusVariant = "nyc" | "italy";

const CLUSTER_OF: Record<string, string> = {
  "Foundation models & AI labs": "Models & infrastructure",
  "AI infrastructure & data": "Models & infrastructure",
  "Developer tools & MLOps": "Models & infrastructure",
  "Sales, marketing & CX": "Enterprise functions",
  "Enterprise automation": "Enterprise functions",
  "Security & trust": "Enterprise functions",
  "Finance & accounting": "Finance, legal & insurance",
  "Legal & compliance": "Finance, legal & insurance",
  Insurance: "Finance, legal & insurance",
  Healthcare: "Health & life sciences",
  "Life sciences": "Health & life sciences",
  "Generative media & consumer": "Media, consumer & commerce",
  "Commerce & advertising": "Media, consumer & commerce",
  "Real estate & construction": "City, industry & public sector",
  "Supply chain & logistics": "City, industry & public sector",
  "Climate & energy": "City, industry & public sector",
  "Government & defense": "City, industry & public sector",
  "Education & workforce": "City, industry & public sector",
  "Robotics & embodied AI": "Robotics & hardware",
  "AI hardware & devices": "Robotics & hardware",
};
const CLUSTERS = [
  "Models & infrastructure",
  "Enterprise functions",
  "Finance, legal & insurance",
  "Health & life sciences",
  "Media, consumer & commerce",
  "City, industry & public sector",
  "Robotics & hardware",
];
const STAGES = ["Seed", "Series A", "Series B", "Series C", "Series D+", "Growth / other", "Public", "Acquired", "Undisclosed"];
const MODEL_STRATEGIES = ["In-house models", "Hybrid", "External models", "No LLM at core", "Undisclosed"];
const REFERENCE_YEAR = 2026;

interface VariantSpec {
  money: (v: Num) => string;
  currency: string;
  cohorts: string[];
  /** Label of the location dimension in the cohort explorer and in the filter bar. */
  areaDimension: string;
  areaFilter: string;
  scatter: { from: number; to: number; tickFrom: number };
  baseLabel: string;
  impactLabel: string;
  dealWord: string;
  aiShareTip: string;
}

const VARIANTS: Record<CensusVariant, VariantSpec> = {
  nyc: {
    money: fmtUsdM,
    currency: "$",
    cohorts: ["Before 2015", "2015–2019", "2020–2022", "2023–2025", "Unknown"],
    areaDimension: "NYC district",
    areaFilter: "District",
    scatter: { from: 2004, to: 2026, tickFrom: 2005 },
    baseLabel: "New York base",
    impactLabel: "Impact in the city",
    dealWord: "deals",
    aiShareTip: "of NYC venture capital went to AI companies",
  },
  italy: {
    money: fmtEurM,
    currency: "€",
    cohorts: ["Before 2015", "2015–2019", "2020–2022", "2023–2026", "Unknown"],
    areaDimension: "Region",
    areaFilter: "Region",
    scatter: { from: 1998, to: 2027, tickFrom: 2000 },
    baseLabel: "Base in Italy",
    impactLabel: "Impact in Italy",
    dealWord: "rounds",
    aiShareTip: "of venture capital went to AI",
  },
};

const co = (o: Row) => o as unknown as CensusRow;
const field = (rows: Row[], key: keyof CensusRow) => rows.map((o) => co(o)[key] as Num);

function makeConfig(v: VariantSpec): ExplorerConfig {
  return {
    noun: ["company", "companies"],
    lenses: [
      { key: "all", label: "All companies", test: () => true },
      { key: "native", label: "AI-native only", test: (o) => co(o).nat },
      { key: "phys", label: "Physical AI only", test: (o) => co(o).phys },
      { key: "priv", label: "Private only", test: (o) => co(o).stg !== "Public" && co(o).stg !== "Acquired" },
    ],
    dimensions: {
      cl: { label: "Cluster", order: CLUSTERS },
      sec: { label: "Sector" },
      stg: { label: "Funding stage", order: STAGES },
      llm: { label: "Model strategy", order: MODEL_STRATEGIES },
      seg: { label: "Primary customer" },
      coh: { label: "Founding cohort", order: v.cohorts },
      area: { label: v.areaDimension },
      type: { label: "Company type" },
    },
    measures: {
      n: { label: "Companies", value: (r) => r.length, format: fmtInt },
      tot: { label: "Capital raised (sum)", value: (r) => sum(field(r, "tot")), format: v.money, coverage: "tot" },
      mtot: { label: "Capital raised (median)", value: (r) => median(field(r, "tot")), format: v.money, coverage: "tot" },
      mval: { label: "Valuation (median)", value: (r) => median(field(r, "val")), format: v.money, coverage: "val" },
      uni: {
        label: `Valued at ${v.currency}1B or more`,
        value: (r) => r.filter((o) => (co(o).val ?? 0) >= 1000).length,
        format: fmtInt,
        coverage: "val",
      },
      emp: { label: "Employees (sum)", value: (r) => sum(field(r, "emp")), format: fmtInt, coverage: "emp" },
      age: {
        label: "Company age (median, years)",
        value: (r) => median(field(r, "age")),
        format: (x) => (x == null ? "n/d" : String(x)),
        coverage: "age",
      },
    },
    defaultGroup: "cl",
    tabKey: "cl",
    tabOrder: CLUSTERS,
    filters: [
      { key: "sec", label: "Sector" },
      { key: "stg", label: "Stage" },
      { key: "llm", label: "Model strategy" },
      { key: "seg", label: "Primary customer" },
      { key: "coh", label: "Founded" },
      { key: "area", label: v.areaFilter },
      { key: "type", label: "Type" },
    ],
    sorts: [
      { key: "tot", label: "Total raised" },
      { key: "val", label: "Valuation" },
      { key: "lr", label: "Latest round" },
      { key: "rev", label: "Revenue" },
      { key: "emp", label: "Employees" },
      { key: "y", label: "Newest first" },
      { key: "n", label: "Name" },
    ],
    defaultSort: "tot",
  };
}

const CONFIGS: Record<CensusVariant, ExplorerConfig> = { nyc: makeConfig(VARIANTS.nyc), italy: makeConfig(VARIANTS.italy) };

/* ── Provider ────────────────────────────────────────────────────────────── */

export function AiCensusProvider({
  variant,
  companies,
  children,
}: {
  variant: CensusVariant;
  companies: AiCompany[];
  children: React.ReactNode;
}) {
  const rows = useMemo<Row[]>(
    () =>
      companies.map((o) => ({
        ...o,
        cl: CLUSTER_OF[o.sec],
        type: o.nat ? "AI-native" : "AI-enabled platform",
        age: o.y ? REFERENCE_YEAR - o.y : null,
        q: [o.n, o.sec, o.sub, o.one, o.inv, o.mod, o.part].map((s) => s || "").join(" ").toLowerCase(),
      })),
    [companies]
  );
  return (
    <ExplorerProvider rows={rows} config={CONFIGS[variant]}>
      {children}
    </ExplorerProvider>
  );
}

/* ── Headline figures (follow the lens) ──────────────────────────────────── */

export function CensusKpis({ variant }: { variant: CensusVariant }) {
  const { base } = useExplorer();
  const v = VARIANTS[variant];
  const r = base.map(co);
  return (
    <KpiGrid
      items={[
        { value: String(r.length), label: "companies in the census" },
        {
          value: v.money(sum(r.map((o) => o.tot))),
          label: `disclosed capital raised (${r.filter((o) => o.tot).length} companies)`,
        },
        {
          value: String(r.filter((o) => (o.val ?? 0) >= 1000).length),
          label: `with a last-known valuation of ${v.currency}1B+`,
        },
        {
          value: fmtInt(sum(r.map((o) => o.emp))),
          label: `employees worldwide (${r.filter((o) => o.emp).length} companies)`,
        },
        { value: String(r.filter((o) => o.phys).length), label: "physical AI companies" },
        {
          value: String(r.filter((o) => o.lry === REFERENCE_YEAR && o.lr).length),
          label: `raised their latest round in ${REFERENCE_YEAR}`,
        },
      ]}
    />
  );
}

/* ── Matrices ────────────────────────────────────────────────────────────── */

export function StageMatrix() {
  return (
    <ExplorerMatrix
      rowKey="cl"
      rowOrder={CLUSTERS}
      colKey="stg"
      colOrder={STAGES}
      jumpTo={(cluster, stage) => ({ tab: cluster, filters: { stg: stage } })}
    />
  );
}

export function ModelMatrix({ variant }: { variant: CensusVariant }) {
  return (
    <ExplorerMatrix
      rowKey="llm"
      rowOrder={MODEL_STRATEGIES}
      colKey="coh"
      colOrder={VARIANTS[variant].cohorts}
      jumpTo={(strategy, cohort) => ({ filters: { llm: strategy, coh: cohort } })}
    />
  );
}

/* ── Age against scale ───────────────────────────────────────────────────── */

const SCATTER_AXES = {
  tot: "Total capital raised",
  val: "Last-known valuation",
  emp: "Employees",
} as const;
type ScatterAxis = keyof typeof SCATTER_AXES;

export function AgeScaleScatter({ variant }: { variant: CensusVariant }) {
  const { base, openRow } = useExplorer();
  const v = VARIANTS[variant];
  const [axis, setAxis] = useState<ScatterAxis>("tot");
  const format = (x: number) => (axis === "emp" ? fmtInt(x) : v.money(x));
  const label = SCATTER_AXES[axis];
  const points = base
    .map(co)
    .filter((o) => o.y && o[axis] != null && (o[axis] as number) > 0)
    .map((o) => ({
      name: o.n,
      year: o.y as number,
      value: o[axis] as number,
      alt: o.phys,
      tip: `${o.n} · founded ${o.y} · ${label.toLowerCase()} ${format(o[axis] as number)} · ${o.sec}`,
    }));

  return (
    <div>
      <label className="mb-6 flex w-fit flex-col gap-1.5 text-xs tracking-wide text-muted-foreground">
        Vertical axis
        <select
          value={axis}
          onChange={(e) => setAxis(e.target.value as ScatterAxis)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          {Object.entries(SCATTER_AXES).map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <SeriesLegend primary="Software AI" secondary="Physical AI" />
      <Scatter
        points={points}
        from={v.scatter.from}
        to={v.scatter.to}
        tickFrom={v.scatter.tickFrom}
        tickTo={2025}
        formatValue={format}
        ariaLabel={`Scatter plot of founding year against ${label.toLowerCase()}`}
        marker={{ year: 2022.92, label: "ChatGPT launch, Nov 2022" }}
        onSelect={openRow}
      />
      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        {points.length} of {base.length} companies have both a founding year and this figure. Log scale. Click a point
        to open the profile.
      </p>
    </div>
  );
}

/* ── Rounds and exits ────────────────────────────────────────────────────── */

function OpenLink({ name, children }: { name: string; children?: React.ReactNode }) {
  const { openRow } = useExplorer();
  return (
    <button type="button" onClick={() => openRow(name)} className={`${LINK} cursor-pointer text-left font-medium`}>
      {children ?? name}
    </button>
  );
}

export function TopRounds({ variant }: { variant: CensusVariant }) {
  const { base } = useExplorer();
  const v = VARIANTS[variant];
  const rows = base
    .map(co)
    .filter((o) => o.lr && (o.lry ?? 0) >= 2025)
    .sort((a, b) => (b.lr as number) - (a.lr as number))
    .slice(0, 15);
  return (
    <DataTable
      head={["Company", "Round", "Amount", "Date", "Valuation", "Sector"]}
      nowrap={[2, 3, 4]}
      rows={rows.map((o) => [
        <OpenLink key="n" name={o.n} />,
        (o.stgt || "").split("(")[0].split(";")[0],
        v.money(o.lr),
        (o.lrd || "").split("(")[0],
        o.val ? v.money(o.val) : "n/d",
        o.sec,
      ])}
    />
  );
}

/** [company, event, date, value, census name to open or null, external url or null] */
export type ExitRow = [string, string, string, string, string | null, string | null];

export function ExitsTable({ rows }: { rows: ExitRow[] }) {
  return (
    <DataTable
      head={["Company", "Event", "Date", "Value"]}
      nowrap={[2, 3]}
      rows={rows.map(([name, event, date, value, open, url]) => [
        open ? (
          <OpenLink key="n" name={open}>
            {name}
          </OpenLink>
        ) : url ? (
          <a key="n" href={url} target="_blank" rel="noopener noreferrer" className={LINK}>
            {name}
          </a>
        ) : (
          name
        ),
        event,
        date,
        value,
      ])}
    />
  );
}

/* ── Context charts (not affected by the lens) ───────────────────────────── */

export function VentureByYear({ variant, rows }: { variant: CensusVariant; rows: { y: string; v: number; d: number }[] }) {
  const v = VARIANTS[variant];
  const max = Math.max(...rows.map((d) => d.v));
  return (
    <BarList
      rows={rows.map((d) => ({
        key: d.y,
        label: d.y,
        fraction: d.v / max,
        display: `${v.currency}${d.v}B`,
        unit: `· ${d.d.toLocaleString("en-US")} ${v.dealWord}`,
        tip: `${d.y}: ${v.currency}${d.v}B across ${d.d.toLocaleString("en-US")} ${v.dealWord}`,
      }))}
    />
  );
}

export function AiShare({ variant, rows }: { variant: CensusVariant; rows: { y: string; v: number }[] }) {
  return (
    <BarList
      alt
      rows={rows.map((d) => ({
        key: d.y,
        label: d.y,
        fraction: d.v / 100,
        display: `${d.v}%`,
        tip: `${d.y}: ${d.v}% ${VARIANTS[variant].aiShareTip}`,
      }))}
    />
  );
}

/** Bars counting the companies that name a provider or a university; hover lists them. */
export function NamedBars({ list }: { list: [string, string[]][] }) {
  const max = Math.max(...list.map(([, names]) => names.length));
  return (
    <BarList
      rows={list.map(([label, names]) => ({
        key: label,
        label,
        fraction: names.length / max,
        display: String(names.length),
        unit: "co.",
        tip: names.join(", "),
      }))}
    />
  );
}

/* ── Company database ────────────────────────────────────────────────────── */

export function CensusDatabase({ variant }: { variant: CensusVariant }) {
  const v = VARIANTS[variant];
  return (
    <CompanyDatabase
      tabsLabel="Filter by cluster"
      searchPlaceholder="Company, investor, model…"
      countSuffix={(rows) =>
        ` · disclosed capital ${v.money(sum(field(rows, "tot")))} · median last round ${v.money(median(field(rows, "lr")))}`
      }
      summary={(row) => {
        const o = co(row);
        return {
          title: o.n,
          subtitle: o.one || o.sub || "",
          meta: (
            <>
              {o.sec}
              <br />
              {o.y ? `Founded ${o.y}` : "Founding year n/d"}
              {o.emp ? ` · ${fmtInt(o.emp)} staff` : ""}
            </>
          ),
          facts: (
            <>
              <b>{o.stg}</b>
              {o.tot ? ` · ${v.money(o.tot)} raised` : ""}
              {o.val ? (
                <>
                  <br />
                  {v.money(o.val)} valuation
                </>
              ) : null}
              {o.rev ? (
                <>
                  <br />
                  {v.money(o.rev)} revenue
                </>
              ) : null}
            </>
          ),
          pills: (
            <>
              <span className={o.llm === "Undisclosed" || o.llm === "No LLM at core" ? PILL_MUTED : PILL_NEUTRAL}>
                {o.llm}
              </span>
              {o.phys && <span className={PILL_ALT}>Physical AI</span>}
              {o.conf === "Low" && <span className={PILL_WARN}>Low confidence</span>}
            </>
          ),
        };
      }}
      detail={(row) => {
        const o = co(row);
        return (
          <DetailGrid>
            <DetailItem label="Main use case" wide>
              {o.uc}
            </DetailItem>
            <DetailItem label="Impact indicators" wide>
              {o.ii?.length ? <DetailBullets items={o.ii} /> : null}
            </DetailItem>
            <DetailItem label="Problem solved">{o.prob}</DetailItem>
            <DetailItem label="Ideal customer profile">{o.icp}</DetailItem>
            <DetailItem label="Buyer">{o.buyer}</DetailItem>
            <DetailItem label="Segment">{o.segt}</DetailItem>
            <DetailItem label="Business model">{o.bm}</DetailItem>
            <DetailItem label="Category">{[o.cat, o.sub].filter(Boolean).join(" · ")}</DetailItem>
            <DetailItem label="Model strategy">
              <b>{o.llm}</b>
              {o.llmt ? ` · ${o.llmt}` : ""}
            </DetailItem>
            <DetailItem label="Models and providers named">{o.mod}</DetailItem>
            <DetailItem label="Founded">
              {o.y ? `${o.y} · ${REFERENCE_YEAR - o.y} years in business` : "Not found"}
            </DetailItem>
            <DetailItem label="Employees">
              {o.emp ? `${fmtInt(o.emp)}${o.empt ? ` (${o.empt})` : ""}` : "Not disclosed"}
            </DetailItem>
            <DetailItem label="Revenue">
              {o.revt ? (
                <>
                  {o.revt}
                  {o.revb && <small>{o.revb}</small>}
                </>
              ) : (
                "Not disclosed"
              )}
            </DetailItem>
            <DetailItem label="Latest round">
              {o.stgt || "Not disclosed"}
              {o.lr ? ` · ${v.money(o.lr)}` : ""}
              {o.lrd ? ` · ${o.lrd}` : ""}
              {o.leads && <small>Led by: {o.leads}</small>}
            </DetailItem>
            <DetailItem label="Total raised and valuation">
              {o.tot ? `${v.money(o.tot)} raised` : "Total not disclosed"}
              {o.val ? ` · ${v.money(o.val)} last-known valuation` : ""}
            </DetailItem>
            <DetailItem label="Status">{o.st}</DetailItem>
            <DetailItem label="Key investors">{o.inv}</DetailItem>
            <DetailItem label="Partners and customers">{o.part}</DetailItem>
            <DetailItem label={v.baseLabel}>
              {o.loc || o.rolet ? (
                <>
                  {o.loc}
                  {o.rolet && <small>Role: {o.rolet}</small>}
                </>
              ) : null}
            </DetailItem>
            <DetailItem label={v.impactLabel}>{o.imp}</DetailItem>
            <DetailItem label="Academic ties">{o.acad}</DetailItem>
            <DetailItem label="Events, 2025–26" wide>
              {o.ev?.length ? <DetailBullets items={o.ev} /> : null}
            </DetailItem>
            <DetailItem label="Sources" wide>
              {o.src?.length || o.w ? <SourceLinks sources={o.src} site={o.w} /> : null}
            </DetailItem>
            <DetailItem label="Data confidence" wide>
              {o.conft || o.conf}
            </DetailItem>
          </DetailGrid>
        );
      }}
    />
  );
}
