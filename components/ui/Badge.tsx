"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gain" | "loss" | "warn" | "info" | "ghost";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium font-mono",
        size === "sm" ? "text-2xs px-1.5 py-0.5" : "text-xs px-2 py-1",
        {
          "bg-surface-3 text-secondary border border-border": variant === "default",
          "bg-gain-dim text-gain border border-gain": variant === "gain",
          "bg-loss-dim text-loss border border-loss": variant === "loss",
          "bg-warn-dim text-warn border border-warn": variant === "warn",
          "bg-accent-glow text-accent border border-accent/30": variant === "info",
          "text-muted": variant === "ghost",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
