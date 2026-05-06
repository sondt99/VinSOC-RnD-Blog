import { unstable_cache } from "next/cache";
import { getVinSOCAchievements } from "./client";
import { getCTFtimeMembers } from "./members";

const REVALIDATE = parseInt(
  process.env.CTFTIME_CACHE_REVALIDATE_SECONDS ?? "21600",
  10
);

export const getCachedVinSOCAchievements = unstable_cache(
  () => getVinSOCAchievements(),
  ["ctftime", "team", "414698", "event-dates-newest-v4"],
  {
    revalidate: REVALIDATE,
    tags: ["ctftime", "achievements"],
  }
);

export const getCachedCTFtimeMembers = unstable_cache(
  () => getCTFtimeMembers(),
  ["ctftime", "team", "414698", "members-v1"],
  {
    revalidate: REVALIDATE,
    tags: ["ctftime", "members"],
  }
);
