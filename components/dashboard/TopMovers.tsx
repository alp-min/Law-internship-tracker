"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatPct } from "@/lib/utils";
import type { TopMover } from "@/lib/types";

export function TopMovers({ movers }: { movers: TopMover[] }) {
  return (
    <Card delay={0.25}>
      <CardHeader>
        <CardTitle>Top Movers</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {movers.map((m, i) => {
          const isUp = m.changePct >= 0;
          return (
            <motion.div
              key={m.ticker}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.04 }}
              className="flex items-center gap-3 py-2 border-b border-border last:border-0 cursor-pointer hover:bg-surface-2 -mx-5 px-5 transition-colors rounded"
            >
              {m.logoUrl ? (
                <img src={m.logoUrl} alt={m.name} className="w-6 h-6 rounded-md object-contain bg-surface-3 shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-6 h-6 rounded-md bg-surface-3 flex items-center justify-center shrink-0">
                  <span className="text-2xs font-mono text-muted">{m.ticker.slice(0, 2)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono font-medium text-primary">{m.ticker}</p>
                <p className="text-2xs text-muted truncate">{m.name}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-mono font-medium ${isUp ? "text-gain" : "text-loss"}`}>
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {formatPct(m.changePct)}
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
