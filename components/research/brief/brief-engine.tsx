"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { fmtInt, fmtUsdM, hostname, median, sum, type Num } from "@/lib/research/format";
import { KpiGrid } from "../research-layout";
import { LINK } from "../rich";
import { BarList, ExplorerMatrix } from "../explorer/charts";
import {
  CompanyDatabase,
  DetailBullets,
  DetailGrid,
  DetailItem,
  PILL,
  PILL_BAD,
  PILL_GOOD,
  PILL_MUTED,
  PILL_NEUTRAL,
  PILL_WARN,
  SourceLinks,
  type RowSummary,
} from "../explorer/company-database";
import { DataTable } from "../explorer/data-table";
import {
  ExplorerProvider,
  groupBy,
  useExplorer,
  type ExplorerConfig,
  type JumpPatch,
  type Row,
} from "../explorer/explorer-context";

// The "ecosystem brief" engine, shared by the Life Sciences and Fashion &
// Luxury pages. Both profile companies, programs, institutions and anchors of
// one sector in the New York metro; they differ in the fields they record and
// therefore in lenses, dimensions, matrices and the expanded company profile.

export type BriefVariant = "life-sciences" | "fashion";

/* ── Data shapes (short keys as in the source applets) ───────────────────── */

interface CompanyBase {
  n: string;
  w: string | null;
  reg: string | null;
  cl: string;
  city: string | null;
  role: string | null;
  y: number | null;
  coh: string;
  seg: string;
  one: string | null;
  prob: string | null;
  cust: string | null;
  acad: string;
  emp: number | null;
  empt: string | null;
  rev: number | null;
  revt: string | null;
  stgt: string | null;
  lr: number | null;
  lrd: string | null;
  lry: number | null;
  leads: string | null;
  tot: number | null;
  val: number | null;
  st: string;
  stt: string | null;
  fs: string;
  inv: string | null;
  ev: string[] | null;
  ii: string[] | null;
  src: string[] | null;
  conf: string;
  ver: boolean;
}

/** A profiled company, with the fields both briefs record. */
export type BriefCompany = CompanyBase;

export interface LifeSciencesCompany extends CompanyBase {
  mod: string | null;
  tat: string | null;
  ta: string;
  ls: string;
  lst: string | null;
  acadt: string | null;
  inc: string | null;
  pp: string | null;
}

export interface FashionCompany extends CompanyBase {
  sub: string | null;
  bmt: string | null;
  bm: string;
  ai: string | null;
  aiy: string;
  sus: string | null;
  susy: string;
  fb: string | null;
  acc: string | null;
  cli: string | null;
}

export interface BriefProgram {
  name: string;
  operator?: string | null;
  type: string;
  region?: string | null;
  cl: string;
  address?: string | null;
  focus?: string | null;
  offer?: string | null;
  equity_or_fee?: string | null;
  funding?: string | null;
  eligibility?: string | null;
  capacity?: string | null;
  notable_alumni?: string | null;
  status: string;
  status_evidence?: string | null;
  contact_url?: string | null;
  sources?: string[] | null;
}

/** What each page's client wrapper hands to the provider. */
export interface BriefData {
  companies: CompanyBase[];
  programs: BriefProgram[];
  /** Sum shown in the sixth headline figure: NIH $M (life sciences) or students (fashion). */
  institutionTotal: number;
}

/** [event row] as in the source: company, event, date, value in $M, sub-region, company to open. */
export interface BriefExit {
  c: string;
  e: string;
  d: string;
  v: number | null;
  r: string | null;
  open: string | null;
}

/* ── Shared vocabulary ───────────────────────────────────────────────────── */

const SUB_REGIONS = ["New York City", "New Jersey", "Long Island", "Westchester / Hudson Valley", "Connecticut"];
const FUNDING_STAGES = ["Seed", "Series A", "Series B", "Series C", "Series D+", "Growth / other", "Undisclosed", "Public", "Acquired"];
const REFERENCE_YEAR = 2026;

const LS_SEGMENTS = [
  "Therapeutics",
  "Platform / AI drug discovery",
  "Medtech & devices",
  "Diagnostics",
  "Tools & services",
  "Digital health",
  "Synthetic bio & industrial bio",
];
const LS_LEAD_STAGES = ["Discovery", "Preclinical", "Phase 1", "Phase 2", "Phase 3", "Commercial / approved", "Not applicable / undisclosed"];
const LS_STATUS = ["Private", "Public", "Acquired", "Bankrupt / closed"];
const LS_COHORTS = ["Before 2010", "2010–2016", "2017–2020", "2021–2026", "Unknown"];
const isDrugDeveloper = (o: Record<string, unknown>) =>
  o.seg === "Therapeutics" || o.seg === "Platform / AI drug discovery";

const FA_SEGMENTS = [
  "Commerce & retail tech",
  "AI design & creative tools",
  "Personalization, fit & try-on",
  "Marketing, creators & community",
  "Data & analytics",
  "Luxury tech & authentication",
  "Resale, rental & circularity",
  "Materials & biofabrication",
  "Supply chain, sourcing & manufacturing",
  "Beauty tech",
  "Jewelry & watches innovation",
  "Digital-native brands",
];
const FA_MODELS = ["B2B software & services", "Marketplace", "Rental & subscription", "Brand (DTC / omnichannel)", "Materials & licensing", "Other / undisclosed"];
const FA_STATUS = ["Private", "Public", "Acquired", "Closed / bankrupt"];
const FA_COHORTS = ["Before 2012", "2012–2017", "2018–2021", "2022–2026", "Unknown"];

const n = (o: Row, k: string): Num => (typeof o[k] === "number" ? (o[k] as number) : null);
const raisedRecently = (o: Row) => (n(o, "lry") ?? 0) >= 2025 && Boolean(o.lr);

// Same seven measures on both pages.
const MEASURES: ExplorerConfig["measures"] = {
  n: { label: "Companies", value: (r) => r.length, format: fmtInt },
  lr: { label: "Latest round (sum)", value: (r) => sum(r.map((o) => n(o, "lr"))), format: fmtUsdM, coverage: "lr" },
  mlr: { label: "Latest round (median)", value: (r) => median(r.map((o) => n(o, "lr"))), format: fmtUsdM, coverage: "lr" },
  tot: { label: "Capital raised (sum)", value: (r) => sum(r.map((o) => n(o, "tot"))), format: fmtUsdM, coverage: "tot" },
  rev: { label: "Revenue (sum)", value: (r) => sum(r.map((o) => n(o, "rev"))), format: fmtUsdM, coverage: "rev" },
  emp: { label: "Employees (sum)", value: (r) => sum(r.map((o) => n(o, "emp"))), format: fmtInt, coverage: "emp" },
  r26: { label: "Raised in 2025–26", value: (r) => r.filter(raisedRecently).length, format: fmtInt },
};

// Sort keys are derived fields (see `prepare`) so that a disclosed zero ranks
// above "not disclosed" and "most recent round" breaks ties by round size, as
// in the source.
const SORT_LABELS: Record<string, string> = {
  k_lr: "Latest round",
  k_lry: "Most recent round",
  k_tot: "Total raised",
  k_rev: "Revenue",
  k_emp: "Employees",
  k_y: "Founding year",
  n: "Name",
};
const sorts = (keys: string[]) => keys.map((key) => ({ key, label: SORT_LABELS[key] }));

interface MatrixSpec {
  rowKey: string;
  /** Fixed row order; omitted when rows are ranked by size (therapeutic areas). */
  rowOrder?: string[];
  colKey: string;
  colOrder: string[];
  only?: (o: Record<string, unknown>) => boolean;
  jumpTo: (row: string, col: string) => JumpPatch;
}

interface VariantSpec {
  config: ExplorerConfig;
  /** Fields that feed the free-text search. */
  searchFields: string[];
  searchPlaceholder: string;
  matrix1: MatrixSpec;
  matrix2: MatrixSpec;
  roundsLastColumn: { label: string; value: (o: Row) => string };
  kpis: (rows: Row[], data: BriefData) => { value: string; label: string }[];
  summary: (o: Row) => RowSummary;
  detail: (o: Row) => React.ReactNode;
}

/* ── Company row renderers ───────────────────────────────────────────────── */

const OWNERSHIP_PILL: Record<string, string> = {
  Private: PILL_NEUTRAL,
  Public: PILL_NEUTRAL,
  Acquired: PILL_MUTED,
  "Bankrupt / closed": PILL_BAD,
  "Closed / bankrupt": PILL_BAD,
};

function Lines({ items }: { items: React.ReactNode[] }) {
  const shown = items.filter((x) => x !== null && x !== false && x !== "" && x !== undefined);
  return (
    <>
      {shown.map((x, i) => (
        <span key={i} className="block">
          {x}
        </span>
      ))}
    </>
  );
}

function commonPills(o: CompanyBase, extra?: React.ReactNode) {
  return (
    <>
      <span className={OWNERSHIP_PILL[o.st] ?? PILL_NEUTRAL}>{o.st}</span>
      {extra}
      {o.ver && <span className={PILL_GOOD}>Checked Oct 19</span>}
      {o.conf === "Low" && <span className={PILL_WARN}>Low confidence</span>}
    </>
  );
}

/** The rows of the expanded profile that both pages share, from "Founded" down. */
function CommonDetail({ o }: { o: CompanyBase }) {
  return (
    <>
      <DetailItem label="Founded">{o.y ? `${o.y} · ${REFERENCE_YEAR - o.y} years` : "Not found"}</DetailItem>
      <DetailItem label="Employees">
        {o.emp ? fmtInt(o.emp) + (o.empt ? ` (${o.empt})` : "") : "Not disclosed"}
      </DetailItem>
      <DetailItem label="Revenue">
        {o.rev != null ? fmtUsdM(o.rev) + (o.revt ? ` (${o.revt})` : "") : "Not disclosed"}
      </DetailItem>
      <DetailItem label="Latest round">
        {(o.stgt || "Not disclosed") + (o.lr ? ` · ${fmtUsdM(o.lr)}` : "") + (o.lrd ? ` · ${o.lrd}` : "")}
        {o.leads && <small>Led by: {o.leads}</small>}
      </DetailItem>
      <DetailItem label="Total raised and valuation">
        {(o.tot ? `${fmtUsdM(o.tot)} raised` : "Total not disclosed") + (o.val ? ` · ${fmtUsdM(o.val)} valuation` : "")}
      </DetailItem>
      <DetailItem label="Status">{o.stt}</DetailItem>
      <DetailItem label="Key investors">{o.inv}</DetailItem>
      <DetailItem label="Location">
        {(o.reg ?? "") + (o.city ? ` · ${o.city}` : "")}
        {o.role && <small>{o.role}</small>}
      </DetailItem>
      <DetailItem label="Impact indicators" wide>
        {o.ii?.length ? <DetailBullets items={o.ii} /> : null}
      </DetailItem>
      <DetailItem label="Milestones, 2025–26" wide>
        {o.ev?.length ? <DetailBullets items={o.ev} /> : null}
      </DetailItem>
      <DetailItem label="Sources" wide>
        {o.src?.length || o.w ? <SourceLinks sources={o.src} site={o.w} /> : null}
      </DetailItem>
      <DetailItem label="Data confidence" wide>
        {o.conf}
      </DetailItem>
    </>
  );
}

const latestRoundLine = (o: CompanyBase) =>
  o.lr ? `Latest round ${fmtUsdM(o.lr)}${o.lry ? ` (${o.lry})` : ""}` : null;

/* ── Variants ────────────────────────────────────────────────────────────── */

const ls = (o: Row) => o as unknown as LifeSciencesCompany;
const fa = (o: Row) => o as unknown as FashionCompany;

const VARIANTS: Record<BriefVariant, VariantSpec> = {
  "life-sciences": {
    config: {
      lenses: [
        { key: "all", label: "Whole metro", test: () => true },
        { key: "nyc", label: "New York City only", test: (o) => o.cl === "New York City" },
        { key: "priv", label: "Private startups", test: (o) => o.st === "Private" },
        { key: "ther", label: "Drug developers", test: isDrugDeveloper },
      ],
      dimensions: {
        seg: { label: "Segment", order: LS_SEGMENTS },
        cl: { label: "Sub-region", order: SUB_REGIONS },
        reg: { label: "Region (detailed)" },
        ta: { label: "Therapeutic area" },
        ls: { label: "Lead program stage", order: LS_LEAD_STAGES },
        fs: { label: "Funding stage", order: FUNDING_STAGES },
        st: { label: "Ownership status", order: LS_STATUS },
        acad: { label: "Academic origin" },
        coh: { label: "Founding cohort", order: LS_COHORTS },
      },
      measures: MEASURES,
      defaultGroup: "seg",
      tabKey: "seg",
      tabOrder: LS_SEGMENTS,
      filters: [
        { key: "cl", label: "Sub-region" },
        { key: "ta", label: "Therapeutic area" },
        { key: "ls", label: "Lead stage" },
        { key: "fs", label: "Funding stage" },
        { key: "st", label: "Status" },
        { key: "acad", label: "Academic origin" },
      ],
      sorts: sorts(["k_lr", "k_lry", "k_tot", "k_rev", "k_emp", "k_y", "n"]),
      defaultSort: "k_lr",
      noun: ["company", "companies"],
    },
    searchFields: ["n", "seg", "mod", "tat", "one", "inv", "pp", "acadt", "reg"],
    searchPlaceholder: "Company, drug, investor…",
    matrix1: {
      rowKey: "cl",
      rowOrder: SUB_REGIONS,
      colKey: "seg",
      colOrder: LS_SEGMENTS,
      jumpTo: (a, b) => ({ filters: { cl: a }, tab: b }),
    },
    matrix2: {
      rowKey: "ta",
      colKey: "ls",
      colOrder: LS_LEAD_STAGES,
      only: isDrugDeveloper,
      jumpTo: (a, b) => ({ filters: { ta: a, ls: b } }),
    },
    roundsLastColumn: { label: "Sub-region", value: (o) => String(o.cl ?? "") },
    kpis: (r, data) => [
      { value: String(r.length), label: "companies profiled" },
      { value: String(r.filter((o) => o.st === "Public").length), label: "publicly listed" },
      {
        value: String(r.filter((o) => /Phase/.test(String(o.ls))).length),
        label: "with a lead program in clinical trials",
      },
      {
        value: fmtUsdM(sum(r.filter((o) => (n(o, "lry") ?? 0) >= 2025).map((o) => n(o, "lr")))),
        label: `latest rounds closed in 2025–26 (${r.filter(raisedRecently).length} companies)`,
      },
      {
        value: String(data.programs.filter((p) => p.status === "Active").length),
        label: "incubators and programs confirmed active",
      },
      { value: fmtUsdM(data.institutionTotal), label: "NIH funding to the institutions listed, FY2025 (BRIMR)" },
    ],
    summary: (row) => {
      const o = ls(row);
      return {
        title: o.n,
        subtitle: o.one ?? undefined,
        meta: <Lines items={[o.seg, (o.reg ?? "") + (o.y ? ` · est. ${o.y}` : "")]} />,
        facts: (
          <Lines
            items={[
              <b key="ls">{o.ls}</b>,
              o.ta !== "Not disease-specific" ? o.ta : null,
              latestRoundLine(o),
              o.rev ? `${fmtUsdM(o.rev)} revenue` : null,
            ]}
          />
        ),
        pills: commonPills(o),
      };
    },
    detail: (row) => {
      const o = ls(row);
      return (
        <DetailGrid>
          <DetailItem label="What it does" wide>
            {o.one}
          </DetailItem>
          <DetailItem label="Problem addressed">{o.prob}</DetailItem>
          <DetailItem label="Modality / technology">{o.mod}</DetailItem>
          <DetailItem label="Therapeutic area">{o.tat}</DetailItem>
          <DetailItem label="Lead program stage">{o.lst || o.ls}</DetailItem>
          <DetailItem label="Who pays">{o.cust}</DetailItem>
          <DetailItem label="Pharma partnerships and deals">{o.pp}</DetailItem>
          <DetailItem label="Academic origin">{o.acadt}</DetailItem>
          <DetailItem label="Incubator history">{o.inc}</DetailItem>
          <CommonDetail o={o} />
        </DetailGrid>
      );
    },
  },

  fashion: {
    config: {
      lenses: [
        { key: "all", label: "All companies", test: () => true },
        {
          key: "tech",
          label: "Technology companies",
          test: (o) => !["Digital-native brands", "Jewelry & watches innovation"].includes(String(o.seg)),
        },
        { key: "ai", label: "AI-driven", test: (o) => o.aiy === "Uses AI" },
        { key: "sus", label: "Circular and sustainable", test: (o) => o.susy === "Sustainability focus" },
      ],
      dimensions: {
        seg: { label: "Segment", order: FA_SEGMENTS },
        bm: { label: "Business model", order: FA_MODELS },
        fs: { label: "Funding stage", order: FUNDING_STAGES },
        aiy: { label: "Use of AI" },
        susy: { label: "Sustainability" },
        st: { label: "Ownership status", order: FA_STATUS },
        reg: { label: "Borough / region" },
        acad: { label: "Founder education" },
        coh: { label: "Founding cohort", order: FA_COHORTS },
      },
      measures: MEASURES,
      defaultGroup: "seg",
      tabKey: "seg",
      tabOrder: FA_SEGMENTS,
      filters: [
        { key: "bm", label: "Business model" },
        { key: "fs", label: "Funding stage" },
        { key: "aiy", label: "Use of AI" },
        { key: "susy", label: "Sustainability" },
        { key: "st", label: "Status" },
        { key: "acad", label: "Founder education" },
      ],
      sorts: sorts(["k_tot", "k_lr", "k_lry", "k_rev", "k_emp", "k_y", "n"]),
      // The source lists "Total raised" first but orders by latest round until changed.
      defaultSort: "k_lr",
      noun: ["company", "companies"],
    },
    searchFields: ["n", "seg", "sub", "one", "inv", "cli", "fb", "acc", "ai"],
    searchPlaceholder: "Company, investor, client…",
    matrix1: {
      rowKey: "seg",
      rowOrder: FA_SEGMENTS,
      colKey: "fs",
      colOrder: FUNDING_STAGES,
      jumpTo: (a, b) => ({ tab: a, filters: { fs: b } }),
    },
    matrix2: {
      rowKey: "seg",
      rowOrder: FA_SEGMENTS,
      colKey: "bm",
      colOrder: FA_MODELS,
      jumpTo: (a, b) => ({ tab: a, filters: { bm: b } }),
    },
    roundsLastColumn: { label: "Lead investors", value: (o) => String(o.leads ?? "") },
    kpis: (r, data) => [
      { value: String(r.length), label: "companies profiled" },
      {
        value: fmtUsdM(sum(r.map((o) => n(o, "tot")))),
        label: `disclosed capital raised (${r.filter((o) => o.tot).length} companies)`,
      },
      { value: String(r.filter(raisedRecently).length), label: "raised their latest round in 2025–26" },
      { value: String(r.filter((o) => o.aiy === "Uses AI").length), label: "build on AI" },
      {
        value: String(data.programs.filter((p) => p.status === "Active").length),
        label: "programs and investors confirmed active",
      },
      { value: fmtInt(data.institutionTotal), label: "students at the dedicated fashion and design schools" },
    ],
    summary: (row) => {
      const o = fa(row);
      return {
        title: o.n,
        subtitle: o.one ?? undefined,
        meta: <Lines items={[o.seg, (o.reg ?? "") + (o.y ? ` · est. ${o.y}` : "")]} />,
        facts: (
          <Lines
            items={[
              <span key="fs">
                <b>{o.fs}</b>
                {o.tot ? ` · ${fmtUsdM(o.tot)} raised` : ""}
              </span>,
              latestRoundLine(o),
              o.rev ? `${fmtUsdM(o.rev)} revenue` : null,
            ]}
          />
        ),
        pills: commonPills(
          o,
          <>
            {o.aiy === "Uses AI" && <span className={PILL_NEUTRAL}>AI</span>}
            {o.susy === "Sustainability focus" && <span className={PILL_NEUTRAL}>Circular / sustainable</span>}
          </>
        ),
      };
    },
    detail: (row) => {
      const o = fa(row);
      return (
        <DetailGrid>
          <DetailItem label="What it does" wide>
            {o.one}
          </DetailItem>
          <DetailItem label="Problem addressed">{o.prob}</DetailItem>
          <DetailItem label="Sub-segment">{o.sub}</DetailItem>
          <DetailItem label="Business model">{o.bmt}</DetailItem>
          <DetailItem label="Customers">{o.cust}</DetailItem>
          <DetailItem label="Use of AI">{o.ai}</DetailItem>
          <DetailItem label="Sustainability angle">{o.sus}</DetailItem>
          <DetailItem label="Clients and partners">{o.cli}</DetailItem>
          <DetailItem label="Founders' background">{o.fb}</DetailItem>
          <DetailItem label="Accelerators and programs">{o.acc}</DetailItem>
          <CommonDetail o={o} />
        </DetailGrid>
      );
    },
  },
};

/* ── Provider ────────────────────────────────────────────────────────────── */

const BriefContext = createContext<{ spec: VariantSpec; data: BriefData } | null>(null);

function useBrief() {
  const value = useContext(BriefContext);
  if (!value) throw new Error("Brief components must be used inside a BriefProvider");
  return value;
}

// A disclosed zero must stay above "not disclosed" when sorting; the shared
// database treats falsy numbers as missing, so nudge real values off zero.
const sortKey = (v: number | null) => (v == null ? null : v + 1e-9);

function prepare(company: CompanyBase, searchFields: string[]): Row {
  const o = company as unknown as Record<string, unknown>;
  const q = searchFields
    .map((k, i) => (i < 2 ? String(o[k]) : String(o[k] || "")))
    .join(" ")
    .toLowerCase();
  const recency = (company.lry || 0) * 1e7 + (company.lr || 0);
  return {
    ...o,
    n: company.n,
    q,
    k_lr: sortKey(company.lr),
    k_lry: recency || null,
    k_tot: sortKey(company.tot),
    k_rev: sortKey(company.rev),
    k_emp: sortKey(company.emp),
    k_y: sortKey(company.y),
  };
}

export function BriefProvider({
  variant,
  data,
  children,
}: {
  variant: BriefVariant;
  data: BriefData;
  children: React.ReactNode;
}) {
  const spec = VARIANTS[variant];
  const rows = useMemo(() => data.companies.map((c) => prepare(c, spec.searchFields)), [data, spec]);
  const value = useMemo(() => ({ spec, data }), [spec, data]);
  return (
    <BriefContext.Provider value={value}>
      <ExplorerProvider rows={rows} config={spec.config}>
        {children}
      </ExplorerProvider>
    </BriefContext.Provider>
  );
}

/* ── Lens-driven views ───────────────────────────────────────────────────── */

export function BriefKpis() {
  const { base } = useExplorer();
  const { spec, data } = useBrief();
  return <KpiGrid items={spec.kpis(base, data)} />;
}

function Matrix({ spec }: { spec: MatrixSpec }) {
  const { base } = useExplorer();
  const rows = spec.only ? base.filter(spec.only) : base;
  const size = (a: string) => rows.filter((o) => o[spec.rowKey] === a).length;
  // Rows with no company under the current lens are left out, as in the source.
  const rowOrder = spec.rowOrder
    ? spec.rowOrder.filter((a) => size(a) > 0)
    : [...new Set(rows.map((o) => String(o[spec.rowKey])))].sort((a, b) => size(b) - size(a));
  return (
    <ExplorerMatrix
      rowKey={spec.rowKey}
      rowOrder={rowOrder}
      colKey={spec.colKey}
      colOrder={spec.colOrder}
      only={spec.only}
      jumpTo={spec.jumpTo}
    />
  );
}

/** First matrix: sub-region × segment (life sciences) or segment × funding stage (fashion). */
export function BriefMatrixOne() {
  return <Matrix spec={useBrief().spec.matrix1} />;
}

/** Second matrix: therapeutic area × lead stage (life sciences) or segment × business model (fashion). */
export function BriefMatrixTwo() {
  return <Matrix spec={useBrief().spec.matrix2} />;
}

const SELECT = "h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground";
const SELECT_LABEL = "flex flex-col gap-1.5 text-xs tracking-wide text-muted-foreground";

export function BriefCohortExplorer() {
  const { config, base, jump } = useExplorer();
  const [group, setGroup] = useState(config.defaultGroup);
  const [measureKey, setMeasureKey] = useState("n");
  const dim = config.dimensions[group];
  const measure = config.measures[measureKey];

  const rows = [...groupBy(base, group)].map(([k, v]) => ({
    k,
    v,
    x: measure.value(v),
    covered: measure.coverage ? v.filter((o) => o[measure.coverage as string] != null).length : v.length,
  }));
  if (dim.order && measureKey === "n") {
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
              ? `${r.covered} of ${r.v.length} companies disclose this figure.`
              : `${r.v.length} companies.`
          } Click to list them.`,
        }))}
        onSelect={(k) => jump(group === config.tabKey ? { tab: k } : { filters: { [group]: k } })}
      />
      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        {measure.coverage
          ? "Sums and medians use only the companies that disclose the figure; hover a bar for coverage. Click a bar to list the companies."
          : "Click a bar to list the companies in the database below."}
      </p>
    </div>
  );
}

function OpenLink({ name, children }: { name: string; children?: React.ReactNode }) {
  const { openRow } = useExplorer();
  return (
    <button type="button" onClick={() => openRow(name)} className={`${LINK} cursor-pointer text-left font-medium`}>
      {children ?? name}
    </button>
  );
}

export function BriefTopRounds() {
  const { base } = useExplorer();
  const { spec } = useBrief();
  const rows = base
    .filter((o) => o.lr && (n(o, "lry") ?? 0) >= 2025)
    .sort((a, b) => (b.lr as number) - (a.lr as number))
    .slice(0, 15);
  return (
    <DataTable
      head={["Company", "Round", "Amount", "Date", "Segment", spec.roundsLastColumn.label]}
      nowrap={[2, 3]}
      rows={rows.map((o) => [
        <OpenLink key="n" name={o.n} />,
        String(o.stgt || "").split("(")[0],
        fmtUsdM(n(o, "lr")),
        String(o.lrd || "").split("(")[0],
        String(o.seg),
        spec.roundsLastColumn.value(o),
      ])}
    />
  );
}

export function BriefExits({ rows }: { rows: BriefExit[] }) {
  return (
    <DataTable
      head={["Company", "Event", "Date", "Value", "Sub-region"]}
      minWidth="min-w-[820px]"
      nowrap={[3]}
      rows={rows.map((x) => [
        x.open ? (
          <OpenLink key="c" name={x.open}>
            {x.c}
          </OpenLink>
        ) : (
          x.c
        ),
        x.e,
        x.d,
        x.v ? fmtUsdM(x.v) : "Undisclosed",
        x.r,
      ])}
    />
  );
}

export function BriefDatabase() {
  const { spec } = useBrief();
  return (
    <CompanyDatabase
      tabsLabel="Filter by segment"
      searchPlaceholder={spec.searchPlaceholder}
      summary={spec.summary}
      detail={spec.detail}
      countSuffix={(rows) =>
        ` · latest rounds disclosed ${fmtUsdM(sum(rows.map((o) => n(o, "lr"))))} · revenue disclosed ${fmtUsdM(
          sum(rows.map((o) => n(o, "rev")))
        )}`
      }
    />
  );
}

/* ── Programs, investors and sites ───────────────────────────────────────── */

const PROGRAM_STATUSES = ["Active", "Listed", "Unconfirmed", "Closed"];
const PROGRAM_PILL: Record<string, string> = {
  Active: PILL_GOOD,
  Listed: PILL_WARN,
  Unconfirmed: `${PILL} bg-foreground/8 text-muted-foreground`,
  Closed: PILL_BAD,
};
const FIELD = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground";
const FIELD_LABEL = "flex min-w-0 flex-1 basis-40 flex-col gap-1.5 text-xs tracking-wide text-muted-foreground";

/** Source notes as links by hostname; a note without a URL stays as text. */
export function InlineLinks({ sources }: { sources?: string[] | null }) {
  if (!sources?.length) return null;
  return (
    <>
      {sources.map((u, i) => {
        const m = String(u).match(/https?:\/\/[^\s)]+/);
        const sep = i > 0 ? " · " : "";
        if (!m) return <span key={i}>{sep + u}</span>;
        const url = m[0].replace(/[),.;]+$/, "");
        return (
          <span key={i}>
            {sep}
            <a href={url} target="_blank" rel="noopener noreferrer" className={LINK}>
              {hostname(m[0])}
            </a>
          </span>
        );
      })}
    </>
  );
}

/** `statusKey` gives the one-line meaning of each status, shown above the list. */
export function BriefPrograms({ statusKey }: { statusKey: Record<string, string> }) {
  const { programs } = useBrief().data;
  const [type, setType] = useState("All");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");

  const types = useMemo(() => ["All", ...new Set(programs.map((p) => p.type))], [programs]);
  const regions = useMemo(() => SUB_REGIONS.filter((c) => programs.some((p) => p.cl === c)), [programs]);
  const rows = programs.filter(
    (p) => (type === "All" || p.type === type) && (!region || p.cl === region) && (!status || p.status === status)
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        {PROGRAM_STATUSES.map((s) => (
          <span key={s} className="flex items-center gap-2">
            <span className={PROGRAM_PILL[s]}>{s}</span>
            {statusKey[s]}
          </span>
        ))}
      </div>

      <div role="group" aria-label="Filter by type" className="mb-4 flex flex-wrap gap-2">
        {types.map((t) => {
          const on = type === t;
          const count = t === "All" ? programs.length : programs.filter((p) => p.type === t).length;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => setType(t)}
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
          Sub-region
          <select value={region} onChange={(e) => setRegion(e.target.value)} className={FIELD}>
            <option value="">All</option>
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className={FIELD_LABEL}>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={FIELD}>
            <option value="">All</option>
            {PROGRAM_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 mb-2 text-xs text-muted-foreground" aria-live="polite">
        {rows.length} of {programs.length} programs and sites
      </p>

      <div className={rows.length ? "border-b border-border" : undefined}>
        {rows.map((p) => (
          <details key={p.name} className="group border-t border-border">
            <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 px-1 py-4 transition-colors hover:bg-primary/5 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_auto_auto] [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 font-medium text-foreground">
                {p.name}
                {p.operator && (
                  <span className="block text-sm leading-snug font-normal text-muted-foreground">{p.operator}</span>
                )}
              </span>
              <span className="hidden min-w-0 text-xs leading-relaxed text-muted-foreground md:block">
                <Lines items={[p.type, p.region]} />
              </span>
              <span className="order-3 col-span-2 min-w-0 text-sm leading-relaxed text-foreground/80 md:order-none md:col-span-1">
                {p.focus}
              </span>
              <span className="flex flex-col items-end gap-1">
                <span className={PROGRAM_PILL[p.status] ?? PROGRAM_PILL.Unconfirmed}>{p.status}</span>
              </span>
              <ChevronDown
                aria-hidden
                className="mt-1 hidden size-4 text-muted-foreground transition-transform group-open:rotate-180 md:block"
              />
            </summary>
            <DetailGrid>
              <DetailItem label="What it offers">{p.offer}</DetailItem>
              <DetailItem label="Cost or equity">{p.equity_or_fee}</DetailItem>
              <DetailItem label="Funding">{p.funding}</DetailItem>
              <DetailItem label="Capacity">{p.capacity}</DetailItem>
              <DetailItem label="Who can apply">{p.eligibility}</DetailItem>
              <DetailItem label="Address">{p.address}</DetailItem>
              <DetailItem label="Alumni and tenants">{p.notable_alumni}</DetailItem>
              <DetailItem label="Status evidence" wide>
                {p.status_evidence}
              </DetailItem>
              <DetailItem label="Links" wide>
                {p.contact_url || p.sources?.length ? (
                  <>
                    {p.contact_url && (
                      <>
                        <a href={p.contact_url} target="_blank" rel="noopener noreferrer" className={LINK}>
                          Program site
                        </a>
                        {" · "}
                      </>
                    )}
                    <InlineLinks sources={p.sources} />
                  </>
                ) : null}
              </DetailItem>
            </DetailGrid>
          </details>
        ))}
      </div>
    </div>
  );
}
