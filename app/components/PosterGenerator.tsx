"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { toPng } from "html-to-image";
import { Archetype, CardContent, FittedTitle } from "./ArchetypeGenerator";
import { Download, Copy, Check, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";

interface PosterGeneratorProps {
  archetype: Archetype;
  lens: "olympic" | "paralympic";
  isOpen: boolean;
  onClose: () => void;
}

export default function PosterGenerator({ archetype, lens, isOpen, onClose }: PosterGeneratorProps) {
  const [format, setFormat] = useState<"story" | "square">("story");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [posterDataUrl, setPosterDataUrl] = useState<string | null>(null);
  const [vectorId, setVectorId] = useState("");
  
  const storyRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setVectorId(Math.random().toString(16).substring(2, 10).toUpperCase());
  }, []);

  const generatePoster = useCallback(async () => {
    const ref = format === "story" ? storyRef : squareRef;
    if (!ref.current) return;

    setGenerating(true);
    try {
      // Small delay to ensure styles and fonts are ready
      await new Promise((resolve) => setTimeout(resolve, 500));
      const dataUrl = await toPng(ref.current, {
        width: 1080,
        height: format === "story" ? 1920 : 1080,
        pixelRatio: 1,
      });
      setPosterDataUrl(dataUrl);
    } catch (err) {
      console.error("Failed to generate poster:", err);
    } finally {
      setGenerating(false);
    }
  }, [format]);

  useEffect(() => {
    if (isOpen) {
      generatePoster();
    } else {
      setPosterDataUrl(null);
    }
  }, [isOpen, format, generatePoster]);

  const handleDownload = () => {
    if (!posterDataUrl) return;
    const link = document.createElement("a");
    link.download = `holo-type-${archetype.title.toLowerCase().replace(/\s+/g, "-")}-${lens}.png`;
    link.href = posterDataUrl;
    link.click();
  };

  const handleCopy = async () => {
    if (!posterDataUrl) return;
    try {
      const response = await fetch(posterDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy image:", err);
    }
  };

  const zero = useMotionValue(0);

  if (!mounted) return null;

  return (
    <>
      {/* Hidden Portal for Rendering */}
      {createPortal(
        <div className="fixed -left-[9999px] top-0 pointer-events-none overflow-hidden">
          {/* 9:16 Story Poster */}
          <div 
            ref={storyRef}
            className="w-[1080px] h-[1920px] bg-[#fbfaf6] relative flex flex-col items-center py-[100px] px-[80px]"
          >
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none" 
              style={{ backgroundImage: 'radial-gradient(#0c1932 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />
            
            <div className="w-full flex flex-col items-start mb-[80px]">
              <h1 className="text-[48px] font-display font-bold italic text-[#0c1932] leading-none uppercase tracking-tighter">HOLO-TYPE</h1>
              <p className="text-[18px] font-mono font-bold text-[#0c1932]/40 tracking-[0.4em] uppercase mt-2">ARCHIVAL ALIGNMENT VECTOR // VER 2.5.0</p>
            </div>

            <div className="w-[640px] h-[896px] relative shadow-2xl overflow-hidden" 
              style={{ clipPath: "polygon(0 32px, 32px 0, calc(100% - 32px) 0, 100% 32px, 100% calc(100% - 32px), calc(100% - 32px) 100%, 32px 100%, 0 calc(100% - 32px))" }}
            >
              <div className="absolute inset-0 bg-silver-holo" />
              <div className="absolute inset-0 border-[4px] border-slate-300 opacity-40 pointer-events-none" 
                style={{ clipPath: "polygon(0 32px, 32px 0, calc(100% - 32px) 0, 100% 32px, 100% calc(100% - 32px), calc(100% - 32px) 100%, 32px 100%, 0 calc(100% - 32px))" }}
              />
              <CardContent 
                archetype={archetype} 
                side={lens} 
                glareX={zero} 
                glareY={zero} 
                mouseX={zero} 
                mouseY={zero} 
                variant="poster" 
              />
            </div>

            <div className="mt-auto flex flex-col items-center text-center w-full">
              <FittedTitle 
                text={archetype.title} 
                center 
                className="text-[84px] font-display font-bold italic text-[#0c1932] leading-none uppercase tracking-tighter" 
              />
              <div className="w-[100px] h-[6px] bg-[#B31942] mt-8" />
              
              <div className="mt-12 space-y-2">
                <p className="text-[24px] font-mono font-bold text-[#0c1932]/60 uppercase tracking-[0.3em]">{lens} Lens</p>
                <p className="text-[20px] font-mono font-bold text-[#0c1932]/40 uppercase tracking-[0.2em]">{archetype.era}</p>
              </div>
            </div>

            <div className="w-full mt-[100px] flex justify-between items-end border-t border-[#0c1932]/10 pt-8">
              <div className="text-[18px] font-mono font-bold text-[#0c1932]/40 tracking-widest uppercase">
                {vectorId} {"// ARCHETYPE VECTOR"}
              </div>
              <div className="text-[18px] font-mono font-bold text-[#0c1932]/40 uppercase">HOLO-TYPE.APP</div>
            </div>
          </div>

          {/* 1:1 Square Poster */}
          <div 
            ref={squareRef}
            className="w-[1080px] h-[1080px] bg-[#fbfaf6] relative flex items-center justify-between p-[80px]"
          >
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none" 
              style={{ backgroundImage: 'radial-gradient(#0c1932 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />
            
            <div className="relative z-10 w-[640px] h-[896px] shadow-2xl overflow-hidden scale-[0.8] origin-left"
              style={{ clipPath: "polygon(0 32px, 32px 0, calc(100% - 32px) 0, 100% 32px, 100% calc(100% - 32px), calc(100% - 32px) 100%, 32px 100%, 0 calc(100% - 32px))" }}
            >
              <div className="absolute inset-0 bg-silver-holo" />
              <div className="absolute inset-0 border-[4px] border-slate-300 opacity-40 pointer-events-none" 
                style={{ clipPath: "polygon(0 32px, 32px 0, calc(100% - 32px) 0, 100% 32px, 100% calc(100% - 32px), calc(100% - 32px) 100%, 32px 100%, 0 calc(100% - 32px))" }}
              />
              <CardContent 
                archetype={archetype} 
                side={lens} 
                glareX={zero} 
                glareY={zero} 
                mouseX={zero} 
                mouseY={zero} 
                variant="poster" 
              />
            </div>

            <div className="relative z-10 w-[420px] flex flex-col items-end text-right h-full justify-center">
              <div className="mb-12">
                <h1 className="text-[36px] font-display font-bold italic text-[#0c1932] leading-none uppercase tracking-tighter">HOLO-TYPE</h1>
                <p className="text-[14px] font-mono font-bold text-[#0c1932]/40 tracking-[0.4em] uppercase mt-1">VECTOR LOCK</p>
              </div>

              <div className="w-full">
                <FittedTitle 
                  text={archetype.title} 
                  className="text-[56px] font-display font-bold italic text-[#0c1932] leading-tight uppercase tracking-tighter" 
                />
              </div>
              <div className="w-[60px] h-[4px] bg-[#B31942] mt-6" />
              
              <div className="mt-8 space-y-1">
                <p className="text-[18px] font-mono font-bold text-[#0c1932]/60 uppercase tracking-[0.2em]">{lens}</p>
                <p className="text-[16px] font-mono font-bold text-[#0c1932]/40 uppercase tracking-[0.1em]">{archetype.era}</p>
              </div>

              <div className="mt-24 pt-12 border-t border-[#0c1932]/10 w-full flex flex-col items-end">
                <div className="text-[14px] font-mono font-bold text-[#0c1932]/40 tracking-widest uppercase">
                  {vectorId} {"// VECTOR"}
                </div>
                <div className="text-[14px] font-mono font-bold text-[#0c1932]/40 uppercase mt-1">HOLO-TYPE.APP</div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal UI */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-bg-main/80 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-bg-card border border-border-subtle shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[800px] md:h-auto"
            >
              <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 text-text-tertiary hover:text-text-main transition-colors">
                <X className="w-6 h-6" />
              </button>

              {/* Preview Area */}
              <div className="flex-1 bg-bg-card-elevated p-8 flex items-center justify-center min-h-[400px]">
                {generating ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-accent-red animate-spin" />
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-tertiary">Generating Artifact...</p>
                  </div>
                ) : posterDataUrl ? (
                  <motion.img 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={posterDataUrl} 
                    alt="Poster Preview" 
                    className={format === "story" ? "h-full max-h-[500px] w-auto shadow-2xl" : "w-full max-w-[400px] h-auto shadow-2xl"}
                  />
                ) : null}
              </div>

              {/* Controls Area */}
              <div className="w-full md:w-[280px] p-8 flex flex-col gap-8 bg-bg-card border-l border-border-subtle">
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-text-tertiary">TRANSMIT ARCHIVAL POSTER</h3>
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => setFormat("story")}
                      className={`flex items-center justify-between p-4 border transition-all ${format === "story" ? "border-accent-red bg-accent-red/5 text-text-main" : "border-border-subtle text-text-tertiary hover:border-text-tertiary"}`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest">Story (9:16)</span>
                      <div className={`w-3 h-3 rounded-full border-2 ${format === "story" ? "border-accent-red bg-accent-red" : "border-text-tertiary"}`} />
                    </button>
                    <button 
                      onClick={() => setFormat("square")}
                      className={`flex items-center justify-between p-4 border transition-all ${format === "square" ? "border-accent-red bg-accent-red/5 text-text-main" : "border-border-subtle text-text-tertiary hover:border-text-tertiary"}`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest">Square (1:1)</span>
                      <div className={`w-3 h-3 rounded-full border-2 ${format === "square" ? "border-accent-red bg-accent-red" : "border-text-tertiary"}`} />
                    </button>
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <button 
                    disabled={generating || !posterDataUrl}
                    onClick={handleDownload}
                    className="w-full h-14 bg-text-main text-bg-main font-bold uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-3 hover:bg-accent-red hover:text-white transition-all disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    Download Image
                  </button>
                  <button 
                    disabled={generating || !posterDataUrl}
                    onClick={handleCopy}
                    className="w-full h-14 bg-bg-card border border-border-subtle text-text-main font-bold uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-3 hover:border-text-main transition-all disabled:opacity-50"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy Image"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
