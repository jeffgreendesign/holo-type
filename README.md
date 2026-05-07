# Holo-Type

Holo-Type uses Google Gemini AI to turn athlete bios into archetypes shown on holographic cards.

## Features

- **AI Archetypes:** Uses `gemini-2.5-flash` to turn bios into titles with Olympic and Paralympic narratives.
- **Holographic UI:** 3D card aesthetic built with Tailwind CSS 4 and Framer Motion. It has real-time glare and iridescent effects.
- **Radar Visuals:** Dynamic charts generated from the AI-generated stats.
- **3D Interactions:** Scale-in reveal, staggered counters, and a 3D flip to switch between Olympic and Paralympic views.
- **Input Presets:** 6 cards to quickly pick an identity.
- **Rarity System:** Metallic borders and shimmer that change based on rarity.
- **Modern Stack:** Built with Next.js 16, React 19, and Tailwind CSS 4.

## Tech Stack

- **Framework:** Next.js 16.2.4 (App Router)
- **Library:** React 19.2.4
- **AI:** Google Gemini AI (`@google/genai`)
- **Animation:** `motion/react` (Framer Motion 12)
- **Icons:** `lucide-react`
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- Google Gemini API Key

### Installation

1. Clone the repo.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### Development

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it.

## Development Mandates

This version of Next.js (16.2.4) has breaking changes. Read the internal docs at `node_modules/next/dist/docs/` before you build anything. Check `GEMINI.md` for the full architecture.
