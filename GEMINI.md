# Holo-Type Project Instructions

Holo-Type is a Next.js 16 and React 19 app that generates AI-powered athlete archetypes with a holographic aesthetic.

## Project Overview

- **Framework:** Next.js 16.2.4 (App Router)
- **Library:** React 19.2.4
- **AI:** Google Gemini AI (`gemini-3-flash`)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Architecture:** Next.js App Router with AI route handlers.

## Core Features

### 1. Archetype Generator (`app/api/generate/route.ts`)

- The backend uses `GoogleGenAI` (v2.0+) to talk to `gemini-3-flash-preview`.
- **Thinking Levels:** Uses `ThinkingLevel.MEDIUM` for enhanced reasoning and narrative quality.
- **Prompt:** Uses a structured `systemInstruction` to get a JSON response for an athlete archetype.
- **Data Shape:** The AI returns a JSON object with:
  - `title`: Archetype name.
  - `narrative`: Olympic and Paralympic lenses.
  - `rarity`: Common, Uncommon, Rare, or Holo Rare.
  - `stats`: 3-4 performance traits.
  - `era`: Historical timeframe.
  - `discipline`: Olympic, Paralympic, or Unified.
- **Strict JSON:** The model returns *only* JSON using `responseMimeType: "application/json"`.

### 2. Holographic UI (`app/page.tsx`)

- **Animation:** Powered by `motion/react` for 3D card tilt, entrance animations, and a 3D flip.
- **Visuals:** 
  - **Radar Chart:** `RadarVisual` component generates shapes from AI stats.
  - **Input Presets:** Preset cards for quick entry.
- **Icons:** `lucide-react`.
- **Effect:** Achieved with Tailwind CSS 4 features:
  - **Glare & Foil:** Mouse-tracking `conic-gradient` and `radial-gradient` using `mix-blend-color-dodge` and `overlay` for a metallic foil finish.
  - **3D Physics:** Refined spring constants (`mass: 1.2`, `damping: 40`, `stiffness: 120`) for liquid-smooth movement.
  - **Flat Stack:** Internal UI elements are flat on the card surface to avoid "Z-fighting" and warping, relying on high-range rotation (30°) for depth.
  - **Borders:** Iridescent gradients with `animate-gradient-x`.
  - **Glassmorphism:** `bg-zinc-950/90` and `backdrop-blur-xl`.

## Rules & Conventions

### ⚠️ CRITICAL: Next.js 16

This version has breaking changes.

- **Docs:** Read the internal docs at `node_modules/next/dist/docs/` before you build anything.
- **Deprecations:** Follow all deprecation notices.
- **Instant Navigation:** If client-side navigation is slow, export `unstable_instant` from the route. Check `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.mdx`.

### Styling

- Use Tailwind CSS 4.
- Follow the holographic aesthetic for cards.
- Dark mode is the primary theme (`zinc-950`).

### Components

- Use Server Components for data fetching.
- Use Client Components for forms and AI state.

## Design Direction

Read `DESIGN.md` before making visual changes. Follow the priority order.

## Directory Structure

- `app/`: Routes and styles.
- `app/api/generate/`: AI endpoint.
- `public/`: Static assets.
- `node_modules/next/dist/docs/`: Internal framework docs.
