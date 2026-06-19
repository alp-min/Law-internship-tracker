"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, StickyNote } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { HoldingsTable } from "@/components/portfolio/HoldingsTable";
import { AllocationChart } from "@/components/dashboard/AllocationChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { formatCurrency, formatPct, formatDate } from "@/lib/utils";
import {
  mockPositions,
  mockPortfolioSummary,
  mockSectorAllocation,
  mockGeographyAllocation,
  mockAssetClassAllocation,
} from "@/lib/mock-data";
import type { Position } from "@/lib/types";

export default function PortfolioPage() {
  const [selected, setSelected] = useState<Position | null>(null);

  const totalDividendYield = mockPositions.reduce((acc, p) => {
    if (p.dividendYield) return acc + (p.marketValue / mockPortfolioSummary.totalValue) * p.dividendYield;
    return acc;
  }, 0);

  return (
    <AppShell
      title="Portfolio"
      subtitle={`${mockPositions.filter(p => p.assetClass !== "cash").length} positions · GBP ${formatCurrency(mockPortfolioSummary.totalValue, "GBP", true)}`}
    >
      <div className="p-5 max-w-[1600px] mx-auto space-y-5">
        {/* Summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Market Value",
              value: formatCurrency(mockPortfolioSummary.totalValue, "GBP"),
              changePct: mockPortfolioSummary.dailyPLPct,
              changeLabel: "today",
            },
            {
              label: "Unrealised P&L",
              value: `+${formatCurrency(mockPortfolioSummary.totalUnrealisedPL, "GBP", true)}`,
              changePct: mockPortfolioSummary.totalUnrealisedPLPct,
              changeLabel: "total return",
            },
            {
              label: "Day Change",
              value: `+${formatCurrency(mockPortfolioSummary.dailyPL, "GBP")}`,
              changePct: mockPortfolioSummary.dailyPLPct,
              changeLabel: "vs yesterday",
            },
            {
              label: "Blended Yield",
              value: `${totalDividendYield.toFixed(2)}%`,
            },
          ].map((s, i) => (
            <Card key={s.label} delay={i * 0.05} className="p-5">
              <Stat {...s} size="sm" />
            </Card>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Holdings table */}
          <div className="lg:col-span-3">
            <HoldingsTable positions={mockPositions} onSelect={setSelected} />
          </div>

          {/* Right rail */}
          <div className="space-y-4">
            <AllocationChart
              sector={mockSectorAllocation}
              geography={mockGeographyAllocation}
              assetClass={mockAssetClassAllocation}
            />

            {/* Dividend summary */}
            <Card delay={0.3}>
              <CardHeader><CardTitle>Top Dividends</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-2">
                {mockPositions
                  .filter((p) => p.dividendYield && p.dividendYield > 1)
                  .sort((a, b) => (b.dividendYield ?? 0) - (a.dividendYield ?? 0))
                  .map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-1.5">
                      <div>
                        <p className="text-xs font-mono font-medium text-primary">{p.ticker}</p>
                        <p className="text-2xs text-muted">{p.name.split(" ").slice(0, 2).join(" ")}</p>
                      </div>
                      <Badge variant="gain">{p.dividendYield?.toFixed(1)}% yield</Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Position detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-surface border-l border-border z-50 overflow-y-auto"
            >
              <div className="p-5 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {selected.logoUrl && (
                      <img
                        src={selected.logoUrl}
                        alt={selected.name}
                        className="w-10 h-10 rounded-xl object-contain bg-surface-3"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                    <div>
                      <p className="font-mono font-semibold text-lg text-primary">{selected.ticker}</p>
                      <p className="text-xs text-muted">{selected.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-2 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Price */}
                <div className="bg-surface-2 rounded-xl p-4 border border-border">
                  <p className="text-2xs text-muted uppercase tracking-wider mb-1">Current Price</p>
                  <p className="text-3xl font-mono font-semibold text-primary">
                    {selected.currentPrice > 100
                      ? formatCurrency(selected.currentPrice, selected.currency)
                      : `${selected.currentPrice.toFixed(4)}`}
                  </p>
                  <div className={`flex items-center gap-1 mt-1 text-sm font-mono ${selected.dayChangePct >= 0 ? "text-gain" : "text-loss"}`}>
                    <span>{selected.dayChangePct >= 0 ? "▲" : "▼"}</span>
                    <span>{formatPct(selected.dayChangePct)} today</span>
                  </div>
                </div>

                {/* Position details */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Market Value", value: formatCurrency(selected.marketValue, "GBP", true) },
                    { label: "Quantity", value: selected.quantity.toLocaleString() },
                    { label: "Avg. Cost", value: formatCurrency(selected.avgCostBasis, selected.currency) },
                    { label: "Portfolio Weight", value: `${selected.weight.toFixed(1)}%` },
                    {
                      label: "Unrealised P&L",
                      value: `${selected.unrealisedPL >= 0 ? "+" : ""}${formatCurrency(selected.unrealisedPL, "GBP", true)}`,
                      color: selected.unrealisedPL >= 0 ? "text-gain" : "text-loss",
                    },
                    {
                      label: "Total Return",
                      value: formatPct(selected.unrealisedPLPct),
                      color: selected.unrealisedPLPct >= 0 ? "text-gain" : "text-loss",
                    },
                  ].map((item) => (
                    <div key={item.label} className="bg-surface-2 rounded-lg p-3 border border-border">
                      <p className="text-2xs text-muted">{item.label}</p>
                      <p className={`text-sm font-mono font-medium mt-0.5 ${item.color ?? "text-primary"}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                <div className="space-y-2">
                  <p className="text-2xs text-muted uppercase tracking-wider">Key Metrics</p>
                  {[
                    { label: "Sector", value: selected.sector },
                    { label: "Exchange", value: `${selected.exchange} · ${selected.currency}` },
                    { label: "Geography", value: selected.geography },
                    selected.peRatio && { label: "P/E Ratio", value: `${selected.peRatio}x` },
                    selected.beta && { label: "Beta", value: selected.beta.toFixed(2) },
                    selected.dividendYield && { label: "Div. Yield", value: `${selected.dividendYield}%` },
                    selected.analystTarget && {
                      label: "Analyst Target",
                      value: formatCurrency(selected.analystTarget, selected.currency),
                    },
                    { label: "Added", value: formatDate(selected.addedDate, "medium") },
                  ]
                    .filter(Boolean)
                    .map((item) => (
                      <div key={(item as { label: string }).label} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                        <span className="text-xs text-muted">{(item as { label: string }).label}</span>
                        <span className="text-xs font-mono text-primary">{(item as { value: string }).value}</span>
                      </div>
                    ))}
                </div>

                {/* Notes */}
                {selected.notes && (
                  <div className="bg-surface-2 rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <StickyNote className="w-3.5 h-3.5 text-accent" />
                      <p className="text-2xs text-muted uppercase tracking-wider">Investment Notes</p>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed">{selected.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
