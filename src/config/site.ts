export const siteConfig = {
  name: "VinSOC RnD",
  achievements: {
    defaultMaxPlace: 50,
    placeFilters: [10],
    rankTiers: [
      { maxPlace: 1, tone: "red", color: "#dc2626", weight: "font-bold" },
      { maxPlace: 5, tone: "yellow", color: "#f59e0b", weight: "font-bold" },
      { maxPlace: 10, tone: "blue", color: "#2563eb", weight: "font-bold" },
      { maxPlace: 20, tone: "lightBlue", color: "#60a5fa", weight: "font-bold" },
    ],
    defaultRank: {
      tone: "muted",
      color: "var(--muted-2)",
      weight: "text-muted",
    },
  },
} as const;

export type RankTone =
  | (typeof siteConfig.achievements.rankTiers)[number]["tone"]
  | typeof siteConfig.achievements.defaultRank.tone;
