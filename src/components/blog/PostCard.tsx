import Link from "next/link";
import type { PostListItem } from "@/lib/content/posts";
import { PostMeta } from "./PostMeta";
import { TagPill } from "@/components/ui/TagPill";

interface PostCardProps {
  post: PostListItem;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article
      className="group block py-6 anim-fade-in-up"
      style={{ borderBottom: "1px solid var(--line-soft)" }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <h2
          className="text-[22px] font-semibold leading-snug mb-2 transition-colors duration-150 group-hover:text-[var(--accent-red)]"
          style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
        >
          {post.title}
        </h2>
        <p className="text-[15px] leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--text-soft)" }}>
          {post.excerpt}
        </p>
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <PostMeta post={post} />
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 4).map((tag) => (
              <TagPill key={tag} tag={tag} href={`/tags/${tag.toLowerCase()}`} small />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
