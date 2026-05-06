import { getCachedVinSOCAchievements } from "@/lib/ctftime/cache";

export const runtime = "nodejs";
export const revalidate = 21600;
export const maxDuration = 10;

export async function GET() {
  try {
    const data = await getCachedVinSOCAchievements();
    return Response.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[api/ctftime] error:", error);
    return Response.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}
