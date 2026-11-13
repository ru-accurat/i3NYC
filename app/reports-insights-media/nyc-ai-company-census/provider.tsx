"use client";

import raw from "@/data/research/nyc-ai-company-census.json";
import { AiCensusProvider, type AiCompany } from "@/components/research/census/ai-census";

// Client boundary for this page: the company data ships with this route only.
const companies = raw.D as unknown as AiCompany[];

export function NycCensusProvider({ children }: { children: React.ReactNode }) {
  return (
    <AiCensusProvider variant="nyc" companies={companies}>
      {children}
    </AiCensusProvider>
  );
}
