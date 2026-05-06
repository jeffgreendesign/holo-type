"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [archetype, setArchetype] = useState<{
    title: string;
    narrative: string;
  } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setArchetype(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate archetype");
      }

      const data = await response.json();
      setArchetype(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Holo-Type
          </h1>
          <p className="text-zinc-400 text-lg">
            Generate your athlete archetype card.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-2xl space-y-6 backdrop-blur-sm"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-400 mb-1"
              >
                Athlete Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-zinc-100"
                placeholder="e.g. Elena Rodriguez"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="sport"
                className="block text-sm font-medium text-zinc-400 mb-1"
              >
                Sport
              </label>
              <input
                id="sport"
                type="text"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-zinc-100"
                placeholder="e.g. Volleyball"
                value={formData.sport}
                onChange={(e) =>
                  setFormData({ ...formData, sport: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-zinc-400 mb-1"
              >
                Athlete Bio
              </label>
              <textarea
                id="bio"
                required
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-zinc-100 resize-none"
                placeholder="Describe their background, strengths, and achievements..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-zinc-50 text-zinc-950 font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-zinc-950"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Archetype"
            )}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        {archetype && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-zinc-500 to-zinc-200 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-zinc-950 border border-zinc-800 p-8 rounded-2xl space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      Athlete Archetype
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                      {archetype.title}
                    </h2>
                  </div>
                  <div className="px-2 py-1 bg-zinc-800 rounded text-[10px] font-bold text-zinc-400 border border-zinc-700">
                    TYPE: {formData.sport.toUpperCase()}
                  </div>
                </div>
                <div className="h-px bg-zinc-800 w-full"></div>
                <div className="space-y-2">
                  <p className="text-zinc-300 leading-relaxed italic">
                    "{archetype.narrative}"
                  </p>
                  <p className="text-zinc-500 text-sm font-medium">
                    {formData.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
