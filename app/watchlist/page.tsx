"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Plus, Bell, Target, StickyNote, TrendingUp, TrendingDown } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPct } from "@/lib/utils";
import { mockWatchlists } from "@/lib/mock-data";

export default function WatchlistPage() {
  const [activeList, setActiveList] = useState(mockWatchlists[0].id);

  const current = mockWatchlists.find((w) => w.id === activeList) ?? mockWatchlists[0];

  return (
    <AppShell title="Watchlist" subtitle={`${mockWatchlists.reduce((a, w) => a + w.items.length, 0)} items across ${mockWatchlists.length} lists`}>
      <div className="p-5 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* List selector */}
          <div className="space-y-2">
            <p className="text-2xs text-muted uppercase tracking-wider px-1 mb-3">My Lists</p>
            {mockWatchlists.map((wl, i) => (
              <motion.button
                key={wl.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveList(wl.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  activeList === wl.id
                    ? "bg-accent-glow border-accent/30 text-primary"
                    : "bg-surface border-border text-muted hover:text-primary hover:bg-surface-2"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{wl.name}</span>
                  <Badge variant={activeList === wl.id ? "info" : "default"}>{wl.items.length}</Badge>
                </div>
              </motion.button>
            ))}
            <Button variant="ghost" icon={<Plus />} className="w-full justify-start mt-2" size="sm">
              New list
            </Button>
          </div>

          {/* Items */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-primary">{current.name}</h2>
              <Button variant="secondary" icon={<Plus />} size="sm">Add ticker</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {current.items.map((item, i) => {
                const isUp = item.dayChangePct >= 0;
                const upside = item.targetPrice
                  ? ((item.targetPrice - item.currentPrice) / item.currentPrice) * 100
                  : null;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-surface border border-border rounded-xl p-4 hover:border-border-subtle hover:shadow-card-hover transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        {item.logoUrl ? (
                          <img src={item.logoUrl} alt={item.name} className="w-8 h-8 rounded-lg object-contain bg-surface-3" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center">
                            <span className="text-xs font-mono text-muted">{item.ticker.slice(0, 2)}</span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-mono font-semibold text-primary">{item.ticker}</p>
                          <p className="text-2xs text-muted">{item.name}</p>
                        </div>
                      </div>
                      <Star className="w-3.5 h-3.5 text-warn/70 shrink-0" />
                    </div>

                    {/* Price row */}
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <p className="text-xl font-mono font-semibold text-primary">
                          {item.currentPrice > 100
                            ? item.currentPrice.toFixed(0)
                            : item.currentPrice > 1
                            ? item.currentPrice.toFixed(2)
                            : item.currentPrice.toFixed(3)}
                        </p>
                        <div className={`flex items-center gap-1 text-xs font-mono mt-0.5 ${isUp ? "text-gain" : "text-loss"}`}>
                          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {formatPct(item.dayChangePct)}
                        </div>
                      </div>
                      {upside !== null && (
                        <div className="text-right">
                          <p className="text-2xs text-muted">Target</p>
                          <p className="text-xs font-mono text-primary">{item.targetPrice?.toFixed(2)}</p>
                          <p className={`text-2xs font-mono ${upside >= 0 ? "text-gain" : "text-loss"}`}>
                            {formatPct(upside)} upside
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {item.alertPrice && (
                        <div className="flex items-center gap-1 text-2xs text-warn bg-warn-dim border border-warn/20 rounded-md px-2 py-0.5">
                          <Bell className="w-2.5 h-2.5" />
                          Alert @ {item.alertPrice.toFixed(2)}
                        </div>
                      )}
                      {item.targetPrice && (
                        <div className="flex items-center gap-1 text-2xs text-accent bg-accent-glow border border-accent/20 rounded-md px-2 py-0.5">
                          <Target className="w-2.5 h-2.5" />
                          Target @ {item.targetPrice.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <div className="flex items-start gap-1.5">
                        <StickyNote className="w-3 h-3 text-muted shrink-0 mt-0.5" />
                        <p className="text-2xs text-muted leading-relaxed line-clamp-2">{item.notes}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
