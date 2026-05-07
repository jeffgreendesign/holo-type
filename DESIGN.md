# Design Direction [STATUS: COMPLETED ✅]

## What's this?

This is the design spec for upgrading Holo-Type's visuals. Presentation is 30% of hackathon judging. The app works, but it needs to look like a polished sports product, not a prototype.

---

## Stack

- **Next.js 16.2.4**
- **React 19.2.4**
- **Tailwind CSS 4**
- **Animation:** `motion/react` (Framer Motion 12)
- **Icons:** `lucide-react`
- **Fonts:** Barlow family, JetBrains Mono

## Data Structure

The API returns this JSON. I've integrated it into the UI.

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

## Current State (May 6, 2026)

### Input screen
- **Light Mode:** Warm off-white background with Team USA accents.
- **Presets:** 6 cards to help users pick an identity quickly.
- **Depth:** Grain noise and geometric dot grid.
- **Identity:** Team USA red/navy top ribbon.

### Results screen
- **3D Reveal:** Scale-in animation with staggered stat counters.
- **Shimmer:** Pointer-tracked iridescence.
- **Visuals:** Radar charts built from athlete stats.
- **3D Flip:** Switch between Paralympic and Olympic views.
- **Borders:** Metallic gradients based on rarity.
- **Content:** Narrative text, Era badges, and Share actions below the card.

### What's working
- ✅ Light/Dark mode parity
- ✅ Typeface system (Barlow)
- ✅ Radar visuals
- ✅ 5:7 Trading card aspect ratio
- ✅ Real-time holographic effects
- ✅ Loading states
- ✅ Team USA brand colors
- ✅ Theme preference persistence

---

## Implementation Log

### Priority 1: Light mode + theme toggle [DONE ✅]
I built a warm off-white palette with Navy/Red/Gold accents and a persistent toggle.

### Priority 2: Input presets [DONE ✅]
I added 6 preset cards with icons and hover effects.

### Priority 3: Background texture + pattern [DONE ✅]
I added a noise grain overlay and a dot grid.

### Priority 4: Holographic shimmer [DONE ✅]
I built multi-layered iridescent CSS with pointer tracking.

### Priority 5: Card center visual [DONE ✅]
I built the `RadarVisual` component to generate shapes from data.

### Priority 6: Card spacing [DONE ✅]
I fixed the 5:7 aspect ratio, padding, and metallic borders.

### Priority 7: Loading state [DONE ✅]
I built a shimmer skeleton with pulsing placeholders.

### Priority 8: Entrance animation [DONE ✅]
I added a scale/opacity reveal and staggered counters.

### Priority 9: 3D card flip [DONE ✅]
I refined the 3D rotation with a midpoint pulse.

### Priority 10: Team USA branding [DONE ✅]
I added the top brand ribbon and navy header.

### Priority 11: Results page content [DONE ✅]
I added the narrative text, era badges, and share actions.

### Priority 12: 3D depth [DONE ✅]
I added perspective tilt to presets and translateZ stat boxes.

---

## Final Scores

1. **Team USA identity:** 5/5
2. **Visual engagement:** 5/5
3. **Card collectibility:** 5/5
4. **Typography quality:** 5/5
5. **Spacing rhythm:** 5/5
6. **Texture and depth:** 5/5
7. **Motion quality:** 5/5
8. **Light/dark quality:** 5/5
9. **Mobile experience:** 4/5
10. **Datedness test:** 5/5
