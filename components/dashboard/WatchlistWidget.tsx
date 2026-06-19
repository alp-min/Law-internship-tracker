"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatPct } from "@/lib/utils";
import type { WatchlistItem } from "@/lib/types";

export function WatchlistWidget({ items }: { items: WatchlistItem[] }) {
  return (
    <Card delay={0.28}>
      <CardHeader
        action={
          <button className="text-2xs text-muted hover:text-accent transition-colors">
            View all →
          </button>
        }
      >
        <CardTitle>Watchlist</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {items.map((item, i) => {
          const isUp = item.dayChangePct >= 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28 + i * 0.05 }}
              className="flex items-center gap-3 py-2.5 border-b border-border last:border-0 cursor-pointer hover:bg-surface-2 -mx-5 px-5 transition-colors"
            >
              <Star className="w-3 h-3 text-warn/60 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono font-medium text-primary">{item.ticker}</p>
                <p className="text-2xs text-muted truncate">{item.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono text-primary">
                  {item.currentPrice > 100
                    ? item.currentPrice.toFixed(0)
                    : item.currentPrice.toFixed(2)}
                </p>
                <p className={`text-2xs font-mono ${isUp ? "text-gain" : "text-loss"}`}>
                  {formatPct(item.dayChangePct)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
