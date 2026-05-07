# Holo-Type: Context

Holo-Type turns athlete bios into AI-generated archetypes with a holographic aesthetic.

## Tech Stack
- **Next.js 16.2.4** (App Router)
- **React 19.2.4**
- **Tailwind CSS 4**
- **Google Gemini AI** (`gemini-2.5-flash`)
- **Animation:** `motion/react` (Framer Motion 12)
- **Icons:** `lucide-react`

## ⚠️ CRITICAL
This version of Next.js has breaking changes. Read the internal guides in `node_modules/next/dist/docs/` before you write any code. Watch for deprecation notices and use `unstable_instant` if you need to.

## Core Files
- `app/api/generate/route.ts`: AI logic. It uses a prompt to get dual-narrative (Olympic/Paralympic) JSON.
- `app/page.tsx`: Holographic UI with 3D card tilt, glare, and radar visuals.

## Data Structure
The AI sends a JSON object with `title`, `narrative`, `rarity`, `stats`, `era`, and `discipline`. The `RadarVisual` component shows the stats.
