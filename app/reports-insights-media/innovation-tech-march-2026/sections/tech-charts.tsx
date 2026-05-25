"use client";

import { HBarChart, DoughnutChart } from "@/components/report/report-charts";

const innovationSectors = [
  { name: "Software & IT", value: 295 },
  { name: "Life Sciences & Biotech", value: 129 },
  { name: "Engineering & Deep Tech", value: 46 },
  { name: "AI & Data Science", value: 46 },
  { name: "Research & Academia", value: 40 },
  { name: "Other Innovation/Tech", value: 26 },
  { name: "Telecom & Communications", value: 19 },
  { name: "FinTech", value: 10 },
  { name: "CleanTech & Energy", value: 4 },
  { name: "Consumer Electronics", value: 2 },
];

const techSeniority = [
  { name: "Senior & Managers", value: 208 },
  { name: "C-Suite & Founders", value: 162 },
  { name: "Other", value: 94 },
  { name: "Professional", value: 60 },
  { name: "VP & Directors", value: 30 },
  { name: "Academic", value: 13 },
];

export function TechCharts() {
  return (
    <div className="flex flex-col gap-16">
      <div className="grid gap-12 md:grid-cols-2">
        <HBarChart data={innovationSectors} title="Innovation Sectors" />
        <DoughnutChart data={techSeniority} title="Tech Company Seniority" />
      </div>
    </div>
  );
}
