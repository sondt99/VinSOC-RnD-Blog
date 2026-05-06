export type CTFtimeTeamSummary = {
  teamId: number;
  name: string;
  aliases: string[];
  country?: string;
  overallPlace?: number;
  countryPlace?: number;
  ratingPoints?: number;
  year: number;
  profileUrl: string;
};

export type Achievement = {
  year: number;
  eventId?: number;
  eventName: string;
  eventUrl?: string;
  place: number;
  ctfPoints?: number;
  ratingPoints?: number;
  date?: string;
  month?: string;
  weight?: number;
  source: "ctftime-api" | "ctftime-page" | "manual-cache";
};

export type AchievementsResponse = {
  team: CTFtimeTeamSummary;
  achievements: Achievement[];
  grouped: Record<string, Achievement[]>;
  lastUpdated: string;
  stale: boolean;
};

// ── CTFtime Team API: GET /api/v1/teams/{id}/ ──────────────────────────────
export type CTFtimeTeamAPIResponse = {
  id: number;
  name: string;
  aliases: string[];
  country: string;
  rating: Record<
    string,
    {
      organizer_points?: number;
      rating_place?: number;
      rating_points?: number;
      country_place?: number;
    }
  >;
  primary_alias: string;
};

// ── CTFtime Results API: GET /api/v1/results/{year}/ ──────────────────────
// Returns: Record<eventId, CTFtimeResultEvent>
// e.g. { "2929": { "title": "...", "scores": [...] } }
export type CTFtimeResultScore = {
  team_id: number;
  points: string; // decimal string, e.g. "2018.0000"
  place: number;
};

export type CTFtimeResultEvent = {
  title: string;
  scores: CTFtimeResultScore[];
};

// ── CTFtime Event API: GET /api/v1/events/{eventId}/ ──────────────────────
export type CTFtimeEventDetails = {
  id: number;
  title: string;
  start?: string;
  finish?: string;
  url?: string;
  ctftime_url?: string;
  weight?: number;
};

// Parsed internally — adds eventId from the dict key and optional event details
export type CTFtimeResultEventWithId = CTFtimeResultEvent & {
  eventId: number;
  start?: string;
  finish?: string;
  url?: string;
  ctftime_url?: string;
  weight?: number;
};
