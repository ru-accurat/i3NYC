"use client";

import { DoughnutChart, VBarChart } from "@/components/report/report-charts";

const confidenceData = [
  { name: "Multi-Signal (2+ layers)", value: 652 },
  { name: "Single-Signal (1 layer)", value: 821 },
];

const layerData = [
  { name: "Layer 1: Industry", value: 599 },
  { name: "Layer 2: Title/Role", value: 742 },
  { name: "Layer 3: Headline", value: 969 },
];

const CONFIDENCE_COLORS = [
  "rgb(115, 55, 225)",
  "rgb(68, 68, 68)",
] as const;

const LAYER_COLORS = [
  "rgb(0, 115, 206)",
  "rgb(115, 55, 225)",
  "rgb(139, 51, 255)",
] as const;

export function MethodologyCharts() {
  return (
    <div className="grid gap-12 md:grid-cols-2">
      <DoughnutChart data={confidenceData} title="Classification Confidence" colors={CONFIDENCE_COLORS} />
      <VBarChart data={layerData} title="Matches by Layer" colors={LAYER_COLORS} />
    </div>
  );
}
