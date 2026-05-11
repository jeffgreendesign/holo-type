/**
 * Copyright 2026 Holo-Type Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Clipboard, Check } from "lucide-react";
import { cn } from "../lib/cn";
import { toBase64, fromBase64 } from "../lib/share-url";
import type { Archetype, Lens } from "../lib/types";
import { HoloCard } from "./HoloCard";
import { InputForm } from "./InputForm";
import { LoadingScanner } from "./LoadingScanner";
import { useArchetypeAPI } from "../hooks/useArchetypeAPI";

export default function ArchetypeGenerator() {
  const { loading, archetype, setArchetype, error, generate } = useArchetypeAPI();
  const [lens, setLens] = useState<Lens>("paralympic");
  const [vectorCopied, setVectorCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vectorData = params.get("vector");
    if (vectorData) {
      try {
        const decoded = JSON.parse(fromBase64(decodeURIComponent(vectorData))) as Archetype;
        setArchetype(decoded);
      } catch (err) {
        console.error("Failed to decode vector alignment:", err);
      }
    }
  }, [setArchetype]);

  const handleReset = () => {
    setArchetype(null);
    setLens("paralympic");
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const handleDownloadLog = () => {
    if (!archetype) return;
    const logData = {
      timestamp: new Date().toISOString(),
      instrument: "HOLOTYPE // VER 3.1.0",
      archetype,
      analysis_lens: lens,
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
          document.execCommand("copy");
        } catch (err) {
          console.error("Fallback copy failed", err);
        }
        document.body.removeChild(textArea);
      }
      setVectorCopied(true);
      setTimeout(() => setVectorCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy vector:", err);
    }
  };

  return (
    <main
      data-component="ArchetypeGenerator"
      className="min-h-screen text-text-main bg-bg-main flex flex-col items-center justify-center px-6 py-[4vh] font-mono relative z-10 transition-colors duration-500"
    >
      <AnimatePresence>{loading && <LoadingScanner />}</AnimatePresence>

      <div className={cn("w-full max-w-5xl flex flex-col items-center transition-all duration-700", loading && "opacity-0 scale-95 pointer-events-none")}>
        <header data-part="app-header" className="text-center space-y-1 mb-[3vh]">
          <h1 className="text-4xl md:text-6xl font-display font-bold italic tracking-tighter uppercase leading-none text-text-main">
            {archetype ? (
              "CLASSIFICATION COMPLETE"
            ) : (
              <>
                HOLO<span className="text-accent-gold">TYPE</span>
              </>
            )}
          </h1>
          <p className="text-text-tertiary text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase">
            {archetype ? "Historical alignment vector locked // transmission successful" : "HISTORICAL ALIGNMENT INSTRUMENT // VER 3.1.0"}
          </p>
        </header>

        {!archetype ? (
          <InputForm loading={loading} onSubmit={generate} />
        ) : (
          <section data-part="results-section" className="w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center space-y-[4vh] pb-12 w-full"
            >
              <div className="flex bg-bg-card-elevated/80 p-1 rounded-full border border-border-subtle backdrop-blur-md shadow-xl scale-90 sm:scale-100 z-50">
                <button
                  onClick={() => setLens("paralympic")}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                    lens === "paralympic" ? "bg-accent-red text-white shadow-lg" : "text-text-tertiary hover:text-text-main"
                  )}
                >
                  Paralympic Lens
                </button>
                <button
                  onClick={() => setLens("olympic")}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                    lens === "olympic" ? "bg-accent-navy text-white shadow-lg" : "text-text-tertiary hover:text-text-main"
                  )}
                >
                  Olympic Lens
                </button>
              </div>

              <div className="flex flex-col items-center">
                <HoloCard archetype={archetype} lens={lens} />
              </div>

              <div className="w-full max-w-xl space-y-10">
                <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                  <p className="text-text-main font-narrative text-lg md:text-[17px] leading-[1.6] font-normal opacity-90 max-w-[60ch] mx-auto">
                    {lens === "paralympic" ? archetype.narrative.paralympic : archetype.narrative.olympic}
                  </p>
                  <div className="inline-flex items-center gap-4 px-5 py-2.5 bg-bg-card border border-border-subtle rounded-full">
                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-text-tertiary flex items-center gap-2">
                      <span className="text-accent-gold">⎔</span> Archival Context Locked
                    </span>
                    <span className="text-sm font-display font-bold uppercase italic text-accent-red">{archetype.era}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleDownloadLog}
                    className="w-full h-14 bg-text-main text-bg-main font-bold uppercase tracking-[0.4em] transition-all hover:bg-accent-red hover:text-white active:scale-[0.98] text-xs shadow-2xl"
                  >
                    DOWNLOAD ARCHIVAL LOG
                  </button>
                  <button
                    onClick={handleCopyVector}
                    className={cn(
                      "h-12 w-full flex items-center justify-center gap-3 bg-bg-card border text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.95]",
                      vectorCopied ? "border-green-500/50 text-green-500" : "border-border-subtle text-text-secondary hover:text-text-main"
                    )}
                  >
                    {vectorCopied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                    {vectorCopied ? "COPIED" : "COPY VECTOR"}
                  </button>
                  <button
                    onClick={handleReset}
                    className="mt-8 self-center text-text-tertiary font-bold uppercase tracking-[0.3em] text-[10px] hover:text-accent-red transition-colors flex items-center gap-3 group"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
                    RESET DIAGNOSTIC INSTRUMENT
                  </button>
                </div>
              </div>
            </motion.div>
          </section>
        )}
        {error && (
          <div className="p-5 bg-accent-red/10 border border-accent-red/20 rounded-xl text-accent-red text-center font-bold text-sm mt-12">{error}</div>
        )}
      </div>
    </main>
  );
}
