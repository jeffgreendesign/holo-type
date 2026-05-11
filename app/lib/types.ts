export interface Archetype {
  title: string;
  narrative: {
    olympic: string;
    paralympic: string;
  };
  rarity: "Common" | "Uncommon" | "Rare" | "Holo Rare";
  stats: Record<string, number>;
  era: string;
  discipline: "Olympic" | "Paralympic" | "Unified";
}

export type Lens = "olympic" | "paralympic";
