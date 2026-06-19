"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  hoverable = false,
  animate = true,
  delay = 0,
  onClick,
}: CardProps) {
  const Comp = animate ? motion.div : "div";
  const animProps = animate
    ? {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, delay, ease: [0.25, 0.46, 0.45, 0.94] },
      }
    : {};

  return (
    <Comp
      {...animProps}
      onClick={onClick}
      className={cn(
        "bg-surface border border-border rounded-xl",
        hoverable && "cursor-pointer transition-all duration-200 hover:border-border-subtle hover:shadow-card-hover hover:bg-surface-2",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </Comp>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between px-5 pt-5 pb-4", className)}>
      <div className="flex-1 min-w-0">{children}</div>
      {action && <div className="ml-3 shrink-0">{action}</div>}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-sm font-semibold text-secondary uppercase tracking-wider", className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 pb-5", className)}>{children}</div>;
}

export function CardDivider() {
  return <div className="border-t border-border mx-5" />;
}
