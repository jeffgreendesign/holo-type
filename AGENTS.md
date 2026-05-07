# Holo-Type: Project Context

Holo-Type is a modern web application for generating AI-powered athlete archetypes with a holographic aesthetic.

## Technical Stack
- **Next.js 16.2.4** (App Router)
- **React 19.2.4**
- **Tailwind CSS 4**
- **Google Gemini AI** (`gemini-2.5-flash`)
- **Animation:** `motion/react` (Framer Motion 12)
- **Icons:** `lucide-react`

## ⚠️ CRITICAL MANDATE
This version of Next.js has breaking changes. **Read the internal guides in `node_modules/next/dist/docs/` before writing any code.** Pay close attention to deprecation notices and the need for `unstable_instant` in some routes.

## Core Files
- `app/api/generate/route.ts`: AI generation logic using `@google/genai`. Uses a structured prompt for dual-narrative (Olympic/Paralympic) JSON responses.
- `app/page.tsx`: Holographic UI implementation with 3D card tilt, real-time glare, and radar visuals.

## Data Structure
The AI generates a JSON object with `title`, `narrative` (olympic/paralympic), `rarity`, `stats`, `era`, and `discipline`. Stats are visualized via a custom `RadarVisual` component.