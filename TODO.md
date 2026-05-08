# Holo-Type Implementation Checklist: Rule Alignment & Fixes

## Phase 1: API Route & Data Structure Alignment
*Goal: Align the backend with the DESIGN.md spec and fix the "Diagnostic failed" error.*

- [ ] **Interface Update:** Update `Archetype` interface in `app/api/generate/route.ts` to use `stats: Record<string, number>`.
- [ ] **Validation Logic:** Update `validateArchetype` to verify `stats` is an object with numeric values instead of an array.
- [ ] **Model Selection:** Change `modelId` from `models/gemini-3-flash-preview` to `models/gemini-3-flash`.
- [ ] **Prompt Engineering:** Update `systemInstruction` in `route.ts` to strictly require the object structure for `stats` with keys: `resilience`, `purposefulFocus`, `workEthic`, `adaptability`.
- [ ] **SDK Fix:** Change `response.text` to `response.text()` call to correctly retrieve AI output.
- [ ] **Error Details:** Ensure the catch block returns the specific error `message` as `details` in the JSON response.

## Phase 2: Frontend Data Adaptation
*Goal: Update frontend components to consume the new object-based stats structure.*

- [ ] **Interface Update:** Update `Archetype` interface in `app/components/ArchetypeGenerator.tsx` to match the backend (`stats: Record<string, number>`).
- [ ] **RadarVisual Refactor:** Modify `RadarVisual` to accept the stats object and map over `Object.entries(stats)` for point calculation.
- [ ] **CardContent Refactor:** Update the stats grid in `CardContent` to map over `Object.entries(archetype.stats)`.
- [ ] **Submit Logic:** Update `handleSubmit` in `ArchetypeGenerator.tsx` to include `data.details` in the error display if available.
- [ ] **Prop Drilling:** Ensure `PosterGenerator` (if applicable) is updated to handle the new stats structure.

## Phase 3: Verification & Security
*Goal: Validate all changes and ensure zero regressions.*

- [ ] **Security Audit:** Run `node scripts/verify_security.js` and ensure all tests pass.
- [ ] **Manual Testing:** Verify "Morning Sprinter" preset generates a valid card with the new 4-trait radar chart.
- [ ] **UI/UX Check:** Confirm 3D flip and holographic shimmer still function correctly with the new data mapping.
- [ ] **Error State Check:** Force a rate limit or invalid input to verify the new detailed error reporting works.
