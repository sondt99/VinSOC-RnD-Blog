import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/content/posts";
import { PageHero } from "@/components/layout/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse posts by tag from VinSOC RnD CTF team.",
};

export default async function TagsPage() {
  const posts = await getAllPosts();
  const tags = getAllTags(posts);

  // Count posts per tag
  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const t = tag.toLowerCase();
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
    }
  }

  return (
    <div>
      <PageHero title="TAGS" subtitle={`${tags.length} TAG${tags.length !== 1 ? "S" : ""}`} />
      <div className="max-w-[820px] mx-auto px-5 py-10">
        {tags.length === 0 ? (
          <EmptyState title="No tags yet" description="Tags will appear here as posts are added." />
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => {
              const count = tagCounts.get(tag) ?? 0;
              return (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border transition-colors hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] group"
                  style={{
                    fontFamily: "var(--font-display)",
                    borderColor: "var(--line)",
                    color: "var(--text-soft)",
                  }}
                >
                  <span className="text-[12px] tracking-[0.14em] uppercase">#{tag}</span>
                  <span
                    className="text-[11px] tabular-nums"
                    style={{ color: "var(--muted)" }}
                  >
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
