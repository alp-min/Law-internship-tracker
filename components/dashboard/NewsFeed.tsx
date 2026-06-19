"use client";

import { motion } from "framer-motion";
import { ExternalLink, Dot } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";

export function NewsFeed({ news }: { news: NewsItem[] }) {
  return (
    <Card className="col-span-2" delay={0.3}>
      <CardHeader>
        <CardTitle>News</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-0">
        {news.map((item, i) => (
          <motion.a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-start gap-3 py-3.5 border-b border-border last:border-0 group cursor-pointer hover:bg-surface-2 -mx-5 px-5 transition-colors"
          >
            <div
              className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                item.sentiment === "positive"
                  ? "bg-gain"
                  : item.sentiment === "negative"
                  ? "bg-loss"
                  : "bg-muted"
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-primary leading-snug group-hover:text-accent transition-colors line-clamp-2">
                {item.headline}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-2xs text-muted">{item.source}</span>
                <Dot className="w-3 h-3 text-muted" />
                <span className="text-2xs text-muted">{formatRelativeTime(item.publishedAt)}</span>
                {item.tickers?.map((t) => (
                  <Badge key={t} variant="info" size="sm">{t}</Badge>
                ))}
              </div>
            </div>
            <ExternalLink className="w-3 h-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
          </motion.a>
        ))}
      </CardContent>
    </Card>
  );
}
