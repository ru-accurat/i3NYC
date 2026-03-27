"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS, CHART_COLORS_EXTENDED, DUAL_COLORS } from "./chart-theme";

/* ─── Shared tooltip style ─── */
const tooltipStyle = {
  backgroundColor: "rgb(31, 31, 36)",
  border: "1px solid rgb(55, 55, 65)",
  borderRadius: "8px",
  color: "rgb(200, 200, 200)",
  fontSize: "12px",
};

/* ─── Doughnut Chart ─── */
interface DoughnutItem {
  name: string;
  value: number;
}

interface DoughnutChartProps {
  data: DoughnutItem[];
  title: string;
  colors?: readonly string[];
}

export function DoughnutChart({ data, title, colors = CHART_COLORS }: DoughnutChartProps) {
  const total = data.reduce((a, b) => a + b.value, 0);

  return (
    <div className="flex flex-col items-center gap-6">
      <h4 className="text-sm tracking-wide text-muted-foreground">{title}</h4>
      <div className="relative h-[220px] w-[220px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length] as string} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [
                `${Number(value).toLocaleString()} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                "",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-light text-foreground">{total.toLocaleString()}</span>
          <span className="text-[10px] tracking-wide text-muted-foreground">Total</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: colors[i % colors.length] as string }}
            />
            <span className="text-[11px] text-muted-foreground">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Horizontal Bar Chart ─── */
interface HBarItem {
  name: string;
  value: number;
}

interface HBarChartProps {
  data: HBarItem[];
  title: string;
  color?: string;
  height?: number;
}

export function HBarChart({ data, title, color = CHART_COLORS[0] as string, height }: HBarChartProps) {
  const h = height ?? Math.max(300, data.length * 36);

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm tracking-wide text-muted-foreground">{title}</h4>
      <div style={{ height: h }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(55, 55, 65)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "rgb(130,130,130)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={180}
              tick={{ fill: "rgb(180,180,180)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(115,55,225,0.08)" }} />
            <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── Stacked Horizontal Bar (Italian vs Italian-American) ─── */
interface StackedItem {
  name: string;
  italian: number;
  italianAmerican: number;
}

interface StackedHBarProps {
  data: StackedItem[];
  title: string;
  height?: number;
}

export function StackedHBar({ data, title, height }: StackedHBarProps) {
  const h = height ?? Math.max(300, data.length * 36);

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm tracking-wide text-muted-foreground">{title}</h4>
      <div style={{ height: h }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(55, 55, 65)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "rgb(130,130,130)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={180}
              tick={{ fill: "rgb(180,180,180)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(115,55,225,0.08)" }} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "rgb(167,167,167)" }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="italian" name="Italian" stackId="a" fill={DUAL_COLORS.italian} barSize={20} radius={[0, 0, 0, 0]} />
            <Bar dataKey="italianAmerican" name="Italian-American" stackId="a" fill={DUAL_COLORS.italianAmerican} barSize={20} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── Grouped Vertical Bar ─── */
interface GroupedItem {
  name: string;
  italian: number;
  italianAmerican: number;
}

interface GroupedBarProps {
  data: GroupedItem[];
  title: string;
}

export function GroupedBar({ data, title }: GroupedBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm tracking-wide text-muted-foreground">{title}</h4>
      <div className="h-[360px]">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(55, 55, 65)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgb(180,180,180)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fill: "rgb(130,130,130)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(115,55,225,0.08)" }} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "rgb(167,167,167)" }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="italian" name="Italian" fill={DUAL_COLORS.italian} radius={[4, 4, 0, 0]} barSize={24} />
            <Bar dataKey="italianAmerican" name="Italian-American" fill={DUAL_COLORS.italianAmerican} radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─── Vertical Bar Chart ─── */
interface VBarItem {
  name: string;
  value: number;
}

interface VBarChartProps {
  data: VBarItem[];
  title: string;
  colors?: readonly string[];
}

export function VBarChart({ data, title, colors }: VBarChartProps) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm tracking-wide text-muted-foreground">{title}</h4>
      <div className="h-[320px]">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(55, 55, 65)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgb(180,180,180)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fill: "rgb(130,130,130)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(115,55,225,0.08)" }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={colors ? (colors[i % colors.length] as string) : (CHART_COLORS_EXTENDED[i % CHART_COLORS_EXTENDED.length] as string)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
