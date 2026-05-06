import { siteConfig, type RankTone } from "@/config/site";

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

function rankTier(place: number) {
  return siteConfig.achievements.rankTiers.find((tier) => place <= tier.maxPlace);
}

export function rankTone(place: number): RankTone {
  return rankTier(place)?.tone ?? siteConfig.achievements.defaultRank.tone;
}

export function rankColor(place: number): string {
  return rankTier(place)?.color ?? siteConfig.achievements.defaultRank.color;
}

export function rankColorClass(place: number): string {
  return rankTier(place)?.weight ?? siteConfig.achievements.defaultRank.weight;
}
