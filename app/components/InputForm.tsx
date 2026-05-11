"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Timer, Users, Wrench, Mountain, Shuffle } from "lucide-react";
import { cn } from "../lib/cn";

const PRESETS = [
  { icon: Zap, label: "Morning Sprinter", text: "Fast decisions, high energy, first one done." },
  { icon: Timer, label: "Steady Pacer", text: "Consistent momentum over long durations." },
  { icon: Users, label: "Team Captain", text: "Organizing people and reading the room." },
  { icon: Wrench, label: "Precision Craftsman", text: "Meticulous detail and manual craft." },
  { icon: Mountain, label: "Endurance Runner", text: "Patience is the edge. Outlasting all." },
  { icon: Shuffle, label: "Adaptive Strategist", text: "Reading the situation and improvising." },
];

export function InputForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (userInput: string) => void | Promise<void>;
}) {
  const [userInput, setUserInput] = useState("");
  const [isFlashActive, setIsFlashActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePresetClick = (text: string) => {
    setUserInput(text);
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 800);
    textareaRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(userInput);
  };

  return (
    <section data-part="input-section" className="w-full">
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-[3vh]">
        <div className="w-full space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            {PRESETS.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePresetClick(preset.text)}
                className="group relative w-full aspect-[3/1.4] md:aspect-[3/1.6] bg-bg-card border-[1.5px] border-[#0c19322e] dark:border-border-subtle shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-none transition-all duration-300 hover:shadow-xl hover:border-accent-red/40 hover:-translate-y-0.5 text-left overflow-hidden"
                style={{
                  clipPath:
                    "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
                }}
              >
                <preset.icon className="absolute bottom-1 right-1 w-14 h-14 md:w-20 md:h-20 opacity-10 dark:opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-14" />
                <div className="relative h-full p-3 md:p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-text-tertiary uppercase">⌜ PRESET 0{i + 1} ⌟</span>
                    <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-text-tertiary uppercase italic">ANALYSIS</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base md:text-xl font-display font-bold leading-tight uppercase italic transition-all group-hover:text-accent-red text-text-main">
                      <span className="relative inline-block">
                        {preset.label}
                        <span
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                          style={{ textShadow: "-1px 0 rgba(200, 16, 74, 0.4), 1px 0 rgba(28, 76, 255, 0.4)" }}
                        >
                          {preset.label}
                        </span>
                      </span>
                    </h3>
                    <div className="w-6 md:w-8 h-[2px] bg-accent-red mt-1 group-hover:w-12 transition-all" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="relative flex items-center py-0.5">
            <div className="flex-grow border-t border-border-subtle"></div>
            <span className="flex-shrink mx-4 text-[9px] font-bold uppercase tracking-[0.5em] text-text-secondary">OR DIRECT ENTRY</span>
            <div className="flex-grow border-t border-border-subtle"></div>
          </div>

          <div className="w-full max-w-2xl mx-auto space-y-2">
            <label htmlFor="userInput" className="block text-[9px] font-bold uppercase tracking-[0.4em] text-text-secondary text-center">
              ⌜ INPUT DAILY MOVEMENT PATTERN ⌟
            </label>
            <div className="relative group">
              <motion.div
                animate={
                  isFlashActive
                    ? {
                        boxShadow: [
                          "0 0 0 0px rgba(196, 30, 58, 0)",
                          "0 0 0 10px rgba(196, 30, 58, 0.2)",
                          "0 0 0 0px rgba(196, 30, 58, 0)",
                        ],
                        backgroundColor: ["rgba(196, 30, 58, 0)", "rgba(196, 30, 58, 0.05)", "rgba(196, 30, 58, 0)"],
                      }
                    : {}
                }
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <textarea
                  ref={textareaRef}
                  id="userInput"
                  required
                  rows={2}
                  className="w-full bg-bg-card-elevated/50 border border-border-subtle p-3.5 md:p-4 focus:outline-none focus:ring-1 focus:ring-accent-red/40 focus:border-accent-red/40 focus:bg-bg-card/80 transition-all resize-none text-sm md:text-base leading-relaxed placeholder:opacity-50 text-text-main font-bold uppercase shadow-sm group-focus-within:shadow-[0_0_20px_-5px_rgba(196,30,58,0.15)]"
                  placeholder="DESCRIBE YOUR TRAJECTORY..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />

                <AnimatePresence>
                  {isFlashActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 border-2 border-accent-red pointer-events-none z-10"
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="absolute bottom-4 right-5 opacity-20 group-focus-within:opacity-80 group-focus-within:text-accent-red transition-all pointer-events-none">
                <svg width="80" height="16" viewBox="0 0 80 16">
                  <path
                    d="M0 8 Q 10 0, 20 8 T 40 8 T 60 8 T 80 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="animate-wave group-focus-within:animate-[pulse_1s_ease-in-out_infinite]"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !userInput.trim()}
          className={cn(
            "w-full max-w-md h-16 bg-text-main text-bg-main font-bold uppercase tracking-[0.4em] transition-all hover:bg-accent-red hover:text-white active:scale-[0.98] group relative overflow-hidden text-sm",
            (loading || !userInput.trim()) && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="relative z-10">RUN HISTORICAL ALIGNMENT</span>
          <div className="absolute inset-0 bg-accent-red translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </form>
    </section>
  );
}
