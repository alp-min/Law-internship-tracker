"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Info, CheckCircle, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import type { InsightCard } from "@/lib/types";

const INSIGHT_CONFIG = {
  warning: { icon: AlertTriangle, color: "text-warn", bg: "bg-warn-dim", border: "border-warn/20" },
  info: { icon: Info, color: "text-accent", bg: "bg-accent-glow", border: "border-accent/20" },
  success: { icon: CheckCircle, color: "text-gain", bg: "bg-gain-dim", border: "border-gain/20" },
  opportunity: { icon: Zap, color: "text-chart2", bg: "bg-surface-3", border: "border-chart2/20" },
} as const;

export function InsightCards({ insights }: { insights: InsightCard[] }) {
  return (
    <Card className="col-span-full" delay={0.35}>
      <CardHeader>
        <CardTitle>Insights</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {insights.map((ins, i) => {
            const cfg = INSIGHT_CONFIG[ins.type];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${cfg.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-primary mb-1">{ins.title}</p>
                    <p className="text-2xs text-muted leading-relaxed line-clamp-3">{ins.body}</p>
                    {ins.metric && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-sm font-mono font-semibold ${cfg.color}`}>{ins.metric}</span>
                        {ins.change && <span className="text-2xs text-muted">{ins.change}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
