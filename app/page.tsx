"use client";

import { useState } from "react";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Star, Info, ShieldCheck, RotateCcw, Shuffle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    "Common": "border-zinc-500/30 text-zinc-400",
    "Uncommon": "border-blue-500/40 text-blue-400",
    "Rare": "border-amber-500/50 text-amber-400",
    "Holo Rare": "border-purple-500/60 text-purple-400",
  };

  const holographicIntensity = {
    "Common": 0.05,
    "Uncommon": 0.15,
    "Rare": 0.3,
    "Holo Rare": 0.6,
  };

  return (
    <div className="perspective-2000 w-full flex flex-col items-center gap-12">
      {/* Lens Toggle */}
      <div className="flex bg-zinc-900/80 p-1 rounded-full border border-zinc-800 backdrop-blur-md shadow-2xl">
        <button
          onClick={() => setLens("paralympic")}
          className={cn(
            "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
            lens === "paralympic" ? "bg-red-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          Paralympic Lens
        </button>
        <button
          onClick={() => setLens("olympic")}
          className={cn(
            "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
            lens === "olympic" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
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
            "absolute inset-0 backface-hidden rounded-[2.5rem] bg-zinc-950 border-[3px] shadow-2xl overflow-hidden flex flex-col p-8 transition-colors duration-500",
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

          {/* Holographic Iridescence */}
          <div 
            className="absolute inset-0 pointer-events-none z-40 opacity-30 mix-blend-color-dodge transition-opacity duration-700 group-hover:opacity-50"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, #ff0000 0%, #0000ff 25%, #ff0000 50%, #0000ff 75%, #ff0000 100%)`,
              filter: "blur(40px)",
              opacity: archetype.rarity === "Holo Rare" ? 0.4 : holographicIntensity[archetype.rarity],
            }}
          />

          {/* Header Badge */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Archetype</span>
              <span className="text-xs font-bold uppercase tracking-widest">{archetype.discipline}</span>
            </div>
            <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] font-black uppercase tracking-tighter">
              {archetype.rarity}
            </div>
          </div>

          {/* Center Visual (Abstract) */}
          <div className="flex-1 flex items-center justify-center relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-b from-red-600/10 to-transparent rounded-3xl" />
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full border-2 border-red-500/20 flex items-center justify-center relative z-10"
            >
               <ShieldCheck className="w-16 h-16 text-red-500/40" />
               <div className="absolute inset-0 animate-pulse bg-red-600/5 blur-3xl rounded-full" />
            </motion.div>
          </div>

          {/* Title Area */}
          <div className="space-y-2 mb-6">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none drop-shadow-lg text-white">
              {archetype.title}
            </h2>
            <div className="h-0.5 w-12 bg-red-600" />
          </div>

          {/* Description Area */}
          <p className="text-zinc-300 text-xs leading-relaxed font-medium mb-6 line-clamp-3">
            {archetype.narrative.paralympic}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-auto">
            {archetype.stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-2 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-500 mb-0.5">{stat.label}</span>
                <span className="text-sm font-black tabular-nums text-white">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800/50">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{archetype.era}</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
            </div>
          </div>
        </div>

        {/* Back Face (Olympic) */}
        <div 
          className={cn(
            "absolute inset-0 backface-hidden rounded-[2.5rem] bg-zinc-950 border-[3px] shadow-2xl overflow-hidden flex flex-col p-8 transition-colors duration-500",
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
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Archetype</span>
              <span className="text-xs font-bold uppercase tracking-widest">{archetype.discipline}</span>
            </div>
            <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] font-black uppercase tracking-tighter">
              {archetype.rarity}
            </div>
          </div>

          {/* Center Visual (Abstract) */}
          <div className="flex-1 flex items-center justify-center relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent rounded-3xl" />
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full border-2 border-blue-500/20 flex items-center justify-center relative z-10"
            >
               <Star className="w-16 h-16 text-blue-500/40" />
               <div className="absolute inset-0 animate-pulse bg-blue-600/5 blur-3xl rounded-full" />
            </motion.div>
          </div>

          {/* Title Area */}
          <div className="space-y-2 mb-6">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none drop-shadow-lg text-white">
              {archetype.title}
            </h2>
            <div className="h-0.5 w-12 bg-blue-600" />
          </div>

          {/* Description Area */}
          <p className="text-zinc-300 text-xs leading-relaxed font-medium mb-6 line-clamp-3">
            {archetype.narrative.olympic}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-auto">
            {archetype.stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-2 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-500 mb-0.5">{stat.label}</span>
                <span className="text-sm font-black tabular-nums text-white">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800/50">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{archetype.era}</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
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
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tighter sm:text-6xl uppercase italic">
            {archetype ? "Your Identity" : "Holo-Type"}
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
            {archetype 
              ? "Your historical Team USA alignment has been identified." 
              : "Describe how you move through your day to discover your Team USA athlete archetype."}
          </p>
        </div>

        {!archetype ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {loading ? (
              <div className="flex flex-col items-center space-y-8">
                <div className="w-[350px] h-[490px] rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800 animate-pulse-slow flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-zinc-800" />
                  <div className="space-y-3 w-full">
                    <div className="h-4 bg-zinc-800 rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-zinc-800 rounded w-1/2 mx-auto" />
                  </div>
                  <div className="flex-1" />
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <div className="h-10 bg-zinc-800 rounded-xl" />
                    <div className="h-10 bg-zinc-800 rounded-xl" />
                    <div className="h-10 bg-zinc-800 rounded-xl" />
                  </div>
                </div>
                <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
                  Analyzing Historical Alignment...
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <label
                    htmlFor="userInput"
                    className="block text-xs font-black uppercase tracking-[0.3em] text-zinc-500 text-center"
                  >
                    Personal Identity Input
                  </label>
                  <textarea
                    id="userInput"
                    required
                    rows={5}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all text-zinc-100 resize-none text-lg leading-relaxed placeholder:text-zinc-600 shadow-inner"
                    placeholder="Describe your day. Do you sprint or pace yourself? Do you work with your hands or your mind? Are you a solo performer or a team player?"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !userInput.trim()}
                  className="w-full h-16 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)] active:scale-[0.98]"
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
                className="w-full h-14 bg-zinc-100 text-zinc-950 font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl active:scale-95"
              >
                Save Collectible Card
              </button>
              <button
                onClick={handleReset}
                className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:text-zinc-300 transition-colors flex items-center gap-2 group border-b border-transparent hover:border-zinc-700 pb-1"
              >
                <RotateCcw className="w-3 h-3 group-hover:rotate-[-45deg] transition-transform" />
                Find New Alignment
              </button>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 text-center font-bold text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
