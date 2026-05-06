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
  narrative: string;
  classification: "Olympic" | "Paralympic" | "Unified";
}

function HoloCard({ archetype, athleteName, sport }: { archetype: Archetype; athleteName: string; sport: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="perspective-1000 w-full flex justify-center py-12"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-[380px] h-[520px] rounded-[2rem] bg-zinc-950 border-[3px] border-[#D4AF37]/30 shadow-[0_0_50px_-12px_rgba(212,175,55,0.3)] group cursor-pointer overflow-hidden"
      >
        {/* Gold Frame Inner Glow */}
        <div className="absolute inset-0 rounded-[2rem] border-[1px] border-[#D4AF37]/50 pointer-events-none" />
        
        {/* Holographic "Patriotic Foil" Overlay */}
        <motion.div 
          style={{
            background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.15) 0%, transparent 60%), 
                         linear-gradient(135deg, rgba(212,175,55,0.1) 0%, transparent 50%, rgba(0,40,104,0.1) 100%)`,
          }}
          className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
        />

        {/* Shimmer Sweep Animation */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.1)_45%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.1)_55%,transparent_60%)] bg-[length:200%_100%] animate-[shimmer_6s_infinite] opacity-30" />

        {/* Patriotic Iridescence (Red/White/Blue) */}
        <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_50%,_oklch(70%_0.15_20)_0%,_oklch(95%_0.02_200)_50%,_oklch(60%_0.15_250)_100%)] mix-blend-soft-light" />

        {/* Content Container */}
        <div className="relative z-30 h-full p-8 flex flex-col justify-between items-center text-center">
          {/* Header: Team USA Logo / Shield Placeholder */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#BA0C2F] to-[#002868] p-0.5 shadow-lg">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
                <Star className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-[#BA0C2F]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Team USA Analyst</span>
              <span className="h-px w-8 bg-[#002868]" />
            </div>
          </div>

          {/* Body: Archetype Title & Narrative */}
          <div className="space-y-6 py-4">
            <div className="space-y-1">
              <motion.h2 
                style={{ transform: "translateZ(50px)" }}
                className="text-4xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]"
              >
                {archetype.title}
              </motion.h2>
              <div className="flex items-center justify-center gap-2">
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border",
                  archetype.classification === "Olympic" ? "bg-blue-500/10 border-blue-500/50 text-blue-400" :
                  archetype.classification === "Paralympic" ? "bg-red-500/10 border-red-500/50 text-red-400" :
                  "bg-gold-500/10 border-[#D4AF37]/50 text-[#D4AF37]"
                )}>
                  {archetype.classification} Discipline
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 -top-2 opacity-20"><ShieldCheck className="w-8 h-8 text-zinc-500" /></div>
              <p className="text-zinc-200 text-lg leading-tight font-medium italic relative z-10">
                &quot;{archetype.narrative}&quot;
              </p>
            </div>
          </div>

          {/* Footer: Athlete Info & Disclaimer */}
          <div className="w-full space-y-4">
            <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent w-full" />
            <div className="flex flex-col items-center space-y-1">
              <p className="text-white font-bold tracking-wide text-xl uppercase">{athleteName}</p>
              <p className="text-zinc-500 text-xs font-semibold tracking-[0.2em] uppercase">{sport}</p>
            </div>
            
            <div className="flex items-center justify-center gap-1.5 text-[8px] text-zinc-600 font-bold uppercase tracking-wider bg-zinc-900/50 py-2 rounded-lg border border-white/5">
              <Info className="w-2.5 h-2.5" />
              <span>120 Years of Historical Insights via Gemini AI</span>
            </div>
          </div>
        </div>

        {/* Card Micro-Texture Overlay */}
        <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [error, setError] = useState("");

  const handleReset = () => {
    setArchetype(null);
    setError("");
  };

  const handleRandomize = () => {
    const names = ["Elena Rodriguez", "Marcus Chen", "Sarah Jenkins", "Liam O'Connor", "Yuki Tanaka", "Amara Okafor", "Jordan Vance"];
    const sports = ["Volleyball", "Basketball", "Swimming", "Track & Field", "Fencing", "Gymnastics", "Rowing"];
    const bios = [
      "A dedicated athlete with a passion for team sports and a competitive spirit. Known for leading their team to victory in the national championships.",
      "Multiple-time gold medalist known for their incredible speed and agility on the track. They have broken several world records in the last year.",
      "A versatile player who excels in both defensive and offensive maneuvers. Their strategic thinking makes them a formidable opponent in any match.",
      "A rising star in the international circuit, making waves with their unique technique and unwavering focus during high-pressure situations.",
      "Veteran athlete with over a decade of experience in top-tier competitions. They are a mentor to younger athletes and a symbol of perseverance.",
      "A powerhouse in the pool, specialized in butterfly and freestyle. Their explosive starts and powerful turns are a masterclass in technique.",
      "Technically gifted fencer with a reputation for lightning-fast parries and precise lunges. A consistent top-three finisher in global tournaments."
    ];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomSport = sports[Math.floor(Math.random() * sports.length)];
    const randomBio = bios[Math.floor(Math.random() * bios.length)];

    setFormData({
      name: randomName,
      sport: randomSport,
      bio: randomBio,
    });
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
        body: JSON.stringify(formData),
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
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            {archetype ? "Your Archetype" : "Holo-Type"}
          </h1>
          <p className="text-zinc-400 text-lg">
            {archetype ? "Your historical athlete profile is ready." : "Generate your athlete archetype card."}
          </p>
        </div>

        {!archetype ? (
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-2xl space-y-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">Athlete Details</h2>
              <button
                type="button"
                onClick={handleRandomize}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors group px-3 py-1.5 rounded-md bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800"
              >
                <Shuffle className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                Randomize
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-400 mb-1"
                >
                  Athlete Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-zinc-100"
                  placeholder="e.g. Elena Rodriguez"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="sport"
                  className="block text-sm font-medium text-zinc-400 mb-1"
                >
                  Sport
                </label>
                <input
                  id="sport"
                  type="text"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-zinc-100"
                  placeholder="e.g. Volleyball"
                  value={formData.sport}
                  onChange={(e) =>
                    setFormData({ ...formData, sport: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-zinc-400 mb-1"
                >
                  Athlete Bio
                </label>
                <textarea
                  id="bio"
                  required
                  rows={4}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-zinc-100 resize-none"
                  placeholder="Describe their background, strengths, and achievements..."
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-zinc-50 text-zinc-950 font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-zinc-950"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Archetype"
              )}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <HoloCard
              archetype={archetype}
              athleteName={formData.name}
              sport={formData.sport}
            />
            <button
              onClick={handleReset}
              className="w-full h-12 bg-zinc-900 border border-zinc-800 text-zinc-400 font-semibold rounded-lg hover:bg-zinc-800 hover:text-zinc-100 transition-all flex items-center justify-center gap-2 group"
            >
              <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
              Generate Another
            </button>
          </motion.div>
        )}

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
