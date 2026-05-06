# holo-type Project Instructions

This is a modern web application built with Next.js 16 and React 19.

## Project Overview

- **Framework:** Next.js 16.2.4 (App Router)
- **Library:** React 19.2.4
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Architecture:** Standard Next.js App Router structure.

## Key Mandates & Conventions

### ⚠️ Critical: Version-Specific Rules
This project uses a version of Next.js (16.2.4) that contains breaking changes compared to earlier versions.
- **Reference Documentation:** ALWAYS consult the internal documentation at `node_modules/next/dist/docs/` before implementing new features or making significant changes.
- **Deprecation Notices:** Pay close attention to and strictly follow all deprecation notices.
- **Instant Navigation:** If you encounter slow client-side navigations, `Suspense` alone may be insufficient. You must also export `unstable_instant` from the route. Refer to `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.mdx` for details.

### Development Workflow
- **Development Server:** `npm run dev`
- **Build:** `npm run build`
- **Production Start:** `npm run start`
- **Linting:** `npm run lint`

### Styling
- Use Tailwind CSS 4 for all styling.
- Follow the established aesthetic: clean, modern, using the Geist font family.
- Dark mode is supported via `dark:` classes.

### Components
- Prefer Server Components by default.
- Use Client Components only when necessary (e.g., for interactivity, hooks).
- Maintain the file-based routing convention of the App Router.

## Directory Structure

- `app/`: Contains the application routes, layouts, and global styles.
- `public/`: Static assets (images, icons, etc.).
- `node_modules/next/dist/docs/`: Internal framework documentation (CRITICAL for reference).
