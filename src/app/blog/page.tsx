import Link from "next/link";
import { getAllPosts, groupPostsByYear, getAllTags } from "@/lib/content/posts";
import { PageHero } from "@/components/layout/PageHero";
import { PostCard } from "@/components/blog/PostCard";
import { TagPill } from "@/components/ui/TagPill";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs & Writeups",
  description: "Security research, writeups and technical writing from VinSOC RnD CTF team.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const grouped = groupPostsByYear(posts);
  const tags = getAllTags(posts);

  return (
    <div>
      <PageHero
        title="BLOGS & WRITEUPS"
        subtitle="RESEARCH, WRITEUPS & TECHNICAL WRITING"
        action={
          <Link
            href="/feed.xml"
            className="inline-block px-4 py-1.5 rounded-full text-[11px] tracking-[0.14em] uppercase border transition-colors hover:border-[var(--accent-red)] hover:text-[var(--accent-red)]"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--muted)",
              borderColor: "var(--line)",
            }}
          >
            RSS FEED
          </Link>
        }
      />

      <div className="max-w-[820px] mx-auto px-5 py-10">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {tags.map((tag) => (
              <TagPill key={tag} tag={tag} href={`/tags/${tag}`} />
            ))}
          </div>
        )}

        {/* Posts grouped by year */}
        {grouped.length === 0 ? (
          <EmptyState title="No posts yet" description="Check back soon for writeups." />
        ) : (
          <div className="space-y-12">
            {grouped.map(([year, yearPosts]) => (
              <section key={year}>
                <h2
                  className="text-[34px] font-bold tracking-[0.22em] mb-6"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                >
                  {year}
                </h2>
                <div>
                  {yearPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
