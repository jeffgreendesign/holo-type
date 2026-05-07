# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-05-06

### Added
- **Holographic UI:** Complete visual upgrade with high-fidelity 3D card interactions, real-time glare, and iridescent shimmer.
- **Radar Visuals:** Dynamic radar chart generation based on AI-generated athlete stats.
- **3D Card Flip:** Seamless parity between Olympic and Paralympic narratives via interactive 3D rotation.
- **Input Presets:** 6 visual cards to streamline archetype selection and identity input.
- **Dual Narrative AI:** Updated `gemini-2.5-flash` prompt to generate dual-lens athlete archetypes.
- **Theme Support:** Full light and dark mode implementation using Team USA brand palette.
- **Experimental Microsite:** Clinical copy and high-fidelity prototype aesthetic integration.

### Fixed
- Resolved mirrored content issues on Olympic card faces.
- Fixed 3D tilt logic and proportions across different themes.
- Resolved Next.js 16 build errors by refactoring route segment configs and enabling `cacheComponents`.
- Updated Gemini model ID to `gemini-2.5-flash`.
- Corrected App Hosting secret mapping in `apphosting.yaml`.

### Changed
- Transitioned application theme to warm dark with primary Team USA accents.
- Optimized performance for visual components and entrance animations.
- Refined archetype rarity schema and metallic gradient borders.

### Docs
- Synchronized all root-level documentation (`README.md`, `GEMINI.md`, `CLAUDE.md`, `AGENTS.md`) with the finalized project state.
- Added this `CHANGELOG.md`.