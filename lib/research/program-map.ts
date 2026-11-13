// Types for the "program map" research pages (university programs, private
// accelerators). The JSON in data/research/ keeps the short keys of the source
// applets so a new export can be re-extracted with
// scripts/extract-research-data.mjs without a mapping step.

export type Access = "Open" | "Mixed" | "Affiliates";
export type Status = "Active" | "Listed" | "Paused" | "Unconfirmed";

export interface Program {
  /** Program name */
  n: string;
  /** Institution or operator */
  i: string;
  /** Group (institution family / program family) — one of GROUPS */
  g: string;
  /** Program type, e.g. "Accelerator" */
  t: string;
  /** Stages covered, as indexes into STAGES */
  s: number[];
  /** Topics — subset of TOPICS */
  k: string[];
  a: Access;
  /** Funding, as published */
  f: string;
  /** Equity, IP and terms */
  e: string;
  /** Who can apply */
  w: string;
  /** Program and benefits */
  b: string;
  /** Duration */
  du: string;
  /** Application window */
  ap: string;
  /** Cohort and selectivity */
  co: string;
  /** Location */
  pl: string;
  /** International founders */
  intl: string;
  /** Track record */
  m: string;
  /** Success cases */
  ss: string;
  st: Status;
  /** Status evidence */
  sv: string;
  /** Reference links as [label, url] */
  links: [string, string][];
  /** Per-team money, low and high bound in USD (absent when unpublished) */
  lo?: number;
  hi?: number;
  /** 1 when the money is an investment (equity or note) rather than a grant */
  eq?: number;
  /** 1 when the program takes no equity */
  ne?: number;
}

/** [company, program, outcome, as-of label, source url] */
export type SuccessCase = [string, string, string, string, string];

export interface ProgramMapData {
  STAGES: string[];
  GROUPS: string[];
  TOPICS: string[];
  P: Program[];
  CASES: SuccessCase[];
}

/** Wording that differs between the maps built on this engine. */
export interface ProgramMapLabels {
  /** First option of the group filter, e.g. "All institutions" */
  allGroups: string;
  /** Field label of the group filter, e.g. "Institution" */
  group: string;
  access: Record<Access, string>;
  status: Record<Status, string>;
  /** Label of the terms field in the expanded row */
  terms: string;
  /** Date the status evidence was checked, e.g. "October 10, 2026" */
  checked: string;
}

export function formatUsd(v: number): string {
  if (v >= 1_000_000) return `$${v / 1_000_000}M`;
  if (v >= 1_000) return `$${v / 1_000}K`;
  return `$${v}`;
}
