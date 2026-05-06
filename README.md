# Holo-Type: Holographic Athlete Archetype Generator

Holo-Type is a modern web application that leverages Google Gemini AI to generate compelling, high-impact "Athlete Archetypes" displayed on a premium holographic card UI.

## Features

- **AI-Powered Archetypes:** Uses `gemini-2.5-flash` to transform athlete bios into iconic titles and narratives.
- **Holographic UI:** A stunning, interactive card aesthetic built with Tailwind CSS 4, featuring iridescent borders and shimmer effects.
- **Modern Tech Stack:** Built with the latest versions of Next.js and React for optimal performance and developer experience.

## Tech Stack

- **Framework:** Next.js 16.2.4 (App Router)
- **Library:** React 19.2.4
- **AI Integration:** Google Gemini AI (`@google/genai`)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- A Google Gemini API Key

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Mandates

This project uses **Next.js 16.2.4**, which contains breaking changes. **Always** refer to the internal documentation at `node_modules/next/dist/docs/` before implementing features. See `GEMINI.md` for full architectural guidelines.
