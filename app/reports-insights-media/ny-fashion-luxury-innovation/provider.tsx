"use client";

import raw from "@/data/research/ny-fashion-luxury-innovation.json";
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
  // Students enrolled across the schools listed.
  institutionTotal: sum((raw.I as unknown as { enr: number | null }[]).map((i) => i.enr)),
};

export function FashionProvider({ children }: { children: React.ReactNode }) {
  return (
    <BriefProvider variant="fashion" data={data}>
      {children}
    </BriefProvider>
  );
}
