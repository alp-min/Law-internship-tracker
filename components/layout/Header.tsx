"use client";

import { motion } from "framer-motion";
import { RefreshCw, Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, onMenuToggle, actions }: HeaderProps) {
  const today = formatDate(new Date().toISOString(), "long");

  return (
    <header className="h-14 border-b border-border bg-canvas/80 backdrop-blur-md flex items-center px-5 gap-4 shrink-0 sticky top-0 z-30">
      {onMenuToggle && (
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-2 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
      )}

      <div className="flex-1 min-w-0">
        <motion.div
          key={title}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          <h1 className="text-sm font-semibold text-primary truncate">{title}</h1>
          {subtitle && <p className="text-2xs text-muted">{subtitle}</p>}
        </motion.div>
      </div>

      {/* Search */}
      <button className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-muted text-xs hover:border-border-subtle hover:text-primary transition-all">
        <Search className="w-3.5 h-3.5" />
        <span>Search...</span>
        <kbd className="ml-2 px-1.5 py-0.5 bg-surface-3 rounded text-2xs text-muted border border-border">⌘K</kbd>
      </button>

      {/* Date */}
      <p className="hidden lg:block text-2xs text-muted tabular-nums shrink-0">{today}</p>

      {/* Refresh */}
      <button className="p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-2 transition-colors group">
        <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
      </button>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-muted hover:text-primary hover:bg-surface-2 transition-colors">
        <Bell className="w-3.5 h-3.5" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
      </button>

      {actions}
    </header>
  );
}
