import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { name, sport, bio } = await req.json();

    if (!name || !sport || !bio) {
      return NextResponse.json(
        { error: "Name, sport, and bio are required" },
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
      Your task is to analyze an athlete's profile and identify their "Historical Alignment" with Team USA's 120-year legacy of Olympic and Paralympic excellence.

      Athlete Profile:
      Name: ${name}
      Sport: ${sport}
      Bio: ${bio}

      Requirements:
      1. CRITICAL: Use CONDITIONAL PHRASING (e.g., "This data suggests," "You could align with," "Potential path toward"). Never guarantee performance results.
      2. PARITY: Treat Olympic and Paralympic disciplines with equal depth and prominence.
      3. INSIGHT: Focus on the "Digital Mirror"—helping the fan/athlete see how their traits reflect the collective power of Team USA.

      An Archetype consists of:
      1. A short, iconic Title (e.g., "The Aerobic Powerhouse", "The Precision Tactician").
      2. A 2-3 sentence Narrative describing their essence and potential alignment with Team USA history.
      3. A Classification: Specify if this archetype is common in "Olympic", "Paralympic", or "Unified" (both) disciplines.

      Return ONLY a JSON object in the following format:
      {
        "title": "ARCHETYPE_TITLE",
        "narrative": "ARCHETYPE_NARRATIVE",
        "classification": "Olympic | Paralympic | Unified"
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
