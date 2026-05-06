import { siteConfig } from "@/config/site";
import type {
  CTFtimeTeamAPIResponse,
  CTFtimeResultEvent,
  CTFtimeResultEventWithId,
  CTFtimeEventDetails,
  Achievement,
  AchievementsResponse,
  CTFtimeTeamSummary,
} from "./types";
import {
  normalizeTeam,
  normalizeEventResult,
  groupAchievementsByYear,
  sortAchievementsByDateDesc,
} from "./normalize";
import fallback from "./fallback.json";

const TEAM_ID = parseInt(process.env.CTFTIME_TEAM_ID ?? "414698", 10);
const TIMEOUT_MS = 8000;
const CURRENT_YEAR = new Date().getFullYear();

async function fetchWithTimeout(url: string, ms = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "VinSOC-Site/1.0 (+https://vinsoc.team)" },
      next: { revalidate: 0 },
    });
  } finally {
    clearTimeout(id);
  }
}

async function fetchTeam(): Promise<CTFtimeTeamAPIResponse | null> {
  try {
    const res = await fetchWithTimeout(`https://ctftime.org/api/v1/teams/${TEAM_ID}/`);
    if (!res.ok) return null;
    return (await res.json()) as CTFtimeTeamAPIResponse;
  } catch (err) {
    console.error("[ctftime] fetchTeam failed:", err);
    return null;
  }
}

// CTFtime /results/{year}/ returns Record<eventId, {title, scores[]}>
// scores[] use team_id (number), not team objects.
async function fetchResultsForYear(year: number): Promise<CTFtimeResultEventWithId[]> {
  try {
    const res = await fetchWithTimeout(`https://ctftime.org/api/v1/results/${year}/`);
    if (!res.ok) return [];
    const data = (await res.json()) as Record<string, CTFtimeResultEvent>;
    return Object.entries(data).map(([key, event]) => ({
      ...event,
      eventId: parseInt(key, 10),
    }));
  } catch (err) {
    console.error(`[ctftime] fetchResultsForYear(${year}) failed:`, err);
    return [];
  }
}

async function fetchEventDetails(eventId: number): Promise<CTFtimeEventDetails | null> {
  try {
    const res = await fetchWithTimeout(`https://ctftime.org/api/v1/events/${eventId}/`);
    if (!res.ok) return null;
    return (await res.json()) as CTFtimeEventDetails;
  } catch (err) {
    console.error(`[ctftime] fetchEventDetails(${eventId}) failed:`, err);
    return null;
  }
}

async function withEventDetails(events: CTFtimeResultEventWithId[]): Promise<CTFtimeResultEventWithId[]> {
  const teamEvents = events.filter((event) => event.scores?.some((score) => score.team_id === TEAM_ID));
  const detailMap = new Map<number, CTFtimeEventDetails>();

  for (const event of teamEvents) {
    const detail = await fetchEventDetails(event.eventId);
    if (detail) detailMap.set(detail.id, detail);
  }

  return teamEvents.map((event) => {
    const detail = detailMap.get(event.eventId);
    if (!detail) return event;
    return {
      ...event,
      start: detail.start,
      finish: detail.finish,
      url: detail.url,
      ctftime_url: detail.ctftime_url,
      weight: detail.weight,
    };
  });
}

function buildFallbackResponse(): AchievementsResponse {
  const fb = fallback as unknown as { years: Record<string, Achievement[]>; lastKnownGood?: string };
  const achievements = sortAchievementsByDateDesc(Object.values(fb.years ?? {}).flat()).filter(
    (achievement) => achievement.place <= siteConfig.achievements.defaultMaxPlace
  );

  const team: CTFtimeTeamSummary = {
    teamId: TEAM_ID,
    name: "VinSOC RnD",
    aliases: ["VinSOC_RnD"],
    year: CURRENT_YEAR,
    profileUrl: `https://ctftime.org/team/${TEAM_ID}`,
  };

  return {
    team,
    achievements,
    grouped: groupAchievementsByYear(achievements),
    lastUpdated: fb.lastKnownGood ?? new Date().toISOString(),
    stale: true,
  };
}

export async function getVinSOCAchievements(): Promise<AchievementsResponse> {
  const years = [CURRENT_YEAR, CURRENT_YEAR - 1];

  const [teamRaw, ...yearResults] = await Promise.all([
    fetchTeam(),
    ...years.map((year) => fetchResultsForYear(year)),
  ]);

  if (!teamRaw && yearResults.every((results) => results.length === 0)) {
    console.warn("[ctftime] All fetches failed, using fallback");
    return buildFallbackResponse();
  }

  const team: CTFtimeTeamSummary = teamRaw
    ? normalizeTeam(teamRaw, CURRENT_YEAR)
    : {
        teamId: TEAM_ID,
        name: "VinSOC RnD",
        aliases: ["VinSOC_RnD"],
        year: CURRENT_YEAR,
        profileUrl: `https://ctftime.org/team/${TEAM_ID}`,
      };

  const achievements: Achievement[] = [];
  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    const events = await withEventDetails(yearResults[i]);
    for (const event of events) {
      const achievement = normalizeEventResult(event, year);
      if (achievement) achievements.push(achievement);
    }
  }

  sortAchievementsByDateDesc(achievements);

  const capped = achievements.filter((a) => a.place <= siteConfig.achievements.defaultMaxPlace);

  // If live results returned nothing for our team (API structural change, rate-limit,
  // or team had no participation), use fallback.json as a floor so the page is never empty.
  if (capped.length === 0) {
    console.warn("[ctftime] No achievements matched from live API, using fallback");
    const fb = buildFallbackResponse();
    return { ...fb, team, stale: true };
  }

  return {
    team,
    achievements: capped,
    grouped: groupAchievementsByYear(capped),
    lastUpdated: new Date().toISOString(),
    stale: false,
  };
}
