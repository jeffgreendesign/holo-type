# Team USA Historical Dataset (1896-2022)

This directory contains sanitized and aggregated historical data used to ground the Holo-Type archetype generator in 120 years of Team USA excellence.

## Dataset Files

- **`team_usa_historical.json`**: A sanitized archive of ~6,000 Team USA medalists.
- **`team_usa_summary.json`**: An aggregated summary of physical traits (height/weight) and regional "hotspots" organized by sport and era. This file is used as grounding context for the Gemini AI.

## Compliance & Processing Strategy

To adhere to the "Vibe Code for Gold with Google" hackathon rules, the following steps were taken to process the raw Olympedia data:

1.  **Public Focus (Mandatory):** Data was sourced from the open-source historical archive mirroring official Team USA records.
2.  **USA-Only Filter:** All international data was stripped, retaining only records where `NOC == 'USA'`.
3.  **NIL Sanitization (Strict):** All individual athlete **Names** and **IDs** were permanently removed from the dataset. The application generates conceptual archetypes based on "the spirit of the data" rather than individual likenesses.
4.  **Result Sanitization:** Specific finish times and scores were excluded. Only the `Sport`, `Event`, `Year`, and `Medal` status were retained to characterize the historical legacy.
5.  **Grounding Logic:** Instead of "hallucinating" traits, the AI uses `team_usa_summary.json` to identify average physical profiles and regional associations (hometown regions) for specific sports eras.

## Schema (Summary Data)

```json
{
  "sport": "Athletics",
  "era": "1980s",
  "total_medals": 45,
  "avg_height_cm": 182.4,
  "avg_weight_kg": 75.6,
  "top_regions": ["California", "Texas", "Florida"]
}
```

## Source
Processed from the [KeithGalli/Olympics-Dataset](https://github.com/KeithGalli/Olympics-Dataset) repository, which aggregates data scraped from Olympedia.org.
