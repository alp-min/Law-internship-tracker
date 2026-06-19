"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatNumber, formatPct } from "@/lib/utils";
import type { MarketIndex } from "@/lib/types";

interface MarketSnapshotProps {
  indices: MarketIndex[];
}

export function MarketSnapshot({ indices }: MarketSnapshotProps) {
  return (
    <Card delay={0.2}>
      <CardHeader>
        <CardTitle>Markets</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {indices.map((idx, i) => {
          const isUp = idx.change >= 0;
          return (
            <motion.div
              key={idx.ticker}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div>
                <p className="text-xs font-medium text-primary">{idx.name}</p>
                <p className="text-2xs text-muted font-mono">{idx.ticker}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono font-medium text-primary">
                  {formatNumber(idx.value, idx.value > 1000 ? 0 : 2)}
                </p>
                <div className={`flex items-center justify-end gap-1 text-2xs font-mono ${isUp ? "text-gain" : "text-loss"}`}>
                  {isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {formatPct(idx.changePct)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
