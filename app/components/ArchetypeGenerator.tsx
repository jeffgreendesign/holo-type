"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, type MotionValue } from "motion/react";
import { 
  RotateCcw, 
  Zap, 
  Timer, 
  Users, 
  Wrench, 
  Mountain, 
  Shuffle,
  Clipboard,
  Share2
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LoadingScanner } from "./LoadingScanner";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PRESETS = [
  {
    icon: Zap,
    label: "Morning Sprinter",
    text: "Fast decisions, high energy, first one done.",
  },
  {
    icon: Timer,
    label: "Steady Pacer",
    text: "Consistent momentum over long durations.",
  },
  {
    icon: Users,
    label: "Team Captain",
    text: "Organizing people and reading the room.",
  },
  {
    icon: Wrench,
    label: "Precision Craftsman",
    text: "Meticulous detail and manual craft.",
  },
  {
    icon: Mountain,
    label: "Endurance Runner",
    text: "Patience is the edge. Outlasting all.",
  },
  {
    icon: Shuffle,
    label: "Adaptive Strategist",
    text: "Reading the situation and improvising.",
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
      className="relative w-28 h-28 flex items-center justify-center"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
        <circle cx="50" cy="50" r="22.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-5" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
        <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
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
        {stats.map((stat, i) => {
          const angle = (i * 90) * (Math.PI / 180);
          const r = (stat.value / 100) * 45;
          const x = 50 + r * Math.cos(angle);
          const y = 50 + r * Math.sin(angle);
          return <circle key={i} cx={x} cy={y} r="1.5" fill={color} />;
        })}
      </svg>
      <div className="absolute inset-0 blur-2xl opacity-20 rounded-full animate-pulse" style={{ backgroundColor: color }} />
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
  return <span className="text-xl font-mono font-bold tabular-nums leading-none">{count}</span>;
}

function CardContent({ archetype, side, glareX, glareY, mouseX, mouseY }: { archetype: Archetype, side: "olympic" | "paralympic", glareX: MotionValue<number>, glareY: MotionValue<number>, mouseX: MotionValue<number>, mouseY: MotionValue<number> }) {
  const accentColor = side === "paralympic" ? "var(--accent-red)" : "var(--accent-navy)";
  
  const glareBackground = useTransform([glareX, glareY], (values: number[]) => `radial-gradient(circle at ${values[0]}% ${values[1]}%, rgba(125, 249, 255, 0.4), transparent 60%)`);
  const dodgeBackground = useTransform([mouseX, mouseY], (values: number[]) => `conic-gradient(from ${values[0] * 90}deg at 50% 50%, rgba(255, 111, 177, 0.15), rgba(125, 249, 255, 0.15), rgba(215, 255, 79, 0.15), rgba(255, 111, 177, 0.15))`);
  
  return (
    <div className="relative h-full flex flex-col">
      <motion.div 
        className="absolute -inset-5 z-50 pointer-events-none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.2, times: [0, 0.1, 0.8, 1], ease: "easeInOut" }}
      >
        <svg width="100%" height="100%" viewBox="0 0 320 448" preserveAspectRatio="none" className="overflow-visible">
          <motion.path d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z" fill="none" stroke="#7df9ff" strokeWidth="2" />
        </svg>
      </motion.div>

      <div className="flex justify-between items-start mb-2">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-text-tertiary">ARCHETYPE</span>
          <div className="text-[10px] font-mono font-bold text-text-secondary px-2 py-0.5 border border-border-subtle bg-bg-card-elevated/50 uppercase">{side}</div>
        </div>
        <div className="text-white text-[10px] font-mono font-bold px-3 py-1 tracking-widest" style={{ backgroundColor: archetype.rarity === "Holo Rare" ? "#B31942" : "#C5972C" }}>
          {archetype.rarity.toUpperCase()}
        </div>
      </div>
{/* Art Area */}
<div className="relative w-full flex-1 min-h-[140px] mb-5 bg-bg-main border border-border-subtle flex items-center justify-center overflow-hidden shadow-inner group-hover:bg-bg-card transition-colors duration-500">
        <RadarVisual stats={archetype.stats} color={accentColor} />
        <div className="absolute top-2 left-2 text-[8px] font-mono text-text-tertiary">Vector Analysis</div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="w-full h-[1px] bg-blue-500/30 absolute top-0 left-0 animate-[cardSweep_4s_linear_infinite]" />
        </div>
      </div>
{/* Title */}
<div className="flex flex-col justify-center mb-5">
  <h2 className="text-3xl font-display font-bold leading-none tracking-tight text-text-main uppercase italic">{archetype.title}</h2>
  <div className="w-10 h-[3px] mt-3" style={{ backgroundColor: accentColor }} />
</div>
{/* Stats Grid */}
<div className="grid grid-cols-3 gap-px bg-text-main/10 border border-border-subtle overflow-hidden">
  {archetype.stats.map((stat, i) => (
    <div key={i} className="bg-bg-card p-1.5 flex flex-col">
            <span className="text-[9px] font-mono font-bold tracking-widest text-text-tertiary mb-1 truncate uppercase">{stat.label}</span>
            <StatCounter value={stat.value} delay={0.8 + (i * 0.1)} />
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-between items-end">
        <div className="space-y-0.5">
          <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-text-tertiary uppercase">ERA ALIGNMENT</span>
          <div className="text-[10px] font-mono font-bold text-text-main">{archetype.era}</div>
        </div>
        <div className="text-[9px] font-mono text-text-tertiary font-bold tracking-widest">HT-X // VECTOR</div>
      </div>

      {(archetype.rarity === "Holo Rare" || archetype.rarity === "Rare") && (
        <>
          <motion.div className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: glareBackground }}
          />
          <motion.div className="absolute inset-0 pointer-events-none z-30 mix-blend-color-dodge opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: dodgeBackground }}
          />
        </>
      )}

      <style jsx global>{`
        @keyframes cardSweep {
          0% { transform: translateY(-10px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(200px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function HoloCard({ archetype, lens, setLens }: { archetype: Archetype, lens: "olympic" | "paralympic", setLens: (l: "olympic" | "paralympic") => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], lens === "paralympic" ? [-10, 10] : [10, -10]);
  const glareX = useSpring(useTransform(mouseXSpring, [-0.5, 0.5], [20, 80]), springConfig);
  const glareY = useSpring(useTransform(mouseYSpring, [-0.5, 0.5], [20, 80]), springConfig);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => { x.set(0); y.set(0); };

  const rarityColor = { "Common": "rgba(12, 25, 50, 0.12)", "Uncommon": "#8B6914", "Rare": "#C5972C", "Holo Rare": "#B31942" }[archetype.rarity];

  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="perspective-[2000px] w-full flex flex-col items-center gap-6 font-body relative z-20"
    >
      <div className="flex bg-bg-card-elevated/80 p-1 rounded-full border border-border-subtle backdrop-blur-md shadow-xl scale-90 sm:scale-100">
        <button onClick={() => setLens("paralympic")} className={cn("px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all", lens === "paralympic" ? "bg-accent-red text-white shadow-lg" : "text-text-tertiary hover:text-text-main")}>Paralympic Lens</button>
        <button onClick={() => setLens("olympic")} className={cn("px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all", lens === "olympic" ? "bg-accent-navy text-white shadow-lg" : "text-text-tertiary hover:text-text-main")}>Olympic Lens</button>
      </div>

      <motion.div ref={cardRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}
        animate={{ rotateY: lens === "olympic" ? 180 : 0 }} transition={{ rotateY: { type: "spring", stiffness: 40, damping: 15, mass: 2 } }}
        style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
        className="relative w-[300px] sm:w-[320px] h-[420px] sm:h-[448px] cursor-pointer group"
      >
        <div className="absolute inset-0 z-0">
          <svg width="100%" height="100%" viewBox="0 0 320 448" preserveAspectRatio="none" fill="none" className="overflow-visible">
            <defs><clipPath id="cardClip"><path d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z" /></clipPath></defs>
            <path d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z" fill="currentColor" className="text-bg-card shadow-2xl" />
            <path d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z" stroke={rarityColor} strokeOpacity="0.2" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute inset-0 preserve-3d">
          <div className="absolute inset-0 backface-hidden flex flex-col p-5" style={{ transform: "rotateY(0deg) translateZ(1px)", clipPath: "url(#cardClip)" }}>
            <CardContent archetype={archetype} side="paralympic" glareX={glareX} glareY={glareY} mouseX={mouseXSpring} mouseY={mouseYSpring} />
          </div>
          <div className="absolute inset-0 backface-hidden flex flex-col p-5 bg-bg-card" style={{ transform: "rotateY(180deg) translateZ(1px)", clipPath: "url(#cardClip)" }}>
            <CardContent archetype={archetype} side="olympic" glareX={glareX} glareY={glareY} mouseX={mouseXSpring} mouseY={mouseYSpring} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ArchetypeGenerator() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [error, setError] = useState("");
  const [lens, setLens] = useState<"olympic" | "paralympic">("paralympic");

  const handleReset = () => { setUserInput(""); setLoading(false); setArchetype(null); setError(""); setLens("paralympic"); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(""); setArchetype(null);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userInput }) });
      if (!res.ok) throw new Error("Diagnostic failed");
      const data = await res.json(); setArchetype(data);
    } catch (err: unknown) { 
      setError(err instanceof Error ? err.message : "An unexpected error occurred"); 
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen text-text-main bg-bg-main flex flex-col items-center justify-center px-6 py-[4vh] font-mono relative z-10 transition-colors duration-500">
      {/* Immersive Loading Overlay */}
      <AnimatePresence>{loading && <LoadingScanner />}</AnimatePresence>

      <div className={cn("w-full max-w-5xl flex flex-col items-center transition-all duration-700", loading && "opacity-0 scale-95 pointer-events-none")}>
        <div className="text-center space-y-2 mb-[6vh]">
          <h1 className="text-5xl md:text-7xl font-display font-bold italic tracking-tighter uppercase leading-none text-text-main">
            {archetype ? "CLASSIFICATION COMPLETE" : "HOLO-TYPE"}
          </h1>
          <p className="text-text-tertiary text-[10px] md:text-[12px] font-bold tracking-[0.4em] uppercase">
            {archetype ? "Historical alignment vector locked // transmission successful" : "HISTORICAL ALIGNMENT INSTRUMENT // VER 2.5.0"}
          </p>
        </div>

        {!archetype ? (
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-[6vh]">
            <div className="w-full space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {PRESETS.map((preset, i) => (
                  <button key={i} type="button" onClick={() => setUserInput(preset.text)}
                    className="group relative w-full aspect-[3/2.8] bg-bg-card border border-border-subtle shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left overflow-hidden"
                    style={{ clipPath: "polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))" }}
                  >
                    <preset.icon className="absolute bottom-2 right-2 w-20 h-20 opacity-[0.05] transition-transform duration-500 group-hover:scale-110" />
                                        <div className="relative h-full p-5 flex flex-col justify-between">
                                          <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-text-tertiary uppercase">PRESET 0{i+1}</span>
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-text-tertiary uppercase italic">ANALYSIS</span>
                                          </div>
                                          <div className="flex flex-col">
                                            <h3 className="text-lg md:text-xl font-display font-bold leading-tight uppercase italic transition-all group-hover:text-accent-red text-text-main">
                          <span className="relative inline-block">{preset.label}
                            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ textShadow: '-1px 0 rgba(200, 16, 74, 0.4), 1px 0 rgba(28, 76, 255, 0.4)' }}>{preset.label}</span>
                          </span>
                        </h3>
                        <div className="w-8 h-[2px] bg-text-main/10 mt-2 group-hover:bg-accent-red group-hover:w-12 transition-all" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border-subtle"></div>
                <span className="flex-shrink mx-6 text-[11px] font-bold uppercase tracking-[0.5em] text-text-tertiary opacity-40">OR DIRECT ENTRY</span>
                <div className="flex-grow border-t border-border-subtle"></div>
              </div>

              <div className="w-full max-w-2xl mx-auto space-y-4">
                <label htmlFor="userInput" className="block text-[11px] font-bold uppercase tracking-[0.4em] text-text-secondary text-center uppercase">INPUT DAILY MOVEMENT PATTERN</label>
                <div className="relative">
                  <textarea id="userInput" required rows={2} className="w-full bg-bg-card-elevated/50 border border-border-subtle p-5 focus:outline-none focus:ring-1 focus:ring-accent-red/30 transition-all resize-none text-base leading-relaxed placeholder:opacity-20 text-text-main font-bold uppercase"
                    placeholder="DESCRIBE YOUR TRAJECTORY..." value={userInput} onChange={(e) => setUserInput(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-5 opacity-20">
                    <svg width="80" height="16" viewBox="0 0 80 16"><path d="M0 8 Q 10 0, 20 8 T 40 8 T 60 8 T 80 8" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[wave_3s_linear_infinite]" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading || !userInput.trim()} className="w-full max-w-md h-16 bg-text-main text-bg-main font-bold uppercase tracking-[0.4em] transition-all hover:bg-accent-red hover:text-white active:scale-[0.98] group relative overflow-hidden text-sm">
              <span className="relative z-10">RUN HISTORICAL ALIGNMENT</span>
              <div className="absolute inset-0 bg-accent-red translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </form>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="flex flex-col items-center space-y-12 pb-12 w-full">
            <HoloCard archetype={archetype} lens={lens} setLens={setLens} />
            <div className="w-full max-w-xl space-y-10">
              <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <p className="text-text-main text-2xl leading-relaxed font-bold uppercase italic opacity-90">{lens === "paralympic" ? archetype.narrative.paralympic : archetype.narrative.olympic}</p>
                <div className="inline-flex items-center gap-4 px-5 py-2.5 bg-bg-card border border-border-subtle rounded-full">
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-text-tertiary">Archival Context Locked</span>
                  <span className="text-sm font-display font-bold uppercase italic text-accent-red">{archetype.era}</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button className="w-full h-14 bg-text-main text-bg-main font-bold uppercase tracking-[0.4em] transition-all hover:bg-accent-red hover:text-white active:scale-[0.98] text-xs shadow-2xl">DOWNLOAD ARCHIVAL LOG</button>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }} className="h-12 flex items-center justify-center gap-3 bg-bg-card border border-border-subtle text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-text-main transition-all active:scale-[0.95]">
                    <Clipboard className="w-4 h-4" />COPY VECTOR</button>
                  <button onClick={() => { if (navigator.share) navigator.share({ title: 'My Holo-Type Archetype', text: `I discovered my Team USA archetype: ${archetype.title}`, url: window.location.href }); }} className="h-12 flex items-center justify-center gap-3 bg-bg-card border border-border-subtle text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-text-main transition-all active:scale-[0.95]">
                    <Share2 className="w-4 h-4" />TRANSMIT</button>
                </div>
                <button onClick={handleReset} className="mt-8 self-center text-text-tertiary font-bold uppercase tracking-[0.3em] text-[10px] hover:text-accent-red transition-colors flex items-center gap-3 group">
                  <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />RESET DIAGNOSTIC INSTRUMENT</button>
              </div>
            </div>
          </motion.div>
        )}

        {error && <div className="p-5 bg-accent-red/10 border border-accent-red/20 rounded-xl text-accent-red text-center font-bold text-sm mt-12">{error}</div>}
      </div>
    </div>
  );
}
