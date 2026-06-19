"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, BookOpen, TrendingUp, TrendingDown, Minus, Tag, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { mockJournalEntries } from "@/lib/mock-data";
import type { JournalEntry } from "@/lib/types";

const TYPE_ICONS = {
  trade: "📊",
  thesis: "🎯",
  lesson: "💡",
  market: "🌍",
  note: "📝",
} as const;

const TYPE_LABELS = {
  trade: "Trade",
  thesis: "Thesis",
  lesson: "Lesson",
  market: "Market",
  note: "Note",
} as const;

const MOOD_CONFIG = {
  bullish: { icon: TrendingUp, color: "text-gain", label: "Bullish" },
  bearish: { icon: TrendingDown, color: "text-loss", label: "Bearish" },
  neutral: { icon: Minus, color: "text-muted", label: "Neutral" },
} as const;

function EntryCard({ entry, onClick }: { entry: JournalEntry; onClick: () => void }) {
  const Mood = entry.mood ? MOOD_CONFIG[entry.mood] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-surface border border-border rounded-xl p-5 cursor-pointer hover:border-border-subtle hover:shadow-card-hover transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-lg">{TYPE_ICONS[entry.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-primary leading-snug line-clamp-2">
              {entry.title}
            </h3>
            {Mood && (
              <div className={`flex items-center gap-1 text-2xs font-medium ${Mood.color} shrink-0`}>
                <Mood.icon className="w-3 h-3" />
                <span>{Mood.label}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted mt-1">{formatDate(entry.date, "medium")}</p>
        </div>
      </div>

      <p className="text-xs text-secondary leading-relaxed line-clamp-3 mb-3">{entry.body}</p>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="default">{TYPE_LABELS[entry.type]}</Badge>
        {entry.tickers?.map((t) => (
          <Badge key={t} variant="info">{t}</Badge>
        ))}
        {entry.tags.slice(0, 3).map((tag) => (
          <div key={tag} className="flex items-center gap-1 text-2xs text-muted">
            <Tag className="w-2.5 h-2.5" />
            {tag}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function JournalPage() {
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = mockJournalEntries.filter(
    (e) => typeFilter === "all" || e.type === typeFilter
  );

  return (
    <AppShell
      title="Journal"
      subtitle={`${mockJournalEntries.length} entries`}
      actions={<Button variant="primary" icon={<Plus />} size="sm">New Entry</Button>}
    >
      <div className="p-5 max-w-[1200px] mx-auto">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {["all", "thesis", "trade", "lesson", "market", "note"].map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                typeFilter === f
                  ? "bg-accent text-white"
                  : "bg-surface border border-border text-muted hover:text-primary"
              }`}
            >
              {f === "all" ? "All" : TYPE_LABELS[f as keyof typeof TYPE_LABELS]}
              {f !== "all" && (
                <span className="ml-1.5 opacity-60">
                  {mockJournalEntries.filter((e) => e.type === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Entry grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onClick={() => setSelected(entry)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-sm text-muted">No entries yet</p>
          </div>
        )}
      </div>

      {/* Entry detail modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              className="fixed inset-x-4 top-16 bottom-16 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-surface border border-border rounded-2xl z-50 overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-border bg-surface/95 backdrop-blur-sm rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{TYPE_ICONS[selected.type]}</span>
                  <Badge variant="default">{TYPE_LABELS[selected.type]}</Badge>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-primary leading-snug mb-1">
                    {selected.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-muted">{formatDate(selected.date, "long")}</p>
                    {selected.mood && (
                      <div className={`flex items-center gap-1 text-xs ${MOOD_CONFIG[selected.mood].color}`}>
                        {(() => {
                          const MoodIcon = MOOD_CONFIG[selected.mood!].icon;
                          return <MoodIcon className="w-3 h-3" />;
                        })()}
                        {MOOD_CONFIG[selected.mood].label}
                      </div>
                    )}
                  </div>
                </div>

                <div className="prose prose-invert prose-sm max-w-none">
                  {selected.body.split("\n\n").map((para, i) => (
                    <p key={i} className="text-sm text-secondary leading-relaxed mb-3 last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  {selected.tickers?.map((t) => (
                    <Badge key={t} variant="info">{t}</Badge>
                  ))}
                  {selected.tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-1 text-xs text-muted bg-surface-2 border border-border rounded-md px-2 py-0.5">
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
