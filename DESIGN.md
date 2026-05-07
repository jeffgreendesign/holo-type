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

### Priority 12: 3D depth [REFINED ✅]
I implemented a high-performance 3D stack. To avoid text warping and glitching, the internal card content is now rendered as a flat stack (removing translateZ from text/stats). The 3D effect is preserved through a stable 1500px perspective and heavy spring physics (mass: 1.2, damping: 40), while the metallic shimmer is achieved using internal `color-dodge` and `overlay` layers that react to pointer movement.

---

## Design Log: v4 Physicality Pass (May 7, 2026)

### 1. Liquid Physics Restoration
The card's movement was refined for a "premium" feel. I increased the spring mass to 1.2 and damping to 40. This removes high-frequency jitter and creates a heavy, liquid-like momentum. The card no longer feels like paper; it feels like a heavy, composite material artifact.

### 2. Flat 3D Architecture
To resolve "Z-fighting" and text warping at steep angles, I moved from a "floating layer" model to a "flat stack" model. All UI elements (labels, stats, icons) sit on the card's surface. The sense of depth is now provided by the high-range rotation (30 degrees) and the way light interacts with the metallic foil layers, rather than physical Z-offsets which were prone to browser rendering glitches.

### 3. Metallic Foil Shimmer (Simey-Style)
I completely rebuilt the holographic iridescence to match the fidelity of the `simeydotme/pokemon-cards-css` reference. 
- **Base Layer:** A silver-holo grain layer with `mix-blend-overlay`.
- **Foil Layer:** A `conic-gradient` color foil using `mix-blend-color-dodge` that rotates with the mouse.
- **Glare Layer:** A high-intensity `soft-light` glare that follows the light source.
These layers are contained within the card face's clipped container, ensuring they react to tilt without breaking the 3D flip.

---

## Design Log: v3 Polish Pass (May 6, 2026)

### 1. Stat Label Readability
The original stat boxes suffered from label truncation at smaller viewports. I restructured the layout to a vertical stack. This allows labels like DECISION MAKING or MENTAL FORTITUDE to wrap naturally over two lines. No more ellipsis. The labels now use 60% opacity to maintain hierarchy while remaining legible.

### 2. Narrative Typography Upgrade
The all-caps italic monospace narrative was hard to read at length. I introduced a two-tier type system. Readout text (labels, status, stats) stays clinical and monospace. The narrative paragraph now uses Source Sans 3 in sentence case. This provides a human, readable center to the archival instrument feel. Max-width is constrained to 60ch for optimal line length.

### 3. Light Mode Definition
Preset cards in light mode felt washed out. I pushed the definition harder by increasing border weight to 1.5px and adding a subtle inset shadow. This creates the feeling of a physical artifact sitting into the page. Icon and label opacity were boosted for better contrast against the cream background.

### 4. Share Artifact (TRANSMIT)
The TRANSMIT action now produces a high-fidelity shareable poster. Using html-to-image and portal rendering, the app generates 9:16 Story and 1:1 Square formats. These posters feature the archetype card against a signal-field grid with archival headers and unique vector hashes. Users can download or copy these images directly to their clipboard for social sharing.

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
