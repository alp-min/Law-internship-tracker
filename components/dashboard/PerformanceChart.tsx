"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ChartDataPoint } from "@/lib/types";

const PERIODS = ["1M", "3M", "6M", "YTD", "1Y", "ALL"] as const;
type Period = (typeof PERIODS)[number];

interface PerformanceChartProps {
  data: ChartDataPoint[];
}

function filterData(data: ChartDataPoint[], period: Period): ChartDataPoint[] {
  const now = new Date();
  const cutoffs: Record<Period, Date | null> = {
    "1M": new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
    "3M": new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
    "6M": new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
    YTD: new Date(now.getFullYear(), 0, 1),
    "1Y": new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
    ALL: null,
  };
  const cutoff = cutoffs[period];
  if (!cutoff) return data;
  return data.filter((d) => new Date(d.date) >= cutoff);
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-2 border border-border rounded-lg px-3 py-2 shadow-card text-xs">
      <p className="text-muted mb-1">{label && formatDate(label, "medium")}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className={p.dataKey === "value" ? "text-accent" : "text-muted"}>
            {p.dataKey === "value" ? "Portfolio" : "Benchmark"}
          </span>
          <span className="font-mono font-medium text-primary">
            {formatCurrency(p.value, "GBP", true)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [period, setPeriod] = useState<Period>("1Y");

  const filtered = useMemo(() => filterData(data, period), [data, period]);

  const startVal = filtered[0]?.value ?? 0;
  const endVal = filtered[filtered.length - 1]?.value ?? 0;
  const gain = endVal - startVal;
  const gainPct = startVal > 0 ? (gain / startVal) * 100 : 0;
  const isUp = gain >= 0;

  // Normalise benchmark to same start
  const bmStart = filtered[0]?.benchmark ?? 1;
  const normalised = filtered.map((d) => ({
    ...d,
    benchmark: d.benchmark ? (d.benchmark / bmStart) * startVal : undefined,
  }));

  return (
    <Card className="col-span-full" delay={0.1}>
      <CardHeader
        action={
          <div className="flex items-center gap-1 bg-surface-3 rounded-lg p-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 text-2xs font-medium rounded-md transition-all ${
                  period === p
                    ? "bg-accent text-white shadow-sm"
                    : "text-muted hover:text-primary"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        }
      >
        <CardTitle>Performance</CardTitle>
        <div className="flex items-baseline gap-2 mt-1">
          <span className={`text-lg font-mono font-semibold ${isUp ? "text-gain" : "text-loss"}`}>
            {isUp ? "+" : ""}{gainPct.toFixed(2)}%
          </span>
          <span className={`text-xs font-mono ${isUp ? "text-gain/70" : "text-loss/70"}`}>
            {isUp ? "+" : ""}{formatCurrency(gain, "GBP", true)}
          </span>
          <span className="text-xs text-muted">vs benchmark</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={normalised} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#44445a" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#44445a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e1e32"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => formatDate(d, "short")}
              tick={{ fill: "#44445a", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(v) => formatCurrency(v, "GBP", true)}
              tick={{ fill: "#44445a", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="benchmark"
              stroke="#2e2e48"
              strokeWidth={1.5}
              fill="url(#benchGrad)"
              dot={false}
              strokeDasharray="4 2"
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#portfolioGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-accent rounded" />
            <span className="text-2xs text-muted">Portfolio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-border rounded border-dashed" />
            <span className="text-2xs text-muted">Benchmark (FTSE 100)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
