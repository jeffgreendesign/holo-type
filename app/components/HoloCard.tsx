"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { cn } from "../lib/cn";
import type { Archetype, Lens } from "../lib/types";
import { RadarVisual } from "./RadarVisual";

function StatCounter({
  value,
  delay,
  className,
}: {
  value: number;
  delay: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const end = Math.max(0, Math.min(100, value));
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

function FittedText({
  text,
  className,
  tag: Tag = "span",
  center = false,
}: {
  text: string;
  className?: string;
  tag?: "h2" | "span" | "div";
  center?: boolean;
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={textRef as any}
        style={{ transform: `scale(${scale})`, transformOrigin: center ? "center center" : "left center" }}
        className={cn("whitespace-nowrap transition-transform duration-300 ease-out", className)}
      >
        {text}
      </Tag>
    </div>
  );
}

function FittedTitle(props: { text: string; className?: string; center?: boolean }) {
  return <FittedText {...props} tag="h2" />;
}

function FittedLabel(props: { text: string; className?: string; center?: boolean }) {
  return <FittedText {...props} tag="span" />;
}

function CardContent({
  archetype,
  side,
  glareX,
  glareY,
  mouseX,
  mouseY,
  variant = "standard",
}: {
  archetype: Archetype;
  side: Lens;
  glareX: MotionValue<number>;
  glareY: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  variant?: "standard" | "poster";
}) {
  const accentColor = side === "paralympic" ? "var(--accent-red)" : "var(--accent-navy)";

  const glareBackground = useTransform(
    [glareX, glareY],
    (values: number[]) =>
      `radial-gradient(circle at ${values[0]}% ${values[1]}%, rgba(255, 255, 255, 0.9), transparent 50%)`
  );
  const foilBackground = useTransform(
    [mouseX, mouseY],
    (values: number[]) =>
      `conic-gradient(from ${values[0] * 360}deg at 50% 50%, rgba(255, 0, 128, 0.4), rgba(0, 255, 255, 0.4), rgba(255, 255, 0, 0.4), rgba(255, 0, 128, 0.4))`
  );

  const isPoster = variant === "poster";

  return (
    <div data-component="CardContent" className={cn("relative h-full flex flex-col overflow-hidden", isPoster ? "w-[640px] h-[896px] p-10" : "p-4 pb-3")}>
      <div
        className={cn(
          "absolute inset-0 mix-blend-overlay opacity-60 dark:opacity-30",
          archetype.rarity === "Holo Rare" ? "bg-gold-holo" : "bg-silver-holo"
        )}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-25 dark:opacity-15 group-hover:opacity-50 dark:group-hover:opacity-30 transition-opacity"
        style={{ background: foilBackground }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-40 dark:opacity-20 group-hover:opacity-80 dark:group-hover:opacity-40 transition-opacity"
        style={{ background: glareBackground }}
      />

      <header data-part="metadata" className={cn("relative flex justify-between items-start", isPoster ? "mb-6" : "mb-1.5")}>
        <div className="space-y-0.5">
          <span className={cn("font-mono font-bold tracking-[0.3em] text-text-tertiary", isPoster ? "text-sm" : "text-[8px]")}>ARCHETYPE</span>
          <div className={cn("font-mono font-bold text-text-main border border-border-subtle bg-bg-card/50 uppercase", isPoster ? "text-sm px-4 py-1" : "text-[9px] px-1.5 py-0")}>{side}</div>
        </div>
        <div
          className={cn("text-white font-mono font-bold tracking-widest shadow-sm", isPoster ? "text-sm px-6 py-2" : "text-[9px] px-2 py-0.5")}
          style={{ backgroundColor: archetype.rarity === "Holo Rare" ? "#B31942" : "#C5972C" }}
        >
          {archetype.rarity.toUpperCase()}
        </div>
      </header>

      <figure
        data-part="visual-container"
        className={cn(
          "relative w-full bg-bg-card-elevated/50 border border-border-subtle flex items-center justify-center overflow-hidden shadow-inner group-hover:bg-bg-card/40 transition-colors duration-500 backdrop-blur-[2px]",
          isPoster ? "flex-none h-[320px] mb-10" : "flex-none h-[110px] mb-2"
        )}
      >
        <div className={isPoster ? "scale-150" : "scale-75"}>
          <RadarVisual stats={archetype.stats} color={accentColor} />
        </div>
        <div className={cn("absolute top-1 left-1 font-mono text-text-tertiary", isPoster ? "text-[12px]" : "text-[7px]")}>Vector Analysis</div>
      </figure>

      <div data-part="title-area" className={cn("relative flex flex-col justify-center", isPoster ? "mb-10" : "mb-2")}>
        <FittedTitle
          text={archetype.title}
          className={cn("font-display font-bold leading-none tracking-tight text-text-main uppercase italic", isPoster ? "text-6xl" : "text-2xl")}
        />
        <div className={cn("mt-1.5 shadow-sm", isPoster ? "w-20 h-[6px]" : "w-8 h-[2px]")} style={{ backgroundColor: accentColor }} />
      </div>

      <section
        data-part="stats-grid"
        className="relative grid grid-cols-2 gap-px bg-border-subtle/20 border border-border-subtle/30 overflow-hidden rounded-sm"
      >
        {Object.entries(archetype.stats).map(([label, value], i) => {
          const formattedLabel = label.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

          return (
            <div
              key={i}
              className={cn(
                "bg-bg-card/10 backdrop-blur-[1px] flex flex-col items-center justify-center text-center",
                isPoster ? "p-5 min-h-[110px]" : "px-1.5 py-2 min-h-[58px]"
              )}
            >
              <div className="w-full flex justify-center mb-1">
                <FittedLabel
                  text={formattedLabel}
                  center
                  className={cn(
                    "font-mono font-bold tracking-[0.12em] text-text-tertiary uppercase",
                    isPoster ? "text-[12px]" : "text-[10px]"
                  )}
                />
              </div>
              <StatCounter
                value={value}
                delay={0.8 + i * 0.1}
                className={cn("text-text-main leading-none", isPoster ? "text-6xl" : "text-4xl")}
              />
            </div>
          );
        })}
      </section>

      <footer data-part="card-footer" className={cn("relative flex justify-between items-end", isPoster ? "mt-10" : "mt-auto pt-2")}>
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

function CardBackground({ rarity, rarityColor }: { rarity: string; rarityColor: string }) {
  return (
    <div className="absolute inset-0 z-0">
      <svg width="100%" height="100%" viewBox="0 0 320 448" preserveAspectRatio="none" fill="none" className="overflow-visible">
        <defs>
          <clipPath id="cardClip">
            <path d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z" />
          </clipPath>
        </defs>
        <path d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z" fill="var(--bg-card-elevated)" className="shadow-2xl" />
        <path
          d="M0 16L16 0H304L320 16V432L304 448H16L0 432V16Z"
          stroke={rarityColor}
          strokeOpacity={rarity === "Common" ? "0.4" : "0.8"}
          strokeWidth={rarity === "Common" ? "1" : "2"}
        />
      </svg>
    </div>
  );
}

export function HoloCard({
  archetype,
  lens,
  variant = "standard",
  isPixelated = false,
}: {
  archetype: Archetype;
  lens: Lens;
  variant?: "standard" | "poster";
  isPixelated?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springConfig = { damping: 40, stiffness: 120, mass: 1.2 };
  const mouseXSpring = useSpring(pointerX, springConfig);
  const mouseYSpring = useSpring(pointerY, springConfig);

  const isPoster = variant === "poster";

  useEffect(() => {
    if (shouldReduceMotion || isPoster) return;

    let frameId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (pointerX.get() === 0 && pointerY.get() === 0) {
        const idleX = Math.sin(elapsed / 2000) * 0.05;
        const idleY = Math.cos(elapsed / 2500) * 0.05;
        mouseXSpring.set(idleX);
        mouseYSpring.set(idleY);
      }

      frameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [shouldReduceMotion, pointerX, pointerY, mouseXSpring, mouseYSpring, isPoster]);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [30, -30]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-30, 30]);

  const transform = useTransform([rotateX, rotateY], ([rX, rY]) => `rotateX(${rX}deg) rotateY(${rY}deg)`);

  const glareXBase = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareXInverted = useTransform(mouseXSpring, [-0.5, 0.5], [100, 0]);
  const glareX = useSpring(useTransform(() => (lens === "paralympic" ? glareXBase.get() : glareXInverted.get())), springConfig);
  const glareY = useSpring(useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]), springConfig);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const newX = (e.clientX - rect.left) / rect.width - 0.5;
    const newY = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(newX);
    pointerY.set(newY);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const rarityColor = { Common: "rgba(148, 163, 184, 0.2)", Uncommon: "#8B6914", Rare: "#C5972C", "Holo Rare": "#B31942" }[archetype.rarity];

  return (
    <motion.article
      data-component="HoloCard"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "w-full flex flex-col items-center gap-10 font-body relative z-20 transition-all duration-300",
        isPoster ? "scale-[1.6]" : "",
        isPixelated ? "pixelate-filter scale-125" : ""
      )}
      style={{ perspective: "1200px" }}
    >
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

      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          transformStyle: "preserve-3d",
          transform,
          touchAction: "none",
        }}
        className="relative cursor-pointer group w-[300px] sm:w-[320px] h-[420px] sm:h-[448px]"
      >
        <motion.div
          animate={{ rotateY: lens === "paralympic" ? 0 : 180 }}
          transition={{ rotateY: { type: "spring", stiffness: 45, damping: 14, mass: 1.5 } }}
          style={{ transformStyle: "preserve-3d", width: "100%", height: "100%" }}
        >
          <div className="absolute inset-0 backface-hidden" style={{ transform: "rotateY(0deg) translateZ(0.5px)" }}>
            <div className="absolute inset-0">
              <CardBackground rarity={archetype.rarity} rarityColor={rarityColor} />
            </div>
            <div className="absolute inset-0" style={{ clipPath: "url(#cardClip)" }}>
              <CardContent archetype={archetype} side="paralympic" glareX={glareX} glareY={glareY} mouseX={mouseXSpring} mouseY={mouseYSpring} variant={variant} />
            </div>
          </div>

          <div className="absolute inset-0 backface-hidden" style={{ transform: "rotateY(180deg) translateZ(0.5px)" }}>
            <div className="absolute inset-0">
              <CardBackground rarity={archetype.rarity} rarityColor={rarityColor} />
            </div>
            <div className="absolute inset-0" style={{ clipPath: "url(#cardClip)" }}>
              <CardContent archetype={archetype} side="olympic" glareX={glareX} glareY={glareY} mouseX={mouseXSpring} mouseY={mouseYSpring} variant={variant} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
