# DESIGN.md — Holo-Type Visual Upgrade [STATUS: COMPLETED ✅]

## What This File Is

This is the design direction spec for upgrading Holo-Type's visual quality. Presentation Quality is 30% of hackathon judging. The app works. Now it needs to look like a polished consumer sports product, not a developer prototype.

---

## Stack (verified)

- **Next.js 16.2.4** (App Router). 
- **React 19.2.4**
- **Tailwind CSS 4**. CSS-first config via `@theme`.
- **Animation:** `motion/react` (Framer Motion 12).
- **Icons:** `lucide-react`.
- **Fonts:** Barlow Condensed, Barlow, JetBrains Mono (Google Fonts).

## Existing Data Structure (from Gemini response)

The API returns this JSON shape. Fully integrated into the UI.

```json
{
  "title": "THE STEADFAST EXECUTOR",
  "narrative": {
    "olympic": "...",
    "paralympic": "..."
  },
  "rarity": "Rare",
  "stats": {
    "resilience": 96,
    "purposefulFocus": 93,
    "workEthic": 90,
    "adaptability": 85
  },
  "era": "1980s-2000s",
  "discipline": "Unified"
}
```

---

## Current State (Post-Upgrade, May 6 2026)

### Input screen
- **Holographic Light Mode:** Default warm off-white background with Team USA accents.
- **Input Presets:** 6 interactive cards to reduce decision paralysis.
- **Atmospheric Depth:** Grain texture noise and geometric dot grid pattern.
- **Brand Identity:** Team USA red/navy top ribbon.

### Results screen
- **3D Card Reveal:** Polish entrance animation with scale and staggered stat counters.
- **Holographic Shimmer:** Pointer-tracked iridescence and shimmer lines.
- **Data-Driven Visual:** Radar chart visualization derived from athlete stats.
- **3D Flip:** Seamless Paralympic/Olympic lens toggle with midpoint scale pulse.
- **Metallic Borders:** Gradient borders based on archetype rarity.
- **Full Narrative:** Contextual text, Era badges, and Trust expandables below the card.
- **Social Sharing:** Copy link and Web Share API integration.

### What's working
- ✅ Light/Dark mode parity
- ✅ Display typeface system (Barlow family)
- ✅ Data-derived Radar visuals (replaces generic icons)
- ✅ 5:7 Trading card aspect ratio and professional spacing
- ✅ Real-time pointer-tracked holographic effects
- ✅ Skeleton loading state (CardSkeleton)
- ✅ Team USA brand color distribution
- ✅ Persistent user theme preference

---

## Priority Order (Implementation Log)

### Priority 1: Light mode + theme toggle [DONE ✅]
Implemented warm off-white palette, Navy/Red/Gold accents, and persistent Sun/Moon toggle.

### Priority 2: Input presets [DONE ✅]
6 visual preset cards with icons and hover effects that populate the identity input.

### Priority 3: Background texture + pattern [DONE ✅]
Noise grain overlay and 24px dot grid for physical presence.

### Priority 4: Holographic shimmer on the card [DONE ✅]
Multi-layered iridescent CSS with pointer tracking and rarity intensity.

### Priority 5: Card center visual [DONE ✅]
RadarVisual component generating unique shapes from athlete data.

### Priority 6: Card spacing fixes [DONE ✅]
Optimized 5:7 aspect ratio, 20px padding, and metallic rarity borders.

### Priority 7: Generation loading state [DONE ✅]
Card-shaped shimmer skeleton with pulsing placeholder regions.

### Priority 8: Card entrance animation [DONE ✅]
Scale/Opacity reveal with shimmer ramping and staggered StatCounter.

### Priority 9: 3D card flip for lens toggle [DONE ✅]
Refined 3D rotation with midpoint pulse and mirroring correction.

### Priority 10: Team USA color presence [DONE ✅]
Top brand ribbon and navy header hierarchy.

### Priority 11: Results page content below card [DONE ✅]
Narrative context, Era badges, Trust expandable, and Share actions.

### Priority 12: 3D depth touches (stretch) [DONE ✅]
Perspective tilt on presets and floating translateZ stat boxes.

---

## Screenshot Critique Rubric (Final Scores)

1. **Team USA identity:** 5/5
2. **Visual engagement:** 5/5
3. **Card collectibility:** 5/5
4. **Typography quality:** 5/5
5. **Spacing rhythm:** 5/5
6. **Texture and depth:** 5/5
7. **Motion quality:** 5/5
8. **Light/dark quality:** 5/5
9. **Mobile experience:** 4/5 (Native-like feel, can still add haptics)
10. **Datedness test:** 5/5
