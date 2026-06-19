"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"logo" | "text" | "done">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 800);
    const t2 = setTimeout(() => setPhase("done"), 2400);
    const t3 = setTimeout(onComplete, 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Background mesh */}
      <div className="absolute inset-0 bg-mesh-1 pointer-events-none" />

      {/* Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

      <motion.div
        className="relative flex flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Logo */}
        <motion.div
          className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center shadow-glow"
          animate={{ boxShadow: phase !== "logo" ? "0 0 40px rgba(99,102,241,0.3)" : "0 0 20px rgba(99,102,241,0.15)" }}
          transition={{ duration: 0.6 }}
        >
          <TrendingUp className="w-8 h-8 text-accent" />
        </motion.div>

        {/* Title */}
        <AnimatePresence>
          {phase !== "logo" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center gap-2"
            >
              <h1 className="text-2xl font-semibold tracking-tight text-primary">
                Portfolio OS
              </h1>
              <p className="text-sm text-muted">
                For Dad
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtitle */}
        <AnimatePresence>
          {phase !== "logo" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xs text-muted max-w-xs leading-relaxed"
            >
              Built for the man who taught me long-term thinking.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Loading bar */}
        <motion.div className="w-48 h-px bg-border rounded-full overflow-hidden mt-2">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: phase === "done" ? "100%" : phase === "text" ? "60%" : "20%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
