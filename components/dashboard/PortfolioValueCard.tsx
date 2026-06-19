"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { formatCurrency, formatPct } from "@/lib/utils";
import type { PortfolioSummary } from "@/lib/types";

interface PortfolioValueCardProps {
  summary: PortfolioSummary;
}

export function PortfolioValueCard({ summary }: PortfolioValueCardProps) {
  const isUp = summary.dailyPL >= 0;

  return (
    <Card className="col-span-2 relative overflow-hidden" delay={0}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />

      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted uppercase tracking-widest font-medium mb-3">
              Total Portfolio Value
            </p>
            <motion.div
              key={summary.totalValue}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-4xl font-semibold font-mono text-primary tracking-tight">
                {formatCurrency(summary.totalValue, "GBP")}
              </p>
            </motion.div>

            <div className="flex items-center gap-4 mt-3">
              <div className={`flex items-center gap-1.5 text-sm font-mono ${isUp ? "text-gain" : "text-loss"}`}>
                {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{isUp ? "+" : ""}{formatCurrency(summary.dailyPL, "GBP")}</span>
                <span className="text-xs">({formatPct(summary.dailyPLPct)})</span>
                <span className="text-muted text-xs font-sans">today</span>
              </div>
            </div>
          </div>

          {/* Total return badge */}
          <div className="text-right">
            <p className="text-xs text-muted mb-1">Total Return</p>
            <div className="flex items-center justify-end gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-gain" />
              <p className="text-lg font-mono font-semibold text-gain">
                {formatPct(summary.totalUnrealisedPLPct)}
              </p>
            </div>
            <p className="text-xs font-mono text-gain/70 mt-0.5">
              +{formatCurrency(summary.totalUnrealisedPL, "GBP")}
            </p>
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
          <div>
            <p className="text-2xs text-muted uppercase tracking-wider">Invested</p>
            <p className="text-sm font-mono font-medium text-primary mt-1">
              {formatCurrency(summary.totalCost, "GBP", true)}
            </p>
          </div>
          <div>
            <p className="text-2xs text-muted uppercase tracking-wider">Cash</p>
            <p className="text-sm font-mono font-medium text-primary mt-1">
              {formatCurrency(summary.cashBalance, "GBP", true)}
              <span className="text-muted text-2xs ml-1">({summary.cashPct.toFixed(1)}%)</span>
            </p>
          </div>
          <div>
            <p className="text-2xs text-muted uppercase tracking-wider">Positions</p>
            <p className="text-sm font-mono font-medium text-primary mt-1">
              {summary.positions.filter(p => p.assetClass !== "cash").length} open
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
