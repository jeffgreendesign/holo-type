# Holo-Type Project Instructions

This is a modern web application built with Next.js 16 and React 19, focused on generating AI-powered athlete archetypes with a holographic aesthetic.

## Project Overview

- **Framework:** Next.js 16.2.4 (App Router)
- **Library:** React 19.2.4
- **AI Integration:** Google Gemini AI (`gemini-2.5-flash`) via `@google/genai`.
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Architecture:** Standard Next.js App Router structure with integrated AI route handlers.

## Core Features & Logic

### 1. Archetype Generation (`app/api/generate/route.ts`)
- The backend uses the `GoogleGenAI` SDK to interact with `gemini-2.5-flash`.
- **Prompt Strategy:** Uses a structured prompt to generate a JSON response containing a "title" and a "narrative".
- **Strict JSON:** The model is instructed to return *only* a JSON object.

### 2. Holographic UI Aesthetic (`app/page.tsx`)
- The "Holographic" effect is achieved using Tailwind CSS 4 features:
  - **Iridescent Border:** `bg-gradient-to-r` with indigo, purple, pink, red, yellow, green, and teal, combined with `animate-gradient-x` and `blur-sm`.
  - **Shimmer Overlay:** `animate-shimmer` with a white linear gradient.
  - **Glassmorphism:** `bg-zinc-950/90`, `backdrop-blur-xl`, and `border-white/10`.

## Key Mandates & Conventions

### ⚠️ Critical: Version-Specific Rules
This project uses a version of Next.js (16.2.4) that contains breaking changes compared to earlier versions.
- **Reference Documentation:** ALWAYS consult the internal documentation at `node_modules/next/dist/docs/` before implementing new features or making significant changes.
- **Deprecation Notices:** Pay close attention to and strictly follow all deprecation notices.
- **Instant Navigation:** If you encounter slow client-side navigations, `Suspense` alone may be insufficient. You must also export `unstable_instant` from the route. Refer to `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.mdx` for details.

### Styling
- Use Tailwind CSS 4 for all styling.
- Follow the holographic aesthetic for card-like components.
- Dark mode is the primary theme (using `zinc-950`).

### Components
- Prefer Server Components for data fetching where possible.
- Use Client Components for interactive forms and AI generation state (as seen in `app/page.tsx`).

## Directory Structure

- `app/`: Routes, layouts, and global styles.
- `app/api/generate/`: AI generation endpoint.
- `public/`: Static assets.
- `node_modules/next/dist/docs/`: Internal framework documentation (CRITICAL for reference).
