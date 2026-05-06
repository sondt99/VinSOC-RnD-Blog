import { getAllPosts } from "@/lib/content/posts";
import { buildRssFeed } from "@/lib/seo/rss";

export const revalidate = 3600;

export async function GET() {
  const posts = await getAllPosts();
  const feed = buildRssFeed(posts);

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
