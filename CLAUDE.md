<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16.2.4

This version of Next.js has breaking changes. Read the guides in `node_modules/next/dist/docs/` before you write any code. Follow deprecation notices.
<!-- END:nextjs-agent-rules -->

# Holo-Type

Holo-Type uses Google Gemini AI to turn sports data into athlete archetypes with a focus on Team USA legacy.

## Tech Stack
- **Next.js 16.2.4**
- **React 19.2.4**
- **Tailwind CSS 4**
- **motion/react** (Framer Motion 12)
- **Google Gemini AI** (`gemini-3.1-flash-lite`)

## Domain & Logic
- **Target:** Sports analysts and athletes.
- **Dual Narrative:** Every archetype has Olympic and Paralympic versions.
- **Output:** JSON with title, narrative, rarity, stats, era, and discipline.
- **Aesthetic:** Holographic cards with 3D interactions, glare, radar visuals, and a 3D flip.

## Key Files
- `app/api/generate/route.ts`: AI prompt and API logic.
- `app/page.tsx`: Holographic card frontend.
