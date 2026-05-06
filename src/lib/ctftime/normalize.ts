import type {
  Achievement,
  CTFtimeTeamSummary,
  CTFtimeTeamAPIResponse,
  CTFtimeResultEventWithId,
  CTFtimeResultScore,
} from "./types";

const TEAM_ID = 414698;

function matchesTeam(score: CTFtimeResultScore): boolean {
  return score.team_id === TEAM_ID;
}

function getMonth(date?: string): string | undefined {
  if (!date) return undefined;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toLocaleString("en-US", { month: "short" }).toUpperCase();
}

export function normalizeTeam(
  raw: CTFtimeTeamAPIResponse,
  currentYear: number
): CTFtimeTeamSummary {
  const yearData = raw.rating?.[String(currentYear)];
  return {
    teamId: raw.id,
    name: "VinSOC RnD",
    aliases: raw.aliases ?? [],
    country: raw.country,
    overallPlace: yearData?.rating_place,
    countryPlace: yearData?.country_place,
    ratingPoints: yearData?.rating_points,
    year: currentYear,
    profileUrl: `https://ctftime.org/team/${raw.id}`,
  };
}

export function normalizeEventResult(
  event: CTFtimeResultEventWithId,
  year: number
): Achievement | null {
  const score = event.scores?.find(matchesTeam);
  if (!score) return null;

  return {
    year,
    eventId: event.eventId,
    eventName: event.title,
    eventUrl: event.ctftime_url ?? `https://ctftime.org/event/${event.eventId}`,
    place: score.place,
    ctfPoints: score.points ? parseFloat(score.points) : undefined,
    ratingPoints: undefined,
    date: event.start,
    month: getMonth(event.start),
    weight: event.weight,
    source: "ctftime-api",
  };
}

export function sortAchievementsByDateDesc(achievements: Achievement[]): Achievement[] {
  return achievements.sort((a, b) => {
    const aDate = a.date ? new Date(a.date).getTime() : Number.MIN_SAFE_INTEGER;
    const bDate = b.date ? new Date(b.date).getTime() : Number.MIN_SAFE_INTEGER;
    if (aDate !== bDate) return bDate - aDate;
    return a.eventName.localeCompare(b.eventName);
  });
}

export function groupAchievementsByYear(
  achievements: Achievement[]
): Record<string, Achievement[]> {
  const groups: Record<string, Achievement[]> = {};
  for (const a of achievements) {
    const key = String(a.year);
    groups[key] = groups[key] ?? [];
    groups[key].push(a);
  }
  for (const key of Object.keys(groups)) {
    groups[key] = sortAchievementsByDateDesc(groups[key]);
  }
  return groups;
}
