"use client";

import { HBarChart, GroupedBar, StackedHBar } from "@/components/report/report-charts";

const topIndustries = [
  { name: "IT & Services", value: 258 },
  { name: "Higher Education", value: 218 },
  { name: "Hospital & Health Care", value: 102 },
  { name: "Research", value: 102 },
  { name: "Pharmaceuticals", value: 75 },
  { name: "Financial Services", value: 61 },
  { name: "Architecture & Planning", value: 36 },
  { name: "Biotechnology", value: 27 },
  { name: "Management Consulting", value: 26 },
  { name: "Electrical/Electronic Mfg", value: 24 },
  { name: "Telecommunications", value: 18 },
  { name: "Internet", value: 17 },
  { name: "Medical Devices", value: 16 },
  { name: "Health & Fitness", value: 14 },
  { name: "Design", value: 14 },
];

const seniorityByOrigin = [
  { name: "Academic", italian: 116, italianAmerican: 29 },
  { name: "Professional", italian: 140, italianAmerican: 56 },
  { name: "Other", italian: 248, italianAmerican: 97 },
  { name: "Senior & Mgrs", italian: 265, italianAmerican: 112 },
  { name: "C-Suite/Founders", italian: 259, italianAmerican: 92 },
  { name: "VP & Directors", italian: 38, italianAmerican: 21 },
];

const sectorByOrigin = [
  { name: "Technology & Comms", italian: 308, italianAmerican: 148 },
  { name: "Academia & Education", italian: 184, italianAmerican: 36 },
  { name: "Healthcare & Pharma", italian: 172, italianAmerican: 65 },
  { name: "Financial Services", italian: 65, italianAmerican: 32 },
  { name: "Services", italian: 59, italianAmerican: 17 },
  { name: "Industrial & Mfg", italian: 47, italianAmerican: 24 },
  { name: "Consumer & Retail", italian: 38, italianAmerican: 16 },
  { name: "Media & Entertainment", italian: 31, italianAmerican: 15 },
  { name: "Gov / Non-profit", italian: 27, italianAmerican: 3 },
  { name: "Transport & Logistics", italian: 6, italianAmerican: 3 },
  { name: "Energy & Utilities", italian: 4, italianAmerican: 1 },
];

export function CommunityCharts() {
  return (
    <div className="flex flex-col gap-16">
      <HBarChart data={topIndustries} title="Top 15 Industries (Full Community)" color="rgb(90, 125, 154)" height={560} />
      <GroupedBar data={seniorityByOrigin} title="Seniority by Origin (Italian vs Italian-American)" />
      <StackedHBar data={sectorByOrigin} title="Sector by Origin (Stacked)" height={440} />
    </div>
  );
}
