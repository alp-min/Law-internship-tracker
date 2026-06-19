"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import type { AllocationSlice } from "@/lib/types";

type View = "sector" | "geography" | "asset";

interface AllocationChartProps {
  sector: AllocationSlice[];
  geography: AllocationSlice[];
  assetClass: AllocationSlice[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: AllocationSlice }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-surface-2 border border-border rounded-lg px-3 py-2 text-xs shadow-card">
      <p className="font-medium text-primary">{d.name}</p>
      <p className="font-mono text-accent mt-0.5">{d.value.toFixed(1)}%</p>
    </div>
  );
}

export function AllocationChart({ sector, geography, assetClass }: AllocationChartProps) {
  const [view, setView] = useState<View>("sector");

  const data = view === "sector" ? sector : view === "geography" ? geography : assetClass;

  return (
    <Card delay={0.15}>
      <CardHeader
        action={
          <select
            value={view}
            onChange={(e) => setView(e.target.value as View)}
            className="text-2xs bg-surface-3 border border-border rounded-md px-2 py-1 text-muted focus:outline-none focus:ring-1 focus:ring-accent/40"
          >
            <option value="sector">Sector</option>
            <option value="geography">Geography</option>
            <option value="asset">Asset Class</option>
          </select>
        }
      >
        <CardTitle>Allocation</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <p className="text-lg font-mono font-semibold text-primary">{data.length}</p>
            <p className="text-2xs text-muted">segments</p>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 mt-3">
          {data.slice(0, 5).map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-xs text-secondary flex-1 truncate">{d.name}</span>
              <span className="text-xs font-mono text-primary">{d.value.toFixed(1)}%</span>
            </div>
          ))}
          {data.length > 5 && (
            <p className="text-2xs text-muted text-center">+{data.length - 5} more</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
