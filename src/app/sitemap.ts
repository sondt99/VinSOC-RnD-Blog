import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/content/posts";
import { getAllMembers } from "@/lib/content/members";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinsoc.team";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, members] = await Promise.all([getAllPosts(), getAllMembers()]);
  const tags = getAllTags(posts);

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/writeups`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/tags`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/members`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/achievements`, changeFrequency: "daily", priority: 0.7 },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updated ?? post.date,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...members.map((member) => ({
      url: `${SITE_URL}/members/${member.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...tags.map((tag) => ({
      url: `${SITE_URL}/tags/${tag}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
  ];
}
