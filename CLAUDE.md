<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (16.2.4) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Holo-Type: Holographic Athlete Archetype Generator

This project uses Google Gemini AI to transform sports data into compelling athlete archetypes, emphasizing the 120-year legacy of Team USA.

## Tech Stack
- **Next.js 16.2.4**
- **React 19.2.4**
- **Tailwind CSS 4**
- **motion/react** (Framer Motion 12)
- **Google Gemini AI** (`gemini-2.5-flash`)

## Domain Context & Logic
- **Target:** Sports analysts and athletes.
- **Dual Narrative:** Every archetype must have parity between Olympic and Paralympic legacy.
- **Output:** Structured JSON containing title, narrative, rarity, stats, era, and discipline.
- **Aesthetic:** High-end holographic cards with 3D interactions, dynamic glare, radar visuals, and 3D flip parity.

## Key Files
- `app/api/generate/route.ts`: AI prompt engineering and API logic.
- `app/page.tsx`: Interactive holographic card frontend.