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
    const modelId = "gemini-3.1-flash-latest";

    const prompt = `
      You are an expert sports analyst and storyteller. 
      Generate a compelling "Athlete Archetype" for the following athlete:
      Name: ${name}
      Sport: ${sport}
      Bio: ${bio}

      An Archetype consists of:
      1. A short, iconic Title (e.g., "The Unstoppable Force", "The Silent Guardian").
      2. A 2-3 sentence Narrative describing their essence, playstyle, and impact.

      Return ONLY a JSON object in the following format:
      {
        "title": "ARCHETYPE_TITLE",
        "narrative": "ARCHETYPE_NARRATIVE"
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
  } catch (error: any) {
    console.error("Error generating archetype:", error);
    return NextResponse.json(
      { error: "Failed to generate archetype", details: error.message },
      { status: 500 }
    );
  }
}
