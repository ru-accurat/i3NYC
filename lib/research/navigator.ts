// Types and pure logic for the Tri-State Innovation Navigator. The JSON in
// data/research/ keeps the short keys of the source applet so a new export can
// be re-extracted with scripts/extract-research-data.mjs without a mapping step.

export type RegionKey = "nyc" | "nys" | "li" | "nj" | "ct" | "us" | "it";
export type TypeKey =
  | "landing"
  | "accelerator"
  | "incubator"
  | "pilot"
  | "funding"
  | "tax"
  | "advisory"
  | "talent";
export type MoneyKey = "grant" | "loan" | "equity" | "tax" | "inkind";
export type StatusKey = "open" | "soon" | "closed";

export interface NavigatorProgram {
  /** Program name */
  n: string;
  /** Operator */
  o: string;
  r: RegionKey;
  t: TypeKey;
  /** Funding forms */
  m: MoneyKey[];
  s: StatusKey;
  /** Timing, as a short status line */
  sl: string;
  /** Benefit */
  b: string;
  /** Who it's for */
  w: string;
  /** Eligibility */
  e: string;
  /** Profiles it suits — values of Q.profile */
  p: string[];
  /** Sectors it suits — values of Q.sector, or "all" */
  x: string[];
  /** Link and its label */
  u: string;
  ul: string;
  /** Optional I3/NYC note */
  k?: string;
}

export interface NavigatorEvent {
  /** ISO date used for ordering and the past/upcoming marker */
  d: string;
  /** Date as displayed */
  dl: string;
  n: string;
  /** Place */
  pl: string;
  /** Description */
  x: string;
}

/** A finder question's options as [value, label]. */
export type Choice = [string, string];

export interface NavigatorData {
  PROGRAMS: NavigatorProgram[];
  EVENTS: NavigatorEvent[];
  REGIONS: Record<RegionKey, string>;
  TYPES: Record<TypeKey, string>;
  MONEY: Record<MoneyKey, string>;
  /** [label, source css class] — only the label is used here */
  STAT: Record<StatusKey, [string, string]>;
  Q: { profile: Choice[]; sector: Choice[]; place: Choice[] };
}

/* ── Pathway finder ──────────────────────────────────────────────────────── */

export interface FinderAnswers {
  profile: string;
  sector: string;
  place: string;
}

export const DEFAULT_ANSWERS: FinderAnswers = { profile: "growth", sector: "ai", place: "any" };

function placeOk(p: NavigatorProgram, place: string): boolean {
  // Federal and Italian programs apply wherever the company lands.
  if (place === "any" || p.r === "us" || p.r === "it") return true;
  if (place === "ny") return p.r === "nyc" || p.r === "nys" || p.r === "li";
  return p.r === place;
}

/** Match score for one program; -1 means it does not fit the answers. */
export function finderScore(p: NavigatorProgram, ans: FinderAnswers): number {
  let s = 0;
  if (p.p.includes(ans.profile)) s += 4;
  else return -1;
  if (ans.sector === "all" || p.x.includes("all")) s += 1;
  else if (p.x.includes(ans.sector)) s += 3;
  else return -1;
  if (!placeOk(p, ans.place)) return -1;
  if (p.r === "it") s += 0.5;
  // Open programs rank ahead of upcoming ones; closed ones sink.
  s += p.s === "open" ? 2 : p.s === "soon" ? 1 : -2;
  if (p.t === "landing" && ans.profile === "growth") s += 2;
  return s;
}

export interface IndexedProgram {
  program: NavigatorProgram;
  /** Position in PROGRAMS — the stable id used by the shortlist and anchors */
  index: number;
}

/** The six best starting points for the given answers, best first. */
export function finderResults(programs: NavigatorProgram[], ans: FinderAnswers): IndexedProgram[] {
  return programs
    .map((program, index) => ({ program, index, score: finderScore(program, ans) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ program, index }) => ({ program, index }));
}

/* ── Program explorer ────────────────────────────────────────────────────── */

export interface ExplorerFilters {
  q: string;
  region: string;
  type: string;
  money: string;
  status: string;
}

export const EMPTY_FILTERS: ExplorerFilters = { q: "", region: "", type: "", money: "", status: "" };

export function filterPrograms(data: NavigatorData, f: ExplorerFilters): IndexedProgram[] {
  const q = f.q.trim().toLowerCase();
  return data.PROGRAMS.map((program, index) => ({ program, index })).filter(
    ({ program: p }) =>
      (!f.region || p.r === f.region) &&
      (!f.type || p.t === f.type) &&
      (!f.money || p.m.includes(f.money as MoneyKey)) &&
      (!f.status || p.s === f.status) &&
      (!q ||
        [p.n, p.o, p.b, p.w, p.e, data.REGIONS[p.r], data.TYPES[p.t]].join(" ").toLowerCase().includes(q))
  );
}

/* ── Shortlist ───────────────────────────────────────────────────────────── */

/** Plain-text shortlist for pasting into an email or a board memo. */
export function shortlistText(data: NavigatorData, saved: number[]): string {
  const items = saved.map((i) => {
    const p = data.PROGRAMS[i];
    return `• ${p.n} — ${data.REGIONS[p.r]}\n  ${p.b}\n  Status: ${p.sl}\n  ${p.u}`;
  });
  return (
    "My Tri-State program shortlist (I3/NYC Innovation Navigator, Oct 2026)\n\n" +
    items.join("\n\n") +
    "\n\nQuestions: info@i3nyc.org"
  );
}
