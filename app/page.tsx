"use client";

import { useState, useEffect } from "react";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { 
  RotateCcw, 
  Zap, 
  Timer, 
  Users, 
  Wrench, 
  Mountain, 
  Shuffle,
  Info,
  Clipboard,
  Share2,
  ChevronDown
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PRESETS = [
  {
    icon: Zap,
    label: "The Morning Sprinter",
    text: "I hit the ground running. Fast decisions, fast pace, first one done.",
  },
  {
    icon: Timer,
    label: "The Steady Pacer",
    text: "I build momentum slowly. Consistency over bursts. I finish what I start.",
  },
  {
    icon: Users,
    label: "The Team Captain",
    text: "I organize people. I read the room. I make the group better than the sum.",
  },
  {
    icon: Wrench,
    label: "The Precision Craftsman",
    text: "I work with my hands. Details matter. I measure twice.",
  },
  {
    icon: Mountain,
    label: "The Endurance Runner",
    text: "Long days don't scare me. I outlast problems. Patience is my edge.",
  },
  {
    icon: Shuffle,
    label: "The Adaptive Strategist",
    text: "I read the situation and adjust. No fixed playbook. I improvise.",
  },
];

interface Archetype {
  title: string;
  narrative: {
    olympic: string;
    paralympic: string;
  };
  rarity: "Common" | "Uncommon" | "Rare" | "Holo Rare";
  stats: { label: string; value: number }[];
  era: string;
  discipline: "Olympic" | "Paralympic" | "Unified";
}

function RadarVisual({ stats, color }: { stats: { label: string; value: number }[], color: string }) {
  // Map 4 stats to 4 axes (0, 90, 180, 270 degrees)
  // Each axis normalized from 0-100 to 0-45 radius
  const points = stats.map((stat, i) => {
    const angle = (i * 90) * (Math.PI / 180);
    const r = (stat.value / 100) * 45;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  return (
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="relative w-32 h-32 flex items-center justify-center"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* Background Grid */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
        <circle cx="50" cy="50" r="22.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-5" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
        <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />

        {/* Data Shape */}
        <motion.polygon
          points={points}
          fill={color}
          fillOpacity="0.2"
          stroke={color}
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Glowing Points */}
        {stats.map((stat, i) => {
          const angle = (i * 90) * (Math.PI / 180);
          const r = (stat.value / 100) * 45;
          const x = 50 + r * Math.cos(angle);
          const y = 50 + r * Math.sin(angle);
          return (
            <circle key={i} cx={x} cy={y} r="1.5" fill={color} />
          );
        })}
      </svg>
      {/* Background Glow */}
      <div 
        className="absolute inset-0 blur-2xl opacity-20 rounded-full animate-pulse" 
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}

function StatCounter({ value, delay }: { value: number, delay: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const end = value;
      const duration = 600;
      const increment = end / (duration / 16);
      
      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(counter);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return <span className="text-xl font-mono font-bold tabular-nums text-text-main leading-none">{count}</span>;
}

function HoloCard({ archetype, lens, setLens }: { archetype: Archetype, lens: "olympic" | "paralympic", setLens: (l: "olympic" | "paralympic") => void }) {
  const [entranceComplete, setEntranceComplete] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Adjust tilt logic: when flipped, Y rotation needs to be inverted to feel natural
  const rotateX = useTransform(mouseYSpring, [-1, 1], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-1, 1], lens === "olympic" ? ["15deg", "-15deg"] : ["-15deg", "15deg"]);

  useEffect(() => {
    const timer = setTimeout(() => setEntranceComplete(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set((px - 0.5) * 2);
    y.set((py - 0.5) * 2);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const holoX = useTransform(mouseXSpring, [-1, 1], ["20%", "80%"]);
  const holoY = useTransform(mouseYSpring, [-1, 1], ["20%", "80%"]);
  const holoRotate = useTransform(mouseXSpring, [-1, 1], ["25deg", "65deg"]);

  const borderGradients = {
    "Common": "linear-gradient(135deg, var(--border-subtle), #D1CFCA, var(--border-subtle))",
    "Uncommon": "linear-gradient(135deg, #8B6914, #C9A84C, #8B6914)",
    "Rare": "linear-gradient(135deg, var(--accent-gold), var(--accent-gold-light), var(--accent-gold))",
    "Holo Rare": "linear-gradient(135deg, #FF0000, #002B5C, #C5972C, #FF0000)",
  };

  const holographicIntensity = {
    "Common": 0,
    "Uncommon": 0.3,
    "Rare": 0.6,
    "Holo Rare": 1.0,
  };

  const baseIntensity = holographicIntensity[archetype.rarity];
  const shimmerOpacity = useSpring(0, { stiffness: 20, damping: 15 });

  useEffect(() => {
    if (entranceComplete) {
      shimmerOpacity.set(baseIntensity);
    }
  }, [entranceComplete, baseIntensity, shimmerOpacity]);

  return (
    <motion.div 
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.5 }}
      className="perspective-2000 w-full flex flex-col items-center gap-8 font-body"
    >
      {/* Lens Toggle */}
      <div className="flex bg-bg-card-elevated/80 p-1 rounded-full border border-border-subtle backdrop-blur-md shadow-2xl relative z-20 scale-90 sm:scale-100">
        <button
          onClick={() => setLens("paralympic")}
          className={cn(
            "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
            lens === "paralympic" ? "bg-accent-red text-white shadow-lg" : "text-text-tertiary hover:text-text-secondary"
          )}
        >
          Paralympic Lens
        </button>
        <button
          onClick={() => setLens("olympic")}
          className={cn(
            "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
            lens === "olympic" ? "bg-accent-navy text-white shadow-lg" : "text-text-tertiary hover:text-text-secondary"
          )}
        >
          Olympic Lens
        </button>
      </div>

      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        initial={false}
        animate={{ 
          rotateY: lens === "olympic" ? 180 : 0,
          scale: [1, 1.03, 1]
        }}
        transition={{ 
          rotateY: { type: "spring", stiffness: 40, damping: 15, mass: 2 },
          scale: { duration: 0.7, times: [0, 0.5, 1], ease: "easeInOut" }
        }}
        style={{
          transformStyle: "preserve-3d",
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        className="relative w-[280px] sm:w-[320px] aspect-[5/7] cursor-pointer group"
      >
        {/* Card Faces Container */}
        <div className="absolute inset-0 preserve-3d">
          {/* Front Face (Paralympic) */}
          <div 
            className="absolute inset-0 backface-hidden rounded-xl bg-bg-card shadow-2xl overflow-hidden flex flex-col p-[20px] transition-colors duration-500 border-[2px]"
            style={{ 
              transform: "rotateY(0deg) translateZ(1px)",
              borderImageSource: borderGradients[archetype.rarity],
              borderImageSlice: 1
            }}
          >
            {/* Holographic BG */}
            <motion.div 
              style={{
                opacity: useTransform(shimmerOpacity, v => v * 0.4),
                background: `radial-gradient(circle at ${holoX.get()} ${holoY.get()}, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6, #ff6b6b)`,
              }}
              className="absolute inset-0 pointer-events-none z-40 mix-blend-color-dodge transition-opacity duration-700 blur-2xl"
            />

            {/* Shimmer Lines */}
            <motion.div 
              style={{
                opacity: useTransform(shimmerOpacity, v => v * 0.2),
                background: `repeating-linear-gradient(${holoRotate.get()}, transparent 0px, rgba(255,255,255,0.1) 1px, transparent 2px, transparent 4px)`,
              }}
              className="absolute inset-0 pointer-events-none z-40 mix-blend-overlay"
            />

            {/* Header Badge */}
            <div className="flex justify-between items-start mb-4 h-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent-navy mb-0.5">Archetype</span>
                <span className="text-sm font-bold uppercase tracking-widest text-accent-red leading-none">{archetype.discipline}</span>
              </div>
              <div className="px-2 py-0.5 bg-accent-gold text-white rounded-sm text-[10px] font-bold uppercase tracking-widest">
                {archetype.rarity}
              </div>
            </div>

            {/* Center Visual (Data-Driven) */}
            <div className="flex-1 flex items-center justify-center relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-b from-accent-red/5 to-transparent rounded-2xl" />
              <div className="relative z-10 scale-90">
                <RadarVisual stats={archetype.stats} color="var(--accent-red)" />
              </div>
            </div>

            {/* Title Area */}
            <div className="space-y-2 mb-5">
              <h2 className="text-2xl sm:text-[28px] font-display italic tracking-tight uppercase leading-none text-text-main">
                {archetype.title}
              </h2>
              <div className="h-0.5 w-10 bg-accent-red" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mt-auto" style={{ transformStyle: "preserve-3d" }}>
              {archetype.stats.map((stat, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-start p-2 bg-bg-card-elevated/30 rounded-md border border-border-subtle/50 shadow-sm"
                  style={{ transform: "translateZ(2px)" }}
                >
                  <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary mb-1 truncate w-full">{stat.label}</span>
                  <StatCounter value={stat.value} delay={0.6 + (i * 0.12)} />
                </div>
              ))}
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-center mt-5 pt-3 border-t border-border-subtle/50">
              <span className="text-[10px] font-display font-bold uppercase tracking-widest text-text-tertiary">{archetype.era}</span>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-red shadow-[0_0_8px_rgba(179,25,66,0.5)]" />
                <div className="w-1.5 h-1.5 rounded-full bg-border-subtle" />
                <div className="w-1.5 h-1.5 rounded-full bg-border-subtle" />
              </div>
            </div>
          </div>

          {/* Back Face (Olympic) */}
          <div 
            className="absolute inset-0 backface-hidden rounded-xl bg-bg-card shadow-2xl overflow-hidden flex flex-col p-[20px] transition-colors duration-500 border-[2px]"
            style={{ 
              transform: "rotateY(180deg) translateZ(1px)",
              borderImageSource: borderGradients[archetype.rarity],
              borderImageSlice: 1
            }}
          >
            {/* Holographic BG */}
            <motion.div 
              style={{
                opacity: useTransform(shimmerOpacity, v => v * 0.4),
                background: `radial-gradient(circle at ${holoX.get()} ${holoY.get()}, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6, #ff6b6b)`,
              }}
              className="absolute inset-0 pointer-events-none z-40 mix-blend-color-dodge transition-opacity duration-700 blur-2xl"
            />

            {/* Shimmer Lines */}
            <motion.div 
              style={{
                opacity: useTransform(shimmerOpacity, v => v * 0.2),
                background: `repeating-linear-gradient(${holoRotate.get()}, transparent 0px, rgba(255,255,255,0.1) 1px, transparent 2px, transparent 4px)`,
              }}
              className="absolute inset-0 pointer-events-none z-40 mix-blend-overlay"
            />

            {/* Header Badge */}
            <div className="flex justify-between items-start mb-4 h-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent-navy mb-0.5">Archetype</span>
                <span className="text-sm font-bold uppercase tracking-widest text-accent-navy leading-none">{archetype.discipline}</span>
              </div>
              <div className="px-2 py-0.5 bg-accent-gold text-white rounded-sm text-[10px] font-bold uppercase tracking-widest">
                {archetype.rarity}
              </div>
            </div>

            {/* Center Visual (Data-Driven) */}
            <div className="flex-1 flex items-center justify-center relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-b from-accent-navy/5 to-transparent rounded-2xl" />
              <div className="relative z-10 scale-90">
                <RadarVisual stats={archetype.stats} color="var(--accent-navy)" />
              </div>
            </div>

            {/* Title Area */}
            <div className="space-y-2 mb-5">
              <h2 className="text-2xl sm:text-[28px] font-display italic tracking-tight uppercase leading-none text-text-main">
                {archetype.title}
              </h2>
              <div className="h-0.5 w-10 bg-accent-navy" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mt-auto" style={{ transformStyle: "preserve-3d" }}>
              {archetype.stats.map((stat, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-start p-2 bg-bg-card-elevated/30 rounded-md border border-border-subtle/50 shadow-sm"
                  style={{ transform: "translateZ(2px)" }}
                >
                  <span className="text-[9px] font-bold uppercase tracking-widest text-text-secondary mb-1 truncate w-full">{stat.label}</span>
                  <StatCounter value={stat.value} delay={0.6 + (i * 0.12)} />
                </div>
              ))}
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-center mt-5 pt-3 border-t border-border-subtle/50">
              <span className="text-[10px] font-display font-bold uppercase tracking-widest text-text-tertiary">{archetype.era}</span>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-navy shadow-[0_0_8px_rgba(0,43,92,0.5)]" />
                <div className="w-1.5 h-1.5 rounded-full bg-border-subtle" />
                <div className="w-1.5 h-1.5 rounded-full bg-border-subtle" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative w-[280px] sm:w-[320px] aspect-[5/7] rounded-xl bg-bg-card-elevated border-2 border-border-subtle overflow-hidden">
        {/* Skeleton Shimmer */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-text-main/5 to-transparent bg-[length:200%_100%] animate-shimmer" 
        />
        
        <div className="p-5 h-full flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="w-16 h-2 bg-text-tertiary/20 rounded animate-pulse" />
              <div className="w-24 h-3 bg-text-tertiary/20 rounded animate-pulse delay-75" />
            </div>
            <div className="w-12 h-5 bg-text-tertiary/20 rounded-full animate-pulse delay-150" />
          </div>
          
          <div className="flex-1 flex items-center justify-center mb-4">
            <div className="w-32 h-32 rounded-full border-2 border-text-tertiary/10 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-text-tertiary/5 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-3 mb-5">
            <div className="w-48 h-8 bg-text-tertiary/20 rounded animate-pulse delay-300" />
            <div className="w-12 h-1 bg-accent-red/20 rounded animate-pulse delay-500" />
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-auto">
            <div className="h-12 bg-text-tertiary/10 rounded-md animate-pulse delay-700" />
            <div className="h-12 bg-text-tertiary/10 rounded-md animate-pulse delay-700" />
            <div className="h-12 bg-text-tertiary/10 rounded-md animate-pulse delay-700" />
          </div>
        </div>
      </div>
      <p className="text-text-tertiary font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
        Analyzing Historical Alignment...
      </p>
    </div>
  );
}

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [error, setError] = useState("");
  const [lens, setLens] = useState<"olympic" | "paralympic">("paralympic");
  const [trustExpanded, setTrustExpanded] = useState(false);

  const handleReset = () => {
    setArchetype(null);
    setError("");
    setUserInput("");
    setLens("paralympic");
    setTrustExpanded(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setArchetype(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate archetype");
      }

      const data = await response.json();
      setArchetype(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main flex flex-col items-center justify-center p-6 font-body">
      <div className="w-full max-w-xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-display tracking-tight sm:text-6xl uppercase italic text-text-main">
            {archetype ? "Your Identity" : "Holo-Type"}
          </h1>
          <p className="text-text-secondary text-lg max-w-md mx-auto leading-relaxed">
            {archetype 
              ? "Your historical Team USA alignment has been identified." 
              : "Describe how you move through your day to discover your Team USA athlete archetype."}
          </p>
        </div>

        {!archetype ? (
          <form
            onSubmit={handleSubmit}
            className={cn("space-y-10 transition-all duration-500", loading && "opacity-50 scale-[0.98] pointer-events-none")}
          >
            {loading ? (
              <CardSkeleton />
            ) : (
              <>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setUserInput(preset.text)}
                        className="flex flex-col items-start p-4 bg-bg-card-elevated border border-border-subtle rounded-xl text-left transition-all duration-200 hover:border-accent-red hover:scale-[1.02] active:scale-[0.98] group shadow-sm hover:shadow-md hover:[transform:perspective(600px)_rotateX(-2deg)_rotateY(2deg)]"
                      >
                        <preset.icon className="w-5 h-5 text-accent-red mb-3 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-display font-bold uppercase tracking-tight text-text-main mb-1">
                          {preset.label}
                        </span>
                        <span className="text-[10px] leading-snug text-text-secondary line-clamp-2">
                          {preset.text}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-border-subtle"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-[0.2em] text-text-tertiary">
                      Or describe yourself
                    </span>
                    <div className="flex-grow border-t border-border-subtle"></div>
                  </div>

                  <div className="space-y-4">
                    <label
                      htmlFor="userInput"
                      className="block text-xs font-body font-bold uppercase tracking-[0.3em] text-accent-navy text-center sr-only"
                    >
                      Personal Identity Input
                    </label>
                    <textarea
                      id="userInput"
                      required
                      rows={4}
                      className="w-full bg-bg-card-elevated/50 border border-border-subtle rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-accent-red/50 transition-all text-text-main resize-none text-lg leading-relaxed placeholder:text-text-tertiary shadow-inner"
                      placeholder="Describe your day..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !userInput.trim()}
                  className="w-full h-16 bg-accent-red text-white font-body font-bold uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_-5px_rgba(179,25,66,0.3)] active:scale-[0.98] animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  {loading ? "Discovering..." : "Discover Your Archetype"}
                </button>
              </>
            )}
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center space-y-12 pb-12"
          >
            <HoloCard archetype={archetype} lens={lens} setLens={setLens} />
            
            <div className="w-full max-w-lg space-y-10">
              {/* Narrative Section */}
              <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <p className="text-text-main text-lg leading-relaxed font-medium">
                  {lens === "paralympic" ? archetype.narrative.paralympic : archetype.narrative.olympic}
                </p>
                
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-bg-card-elevated border border-border-subtle rounded-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Historical Context</span>
                  <span className="text-xs font-display font-bold uppercase italic text-accent-red">
                    {archetype.era} ERA
                  </span>
                </div>
              </div>

              {/* Trust Expandable */}
              <div className="border-t border-border-subtle pt-6">
                <button 
                  onClick={() => setTrustExpanded(!trustExpanded)}
                  className="flex items-center justify-between w-full text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-accent-navy" />
                    <span className="text-xs font-bold uppercase tracking-widest text-text-secondary group-hover:text-text-main transition-colors">
                      How was this determined?
                    </span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-text-tertiary transition-transform duration-300", trustExpanded && "rotate-180")} />
                </button>
                {trustExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <p className="pt-4 text-xs leading-relaxed text-text-tertiary">
                      Matched using Gemini 2.5 Flash against 120 years of Team USA athlete data. 
                      This archetype analysis is derived from behavioral traits and historical alignment profiles.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                <button
                  className="w-full h-14 bg-text-main text-bg-main font-body font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all shadow-xl active:scale-[0.98]"
                >
                  Save Collectible Card
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied!");
                    }}
                    className="h-12 flex items-center justify-center gap-2 bg-bg-card-elevated border border-border-subtle rounded-xl text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-text-main transition-all active:scale-[0.95]"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    Copy Link
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'My Holo-Type Archetype',
                          text: `I discovered my Team USA archetype: ${archetype.title}`,
                          url: window.location.href,
                        });
                      }
                    }}
                    className="h-12 flex items-center justify-center gap-2 bg-bg-card-elevated border border-border-subtle rounded-xl text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-text-main transition-all active:scale-[0.95]"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </button>
                </div>

                <button
                  onClick={handleReset}
                  className="mt-4 self-center text-text-tertiary font-bold uppercase tracking-widest text-[10px] hover:text-text-secondary transition-colors flex items-center gap-2 group border-b border-transparent hover:border-border-subtle pb-1"
                >
                  <RotateCcw className="w-3 h-3 group-hover:rotate-[-45deg] transition-transform" />
                  Find New Alignment
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="p-4 bg-accent-red/10 border border-accent-red/20 rounded-xl text-accent-red text-center font-bold text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
