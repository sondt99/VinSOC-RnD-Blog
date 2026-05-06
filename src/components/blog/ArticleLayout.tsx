import Link from "next/link";
import type { PostListItem } from "@/lib/content/posts";
import type { TocItem } from "@/lib/content/toc";
import { PostMeta } from "./PostMeta";
import { TagPill } from "@/components/ui/TagPill";
import { TableOfContents } from "./TableOfContents";
import { PrevNextPost } from "./PrevNextPost";
import { ArticleContent } from "./ArticleContent";

interface ArticleLayoutProps {
  post: PostListItem;
  toc: TocItem[];
  htmlContent: string;
  previous?: PostListItem | null;
  next?: PostListItem | null;
}

export function ArticleLayout({ post, toc, htmlContent, previous, next }: ArticleLayoutProps) {
  return (
    <div className="max-w-[1180px] mx-auto px-5 py-10">
      {/* Breadcrumb */}
      <nav
        className="max-w-[760px] mx-auto text-[12px] tracking-[0.12em] uppercase mb-8 flex items-center gap-2"
        aria-label="Breadcrumb"
        style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}
      >
        <Link href="/" className="hover:text-[var(--accent-red)] transition-colors">Home</Link>
        <span>›</span>
        <Link href="/blog" className="hover:text-[var(--accent-red)] transition-colors">Blogs & Writeups</Link>
        <span>›</span>
        <span style={{ color: "var(--text-soft)" }} className="truncate max-w-[220px]">{post.title}</span>
      </nav>

      {/* Article header */}
      <header className="mb-10 max-w-[760px] mx-auto">
        <h1
          className="text-[clamp(32px,5vw,52px)] font-normal leading-tight tracking-[0.04em] mb-6"
          style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
        >
          {post.title}
        </h1>
        <PostMeta post={post} className="mb-4" />
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagPill key={tag} tag={tag} href={`/tags/${tag.toLowerCase()}`} />
            ))}
          </div>
        )}
      </header>

      {/* Prev/Next */}
      <div className="max-w-[760px] mx-auto mb-10">
        <PrevNextPost previous={previous} next={next} />
      </div>

      {/* Grid: TOC + Content */}
      <div className="article-shell">
        {/* TOC - sticky left */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <TableOfContents items={toc} />
          </div>
        </aside>

        {/* Mobile TOC */}
        <div
          className="lg:hidden mb-6 p-4 rounded-[14px] col-span-full max-w-[760px] mx-auto w-full"
          style={{ border: "1px solid var(--line)", background: "var(--surface-muted)" }}
        >
          <details>
            <summary
              className="text-[11px] tracking-[0.16em] uppercase cursor-pointer"
              style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
            >
              TABLE OF CONTENTS
            </summary>
            <div className="mt-3">
              <TableOfContents items={toc} />
            </div>
          </details>
        </div>

        {/* Article content */}
        <ArticleContent html={htmlContent} />

        {/* Right gutter */}
        <div className="hidden lg:block" />
      </div>

      {/* Bottom prev/next */}
      <div className="max-w-[760px] mx-auto mt-10">
        <PrevNextPost previous={previous} next={next} />
      </div>

      <style>{`
        .article-shell {
          display: grid;
          grid-template-columns: minmax(0, 180px) minmax(0, 760px) minmax(0, 180px);
          gap: 30px;
          align-items: start;
        }
        @media (max-width: 1023px) {
          .article-shell {
            grid-template-columns: 1fr;
          }
          .article-shell > .article {
            max-width: 760px;
            width: 100%;
            margin-inline: auto;
          }
        }
      `}</style>
    </div>
  );
}
