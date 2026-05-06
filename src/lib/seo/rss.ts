import type { PostListItem } from "@/lib/content/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinsoc.team";

export function buildRssFeed(posts: PostListItem[]): string {
  const items = posts
    .slice(0, 20)
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const date = new Date(post.date).toUTCString();
      const authors = post.authors.join(", ") || "VinSOC RnD";
      const tags = post.tags.map((t) => `<category>${t}</category>`).join("");
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <author>${authors}</author>
      ${tags}
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>VinSOC RnD CTF - Blogs &amp; Writeups</title>
    <link>${SITE_URL}</link>
    <description>Security research, writeups and technical writing from VinSOC RnD CTF team.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}
