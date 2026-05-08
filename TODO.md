# Holo-Type Implementation Checklist: Rule Alignment & Fixes

## Phase 1: API Route & Data Structure Alignment
*Goal: Align the backend with the DESIGN.md spec and fix the "Diagnostic failed" error.*

- [x] **Interface Update:** Update `Archetype` interface in `app/api/generate/route.ts` to use `stats: Record<string, number>`.
- [x] **Validation Logic:** Update `validateArchetype` to verify `stats` is an object with numeric values instead of an array.
- [x] **Model Selection:** Change `modelId` from `models/gemini-3-flash-preview` to `models/gemini-3-flash`.
- [x] **Prompt Engineering:** Update `systemInstruction` in `route.ts` to strictly require the object structure for `stats` with keys: `resilience`, `purposefulFocus`, `workEthic`, `adaptability`.
- [x] **SDK Fix:** Change `response.text` to `response.text()` call to correctly retrieve AI output.
- [x] **Error Details:** Ensure the catch block returns the specific error `message` as `details` in the JSON response.

## Phase 2: Frontend Data Adaptation
*Goal: Update frontend components to consume the new object-based stats structure.*

- [x] **Interface Update:** Update `Archetype` interface in `app/components/ArchetypeGenerator.tsx` to match the backend (`stats: Record<string, number>`).
- [x] **RadarVisual Refactor:** Modify `RadarVisual` to accept the stats object and map over `Object.entries(stats)` for point calculation.
- [x] **CardContent Refactor:** Update the stats grid in `CardContent` to map over `Object.entries(archetype.stats)`.
- [x] **Submit Logic:** Update `handleSubmit` in `ArchetypeGenerator.tsx` to include `data.details` in the error display if available.
- [x] **Prop Drilling:** Ensure `PosterGenerator` (if applicable) is updated to handle the new stats structure.

## Phase 3: Verification & Security
*Goal: Validate all changes and ensure zero regressions.*

- [x] **Security Audit:** Run `node scripts/verify_security.js` and ensure all tests pass.
- [x] **Manual Testing:** Verify "Morning Sprinter" preset generates a valid card with the new 4-trait radar chart.
- [x] **UI/UX Check:** Confirm 3D flip and holographic shimmer still function correctly with the new data mapping.
- [x] **Error State Check:** Force a rate limit or invalid input to verify the new detailed error reporting works.
