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

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Activity, Zap, Target, Shield, Timer, Compass } from "lucide-react";

interface Archetype {
  id: string;
  title: string;
  icon: React.ElementType;
  class: string;
}

const ARCHETYPES: Archetype[] = [
  { id: "HT-01", title: "THE SWIFT CATALYST", icon: Activity, class: "OLYMPIC" },
  { id: "HT-02", title: "THE CALM DISRUPTOR", icon: Zap, class: "PARALYMPIC" },
  { id: "HT-03", title: "THE ENDURING STRATEGIST", icon: Target, class: "UNIFIED" },
  { id: "HT-04", title: "THE STEADFAST ANCHOR", icon: Shield, class: "OLYMPIC" },
  { id: "HT-05", title: "THE KINETIC ORACLE", icon: Timer, class: "PARALYMPIC" },
  { id: "HT-06", title: "THE HORIZON SEEKER", icon: Compass, class: "UNIFIED" },
];

export default function SignalField() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for tracking cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tracking
  const springConfig = { damping: 50, stiffness: 100, mass: 1 };
  const holoX = useSpring(mouseX, springConfig);
  const holoY = useSpring(mouseY, springConfig);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-screen w-full bg-[#fbfaf6] overflow-x-hidden font-mono selection:bg-accent-red/20 text-[#0c1932]"
    >
      {/* Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Simplified High-Performance Holo Effect */}
        <motion.div 
          className="absolute inset-0 opacity-[0.05]"
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
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'linear-gradient(#0c1932 1px, transparent 1px), linear-gradient(90deg, #0c1932 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            transform: 'translateZ(0)'
          }} 
        />
        {/* Radial Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(200, 16, 74, 0.08), transparent 60%)',
            transform: 'translateZ(0)'
          }}
        />
        {/* Scanner Sweep */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-[1px] bg-blue-500/15 absolute top-0 left-0 animate-[sweep_4s_linear_infinite] will-change-transform" style={{ transform: 'translateZ(0)' }} />
        </div>
        {/* Optimized Grain Layer (CSS-only) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            transform: 'translateZ(0)'
          }} 
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-[4vh] flex flex-col items-center">
        {/* Header */}
        <header className="text-center space-y-1 mb-[4vh]">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold italic tracking-tighter uppercase"
          >
            HOLO-TYPE
          </motion.h1>
          <p className="text-[11px] font-bold tracking-[0.4em] opacity-40 uppercase">
            HISTORICAL ALIGNMENT INSTRUMENT // VER 2.5.0
          </p>
        </header>

        {/* Stabilized Card Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-5xl w-full">
          {ARCHETYPES.map((archetype, i) => (
            <ArchetypeCard 
              key={archetype.id} 
              archetype={archetype} 
              index={i} 
            />
          ))}
        </div>

        {/* Input Area */}
        <div className="w-full max-w-xl space-y-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold tracking-[0.4em] opacity-60 uppercase text-center">
              INPUT DAILY MOVEMENT PATTERN
            </label>
            <div className="relative">
              <textarea 
                rows={2}
                className="w-full bg-white/50 border border-[#0c1932]/10 p-3 focus:outline-none focus:ring-1 focus:ring-accent-red/30 transition-all resize-none text-sm leading-relaxed placeholder:opacity-20"
                placeholder="DESCRIBE YOUR TRAJECTORY..."
              />
              {/* Decorative Sine Wave */}
              <div className="absolute bottom-3 right-4 opacity-10">
                <svg width="60" height="12" viewBox="0 0 60 12">
                  <path d="M0 6 Q 7.5 0, 15 6 T 30 6 T 45 6 T 60 6" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[wave_3s_linear_infinite]" />
                </svg>
              </div>
            </div>
          </div>

          <button className="w-full h-12 bg-[#0c1932] text-[#fbfaf6] text-sm font-bold tracking-[0.3em] uppercase transition-all hover:bg-accent-red active:scale-[0.98] group relative overflow-hidden">
            <span className="relative z-10">RUN HISTORICAL ALIGNMENT</span>
            <div className="absolute inset-0 bg-accent-red translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes sweep {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-15px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[sweep_4s_linear_infinite], .animate-[wave_3s_linear_infinite] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function ArchetypeCard({ archetype, index }: { archetype: Archetype; index: number }) {
  const Icon = archetype.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative w-full aspect-[3/2.8] bg-white border border-[#0c1932]/10 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{
        clipPath: "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))"
      }}
    >
      {/* Background Glyph */}
      <Icon className="absolute bottom-3 right-3 w-20 h-20 opacity-[0.03] transition-transform duration-500 group-hover:scale-110" />

      <div className="relative h-full p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold tracking-widest opacity-30">{archetype.class}</span>
          <span className="text-[10px] font-bold tracking-widest opacity-30">{archetype.id}</span>
        </div>

        <div className="flex flex-col">
          <h3 className="text-lg md:text-xl font-display font-bold leading-tight uppercase italic transition-all group-hover:text-accent-red">
            <span className="relative inline-block">
              {archetype.title}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ textShadow: '-1px 0 rgba(200, 16, 74, 0.4), 1px 0 rgba(28, 76, 255, 0.4)' }}>
                {archetype.title}
              </span>
            </span>
          </h3>
          <div className="w-8 h-[2px] bg-[#0c1932]/10 mt-1.5 group-hover:bg-accent-red group-hover:w-12 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}
