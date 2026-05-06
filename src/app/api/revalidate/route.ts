import { revalidateTag } from "next/cache";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tag = url.searchParams.get("tag");
  const authHeader = request.headers.get("authorization");
  const secret = process.env.REVALIDATE_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!tag || !["ctftime", "achievements"].includes(tag)) {
    return Response.json({ ok: false, error: "Invalid tag" }, { status: 400 });
  }

  revalidateTag(tag);
  return Response.json({ ok: true, revalidated: tag, ts: Date.now() });
}
