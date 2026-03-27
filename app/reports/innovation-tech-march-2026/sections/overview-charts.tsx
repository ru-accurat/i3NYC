"use client";

import { DoughnutChart, StackedHBar } from "@/components/report/report-charts";

const seniorityData = [
  { name: "Senior & Managers", value: 377 },
  { name: "C-Suite & Founders", value: 351 },
  { name: "Other", value: 345 },
  { name: "Professional", value: 196 },
  { name: "Academic", value: 145 },
  { name: "VP & Directors", value: 59 },
];

const geoData = [
  { name: "New York", value: 1255 },
  { name: "New Jersey", value: 163 },
  { name: "Connecticut", value: 55 },
];

const sectorData = [
  { name: "Technology & Comms", italian: 308, italianAmerican: 148 },
  { name: "Healthcare & Pharma", italian: 172, italianAmerican: 65 },
  { name: "Academia & Education", italian: 184, italianAmerican: 36 },
  { name: "Financial Services", italian: 65, italianAmerican: 32 },
  { name: "Services", italian: 59, italianAmerican: 17 },
  { name: "Industrial & Mfg", italian: 47, italianAmerican: 24 },
  { name: "Consumer & Retail", italian: 38, italianAmerican: 16 },
  { name: "Media & Entertainment", italian: 31, italianAmerican: 15 },
  { name: "Gov / Non-profit", italian: 27, italianAmerican: 3 },
  { name: "Transport & Logistics", italian: 6, italianAmerican: 3 },
  { name: "Energy & Utilities", italian: 4, italianAmerican: 1 },
];

const GEO_COLORS = [
  "rgb(115, 55, 225)",
  "rgb(0, 115, 206)",
  "rgb(90, 125, 154)",
] as const;

export function OverviewCharts() {
  return (
    <div className="flex flex-col gap-16">
      <div className="grid gap-12 md:grid-cols-2">
        <DoughnutChart data={seniorityData} title="By Seniority Level" />
        <DoughnutChart data={geoData} title="Geographic Distribution" colors={GEO_COLORS} />
      </div>
      <StackedHBar data={sectorData} title="By Sector (Italian vs Italian-American)" height={440} />
    </div>
  );
}
