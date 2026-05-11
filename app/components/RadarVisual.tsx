"use client";

import { motion } from "motion/react";
import { cn } from "../lib/cn";

export function RadarVisual({
  stats,
  color,
  isSmall = false,
}: {
  stats: Record<string, number>;
  color: string;
  isSmall?: boolean;
}) {
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  const statEntries = Object.entries(stats);
  const points = statEntries
    .map(([, value], i) => {
      const angle = i * 90 * (Math.PI / 180);
      const r = (clamp(value) / 100) * 45;
      const x = 50 + r * Math.cos(angle);
      const y = 50 + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <motion.div
      data-component="RadarVisual"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className={cn(
        "relative flex items-center justify-center",
        isSmall ? "w-16 h-16" : "w-28 h-28"
      )}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {!isSmall && (
          <>
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
            <circle cx="50" cy="50" r="22.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-5" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
          </>
        )}
        <motion.polygon
          points={points}
          fill={color}
          fillOpacity={isSmall ? "0.6" : "0.2"}
          stroke={color}
          strokeWidth={isSmall ? "4" : "1.5"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {statEntries.map(([, value], i) => {
          const angle = i * 90 * (Math.PI / 180);
          const r = (clamp(value) / 100) * 45;
          const x = 50 + r * Math.cos(angle);
          const y = 50 + r * Math.sin(angle);
          return <circle key={i} cx={x} cy={y} r={isSmall ? "3" : "1.5"} fill={color} />;
        })}
      </svg>
      <div
        className={cn("absolute inset-0 blur-2xl opacity-20 rounded-full animate-pulse", isSmall ? "hidden" : "")}
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}
