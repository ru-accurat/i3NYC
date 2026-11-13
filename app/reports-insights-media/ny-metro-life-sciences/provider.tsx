"use client";

import raw from "@/data/research/ny-metro-life-sciences.json";
import { sum } from "@/lib/research/format";
import {
  BriefProvider,
  type BriefCompany,
  type BriefData,
  type BriefProgram,
} from "@/components/research/brief/brief-engine";

// Client boundary for this page: the company and program data ship with this route only.
const data: BriefData = {
  companies: raw.D as unknown as BriefCompany[],
  programs: raw.P as unknown as BriefProgram[],
  // NIH funding, $ millions, across the institutions listed.
  institutionTotal: sum((raw.I as unknown as { nih: number | null }[]).map((i) => i.nih)),
};

export function LifeSciencesProvider({ children }: { children: React.ReactNode }) {
  return (
    <BriefProvider variant="life-sciences" data={data}>
      {children}
    </BriefProvider>
  );
}
