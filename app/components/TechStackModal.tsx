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

import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Cpu, Globe, Palette, Layers, Zap } from "lucide-react";

const TECH_STACK = [
  { name: "Next.js 16", category: "Framework", icon: <Globe className="w-4 h-4" /> },
  { name: "React 19", category: "Library", icon: <Layers className="w-4 h-4" /> },
  { name: "Gemini 1.5 Flash", category: "AI Model", icon: <Cpu className="w-4 h-4" /> },
  { name: "Tailwind CSS 4", category: "Styling", icon: <Palette className="w-4 h-4" /> },
  { name: "TypeScript", category: "Language", icon: <Zap className="w-4 h-4" /> },
  { name: "Motion/React", category: "Animation", icon: <Zap className="w-4 h-4" /> },
];

export const TechStackModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const portalRoot = typeof document === "undefined" ? null : document.body;

  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md"
          >
            {/* Main Modal Container */}
            <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-colors duration-300">
              
              {/* Iridescent Accent Line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent-navy via-accent-gold to-accent-red animate-gradient-x" />
              
              <div className="p-6 md:p-8 text-zinc-900 dark:text-white">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-display font-bold italic tracking-tight flex items-center gap-1.5 uppercase">
                    <span>HOLO<span className="text-accent-gold">TYPE</span></span> <span className="text-zinc-400 dark:text-zinc-500 not-italic font-mono text-[10px] ml-1 tracking-widest">v2.5</span>
                  </h3>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tech List */}
                <div className="grid grid-cols-1 gap-3">
                  {TECH_STACK.map((tech) => (
                    <div 
                      key={tech.name}
                      className="flex items-center gap-4 p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-transparent hover:border-zinc-200 dark:hover:border-white/10 transition-all group"
                    >
                      <div className="p-2.5 rounded-lg bg-white dark:bg-white/5 shadow-sm border border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-zinc-400 group-hover:text-accent-navy dark:group-hover:text-accent-gold transition-colors">
                        {tech.icon}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">{tech.name}</span>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-500 uppercase tracking-wider font-medium">{tech.category}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Attribution */}
                <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-white/10">
                  <p className="text-[11px] text-text-tertiary text-center font-medium leading-relaxed uppercase tracking-widest opacity-80">
                    High-Performance Athlete Visualization<br />
                    <span className="text-[10px] opacity-60">Engineered for HOLOTYPE v2.5.0</span>
                  </p>

                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};
