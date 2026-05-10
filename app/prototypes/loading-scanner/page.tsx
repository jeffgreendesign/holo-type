/**
 * Copyright 2026 Holo-Type Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

export default function LoadingScanner() {
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
    <div className="relative min-h-screen w-full bg-[#fbfaf6] overflow-hidden font-mono selection:bg-accent-red/20 flex flex-col items-center justify-center">
      {/* Background Layers */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 50% 35%, rgba(200, 16, 74, 0.08), transparent 30%),
            linear-gradient(rgba(12, 25, 50, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(12, 25, 50, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, 44px 44px, 44px 44px'
        }}
      />
      
      {/* Scanner Sweep */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-[1px] bg-blue-500/15 absolute top-0 left-0 animate-[sweep_4s_linear_infinite]" />
      </div>

      {/* Year Markers */}
      <div className="absolute inset-0 pointer-events-none">
        {YEARS.map((year) => (
          <YearMarker key={year} year={year} />
        ))}
      </div>

      {/* Main Scanner UI */}
      <div className="relative flex flex-col items-center space-y-12 z-10">
        {/* Radar Ring */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center bg-[#fbfaf6] rounded-full shadow-[0_0_100px_50px_#fbfaf6]">
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
                className="text-[10px] md:text-xs font-bold leading-tight tracking-[0.2em] text-[#0c1932]/60 uppercase"
              >
                {STATUS_STRINGS[statusIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Classification Meter */}
        <div className="flex items-center space-x-4 md:space-x-8 bg-[#fbfaf6] px-12 py-6 rounded-full shadow-[0_0_80px_30px_#fbfaf6]">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex flex-col items-center space-y-2">
              <span 
                className={`text-[9px] md:text-[11px] font-bold tracking-[0.3em] transition-colors duration-500 ${
                  activeStep === i ? "text-[#0c1932]" : "text-[#0c1932]/20"
                }`}
              >
                {step}
              </span>
              <div className="relative w-full h-[2px] bg-[#0c1932]/10 overflow-hidden">
                {activeStep === i && (
                  <motion.div 
                    layoutId="meter-active"
                    className="absolute inset-0 bg-[#0c1932]"
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

      <style jsx global>{`
        @keyframes sweep {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-[sweep_4s_linear_infinite],
          .animate-[spin_10s_linear_infinite],
          .animate-[spin_15s_linear_infinite_reverse] {
            animation: none !important;
          }
        }
      `}</style>
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
    rotate: string;
    delay: number;
    duration: number;
  } | null>(null);
  
  useEffect(() => {
    const isLarge = Math.random() > 0.6; // 40% chance of large
    const timeout = setTimeout(() => {
      setConfig({
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
        fontSize: isLarge ? `${Math.random() * 6 + 4}rem` : `${Math.random() * 0.8 + 0.8}rem`,
        opacity: isLarge ? Math.random() * 0.1 + 0.1 : Math.random() * 0.3 + 0.5,
        rotate: "0deg",
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
            rotate: config.rotate 
          }}
        >
          {year}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
