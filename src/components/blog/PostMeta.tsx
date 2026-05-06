import type { PostListItem } from "@/lib/content/posts";
import { formatDateShort } from "@/lib/utils/date";

interface PostMetaProps {
  post: PostListItem;
  className?: string;
}

export function PostMeta({ post, className = "" }: PostMetaProps) {
  const authors = post.authors.join(", ") || "VinSOC RnD";

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] ${className}`}
      style={{ color: "var(--muted)" }}
    >
      <span>{authors}</span>
      <span style={{ color: "var(--line)" }}>·</span>
      <time dateTime={post.date}>{formatDateShort(post.date)}</time>
      <span style={{ color: "var(--line)" }}>·</span>
      <span>{post.readingTime}</span>
    </div>
  );
}
