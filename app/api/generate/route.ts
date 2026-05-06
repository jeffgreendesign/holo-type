import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json(
        { error: "User input is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-2.5-flash";

    const prompt = `
      You are a Senior Team USA Analyst powered by Gemini. 
      Your task is to analyze a user's description of how they move and work through their day, and identify their "Historical Alignment" with Team USA's 120-year legacy of Olympic and Paralympic excellence.

      User Context:
      "${userInput}"

      Requirements:
      1. CRITICAL: Use CONDITIONAL PHRASING (e.g., "This data suggests," "You could align with," "Potential path toward"). Never guarantee performance results.
      2. PARITY: Treat Olympic and Paralympic disciplines with equal depth and prominence.
      3. INSIGHT: Focus on the "Digital Mirror"—helping the fan see how their daily traits reflect the collective power of Team USA.
      4. RARITY: Assign a rarity based on the uniqueness or intensity of the alignment: Common, Uncommon, Rare, or Holo Rare.
      5. STATS: Generate 3-4 specific performance traits (e.g., Agility, Resilience, Precision, Power) with values from 50-99.
      6. DUAL NARRATIVE: Provide two distinct "lenses" for the same archetype—one for the Paralympic legacy and one for the Olympic legacy.

      Return ONLY a JSON object in the following format:
      {
        "title": "ARCHETYPE_TITLE (e.g., THE ENDURING ICON)",
        "narrative": {
          "olympic": "2-3 sentences max on the Olympic alignment.",
          "paralympic": "2-3 sentences max on the Paralympic alignment."
        },
        "rarity": "Common | Uncommon | Rare | Holo Rare",
        "stats": [
          { "label": "TRAIT_NAME", "value": NUMBER },
          { "label": "TRAIT_NAME", "value": NUMBER },
          { "label": "TRAIT_NAME", "value": NUMBER }
        ],
        "era": "e.g., 1984 - Present",
        "discipline": "Olympic | Paralympic | Unified"
      }
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response generated from Gemini");
    }

    const result = JSON.parse(resultText);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error generating archetype:", error);
    return NextResponse.json(
      { error: "Failed to generate archetype", details: message },
      { status: 500 }
    );
  }
}
