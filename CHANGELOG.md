# Changelog

All notable changes to this project go here.

I'm following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-05-11

### Added
- **Error Boundaries:** Wrapped the application in an `ErrorBoundary` to ensure stability and prevent white-screens during demonstrations.
- **Hardened API:** Enhanced `/api/generate` with stricter input validation and response schema enforcement.
- **Archival Aesthetic:** Integrated a high-fidelity archival aesthetic into the UI, including custom shaders and a style guide.
- **Visual Effects:** Added a "Gold Holo" shader and pixelate filter utilities for enhanced holographic depth.
- **Internal Tools:** Added a hackathon documentation fetcher for streamlined resource access.

### Changed
- **UI Optimization:** Redesigned the stat display with a 2x2 grid and vertical compression to optimize visual balance.
- **Modular Refactor:** Refactored the core `ArchetypeGenerator` into focused modules for better maintainability.
- **Documentation:** Extensively updated the README and project documentation for judge-readiness.

## [0.3.0] - 2026-05-09

### Added
- **Historical Data Grounding:** Integrated a curated dataset of 120 years of Team USA history to ground AI-generated archetypes in real Olympic and Paralympic legacy.
- **Legacy Analysis:** AI now analyzes movement patterns against regional hotspots and historical physical traits (averages).
- **Model Refresh:** Transitioned to `gemini-3.1-flash-lite` for the core analysis engine.

### Changed
- **Documentation:** Updated `GEMINI.md` and `README.md` to reflect the new data grounding architecture and testing procedures.

## [0.2.1] - 2026-05-08

### Fixed
- **PostCSS Vulnerability:** Resolved CVE-2026-41305 by forcing `postcss@^8.5.10` via package overrides.

### Added
- **Data Structure Alignment:**
    - Refactored `Archetype` interface to use an object-based `stats` structure (`Record<string, number>`) for better predictability and radar mapping.
    - Updated `systemInstruction` and `validateArchetype` to enforce strict keys: `resilience`, `purposefulFocus`, `workEthic`, `adaptability`.
- **Security Hardening:**
    - Implemented **Content-Security-Policy (CSP)** and standard security headers in `next.config.ts`.
    - Added **API Rate Limiting** (5 req/min per IP) to the `/api/generate` endpoint.
    - Enhanced **Prompt Protection** using triple-quote delimiters and untrusted data markers.
    - Integrated **Response Schema Validation** to ensure AI output integrity.
    - Enforced **Request Size Limits** (500 chars) and sanitization on user input.
- **Frontend Refactor:**
    - Updated `RadarVisual` and `CardContent` to dynamically map over the new object-based stats structure.
    - Improved **Client-side Error Reporting** to show specific API error messages (including `details`) instead of a generic "Diagnostic failed" warning.

## [0.2.0] - 2026-05-07

### Added
- **Metallic Foil Iridescence:** Implemented high-fidelity metallic shimmer using `mix-blend-color-dodge` and `overlay` layers, matching premium trading card aesthetics.
- **Enhanced Physics:** Tuned `motion/react` spring constants (`mass: 1.2`, `damping: 40`) for liquid-smooth, "heavy" card movement.

### Fixed
- **3D Glitching:** Resolved flickering and transparency issues during card flips by isolating face containers and adding a `0.5px` Z-offset.
- **Text Warping:** Fixed "double-layer" text distortion by transitioning to a flat-stack internal architecture.
- **Hover Tilt:** Restored and boosted hover tilt sensitivity (30°) with explicit CSS transform strings for better browser compatibility.

### Changed
- Refined the 3D perspective to 1500px for more stable viewing angles.
- Simplified internal component hierarchy to prevent 3D context flattening.

### Docs
- Updated `DESIGN.md` and `GEMINI.md` to reflect the new 3D architecture and visual strategy.

## [0.1.0] - 2026-05-06

### Added
- **Holographic UI:** Added 3D card interactions, real-time glare, and iridescent shimmer.
- **Radar Visuals:** Built dynamic radar charts from AI-generated athlete stats.
- **3D Card Flip:** Added interactive 3D rotation to switch between Olympic and Paralympic views.
- **Input Presets:** Added 6 cards to help you quickly pick an identity.
- **Dual Narrative AI:** Updated the Gemini prompt to generate dual-lens archetypes.
- **Theme Support:** Added light and dark modes with Team USA colors.
- **Microsite:** Integrated clinical copy and high-fidelity prototype styles.

### Fixed
- Fixed mirrored content on Olympic card faces.
- Fixed 3D tilt and proportions across themes.
- Fixed Next.js 16 build errors by refactoring route configs and enabling `cacheComponents`.
- Updated Gemini model ID to `gemini-2.5-flash`.
- Fixed secret mapping in `apphosting.yaml`.

### Changed
- Switched the theme to warm dark with Team USA accents.
- Improved performance for visuals and entrance animations.
- Refined rarity schema and metallic borders.

### Docs
- Updated `README.md`, `GEMINI.md`, `CLAUDE.md`, and `AGENTS.md`.
- Added this `CHANGELOG.md`.
