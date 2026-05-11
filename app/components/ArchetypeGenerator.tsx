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

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useReducedMotion, type MotionValue } from "motion/react";
import { 
  RotateCcw, 
  Zap, 
  Timer, 
  Users, 
  Wrench, 
  Mountain,
  Shuffle,
  Clipboard,
  Check
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toCanvas } from "html-to-image";
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import { LoadingScanner } from "./LoadingScanner";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Encodes a string to Base64 with UTF-8 support.
 */
function toBase64(str: string) {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binString);
}

/**
 * Decodes a Base64 string to a UTF-8 string.
 */
function fromBase64(base64: string) {
  try {
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (e) {
    // Fallback to standard atob for legacy compatibility if possible
    try {
      return atob(base64);
    } catch (err) {
      console.error("Base64 decoding failed:", err);
      return "";
    }
  }
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

export interface Archetype {
  title: string;
  narrative: {
    olympic: string;
    paralympic: string;
  };
  rarity: "Common" | "Uncommon" | "Rare" | "Holo Rare";
  stats: Record<string, number>;
  era: string;
  discipline: "Olympic" | "Paralympic" | "Unified";
}

export function RadarVisual({ stats, color, isSmall = false }: { stats: Record<string, number>, color: string, isSmall?: boolean }) {
  const statEntries = Object.entries(stats);
  const points = statEntries.map(([_, value], i) => {
    const angle = (i * 90) * (Math.PI / 180);
    const r = (value / 100) * 45;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  return (
    <motion.div 
      data-component="RadarVisual"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className={cn("relative flex items-center justify-center", isSmall ? "w-16 h-16" : "w-28 h-28")}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {!isSmall && (
          <>
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
            <circle cx="50" cy="50" r="22.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-5" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
          </>
        )}
        <motion.polygon
          points={points}
          fill={color}
          fillOpacity={isSmall ? "0.6" : "0.2"}
          stroke={color}
          strokeWidth={isSmall ? "4" : "1.5"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {statEntries.map(([_, value], i) => {
          const angle = (i * 90) * (Math.PI / 180);
          const r = (value / 100) * 45;
          const x = 50 + r * Math.cos(angle);
          const y = 50 + r * Math.sin(angle);
          return <circle key={i} cx={x} cy={y} r={isSmall ? "3" : "1.5"} fill={color} />;
        })}
      </svg>
      <div className={cn("absolute inset-0 blur-2xl opacity-20 rounded-full animate-pulse", isSmall ? "hidden" : "")} style={{ backgroundColor: color }} />
    </motion.div>
  );
}

export function StatCounter({ value, delay, className }: { value: number, delay: number, className?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const end = value;
      const duration = 1000;
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
  return <span className={cn("font-display font-bold leading-none", className)}>{count}</span>;
}

export function FittedText({ 
  text, 
  className, 
  tag: Tag = "span",
  center = false
}: { 
  text: string, 
  className?: string, 
  tag?: "h2" | "span" | "div",
  center?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    setScale(1);
    const request = requestAnimationFrame(() => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const textWidth = textRef.current.scrollWidth;
        if (textWidth > containerWidth) {
          setScale(containerWidth / textWidth);
        }
      }
    });
    return () => cancelAnimationFrame(request);
  }, [text]);

  return (
    <div ref={containerRef} className={cn("w-full overflow-hidden flex items-center", center && "justify-center")}>
      <Tag
        ref={textRef as any}
        style={{ transform: `scale(${scale})`, transformOrigin: center ? "center center" : "left center" }}
        className={cn("whitespace-nowrap transition-transform duration-300 ease-out", className)}
      >
        {text}
      </Tag>
    </div>
  );
}

export function FittedTitle(props: { text: string, className?: string, center?: boolean }) {
  return <FittedText {...props} tag="h2" />;
}

export function FittedLabel(props: { text: string, className?: string, center?: boolean }) {
  return <FittedText {...props} tag="span" />;
}

export function CardContent({ archetype, side, glareX, glareY, mouseX, mouseY, variant = "standard" }: { archetype: Archetype, side: "olympic" | "paralympic", glareX: MotionValue<number>, glareY: MotionValue<number>, mouseX: MotionValue<number>, mouseY: MotionValue<number>, variant?: "standard" | "poster" }) {
  const accentColor = side === "paralympic" ? "var(--accent-red)" : "var(--accent-navy)";
  
  // High-intensity glare and foil mapping
  const glareBackground = useTransform([glareX, glareY], (values: number[]) => `radial-gradient(circle at ${values[0]}% ${values[1]}%, rgba(255, 255, 255, 0.9), transparent 50%)`);
  const foilBackground = useTransform([mouseX, mouseY], (values: number[]) => `conic-gradient(from ${values[0] * 360}deg at 50% 50%, rgba(255, 0, 128, 0.4), rgba(0, 255, 255, 0.4), rgba(255, 255, 0, 0.4), rgba(255, 0, 128, 0.4))`);
  
  const isPoster = variant === "poster";
  const statCount = Object.keys(archetype.stats).length;

  return (
    <div data-component="CardContent" className={cn("relative h-full flex flex-col overflow-hidden", isPoster ? "w-[640px] h-[896px] p-10" : "p-5")}>
      {/* 1. FOIL BASE LAYER (The Metallic Look) */}
      <div className={cn(
        "absolute inset-0 mix-blend-overlay opacity-60 dark:opacity-30",
        archetype.rarity === "Holo Rare" ? "bg-gold-holo" : "bg-silver-holo"
      )} />
      
      {/* 2. COLOR FOIL (The Rainbow/Shininess) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-25 dark:opacity-15 group-hover:opacity-50 dark:group-hover:opacity-30 transition-opacity" 
        style={{ background: foilBackground }} 
      />

      {/* 3. LIGHT GLARE (The Reflection) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-40 dark:opacity-20 group-hover:opacity-80 dark:group-hover:opacity-40 transition-opacity" 
        style={{ background: glareBackground }} 
      />

      <header data-part="metadata" className={cn("relative flex justify-between items-start", isPoster ? "mb-6" : "mb-2")}>
        <div className="space-y-1">
          <span className={cn("font-mono font-bold tracking-[0.3em] text-text-tertiary", isPoster ? "text-sm" : "text-[10px]")}>ARCHETYPE</span>
          <div className={cn("font-mono font-bold text-text-main border border-border-subtle bg-bg-card/50 uppercase", isPoster ? "text-sm px-4 py-1" : "text-[10px] px-2 py-0.5")}>{side}</div>
        </div>
        <div className={cn("text-white font-mono font-bold tracking-widest shadow-sm", isPoster ? "text-sm px-6 py-2" : "text-[10px] px-3 py-1")} style={{ backgroundColor: archetype.rarity === "Holo Rare" ? "#B31942" : "#C5972C" }}>
          {archetype.rarity.toUpperCase()}
        </div>
      </header>

      {/* Art Area */}
      <figure data-part="visual-container" className={cn("relative w-full bg-bg-card-elevated/50 border border-border-subtle flex items-center justify-center overflow-hidden shadow-inner group-hover:bg-bg-card/40 transition-colors duration-500 backdrop-blur-[2px]", isPoster ? "flex-none h-[320px] mb-10" : "flex-1 min-h-[120px] mb-4")}>
        <div className={isPoster ? "scale-150" : ""}>
          <RadarVisual stats={archetype.stats} color={accentColor} />
        </div>
        <div className={cn("absolute top-2 left-2 font-mono text-text-tertiary", isPoster ? "text-[12px]" : "text-[8px]")}>Vector Analysis</div>
      </figure>

      {/* Title */}
      <div data-part="title-area" className={cn("relative flex flex-col justify-center", isPoster ? "mb-10" : "mb-4")}>
        <FittedTitle 
          text={archetype.title} 
          className={cn("font-display font-bold leading-none tracking-tight text-text-main uppercase italic", isPoster ? "text-6xl" : "text-3xl")} 
        />
        <div className={cn("mt-4 shadow-sm", isPoster ? "w-20 h-[6px]" : "w-10 h-[3px]")} style={{ backgroundColor: accentColor }} />
      </div>

      {/* Stats Grid */}
      <section data-part="stats-grid" className={cn(
        "relative grid gap-px bg-border-subtle/20 border border-border-subtle/30 overflow-hidden rounded-sm",
        statCount > 3 ? "grid-cols-4" : "grid-cols-3"
      )}>
        {Object.entries(archetype.stats).map(([label, value], i) => {
          const formattedLabel = label
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase());
          
          return (
            <div key={i} className={cn("bg-bg-card/10 backdrop-blur-[1px] flex flex-col items-center", isPoster ? "p-8 min-h-[180px]" : "p-3.5 min-h-[105px]")}>
              <FittedLabel 
                text={formattedLabel} 
                center
                className={cn("font-mono font-bold tracking-[0.12em] text-text-tertiary uppercase", isPoster ? "text-[12px]" : "text-[9px]")} 
              />
              <div className="mt-auto">
                <StatCounter value={value} delay={0.8 + (i * 0.1)} className={cn("text-text-main", isPoster ? "text-7xl" : "text-5xl")} />
              </div>
            </div>
          );
        })}
      </section>

      <footer data-part="card-footer" className={cn("relative flex justify-between items-end", isPoster ? "mt-10" : "mt-auto pt-4")}>
        <div className="space-y-1">
          <span className={cn("font-mono font-bold tracking-[0.2em] text-text-tertiary uppercase", isPoster ? "text-[12px]" : "text-[9px]")}>ERA ALIGNMENT</span>
          <FittedLabel 
            text={archetype.era} 
            className={cn("font-mono font-bold text-text-secondary", isPoster ? "text-sm" : "text-[10px]")} 
          />
        </div>
        <div className={cn("font-mono text-text-tertiary font-bold tracking-widest", isPoster ? "text-[12px]" : "text-[9px]")}>HT-X // VECTOR</div>
      </footer>
    </div>
  );
}

function CardBackground({ rarity, rarityColor }: { rarity: string, rarityColor: string }) {
  return (
    <div className="absolute inset-0 z-0">
      <svg width="100%" height="100%" viewBox="0 0 320 448" preserveAspectRatio="none" fill="none" className="overflow-visible">
        <defs><clipPath id="cardClip"><path d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z" /></clipPath></defs>
        <path d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z" fill="var(--bg-card-elevated)" className="shadow-2xl" />
        <path d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z" stroke={rarityColor} strokeOpacity={rarity === "Common" ? "0.4" : "0.8"} strokeWidth={rarity === "Common" ? "1" : "2"} />
      </svg>
    </div>
  );
}

export function HoloCard({ 
  archetype, 
  lens, 
  setLens, 
  variant = "standard",
  isSpinning = false,
  isPixelated = false,
  manualTime,
  isSprite = false
}: { 
  archetype: Archetype, 
  lens: "olympic" | "paralympic", 
  setLens: (l: "olympic" | "paralympic") => void, 
  variant?: "standard" | "poster",
  isSpinning?: boolean,
  isPixelated?: boolean,
  manualTime?: number,
  isSprite?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springConfig = { damping: 40, stiffness: 120, mass: 1.2 };
  const mouseXSpring = useSpring(pointerX, springConfig);
  const mouseYSpring = useSpring(pointerY, springConfig);
  const spinX = useMotionValue(0);

  const isPoster = variant === "poster";

  // Idle "breathing" animation or steady spin
  useEffect(() => {
    if (shouldReduceMotion || isPoster) return;
    
    let frameId: number;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = manualTime !== undefined ? manualTime : (Date.now() - startTime);
      
      if (isSpinning || manualTime !== undefined) {
        // Continuous 360 rotation for capture
        const progress = (elapsed / 4000) % 1;
        spinX.set(progress);
        pointerY.set(Math.cos(elapsed / 2000) * 0.05);
      } else {
        // Reset spin if not active
        if (spinX.get() !== 0) spinX.set(0);
        
        // Idle animation: Only apply if mouse is at center
        if (pointerX.get() === 0 && pointerY.get() === 0) {
          const idleX = Math.sin(elapsed / 2000) * 0.05;
          const idleY = Math.cos(elapsed / 2500) * 0.05;
          mouseXSpring.set(idleX);
          mouseYSpring.set(idleY);
        }
      }
      
      frameId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [shouldReduceMotion, pointerX, pointerY, mouseXSpring, mouseYSpring, spinX, isPoster, isSpinning, manualTime]);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [30, -30]);
  // When spinning or exporting, use spinX progress. Otherwise use mouseXSpring.
  const rotateY = useTransform(
    isSpinning || manualTime !== undefined ? spinX : mouseXSpring, 
    isSpinning || manualTime !== undefined ? [0, 1] : [-0.5, 0.5], 
    isSpinning || manualTime !== undefined ? [0, 360] : [-30, 30]
  );
  
  const transform = useTransform([rotateX, rotateY], ([rX, rY]) => `rotateX(${rX}deg) rotateY(${rY}deg)`);

  // Glare mapping: on the back side (olympic), the local X axis is inverted relative to the viewer.
  const glareXBase = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareXInverted = useTransform(mouseXSpring, [-0.5, 0.5], [100, 0]);
  const glareX = useSpring(useTransform(() => lens === "paralympic" ? glareXBase.get() : glareXInverted.get()), springConfig);
  const glareY = useSpring(useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]), springConfig);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current || isSpinning) return;
    const rect = cardRef.current.getBoundingClientRect();
    const newX = (e.clientX - rect.left) / rect.width - 0.5;
    const newY = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(newX);
    pointerY.set(newY);
  };

  const handlePointerLeave = () => { 
    if (isSpinning) return;
    pointerX.set(0); 
    pointerY.set(0); 
  };

  const rarityColor = { "Common": "rgba(148, 163, 184, 0.2)", "Uncommon": "#8B6914", "Rare": "#C5972C", "Holo Rare": "#B31942" }[archetype.rarity];

  const accentColor = lens === "paralympic" ? "var(--accent-red)" : "var(--accent-navy)";

  return (
    <motion.article 
      data-component="HoloCard"
      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "w-full flex flex-col items-center gap-10 font-body relative z-20 transition-all duration-300", 
        isPoster ? "scale-[1.6]" : "",
        isPixelated ? "pixelate-filter scale-125" : ""
      )}
      style={{ perspective: "1200px" }}
    >
      {/* SVG Filter for Pixelation: Using a visible but hidden container to ensure it's available for the filter call */}
      <div className="absolute inset-0 pointer-events-none opacity-0 overflow-hidden w-0 h-0">
        <svg xmlns="http://www.w3.org/2000/svg">
          <filter id="pixelate-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feFlood x="4" y="4" height="2" width="2" />
            <feComposite width="8" height="8" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
          </filter>
        </svg>
      </div>
      {/* Removed Lens Toggle from here to move it to a safer layout position in ArchetypeGenerator */}

      {/* TILT CONTAINER: Always stable relative to viewer */}
      <motion.div 
        ref={cardRef} 
        onPointerMove={handlePointerMove} 
        onPointerLeave={handlePointerLeave}
        style={{ 
          transformStyle: "preserve-3d", 
          transform,
          touchAction: "none",
          width: isSprite ? "128px" : undefined,
          height: isSprite ? "180px" : undefined
        }}
        className={cn(
          "relative cursor-pointer group",
          isSprite ? "" : "w-[300px] sm:w-[320px] h-[420px] sm:h-[448px]"
        )}
      >
        {/* FLIP CONTAINER */}
        <motion.div 
          animate={{ rotateY: (isSprite || lens === "paralympic") ? 0 : 180 }} 
          transition={{ rotateY: { type: "spring", stiffness: 45, damping: 14, mass: 1.5 } }}
          style={{ transformStyle: "preserve-3d", width: "100%", height: "100%" }}
        >
          {isSprite ? (
             <div className="absolute inset-0 bg-bg-card-elevated border-2 border-accent-red rounded-lg flex items-center justify-center overflow-hidden">
                <RadarVisual stats={archetype.stats} color={accentColor} isSmall />
             </div>
          ) : (
            <>
              {/* PARALYMPIC FACE (Front) */}
              <div className="absolute inset-0 backface-hidden" style={{ transform: "rotateY(0deg) translateZ(0.5px)" }}>
                <div className="absolute inset-0">
                  <CardBackground rarity={archetype.rarity} rarityColor={rarityColor} />
                </div>
                <div className="absolute inset-0" style={{ clipPath: "url(#cardClip)" }}>
                  <CardContent archetype={archetype} side="paralympic" glareX={glareX} glareY={glareY} mouseX={mouseXSpring} mouseY={mouseYSpring} variant={variant} />
                </div>
              </div>

              {/* OLYMPIC FACE (Back) */}
              <div className="absolute inset-0 backface-hidden" style={{ transform: "rotateY(180deg) translateZ(0.5px)" }}>
                <div className="absolute inset-0">
                  <CardBackground rarity={archetype.rarity} rarityColor={rarityColor} />
                </div>
                <div className="absolute inset-0" style={{ clipPath: "url(#cardClip)" }}>
                  <CardContent archetype={archetype} side="olympic" glareX={glareX} glareY={glareY} mouseX={mouseXSpring} mouseY={mouseYSpring} variant={variant} />
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

export default function ArchetypeGenerator() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [error, setError] = useState("");
  const [lens, setLens] = useState<"olympic" | "paralympic">("paralympic");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [vectorCopied, setVectorCopied] = useState(false);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isPixelated, setIsPixelated] = useState(false);
  const [isSprite, setIsSprite] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [manualTime, setManualTime] = useState<number | undefined>(undefined);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const captureGif = async () => {
    if (!cardContainerRef.current || !archetype) return;
    
    setIsCapturing(true);
    setCaptureProgress(0);
    
    const frames = 30; // 10fps for 3 seconds
    const interval = 3000 / frames;
    const gif = new GIFEncoder();
    
    // Target dimensions for the GIF file
    const gifWidth = isSprite ? 320 : 512;
    const gifHeight = isSprite ? 320 : 640;
    
    try {
      for (let i = 0; i < frames; i++) {
        setManualTime(i * interval);
        setCaptureProgress(Math.round(((i + 1) / frames) * 100));
        
        // Wait for render stabilization (Crucial for complex filters and 3D transforms)
        await new Promise(r => setTimeout(r, 250));
        
        // Use toCanvas with explicit pixel dimensions to prevent high-DPI scaling issues
        const canvas = await toCanvas(cardContainerRef.current, {
          width: gifWidth,
          height: gifHeight,
          backgroundColor: "transparent",
          style: {
            margin: "0",
            padding: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: `${gifWidth}px`,
            height: `${gifHeight}px`
          }
        });
        
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        
        // repeat: 0 on the first frame enables infinite looping
        gif.writeFrame(index, canvas.width, canvas.height, { 
          palette, 
          delay: 100, 
          repeat: i === 0 ? 0 : undefined 
        });
      }
      
      gif.finish();
      const bytes = gif.bytes();
      const blob = new Blob([bytes as any], { type: "image/gif" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `holotype-${archetype.title.toLowerCase().replace(/\s+/g, "-")}-${isSprite ? "sprite" : "card"}.gif`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("GIF Capture failed:", err);
      setError("GIF Capture failed. Please try a manual recording.");
    } finally {
      setIsCapturing(false);
      setManualTime(undefined);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vectorData = params.get("vector");
    if (vectorData) {
      try {
        const decoded = JSON.parse(fromBase64(decodeURIComponent(vectorData)));
        setArchetype(decoded);
      } catch (err) {
        console.error("Failed to decode vector alignment:", err);
      }
    }
  }, []);

  const handlePresetClick = (text: string) => {
    setUserInput(text);
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 800);
    
    // Focus the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleReset = () => { 
    setUserInput(""); 
    setLoading(false); 
    setArchetype(null); 
    setError(""); 
    setLens("paralympic");
    // Clear URL params
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleDownloadLog = () => {
    if (!archetype) return;
    const logData = {
      timestamp: new Date().toISOString(),
      instrument: "HOLOTYPE // VER 3.1.0",
      archetype: archetype,
      analysis_lens: lens
    };
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `holotype-log-${archetype.title.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyVector = async () => {
    if (!archetype) return;
    try {
      const vectorData = encodeURIComponent(toBase64(JSON.stringify(archetype)));
      const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?vector=${vectorData}`;
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
      }
      setVectorCopied(true);
      setTimeout(() => setVectorCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy vector:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(""); setArchetype(null);
    try {
      const res = await fetch("/api/generate", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ userInput }) 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Diagnostic failed");
      }

      setArchetype(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally { setLoading(false); }
  };
  return (
    <main data-component="ArchetypeGenerator" className="min-h-screen text-text-main bg-bg-main flex flex-col items-center justify-center px-6 py-[4vh] font-mono relative z-10 transition-colors duration-500">
      {/* Immersive Loading Overlay */}
      <AnimatePresence>{loading && <LoadingScanner />}</AnimatePresence>

      <div className={cn("w-full max-w-5xl flex flex-col items-center transition-all duration-700", loading && "opacity-0 scale-95 pointer-events-none")}>
        <header data-part="app-header" className="text-center space-y-1 mb-[3vh]">
          <h1 className="text-4xl md:text-6xl font-display font-bold italic tracking-tighter uppercase leading-none text-text-main">
            {archetype ? "CLASSIFICATION COMPLETE" : (
              <>HOLO<span className="text-accent-gold">TYPE</span></>
            )}
          </h1>
          <p className="text-text-tertiary text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase">
            {archetype ? "Historical alignment vector locked // transmission successful" : "HISTORICAL ALIGNMENT INSTRUMENT // VER 3.1.0"}
          </p>
        </header>

        {!archetype ? (
          <section data-part="input-section" className="w-full">
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-[3vh]">
              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                  {PRESETS.map((preset, i) => (
                    <button key={i} type="button" onClick={() => handlePresetClick(preset.text)}
                      className="group relative w-full aspect-[3/1.4] md:aspect-[3/1.6] bg-bg-card border-[1.5px] border-[#0c19322e] dark:border-border-subtle shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-none transition-all duration-300 hover:shadow-xl hover:border-accent-red/40 hover:-translate-y-0.5 text-left overflow-hidden"
                      style={{ clipPath: "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))" }}
                    >
                      <preset.icon className="absolute bottom-1 right-1 w-14 h-14 md:w-20 md:h-20 opacity-10 dark:opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-14" />
                                          <div className="relative h-full p-3 md:p-5 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                              <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-text-tertiary uppercase">⌜ PRESET 0{i+1} ⌟</span>
                                              <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-text-tertiary uppercase italic">ANALYSIS</span>
                                            </div>
                                            <div className="flex flex-col">
                                              <h3 className="text-base md:text-xl font-display font-bold leading-tight uppercase italic transition-all group-hover:text-accent-red text-text-main">
                            <span className="relative inline-block">{preset.label}
                              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ textShadow: '-1px 0 rgba(200, 16, 74, 0.4), 1px 0 rgba(28, 76, 255, 0.4)' }}>{preset.label}</span>
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
                  <label htmlFor="userInput" className="block text-[9px] font-bold uppercase tracking-[0.4em] text-text-secondary text-center">⌜ INPUT DAILY MOVEMENT PATTERN ⌟</label>
                  <div className="relative group">
                    <motion.div
                      animate={isFlashActive ? { 
                        boxShadow: ["0 0 0 0px rgba(196, 30, 58, 0)", "0 0 0 10px rgba(196, 30, 58, 0.2)", "0 0 0 0px rgba(196, 30, 58, 0)"],
                        backgroundColor: ["rgba(196, 30, 58, 0)", "rgba(196, 30, 58, 0.05)", "rgba(196, 30, 58, 0)"]
                      } : {}}
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
                      
                      {/* Visual Flash Overlay */}
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

              <button type="submit" disabled={loading || !userInput.trim()} className="w-full max-w-md h-16 bg-text-main text-bg-main font-bold uppercase tracking-[0.4em] transition-all hover:bg-accent-red hover:text-white active:scale-[0.98] group relative overflow-hidden text-sm">
                <span className="relative z-10">RUN HISTORICAL ALIGNMENT</span>
                <div className="absolute inset-0 bg-accent-red translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </form>
          </section>
        ) : (
          <section data-part="results-section" className="w-full">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="flex flex-col items-center space-y-[4vh] pb-12 w-full">
              
              {/* Lens Toggle: Moved out of HoloCard for stable positioning */}
              {!isSprite && (
                <div className="flex bg-bg-card-elevated/80 p-1 rounded-full border border-border-subtle backdrop-blur-md shadow-xl scale-90 sm:scale-100 z-50">
                  <button onClick={() => setLens("paralympic")} className={cn("px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all", lens === "paralympic" ? "bg-accent-red text-white shadow-lg" : "text-text-tertiary hover:text-text-main")}>Paralympic Lens</button>
                  <button onClick={() => setLens("olympic")} className={cn("px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all", lens === "olympic" ? "bg-accent-navy text-white shadow-lg" : "text-text-tertiary hover:text-text-main")}>Olympic Lens</button>
                </div>
              )}

              <div ref={cardContainerRef} className="flex flex-col items-center">
                <HoloCard 
                  archetype={archetype} 
                  lens={lens} 
                  setLens={setLens} 
                  isSpinning={isSpinning} 
                  isPixelated={false} 
                  isSprite={isSprite}
                  manualTime={manualTime}
                />
              </div>

              {/* Dev Tools Overlay: Improved visibility and consistency */}
              <div className="flex flex-wrap justify-center gap-4 p-3 bg-zinc-900/90 border border-zinc-700 rounded-xl backdrop-blur-xl shadow-2xl">
                <button 
                  onClick={() => setIsSpinning(!isSpinning)} 
                  disabled={isCapturing}
                  className={cn(
                    "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all", 
                    isSpinning ? "bg-accent-red border-accent-red text-white shadow-[0_0_15px_rgba(179,25,66,0.4)]" : "bg-zinc-800 border-zinc-600 text-zinc-300 hover:border-zinc-400"
                  )}
                >
                  {isSpinning ? "Stop Spin" : "Steady Spin"}
                </button>
                <button 
                  onClick={() => setIsSprite(!isSprite)} 
                  disabled={isCapturing}
                  className={cn(
                    "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all", 
                    isSprite ? "bg-white border-white text-black" : "bg-zinc-800 border-zinc-600 text-zinc-300 hover:border-zinc-400"
                  )}
                >
                  {isSprite ? "Card Mode" : "Sprite Mode (Small)"}
                </button>
                <button 
                  onClick={captureGif}
                  disabled={isCapturing}
                  className={cn(
                    "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all relative overflow-hidden",
                    isCapturing ? "bg-zinc-800 border-zinc-700 text-zinc-500" : "bg-accent-gold border-accent-gold text-black hover:bg-white hover:border-white shadow-[0_0_15px_rgba(197,151,44,0.3)]"
                  )}
                >
                  {isCapturing ? `Capturing ${captureProgress}%` : "Export 360 GIF"}
                  {isCapturing && (
                    <div 
                      className="absolute bottom-0 left-0 h-1 bg-accent-red transition-all duration-300" 
                      style={{ width: `${captureProgress}%` }}
                    />
                  )}
                </button>
              </div>

              <div className="w-full max-w-xl space-y-10">
                <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                  <p className="text-text-main font-narrative text-lg md:text-[17px] leading-[1.6] font-normal opacity-90 max-w-[60ch] mx-auto">{lens === "paralympic" ? archetype.narrative.paralympic : archetype.narrative.olympic}</p>
                  <div className="inline-flex items-center gap-4 px-5 py-2.5 bg-bg-card border border-border-subtle rounded-full">
                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-text-tertiary flex items-center gap-2">
                      <span className="text-accent-gold">⎔</span> Archival Context Locked
                    </span>
                    <span className="text-sm font-display font-bold uppercase italic text-accent-red">{archetype.era}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <button onClick={handleDownloadLog} className="w-full h-14 bg-text-main text-bg-main font-bold uppercase tracking-[0.4em] transition-all hover:bg-accent-red hover:text-white active:scale-[0.98] text-xs shadow-2xl">DOWNLOAD ARCHIVAL LOG</button>
                  <button onClick={handleCopyVector} className={cn("h-12 w-full flex items-center justify-center gap-3 bg-bg-card border text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.95]", vectorCopied ? "border-green-500/50 text-green-500" : "border-border-subtle text-text-secondary hover:text-text-main")}>
                    {vectorCopied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                    {vectorCopied ? "COPIED" : "COPY VECTOR"}</button>
                  <button onClick={handleReset} className="mt-8 self-center text-text-tertiary font-bold uppercase tracking-[0.3em] text-[10px] hover:text-accent-red transition-colors flex items-center gap-3 group">
                    <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />RESET DIAGNOSTIC INSTRUMENT</button>
                </div>
              </div>
              </motion.div>
              </section>
              )}
        {error && <div className="p-5 bg-accent-red/10 border border-accent-red/20 rounded-xl text-accent-red text-center font-bold text-sm mt-12">{error}</div>}
      </div>
    </main>
  );
}
