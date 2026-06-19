"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Gift, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

const TYPE_CONFIG = {
  buy: { icon: ArrowUpRight, color: "text-accent", bg: "bg-accent-glow", label: "Buy" },
  sell: { icon: ArrowDownLeft, color: "text-loss", bg: "bg-loss-dim", label: "Sell" },
  dividend: { icon: Gift, color: "text-gain", bg: "bg-gain-dim", label: "Dividend" },
  corporate_action: { icon: Zap, color: "text-warn", bg: "bg-warn-dim", label: "Corp. Action" },
} as const;

export function RecentActivity({ transactions }: { transactions: Transaction[] }) {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <Card delay={0.2}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-0">
        {recent.map((tx, i) => {
          const cfg = TYPE_CONFIG[tx.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
            >
              <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-primary">
                  {cfg.label} {tx.ticker}
                </p>
                <p className="text-2xs text-muted">{formatDate(tx.date, "short")} · {tx.broker}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-mono font-medium text-primary">
                  {formatCurrency(tx.total, tx.currency)}
                </p>
                <p className="text-2xs text-muted font-mono">{tx.quantity} @ {tx.price.toFixed(2)}</p>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
