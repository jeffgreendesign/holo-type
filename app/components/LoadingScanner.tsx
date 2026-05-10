"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const YEARS = ["1904", "1936", "1948", "1960", "1976", "1984", "1996", "2004", "2012", "2021", "2024", "LA28"];
const STATUS_STEPS = ["MOTION", "TEMPERAMENT", "ERA", "ARCHETYPE"];
const STATUS_STRINGS = [
  "SCANNING PARALYMPIC / OLYMPIC LINEAGE",
  "CROSS-REFERENCING HISTORICAL ARCHETYPES",
  "CALCULATING MOVEMENT ALIGNMENT",
  "LOCKING IDENTITY VECTOR",
];

export function LoadingScanner() {
  const [activeStep, setActiveStep] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (STATUS_STEPS.length + 1));
    }, 1250);

    const statusInterval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % STATUS_STRINGS.length);
    }, 1500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center font-mono z-50 pointer-events-none">
      {/* Year Markers (Global Scatter) */}
      <div className="absolute inset-0 overflow-hidden">
        {YEARS.map((year, i) => (
          <YearMarker key={`${year}-${i}`} year={year} />
        ))}
      </div>

      {/* Main Scanner UI */}
      <div className="relative flex flex-col items-center space-y-12 z-10 pointer-events-auto">
        {/* Radar Ring */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center bg-bg-main rounded-full shadow-[0_0_100px_50px_var(--color-bg-main)]">
          <div className="absolute inset-0 border border-[rgba(200,16,74,0.3)] rounded-full animate-[spin_10s_linear_infinite]">
            {/* Sweep Arc */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, transparent 330deg, rgba(200, 16, 74, 1) 360deg)',
                maskImage: 'radial-gradient(transparent 69%, black 70%)',
                WebkitMaskImage: 'radial-gradient(transparent 69%, black 70%)',
              }}
            />
          </div>
          <div className="absolute inset-8 border border-[rgba(12,25,50,0.05)] rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          
          {/* Status Text (Centered in Ring) */}
          <div className="w-48 text-center px-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIdx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.5 }}
                className="text-[10px] md:text-xs font-bold leading-tight tracking-[0.2em] text-text-main uppercase"
              >
                {STATUS_STRINGS[statusIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Classification Meter */}
        <div className="flex items-center space-x-4 md:space-x-8 bg-bg-main px-10 py-5 rounded-full shadow-[0_0_80px_30px_var(--color-bg-main)]">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex flex-col items-center space-y-2">
              <span 
                className={`text-[9px] md:text-[10px] font-bold tracking-[0.3em] transition-colors duration-500 ${
                  activeStep === i ? "text-text-main" : "text-text-secondary"
                }`}
              >
                {step}
              </span>
              <div className="relative w-full h-[2px] bg-text-main/10 overflow-hidden">
                {activeStep === i && (
                  <motion.div 
                    layoutId="meter-active"
                    className="absolute inset-0 bg-text-main"
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function YearMarker({ year }: { year: string }) {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<{
    top: string;
    left: string;
    fontSize: string;
    opacity: number;
    delay: number;
    duration: number;
  } | null>(null);
  
  useEffect(() => {
    const isLarge = Math.random() > 0.6;
    const timeout = setTimeout(() => {
      setConfig({
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
        fontSize: isLarge ? `${Math.random() * 5 + 3}rem` : `${Math.random() * 0.8 + 0.8}rem`,
        opacity: isLarge ? Math.random() * 0.1 + 0.1 : Math.random() * 0.3 + 0.5,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 4,
      });
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!config) return;
    const timeout = setTimeout(() => setVisible(true), config.delay * 1000);
    return () => clearTimeout(timeout);
  }, [config]);

  if (!config) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: config.opacity }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: config.duration, 
            repeat: Infinity, 
            repeatType: "reverse",
          }}
          className="absolute font-bold tracking-tighter pointer-events-none select-none"
          style={{ 
            top: config.top, 
            left: config.left, 
            fontSize: config.fontSize,
          }}
        >
          {year}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
