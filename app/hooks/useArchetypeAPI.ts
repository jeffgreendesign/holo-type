"use client";

import { useState } from "react";
import type { Archetype } from "../lib/types";

export function useArchetypeAPI() {
  const [loading, setLoading] = useState(false);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [error, setError] = useState("");

  const generate = async (userInput: string) => {
    setLoading(true);
    setError("");
    setArchetype(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Diagnostic failed");
      }

      setArchetype(data as Archetype);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loading, archetype, setArchetype, error, generate };
}
