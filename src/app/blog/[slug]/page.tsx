import { notFound } from "next/navigation";
import { getAllPosts, getAllPostSlugs, getPost } from "@/lib/content/posts";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { makePostMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return makePostMetadata(post);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const allPosts = await getAllPosts();
  const idx = allPosts.findIndex((p) => p.slug === slug);
  const previous = idx < allPosts.length - 1 ? allPosts[idx + 1] : null;
  const next = idx > 0 ? allPosts[idx - 1] : null;

  return (
    <ArticleLayout
      post={post}
      toc={post.toc}
      htmlContent={post.html}
      previous={previous}
      next={next}
    />
  );
}
