"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Target } from "lucide-react";

export default function CardReveal() {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for tracking cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tilt
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  
  // Custom properties for glare
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, 80]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, 80]), springConfig);
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="min-h-screen w-full bg-[#fbfaf6] flex items-center justify-center overflow-hidden p-8">
      <div 
        className="perspective-[1000px]"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative w-[320px] h-[448px] group"
        >
          {/* Unified SVG Container for Background, Border, and Clipping */}
          <div className="absolute inset-0 z-0">
            <svg width="320" height="448" viewBox="0 0 320 448" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <clipPath id="cardClip">
                  <path d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z" />
                </clipPath>
              </defs>
              {/* Card Background */}
              <path d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z" fill="white" />
              {/* Card Permanent Border */}
              <path d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z" stroke="#0c1932" strokeOpacity="0.12" strokeWidth="1" />
            </svg>
          </div>

          {/* Content Layer clipped by the same SVG path */}
          <div 
            className="absolute inset-0 z-10 flex flex-col p-5"
            style={{ clipPath: "url(#cardClip)" }}
          >
            {/* Border Trace Animation (matches the same path) */}
            <motion.div 
              className="absolute inset-0 z-50 pointer-events-none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.2, times: [0, 0.1, 0.8, 1], ease: "easeInOut" }}
            >
              <svg width="320" height="448" viewBox="0 0 320 448" className="overflow-visible">
                <motion.path
                  d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z"
                  fill="none"
                  stroke="#7df9ff"
                  strokeWidth="2"
                />
              </svg>
            </motion.div>

              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold tracking-[0.3em] text-[#0c1932]/40">ARCHETYPE</span>
                  <div className="text-[10px] font-mono font-bold text-[#0c1932]/60 px-2 py-0.5 border border-[#0c1932]/10 bg-[#0c1932]/5">UNIFIED</div>
                </div>
                
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.8, type: "spring", stiffness: 200, damping: 15 }}
                  className="bg-accent-red text-white text-[9px] font-mono font-bold px-3 py-1 tracking-widest"
                >
                  RARE
                </motion.div>
              </div>

              {/* Card Art Area */}
              <div className="relative w-full flex-1 min-h-[140px] mb-5 bg-[#fbfaf6] border border-[#0c1932]/10 flex items-center justify-center overflow-hidden shadow-inner">
                <Target className="w-24 h-24 text-[#0c1932]/5" strokeWidth={1} />
                <div className="absolute top-2 left-2 text-[8px] font-mono text-[#0c1932]/30">FIG. 1</div>
                {/* Image Area Scanner Line */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="w-full h-[1px] bg-blue-500/10 absolute top-0 left-0 animate-[cardSweep_3s_linear_infinite]" />
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col justify-center mb-5">
                <h2 className="text-3xl font-display font-bold leading-none tracking-tight text-[#0c1932] uppercase italic">
                  THE ENDURING STRATEGIST
                </h2>
                <div className="w-10 h-[3px] bg-accent-red mt-3" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-px bg-[rgba(12,25,50,0.1)] border border-[rgba(12,25,50,0.1)] overflow-hidden">
                <StatItem label="RESILIENCE" value="92" />
                <StatItem label="PATIENCE" value="95" />
                <StatItem label="ENDURANCE" value="88" />
                <StatItem label="VISION" value="85" />
              </div>

              {/* Footer */}
              <div className="mt-4 flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono font-bold tracking-[0.2em] text-[#0c1932]/40">ERA ALIGNMENT</span>
                  <div className="text-[9px] font-mono font-bold text-[#0c1932]">1900 – PRESENT</div>
                </div>
                <div className="text-[8px] font-mono text-[#0c1932]/40">
                  HT-03 // VECTOR
                </div>
              </div>

              {/* Holographic Overlays */}
              <motion.div 
                className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: useTransform(
                    [glareX, glareY],
                    (values: number[]) => `radial-gradient(circle at ${values[0]}% ${values[1]}%, rgba(125, 249, 255, 0.4), transparent 60%)`
                  )
                }}
              />
              
              <motion.div 
                className="absolute inset-0 pointer-events-none z-30 mix-blend-color-dodge opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: useTransform(
                    [mouseX, mouseY],
                    (values: number[]) => `conic-gradient(from ${values[0] * 90}deg at 50% 50%, rgba(255, 111, 177, 0.15), rgba(125, 249, 255, 0.15), rgba(215, 255, 79, 0.15), rgba(255, 111, 177, 0.15))`
                  )
                }}
              />
            </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes cardSweep {
          0% { transform: translateY(-10px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(150px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-3 flex flex-col">
      <span className="text-[8px] font-mono font-bold tracking-widest text-[#0c1932]/40 mb-1">{label}</span>
      <span className="text-sm font-mono font-bold text-[#0c1932]">{value}</span>
    </div>
  );
}
