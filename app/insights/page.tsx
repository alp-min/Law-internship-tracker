"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Info, CheckCircle, Zap, BarChart2, TrendingUp, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { mockInsights, mockPositions, mockPortfolioSummary } from "@/lib/mock-data";

const INSIGHT_CONFIG = {
  warning: { icon: AlertTriangle, color: "text-warn", bg: "bg-warn-dim", border: "border-warn/20", label: "Warning" },
  info: { icon: Info, color: "text-accent", bg: "bg-accent-glow", border: "border-accent/20", label: "Info" },
  success: { icon: CheckCircle, color: "text-gain", bg: "bg-gain-dim", border: "border-gain/20", label: "Positive" },
  opportunity: { icon: Zap, color: "text-chart2", bg: "bg-surface-3", border: "border-chart2/20", label: "Opportunity" },
} as const;

function RiskMeter({ value, label }: { value: number; label: string }) {
  const pct = Math.min(value / 2, 100);
  const color = value < 0.8 ? "#10b981" : value < 1.2 ? "#f59e0b" : "#ef4444";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted">{label}</p>
        <p className="text-xs font-mono text-primary">{value.toFixed(2)}</p>
      </div>
      <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const topPerformer = [...mockPositions].sort((a, b) => b.unrealisedPLPct - a.unrealisedPLPct)[0];
  const topDrag = [...mockPositions].sort((a, b) => a.unrealisedPLPct - b.unrealisedPLPct)[0];
  const avgBeta = mockPositions.reduce((acc, p) => acc + (p.beta ?? 1) * p.weight, 0) / 100;

  return (
    <AppShell title="Insights" subtitle="AI-generated portfolio analytics">
      <div className="p-5 max-w-[1600px] mx-auto space-y-5">
        {/* Risk overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card delay={0}>
            <CardHeader><CardTitle>Risk Profile</CardTitle></CardHeader>
            <CardContent className="pt-0 space-y-3">
              <RiskMeter value={avgBeta} label="Portfolio Beta" />
              <RiskMeter value={0.74} label="Sharpe Ratio (annualised)" />
              <RiskMeter value={0.42} label="Max Drawdown (12m)" />
              <RiskMeter value={0.62} label="Volatility (annualised)" />
            </CardContent>
          </Card>

          <Card delay={0.05}>
            <CardHeader><CardTitle>Performance Leaders</CardTitle></CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div>
                <p className="text-2xs text-muted uppercase tracking-wider mb-2">Best performer</p>
                <div className="bg-gain-dim border border-gain/20 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-mono font-semibold text-primary">{topPerformer.ticker}</p>
                    <Badge variant="gain">+{topPerformer.unrealisedPLPct.toFixed(1)}%</Badge>
                  </div>
                  <p className="text-xs text-muted mt-1">{topPerformer.name}</p>
                  <p className="text-xs font-mono text-gain mt-1">
                    +{formatCurrency(topPerformer.unrealisedPL, "GBP", true)} unrealised
                  </p>
                </div>
              </div>
              <div>
                <p className="text-2xs text-muted uppercase tracking-wider mb-2">Most exposure</p>
                <div className="bg-accent-glow border border-accent/20 rounded-xl p-3">
                  {mockPositions
                    .sort((a, b) => b.weight - a.weight)
                    .slice(0, 3)
                    .map((p) => (
                      <div key={p.id} className="flex items-center justify-between py-1">
                        <p className="text-xs font-mono text-primary">{p.ticker}</p>
                        <p className="text-xs font-mono text-accent">{p.weight.toFixed(1)}%</p>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card delay={0.1}>
            <CardHeader><CardTitle>Portfolio Health</CardTitle></CardHeader>
            <CardContent className="pt-0 space-y-2">
              {[
                { label: "Diversification", score: 72, icon: BarChart2 },
                { label: "Risk-adjusted return", score: 84, icon: TrendingUp },
                { label: "Income generation", score: 61, icon: ShieldCheck },
                { label: "Hedging coverage", score: 38, icon: ShieldCheck },
              ].map(({ label, score, icon: Icon }) => {
                const color = score >= 70 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
                return (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className="w-3.5 h-3.5 text-muted shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-2xs text-muted">{label}</span>
                        <span className="text-2xs font-mono" style={{ color }}>{score}/100</span>
                      </div>
                      <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* All insights */}
        <div>
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4">All Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockInsights.map((ins, i) => {
              const cfg = INSIGHT_CONFIG[ins.type];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={ins.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className={`rounded-xl border p-5 ${cfg.bg} ${cfg.border}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-canvas/30 ${cfg.color} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="text-sm font-semibold text-primary">{ins.title}</p>
                        <Badge variant={ins.type === "success" ? "gain" : ins.type === "warning" ? "warn" : "info"} size="sm">
                          {cfg.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-secondary leading-relaxed">{ins.body}</p>
                      {ins.metric && (
                        <div className="mt-3 flex items-center gap-3">
                          <span className={`text-xl font-mono font-semibold ${cfg.color}`}>{ins.metric}</span>
                          {ins.change && <span className="text-xs text-muted">{ins.change}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
