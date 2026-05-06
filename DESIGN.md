# DESIGN.md — Holo-Type Visual Upgrade

## What This File Is

This is the design direction spec for upgrading Holo-Type's visual quality. Presentation Quality is 30% of hackathon judging. The app works. Now it needs to look like a polished consumer sports product, not a developer prototype.

Read this entire file before writing any code. Reference it during implementation the same way you reference CLAUDE.md.

---

## Stack (do not deviate)

- **Next.js 16.2.4** (App Router). Read `node_modules/next/dist/docs/` before writing any route or component code. Breaking changes from 15.
- **React 19.2.4**
- **Tailwind CSS 4**. Config is CSS-first: use `@theme` blocks in CSS files and `@import "tailwindcss"`. There is no `tailwind.config.js`. All design tokens are native CSS custom properties.
- **Animation:** `motion/react` (Framer Motion 12). Import as `import { motion, AnimatePresence } from "motion/react"`.
- **Icons:** `lucide-react` only. No other icon libraries.
- **AI:** `@google/genai` with `gemini-2.5-flash`. Already implemented.
- **Fonts:** Google Fonts only (free, no licensing issues).

## Existing Data Structure (from Gemini response)

The API already returns this JSON shape. No backend changes needed.

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

The `era`, `discipline`, `rarity`, and `stats` fields are all available for the card layout. Use them.

---

## Current State (from screenshots, May 6 2026)

### Input screen (mobile)
- "HOLO-TYPE" bold italic condensed white display type. Good direction.
- Subtitle copy is correct: "Describe how you move through your day..."
- "PERSONAL IDENTITY INPUT" section label in caps tracking
- Textarea with solid placeholder copy
- Red "DISCOVER YOUR ARCHETYPE" full-width CTA
- Pure dark background. No texture, no pattern, no visual interest beyond text. Empty and sparse.

### Results screen (mobile)
- Paralympic Lens / Olympic Lens toggle. Red active state, gray inactive. Functional.
- Card with gold/amber border glow, dark gradient interior
- "ARCHETYPE" label + "UNIFIED" category + "RARE" badge. All present.
- Shield/checkmark icon as center visual. Generic. Needs replacement.
- "THE STEADFAST EXECUTOR" bold italic condensed. Strong.
- Red underline accent below title
- 4 stat boxes in a grid. Right concept, spacing is cramped.
- "SAVE COLLECTIBLE CARD" white primary CTA + "FIND NEW ALIGNMENT" secondary link

### What's working
- Display typeface choice and weight for "HOLO-TYPE" and archetype names
- Lens toggle concept
- Rarity badge
- Stat box concept (not execution)
- Button hierarchy (save primary, retry secondary)
- Fan-facing input mechanic is correct

### What's not working
- No light mode. Dark-only reads as dev tool, not sports product.
- Input screen is a dark void with a textarea. No presets, no visual engagement.
- No holographic shimmer on the card. Just a gold border glow.
- Center visual is a generic shield icon. Not data-derived, not unique per card.
- Card spacing is cramped. Labels too close to edges, stats too tight.
- No generation/loading animation between input and results.
- No card entrance animation.
- No 3D card flip for lens toggle. Just content swap.
- No texture or pattern anywhere. Flat surfaces throughout.
- Zero Team USA color identity. Could be any dark-themed app.
- Results page ends abruptly after the card. No narrative, no context, no share.

---

## Priority Order

Fix these in order. Do not skip ahead.

### Priority 1: Light mode + theme toggle

This is the single highest-impact change. Team USA's visual identity is red, white, navy, and gold against light backgrounds. The teamusa.org website uses a light base. Ralph Lauren's 2026 Team USA ceremony collection is cream-colored. The current all-dark app doesn't register as a sports product.

**Light mode palette (use CSS custom properties in `@theme` blocks):**
```
--bg-primary: #FAFAF8        /* warm off-white */
--bg-card: #FFFFFF            /* card surface */
--bg-card-elevated: #F5F4F2   /* preset cards, input areas */
--text-primary: #0A1628       /* near-navy for body text */
--text-secondary: #5A6577     /* medium gray for labels */
--text-tertiary: #8B95A5      /* light gray for placeholders */
--accent-red: #B31942         /* Team USA red. CTAs, Paralympic lens, active states */
--accent-navy: #002B5C        /* Olympic lens, borders, headers */
--accent-gold: #C5972C        /* card borders, rarity, premium touches */
--accent-gold-light: #E8D5A3  /* gold highlights */
--border-subtle: #E5E3DF      /* card borders, dividers */
```

**Dark mode palette (refine current):**
```
--bg-primary: #1A1816         /* warm dark, NOT pure black */
--bg-card: #242220            /* card surface, slightly lighter */
--bg-card-elevated: #2E2C29   /* preset cards, input areas */
--text-primary: #F0EDE8       /* warm white */
--text-secondary: #9A9590     /* medium warm gray */
--text-tertiary: #6B6560      /* dim gray */
--accent-red: #C41E3A         /* slightly brighter red for dark bg */
--accent-navy: #3A6FA0        /* lighter navy for dark bg */
--accent-gold: #D4A843        /* gold */
--accent-gold-light: #E8D5A3  /* gold highlights */
--border-subtle: #3A3835      /* borders */
```

**Theme toggle:** Use a `lucide-react` Sun/Moon icon in the top-right corner. Small, unobtrusive. Use `prefers-color-scheme` as the default, with manual override stored in `localStorage`.

**Default the demo video to light mode.** Judges see 3 minutes. Light mode with Team USA colors reads as "polished sports product" instantly.

### Priority 2: Input presets

The empty textarea causes decision paralysis. Add visual preset cards above it.

**6 preset cards in a 2x3 grid (mobile) or horizontal scroll row (desktop):**

Each card:
- Small abstract icon from `lucide-react` (Zap, Timer, Users, Wrench, Mountain, Shuffle)
- Short label in display font (14-16px, bold): "The Morning Sprinter"
- One-sentence description in body font (12-13px): "I hit the ground running. Fast decisions, fast pace, first one done."
- Subtle border. Background uses `--bg-card-elevated`.
- On hover/tap: border shifts to `--accent-red` or `--accent-gold`, slight scale (1.02)
- Tapping fills the textarea with the preset text. User can edit before submitting.

**Presets:**
1. Zap icon — "The Morning Sprinter" — "I hit the ground running. Fast decisions, fast pace, first one done."
2. Timer icon — "The Steady Pacer" — "I build momentum slowly. Consistency over bursts. I finish what I start."
3. Users icon — "The Team Captain" — "I organize people. I read the room. I make the group better than the sum."
4. Wrench icon — "The Precision Craftsman" — "I work with my hands. Details matter. I measure twice."
5. Mountain icon — "The Endurance Runner" — "Long days don't scare me. I outlast problems. Patience is my edge."
6. Shuffle icon — "The Adaptive Strategist" — "I read the situation and adjust. No fixed playbook. I improvise."

Below the presets: a subtle "Or describe yourself:" label, then the textarea.

### Priority 3: Background texture + pattern

Kill the flat void.

**Noise overlay (both modes):**
Add a pseudo-element on the body or main container with a subtle grain texture. CSS approach:
```css
.noise-overlay::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,..."); /* tiny noise SVG */
  /* OR use SVG filter: */
  filter: url(#noise);
}
```
Keep opacity at 3-5%. In light mode: dark noise on light. In dark mode: light noise on dark.

**Geometric pattern (optional, atmospheric):**
A very faint diagonal line pattern or dot grid behind content at 2-3% opacity. Evokes track lane markings or scoring matrix. Applied to the page background, never competing with content.

### Priority 4: Holographic shimmer on the card

Use the approach from Simon Goellner's Pokemon Cards CSS work (github.com/simeydotme/pokemon-cards-css). This is the proven implementation.

**Architecture:**
```
.card-container (perspective: 800px)
  └─ .card-inner (transform-style: preserve-3d, pointer-tracked tilt)
       ├─ .card-base (background gradient, border, border-radius)
       ├─ .holo-bg (iridescent radial-gradient, mix-blend-mode: color-dodge)
       ├─ .holo-lines (repeating-linear-gradient shimmer, mask-image)
       └─ .card-content (text, stats, center visual — z-index above holo layers)
```

**JavaScript pointer tracking:**
```typescript
// In a React ref callback or useEffect
const handlePointerMove = (e: PointerEvent) => {
  const rect = cardRef.current.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;  // 0 to 1
  const y = (e.clientY - rect.top) / rect.height;   // 0 to 1
  const ratioX = (x - 0.5) * 2;  // -1 to 1
  const ratioY = (y - 0.5) * 2;  // -1 to 1

  cardRef.current.style.setProperty('--ratio-x', String(ratioX));
  cardRef.current.style.setProperty('--ratio-y', String(ratioY));
};
```

**CSS layers:**
```css
.card-inner {
  transform:
    rotateY(calc(-15deg * var(--ratio-x)))
    rotateX(calc(15deg * var(--ratio-y)));
  transition: transform 100ms ease-out;
}

.holo-bg {
  background: radial-gradient(
    circle at calc(50% + var(--ratio-x) * 30%) calc(50% + var(--ratio-y) * 30%),
    #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6, #ff6b6b
  );
  mix-blend-mode: color-dodge;
  filter: brightness(0.7) contrast(1.5);
  opacity: var(--holo-intensity);
}

.holo-lines {
  background: repeating-linear-gradient(
    calc(45deg + var(--ratio-x) * 20deg),
    transparent 0px,
    rgba(255,255,255,0.1) 1px,
    transparent 2px,
    transparent 4px
  );
  mask-image: radial-gradient(
    circle at calc(50% + var(--ratio-x) * 40%) calc(50% + var(--ratio-y) * 40%),
    black 20%, transparent 80%
  );
  opacity: var(--holo-intensity);
}
```

**Rarity-based intensity (set `--holo-intensity` via inline style or class):**
- Common: `--holo-intensity: 0` (matte card, no shimmer)
- Uncommon: `--holo-intensity: 0.3`
- Rare: `--holo-intensity: 0.6`
- Holo Rare: `--holo-intensity: 1.0`

**On pointer leave:** Animate `--ratio-x` and `--ratio-y` back to 0 over 400ms.
**On mobile:** Use touch events via the same pointer normalization. Gyroscope is a stretch goal.

### Priority 5: Card center visual

Replace the shield/checkmark with a data-derived abstract shape. This is what makes each card unique and screenshot-worthy.

**Recommended approach: radial stat visualization.**
Build an SVG that uses the 4 stat values to control shape:
- 4 axes radiating from center (like a spider/radar chart but styled as a glowing visualization)
- Each axis length = stat value normalized (0-100 → 0-1 → radius)
- Connect points with a filled polygon using `--accent-red` at 20% opacity with a 1px stroke
- Add a pulsing glow behind the shape using a radial gradient
- Rotate the entire shape slowly (1 revolution per 30 seconds) for subtle life

This visual changes with every archetype because the stat values change. It's data-driven, not decorative.

**Alternative approaches (if radar feels too chart-like):**
- Concentric rings where each ring's radius corresponds to a stat value
- A waveform/oscilloscope where frequency, amplitude, phase, and decay map to the 4 stats
- A geometric rosette built from overlapping circles at stat-derived positions

### Priority 6: Card spacing fixes

Current card is cramped. Fix with these specific values:

```
Card border-radius: 12px
Card padding: 20px horizontal, 20px vertical
Card aspect ratio: approximately 5:7 (trading card proportions)

Top section (ARCHETYPE label + discipline + rarity badge):
  - 0px from top padding
  - ARCHETYPE label: 10px caps, tracking 0.15em, --text-secondary
  - Discipline value: 14px, semibold, --accent-red
  - RARE badge: positioned top-right, 10px caps, tracking 0.1em
  - 16px gap below this section

Center visual:
  - Height: ~120-140px
  - Centered horizontally
  - 16px gap below

Archetype name:
  - Display font, 28-32px, bold italic
  - --text-primary
  - Red underline accent: 40px wide, 2px thick, 8px below name
  - 20px gap below (with optional 1px divider at 10% opacity)

Stats grid:
  - 3 columns, 8px gap
  - Stat label: 9-10px caps, tracking 0.12em, --text-secondary
  - Stat value: 24-28px, bold, mono/tabular font, --text-primary
  - If 4 stats: 3 top row + 1 bottom-left
  - Each stat box: subtle border (1px --border-subtle), 8px padding, 4px border-radius

Bottom padding: 20px
```

**Card border:**
Replace ambient glow with a solid metallic border:
- 2px solid border with gradient: `linear-gradient(135deg, var(--accent-gold), var(--accent-gold-light), var(--accent-gold))`
- Rarity determines treatment:
  - Common: `--border-subtle` (gray/silver)
  - Uncommon: bronze gradient (#8B6914 → #C9A84C → #8B6914)
  - Rare: gold gradient (current gold values)
  - Holo Rare: animated iridescent border (hue-rotate on a rainbow gradient, 3s loop)

### Priority 7: Generation loading state

When user taps "DISCOVER YOUR ARCHETYPE":

1. CTA button shows loading state (text changes to "Discovering...", subtle pulse)
2. Input form fades out and scales to 0.98 over 300ms using `motion/react`
3. Card-shaped skeleton appears at correct proportions (5:7 aspect ratio)
4. Skeleton has holographic shimmer animation:
```css
@keyframes skeleton-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.card-skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-card) 0%,
    var(--bg-card-elevated) 40%,
    var(--bg-card) 60%,
    var(--bg-card-elevated) 80%,
    var(--bg-card) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.8s ease-in-out infinite;
}
```
5. Inside the skeleton: faint placeholder regions (title bar, circle for center visual, stat rectangles) pulsing at staggered intervals
6. Small text below: "Analyzing your archetype..." in body font, opacity pulsing

### Priority 8: Card entrance animation

When Gemini data arrives:

1. Quick brightness flash on the skeleton (200ms white overlay, opacity 0 → 0.3 → 0)
2. Real card fades in: scale 0.92 → 1.0 over 500ms, spring easing
3. Holographic shimmer intensity ramps from 0 to rarity level over 1.5 seconds
4. Stats animate with staggered counters: each value counts from 0 → final over 600ms, with 120ms stagger between each stat

Use `motion/react` for orchestration:
```tsx
<motion.div
  initial={{ scale: 0.92, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", stiffness: 200, damping: 20 }}
>
  {/* card content */}
</motion.div>
```

### Priority 9: 3D card flip for lens toggle

The Paralympic/Olympic toggle should trigger a real 3D flip, not a content swap.

```tsx
// Card structure
<div className="card-container" style={{ perspective: "800px" }}>
  <motion.div
    className="card-inner"
    animate={{ rotateY: isOlympicLens ? 180 : 0 }}
    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    style={{ transformStyle: "preserve-3d" }}
  >
    <div className="card-front" style={{ backfaceVisibility: "hidden" }}>
      {/* Paralympic lens content */}
    </div>
    <div
      className="card-back"
      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", position: "absolute", inset: 0 }}
    >
      {/* Olympic lens content */}
    </div>
  </motion.div>
</div>
```

Add a subtle scale pulse at the flip midpoint. Animate scale to 1.03 at 350ms, back to 1.0 at 700ms, overlaid on the rotateY.

The toggle buttons remain above the card. Active lens button uses `--accent-red` (Paralympic) or `--accent-navy` (Olympic) background.

### Priority 10: Team USA color presence

Distribute red, navy, and gold intentionally:

- **Red (`--accent-red`):** Primary CTA buttons, Paralympic lens active state, preset card hover border, the red underline below archetype name
- **Navy (`--accent-navy`):** Olympic lens active state, section labels ("PERSONAL IDENTITY INPUT", "ARCHETYPE"), link hover states in light mode
- **Gold (`--accent-gold`):** Card border (Rare+), rarity badge background, premium accents
- **White/cream:** Light mode backgrounds, card surface
- In light mode: add a 3px gradient bar at the very top of the viewport (`linear-gradient(90deg, --accent-red, --accent-navy)`) as a subtle flag ribbon. Fixed position, never scrolls.

### Priority 11: Results page content below card

The page currently ends after the card and two buttons. Add:

1. **Archetype narrative** (from `narrative.paralympic` or `narrative.olympic` depending on active lens). 2-3 sentences in body font, max-width 520px, centered. This is where the longer Gemini text lives. NOT on the card face.
2. **Era badge:** "Athletes in this archetype span the `{era}` era of Team USA history." Small text with the era value styled in the display font.
3. **Trust expandable:** A `lucide-react` Info icon + "How was this determined?" as a collapsible. Shows: "Matched using Gemini 2.5 Flash against 120 years of Team USA athlete data. Confidence framing uses conditional language." Keep it understated.
4. **Share row:** A Copy Link button (Clipboard icon from lucide-react) and native Share button (Share2 icon) using the Web Share API where available.
5. "SAVE COLLECTIBLE CARD" remains primary. "FIND NEW ALIGNMENT" remains secondary below it.

### Priority 12: 3D depth touches (stretch)

If everything above is solid:
- Preset cards on hover: `transform: perspective(600px) rotateX(-2deg) rotateY(2deg)` with 200ms transition
- Layered shadows on card and presets: `box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04), 0 12px 24px rgba(0,0,0,0.03);` (light mode values)
- Stat boxes with very subtle `translateZ(2px)` and `transform-style: preserve-3d` on the parent to float above card surface

---

## Typography

**Google Fonts selections (all free, verified available):**

- **Display:** Barlow Condensed 700 Italic. Use for "HOLO-TYPE" wordmark, archetype names, page headings. Condensed athletic character with italic energy. Import: `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,700&display=swap');`
- **Body:** Barlow 400, 500, 600. Clean, readable, same family as display so they pair perfectly. Import: `@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&display=swap');`
- **Mono/Stats:** JetBrains Mono 700. For stat values, data points, era dates. Import: `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');`

Define in Tailwind 4 `@theme`:
```css
@theme {
  --font-display: 'Barlow Condensed', sans-serif;
  --font-body: 'Barlow', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

**Hierarchy rules:**
- Archetype name: `--font-display`, 28-32px, 700 italic, tight tracking (-0.01em)
- Section labels ("ARCHETYPE", "PERSONAL IDENTITY INPUT"): `--font-body`, 10-11px, 600, caps, tracking 0.12-0.15em
- Body text (narrative, descriptions): `--font-body`, 14-16px, 400
- Stat values: `--font-mono`, 24-28px, 700
- Stat labels: `--font-body`, 9-10px, 500, caps, tracking 0.12em

---

## What NOT to Do

- No purple-blue AI gradient blobs
- No glassmorphism panels
- No bento grid layouts
- No over-rounded buttons (use 6-8px radius for buttons, 12px for cards)
- No emoji as design elements (kill the shield icon, replace with data viz)
- No "powered by AI" or "built with Gemini" badges in the UI (keep in trust expandable only)
- No robot/AI imagery
- No fake loading percentage counters or progress bars
- No confetti or particle explosions on reveal
- No Olympic rings, torch, cauldron, or other USOPC/IOC restricted marks anywhere (disqualification risk)
- No athlete photos, illustrations, or likenesses (NIL rules)
- No Inter, Roboto, Space Grotesk, or system fonts
- No walls of text on the card face. Card is visual-first. Narrative lives below.
- No visible unstyled shadcn defaults. Every component is intentionally styled.
- No `tailwind.config.js` (Tailwind 4 uses CSS-first config)
- No `import { motion } from "framer-motion"` (correct path is `"motion/react"`)
- No icon libraries other than `lucide-react`

---

## Screenshot Critique Rubric

After each implementation pass, score 1-5 on each dimension. Then name the 5 most generic remaining choices and the 3 changes with highest visual ROI.

1. **Team USA identity:** Does this feel like a sports product connected to Team USA?
2. **Visual engagement:** Would a non-technical person find this exciting?
3. **Card collectibility:** Would you screenshot this card and share it?
4. **Typography quality:** Is the type system distinctive and well-hierarchied?
5. **Spacing rhythm:** Consistent, generous, no cramping?
6. **Texture and depth:** Does the page have physical presence or feel flat?
7. **Motion quality:** Are transitions smooth, purposeful, and satisfying?
8. **Light/dark quality:** Do both modes feel intentional and polished?
9. **Mobile experience:** Does this feel native-app quality on a phone?
10. **Datedness test:** Would this look current in 6 months?
