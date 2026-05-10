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

import React, { useState } from "react";
import { Code, ExternalLink } from "lucide-react";
import { TechStackModal } from "./TechStackModal";

export const Footer = () => {
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);

  return (
    <footer className="relative z-10 w-full mt-auto py-12 px-6 border-t border-border-subtle bg-bg-card/50 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-sm font-body">
        
        {/* Left: Project & Hackathon */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-display font-bold italic text-2xl tracking-tighter text-text-main uppercase leading-none">
            HOLO<span className="text-accent-gold">TYPE</span>
          </div>
          <a 
            href="https://vibecodeforgoldwithgoogle.devpost.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-navy transition-colors flex items-center gap-1.5 group"
          >
            Built for the <span className="font-semibold">TEAM USA X GOOGLE CLOUD HACKATHON</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
          </a>
        </div>

        {/* Center: Author & License */}
        <div className="flex flex-col items-center gap-1 text-center md:absolute md:left-1/2 md:-translate-x-1/2">
          <p className="text-text-secondary">
            © 2026 <a href="https://www.hirejeffgreen.com/" target="_blank" rel="noopener noreferrer" className="text-text-main hover:text-accent-gold underline underline-offset-4 decoration-accent-gold/30 transition-colors">Jeff Green</a>
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary opacity-70">
            Apache 2.0 License
          </p>
        </div>

        {/* Right: GitHub & Tech Stack */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsTechModalOpen(true)}
            className="text-text-secondary hover:text-text-main transition-colors flex items-center gap-2 group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold group-hover:animate-pulse" />
            + More tech
          </button>
          
          <div className="w-px h-4 bg-border-subtle hidden md:block" />
          
          <a 
            href="https://github.com/jeffgreendesign/holo-type"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-main transition-colors flex items-center gap-2 group"
            aria-label="GitHub Repository"
          >
            <Code className="w-4 h-4" />
            <span>Source</span>
          </a>
        </div>
      </div>

      <TechStackModal isOpen={isTechModalOpen} onClose={() => setIsTechModalOpen(false)} />
    </footer>
  );
};
