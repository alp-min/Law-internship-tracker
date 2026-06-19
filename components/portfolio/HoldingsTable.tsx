"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatPct, formatNumber, cn } from "@/lib/utils";
import type { Position } from "@/lib/types";

type SortKey = keyof Pick<Position, "name" | "marketValue" | "unrealisedPL" | "unrealisedPLPct" | "dayChangePct" | "weight">;

interface HoldingsTableProps {
  positions: Position[];
  onSelect?: (pos: Position) => void;
}

function Sparkline({ trend }: { trend: "up" | "down" }) {
  const points = Array.from({ length: 12 }, (_, i) => {
    const base = 40;
    const drift = trend === "up" ? i * 1.5 : -i * 1.5;
    return base + drift + (Math.random() * 8 - 4);
  });
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 56;
  const h = 24;
  const coords = points.map((p, i) => `${(i / (points.length - 1)) * w},${h - ((p - min) / range) * h}`).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <polyline
        points={coords}
        fill="none"
        stroke={trend === "up" ? "#10b981" : "#ef4444"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HoldingsTable({ positions, onSelect }: HoldingsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("marketValue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [query, setQuery] = useState("");
  const [assetFilter, setAssetFilter] = useState<string>("all");

  const sorted = useMemo(() => {
    let rows = positions.filter((p) => {
      const q = query.toLowerCase();
      return (
        (p.ticker.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)) &&
        (assetFilter === "all" || p.assetClass === assetFilter)
      );
    });
    rows = [...rows].sort((a, b) => {
      const aVal = a[sortKey] as number | string;
      const bVal = b[sortKey] as number | string;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "desc" ? bVal - aVal : aVal - bVal;
      }
      return sortDir === "desc"
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });
    return rows;
  }, [positions, sortKey, sortDir, query, assetFilter]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronDown className="w-3 h-3 text-muted opacity-30" />;
    return sortDir === "desc" ? (
      <ChevronDown className="w-3 h-3 text-accent" />
    ) : (
      <ChevronUp className="w-3 h-3 text-accent" />
    );
  }

  const cols: { key: SortKey; label: string; align?: "right" }[] = [
    { key: "name", label: "Name" },
    { key: "marketValue", label: "Value", align: "right" },
    { key: "weight", label: "Weight", align: "right" },
    { key: "unrealisedPL", label: "P&L", align: "right" },
    { key: "unrealisedPLPct", label: "Return", align: "right" },
    { key: "dayChangePct", label: "Today", align: "right" },
  ];

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search holdings..."
            className="w-full bg-surface border border-border rounded-lg pl-8 pr-3 py-2 text-xs text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-all"
          />
        </div>
        <select
          value={assetFilter}
          onChange={(e) => setAssetFilter(e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-2 text-xs text-muted focus:outline-none focus:ring-1 focus:ring-accent/40"
        >
          <option value="all">All Assets</option>
          <option value="stock">Stocks</option>
          <option value="etf">ETFs</option>
          <option value="fund">Funds</option>
          <option value="cash">Cash</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {cols.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className={cn(
                      "px-4 py-3 text-muted uppercase tracking-wider font-medium cursor-pointer hover:text-primary transition-colors",
                      col.align === "right" ? "text-right" : "text-left"
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <SortIcon k={col.key} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-muted uppercase tracking-wider font-medium">7d</th>
                <th className="px-4 py-3 text-right text-muted uppercase tracking-wider font-medium">Sector</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((pos, i) => {
                const isUp = pos.unrealisedPL >= 0;
                const dayUp = pos.dayChangePct >= 0;
                return (
                  <motion.tr
                    key={pos.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => onSelect?.(pos)}
                    className="border-b border-border last:border-0 hover:bg-surface-2 cursor-pointer transition-colors group"
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {pos.logoUrl ? (
                          <img
                            src={pos.logoUrl}
                            alt={pos.name}
                            className="w-6 h-6 rounded-md object-contain bg-surface-3 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-md bg-surface-3 flex items-center justify-center shrink-0">
                            <span className="text-2xs font-mono text-muted">{pos.ticker.slice(0, 2)}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-mono font-semibold text-primary">{pos.ticker}</p>
                          <p className="text-muted text-2xs truncate max-w-[120px]">{pos.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Value */}
                    <td className="px-4 py-3 text-right">
                      <p className="font-mono font-medium text-primary">
                        {formatCurrency(pos.marketValue, "GBP", true)}
                      </p>
                      <p className="text-muted text-2xs font-mono">{formatNumber(pos.quantity, 0)} units</p>
                    </td>

                    {/* Weight */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-mono text-primary">{pos.weight.toFixed(1)}%</span>
                        <div className="w-12 h-1 bg-surface-3 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${Math.min(pos.weight * 4, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* P&L */}
                    <td className="px-4 py-3 text-right">
                      <p className={`font-mono font-medium ${isUp ? "text-gain" : "text-loss"}`}>
                        {isUp ? "+" : ""}{formatCurrency(pos.unrealisedPL, "GBP", true)}
                      </p>
                    </td>

                    {/* Return */}
                    <td className="px-4 py-3 text-right">
                      <Badge variant={isUp ? "gain" : "loss"}>
                        {formatPct(pos.unrealisedPLPct)}
                      </Badge>
                    </td>

                    {/* Today */}
                    <td className="px-4 py-3 text-right">
                      <span className={`font-mono text-xs ${dayUp ? "text-gain" : "text-loss"}`}>
                        {formatPct(pos.dayChangePct)}
                      </span>
                    </td>

                    {/* Sparkline */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end">
                        <Sparkline trend={pos.unrealisedPL >= 0 ? "up" : "down"} />
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="px-4 py-3 text-right">
                      <Badge variant="ghost">{pos.sector.split(" ")[0]}</Badge>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-2xs text-muted px-1">
        {sorted.length} of {positions.length} holdings · Prices delayed 15 min
      </p>
    </div>
  );
}
