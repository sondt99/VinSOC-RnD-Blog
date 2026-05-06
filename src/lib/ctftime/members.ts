import * as cheerio from "cheerio";

export type CTFtimeMember = {
  userId: number;
  handle: string;
  profileUrl: string;
  status: "current" | "former";
};

export type CTFtimeMembersResponse = {
  current: CTFtimeMember[];
  former: CTFtimeMember[];
  lastUpdated: string;
  stale: boolean;
};

const TEAM_ID = parseInt(process.env.CTFTIME_TEAM_ID ?? "414698", 10);
const TEAM_URL = `https://ctftime.org/team/${TEAM_ID}`;
const TIMEOUT_MS = 8000;

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

function parseMemberTable($: cheerio.CheerioAPI, selector: string, status: "current" | "former") {
  const members: CTFtimeMember[] = [];

  $(`${selector} a[href^="/user/"]`).each((_, element) => {
    const link = $(element);
    const href = link.attr("href");
    const handle = link.text().trim();
    const match = href?.match(/^\/user\/(\d+)/);

    if (!href || !handle || !match) return;

    members.push({
      userId: parseInt(match[1], 10),
      handle,
      profileUrl: `https://ctftime.org${href}`,
      status,
    });
  });

  return members;
}

export async function getCTFtimeMembers(): Promise<CTFtimeMembersResponse> {
  try {
    const res = await fetchWithTimeout(TEAM_URL);
    if (!res.ok) throw new Error(`CTFtime returned ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);
    const current = parseMemberTable($, "#recent_members", "current");
    const former = parseMemberTable($, "#past_members", "former");

    return {
      current,
      former,
      lastUpdated: new Date().toISOString(),
      stale: false,
    };
  } catch (err) {
    console.error("[ctftime] getCTFtimeMembers failed:", err);
    return {
      current: [],
      former: [],
      lastUpdated: new Date().toISOString(),
      stale: true,
    };
  }
}
