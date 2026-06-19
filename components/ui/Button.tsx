"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  loading?: boolean;
}

export function Button({
  children,
  variant = "secondary",
  size = "md",
  icon,
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center gap-2 font-medium transition-all duration-150 rounded-lg",
        "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-canvas",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        size === "sm" && "text-xs px-3 py-1.5",
        size === "md" && "text-sm px-4 py-2",
        size === "lg" && "text-sm px-5 py-2.5",
        variant === "primary" && "bg-accent text-white hover:bg-accent-dim shadow-glow",
        variant === "secondary" && "bg-surface-2 text-secondary border border-border hover:border-border-subtle hover:text-primary",
        variant === "ghost" && "text-muted hover:text-primary hover:bg-surface-2",
        variant === "danger" && "bg-loss-dim text-loss border border-loss/30 hover:bg-loss hover:text-white",
        className
      )}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {loading ? (
        <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="h-4 w-4 shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
