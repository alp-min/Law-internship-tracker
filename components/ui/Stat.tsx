"use client";

import { cn, formatPct } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatProps {
  label: string;
  value: string;
  change?: number;
  changePct?: number;
  changeLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  mono?: boolean;
}

export function Stat({ label, value, change, changePct, changeLabel, size = "md", className, mono = true }: StatProps) {
  const isPositive = (change ?? changePct ?? 0) > 0;
  const isNegative = (change ?? changePct ?? 0) < 0;
  const isZero = (change ?? changePct ?? 0) === 0;

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className="text-xs text-muted uppercase tracking-wider font-medium">{label}</p>
      <p
        className={cn(
          "font-semibold text-primary",
          mono && "font-mono",
          size === "sm" && "text-lg",
          size === "md" && "text-2xl",
          size === "lg" && "text-4xl tracking-tight"
        )}
      >
        {value}
      </p>
      {(change !== undefined || changePct !== undefined) && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-mono",
            isPositive && "text-gain",
            isNegative && "text-loss",
            isZero && "text-muted"
          )}
        >
          <TrendIcon className="h-3 w-3" />
          <span>
            {changePct !== undefined ? formatPct(changePct) : ""}
            {changeLabel && <span className="text-muted ml-1">{changeLabel}</span>}
          </span>
        </div>
      )}
    </div>
  );
}
