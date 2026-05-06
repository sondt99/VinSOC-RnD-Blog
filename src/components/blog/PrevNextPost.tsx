import Link from "next/link";
import type { PostListItem } from "@/lib/content/posts";

interface PrevNextPostProps {
  previous?: PostListItem | null;
  next?: PostListItem | null;
}

export function PrevNextPost({ previous, next }: PrevNextPostProps) {
  if (!previous && !next) return null;

  const single = Boolean(previous) !== Boolean(next);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 w-full"
      style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
    >
      {previous && (
        <Link
          href={`/blog/${previous.slug}`}
          className={`group flex flex-col gap-1 p-4 rounded-[14px] transition-all duration-150 hover:-translate-y-0.5 ${single ? "sm:col-span-2" : ""}`}
          style={{ border: "1px solid var(--line)", background: "var(--surface)" }}
        >
          <span
            className="text-[10px] tracking-[0.16em] uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
          >
            ← Previous
          </span>
          <span
            className="text-[15px] font-semibold leading-snug group-hover:text-[var(--accent-red)] transition-colors duration-150"
            style={{ color: "var(--text)" }}
          >
            {previous.title}
          </span>
        </Link>
      )}

      {next && (
        <Link
          href={`/blog/${next.slug}`}
          className={`group flex flex-col gap-1 p-4 rounded-[14px] text-right transition-all duration-150 hover:-translate-y-0.5 ${single ? "sm:col-span-2" : ""}`}
          style={{ border: "1px solid var(--line)", background: "var(--surface)" }}
        >
          <span
            className="text-[10px] tracking-[0.16em] uppercase"
            style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
          >
            Next →
          </span>
          <span
            className="text-[15px] font-semibold leading-snug group-hover:text-[var(--accent-red)] transition-colors duration-150"
            style={{ color: "var(--text)" }}
          >
            {next.title}
          </span>
        </Link>
      )}
    </div>
  );
}
