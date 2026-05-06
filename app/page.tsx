"use client";

import { useState } from "react";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { 
  Star, 
  ShieldCheck, 
  RotateCcw, 
  Zap, 
  Timer, 
  Users, 
  Wrench, 
  Mountain, 
  Shuffle 
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

function HoloCard({ archetype }: { archetype: Archetype }) {
  const [lens, setLens] = useState<"olympic" | "paralympic">("paralympic");
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  // Rarity styling
  const rarityColors = {
    "Common": "border-border-subtle text-text-secondary",
    "Uncommon": "border-accent-navy/40 text-accent-navy",
    "Rare": "border-accent-gold/50 text-accent-gold",
    "Holo Rare": "border-accent-red/60 text-accent-red",
  };

  const holographicIntensity = {
    "Common": 0.05,
    "Uncommon": 0.15,
    "Rare": 0.3,
    "Holo Rare": 0.6,
  };

  return (
    <div className="perspective-2000 w-full flex flex-col items-center gap-12 font-body">
      {/* Lens Toggle */}
      <div className="flex bg-bg-card-elevated/80 p-1 rounded-full border border-border-subtle backdrop-blur-md shadow-2xl">
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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={false}
        animate={{ rotateY: lens === "olympic" ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 40, damping: 15, mass: 2 }}
        style={{
          transformStyle: "preserve-3d",
          rotateX: lens === "paralympic" ? rotateX : 0,
          rotateY: lens === "olympic" ? 180 : rotateY,
        }}
        className="relative w-[350px] h-[490px] cursor-pointer group"
      >
        {/* Front Face (Paralympic Default) */}
        <div 
          className={cn(
            "absolute inset-0 backface-hidden rounded-[2.5rem] bg-bg-card border-[3px] shadow-2xl overflow-hidden flex flex-col p-8 transition-colors duration-500",
            rarityColors[archetype.rarity]
          )}
          style={{ transform: "translateZ(1px)" }}
        >
          {/* Card Shine Layer */}
          <motion.div 
            style={{
              background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,${holographicIntensity[archetype.rarity]}) 0%, transparent 80%)`,
            }}
            className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay"
          />

          {/* Header Badge */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-tertiary mb-1">Archetype</span>
              <span className="text-xs font-bold uppercase tracking-widest text-text-main">{archetype.discipline}</span>
            </div>
            <div className="px-3 py-1 bg-bg-card-elevated border border-border-subtle rounded-full text-[9px] font-bold uppercase tracking-tighter text-text-secondary">
              {archetype.rarity}
            </div>
          </div>

          {/* Center Visual (Abstract) */}
          <div className="flex-1 flex items-center justify-center relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-b from-accent-red/10 to-transparent rounded-3xl" />
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full border-2 border-accent-red/20 flex items-center justify-center relative z-10"
            >
               <ShieldCheck className="w-16 h-16 text-accent-red/40" />
               <div className="absolute inset-0 animate-pulse bg-accent-red/5 blur-3xl rounded-full" />
            </motion.div>
          </div>

          {/* Title Area */}
          <div className="space-y-2 mb-6">
            <h2 className="text-3xl font-display italic tracking-tight uppercase leading-none drop-shadow-sm text-text-main">
              {archetype.title}
            </h2>
            <div className="h-0.5 w-12 bg-accent-red" />
          </div>

          {/* Description Area */}
          <p className="text-text-secondary text-xs leading-relaxed font-medium mb-6 line-clamp-3">
            {archetype.narrative.paralympic}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-auto">
            {archetype.stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-2 bg-bg-card-elevated/50 rounded-xl border border-border-subtle">
                <span className="text-[8px] font-bold uppercase tracking-tighter text-text-tertiary mb-0.5">{stat.label}</span>
                <span className="text-sm font-mono font-bold tabular-nums text-text-main">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-border-subtle/50">
            <span className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary">{archetype.era}</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-red" />
              <div className="w-1.5 h-1.5 rounded-full bg-border-subtle" />
              <div className="w-1.5 h-1.5 rounded-full bg-border-subtle" />
            </div>
          </div>
        </div>

        {/* Back Face (Olympic) */}
        <div 
          className={cn(
            "absolute inset-0 backface-hidden rounded-[2.5rem] bg-bg-card border-[3px] shadow-2xl overflow-hidden flex flex-col p-8 transition-colors duration-500",
            rarityColors[archetype.rarity]
          )}
          style={{ transform: "rotateY(180deg)" }}
        >
           {/* Card Shine Layer */}
           <motion.div 
            style={{
              background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,${holographicIntensity[archetype.rarity]}) 0%, transparent 80%)`,
            }}
            className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay"
          />

          {/* Header Badge */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-tertiary mb-1">Archetype</span>
              <span className="text-xs font-bold uppercase tracking-widest text-text-main">{archetype.discipline}</span>
            </div>
            <div className="px-3 py-1 bg-bg-card-elevated border border-border-subtle rounded-full text-[9px] font-bold uppercase tracking-tighter text-text-secondary">
              {archetype.rarity}
            </div>
          </div>

          {/* Center Visual (Abstract) */}
          <div className="flex-1 flex items-center justify-center relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-b from-accent-navy/10 to-transparent rounded-3xl" />
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full border-2 border-accent-navy/20 flex items-center justify-center relative z-10"
            >
               <Star className="w-16 h-16 text-accent-navy/40" />
               <div className="absolute inset-0 animate-pulse bg-accent-navy/5 blur-3xl rounded-full" />
            </motion.div>
          </div>

          {/* Title Area */}
          <div className="space-y-2 mb-6">
            <h2 className="text-3xl font-display italic tracking-tight uppercase leading-none drop-shadow-sm text-text-main">
              {archetype.title}
            </h2>
            <div className="h-0.5 w-12 bg-accent-navy" />
          </div>

          {/* Description Area */}
          <p className="text-text-secondary text-xs leading-relaxed font-medium mb-6 line-clamp-3">
            {archetype.narrative.olympic}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-auto">
            {archetype.stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-2 bg-bg-card-elevated/50 rounded-xl border border-border-subtle">
                <span className="text-[8px] font-bold uppercase tracking-tighter text-text-tertiary mb-0.5">{stat.label}</span>
                <span className="text-sm font-mono font-bold tabular-nums text-text-main">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-border-subtle/50">
            <span className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary">{archetype.era}</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-navy" />
              <div className="w-1.5 h-1.5 rounded-full bg-border-subtle" />
              <div className="w-1.5 h-1.5 rounded-full bg-border-subtle" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [error, setError] = useState("");

  const handleReset = () => {
    setArchetype(null);
    setError("");
    setUserInput("");
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
            className="space-y-10"
          >
            {loading ? (
              <div className="flex flex-col items-center space-y-8">
                <div className="w-[350px] h-[490px] rounded-[2.5rem] bg-bg-card-elevated/50 border border-border-subtle animate-pulse-slow flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-bg-card-elevated" />
                  <div className="space-y-3 w-full">
                    <div className="h-4 bg-bg-card-elevated rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-bg-card-elevated rounded w-1/2 mx-auto" />
                  </div>
                  <div className="flex-1" />
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <div className="h-10 bg-bg-card-elevated rounded-xl" />
                    <div className="h-10 bg-bg-card-elevated rounded-xl" />
                    <div className="h-10 bg-bg-card-elevated rounded-xl" />
                  </div>
                </div>
                <p className="text-text-tertiary font-body font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
                  Analyzing Historical Alignment...
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setUserInput(preset.text)}
                        className="flex flex-col items-start p-4 bg-bg-card-elevated border border-border-subtle rounded-xl text-left transition-all hover:border-accent-red hover:scale-[1.02] active:scale-[0.98] group"
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
                      className="block text-xs font-body font-bold uppercase tracking-[0.3em] text-text-tertiary text-center sr-only"
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
                  className="w-full h-16 bg-accent-red text-white font-body font-bold uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_-5px_rgba(179,25,66,0.3)] active:scale-[0.98]"
                >
                  Discover Your Archetype
                </button>
              </>
            )}
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center space-y-12"
          >
            <HoloCard archetype={archetype} />
            
            <div className="flex flex-col items-center gap-6 w-full max-w-[350px]">
              <button
                className="w-full h-14 bg-text-main text-bg-main font-body font-bold uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-95"
              >
                Save Collectible Card
              </button>
              <button
                onClick={handleReset}
                className="text-text-tertiary font-bold uppercase tracking-widest text-[10px] hover:text-text-secondary transition-colors flex items-center gap-2 group border-b border-transparent hover:border-border-subtle pb-1"
              >
                <RotateCcw className="w-3 h-3 group-hover:rotate-[-45deg] transition-transform" />
                Find New Alignment
              </button>
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
