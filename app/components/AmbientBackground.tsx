"use client";

import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for tracking cursor
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs for tracking
  const springConfig = { damping: 50, stiffness: 100, mass: 1 };
  const holoX = useSpring(mouseX, springConfig);
  const holoY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("pointermove", handleGlobalPointerMove);
    return () => window.removeEventListener("pointermove", handleGlobalPointerMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-bg-main transition-colors duration-500">
      {/* Simplified High-Performance Holo Effect */}
      <motion.div 
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1]"
        style={{
          background: useTransform(
            [holoX, holoY],
            (values: number[]) => `radial-gradient(circle at ${50 + values[0] * 40}% ${50 + values[1] * 40}%, rgba(125, 249, 255, 0.8), transparent 70%)`
          ),
          transform: 'translateZ(0)',
          willChange: 'background'
        }}
      />

      {/* Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]" 
        style={{ 
          backgroundImage: 'linear-gradient(var(--color-text-tertiary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-tertiary) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          transform: 'translateZ(0)'
        }} 
      />

      {/* Radial Gradient Archival Spot */}
      <div 
        className="absolute inset-0 opacity-100 dark:opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(200, 16, 74, 0.08), transparent 60%)',
          transform: 'translateZ(0)'
        }}
      />

      {/* Global Scanner Sweep */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="w-full h-[1px] bg-blue-500/15 absolute top-0 left-0 animate-[sweep_6s_linear_infinite] will-change-transform" 
          style={{ transform: 'translateZ(0)' }} 
        />
      </div>

      {/* Optimized Grain Layer */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          transform: 'translateZ(0)'
        }} 
      />

      <style jsx global>{`
        @keyframes sweep {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[sweep_6s_linear_infinite] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
