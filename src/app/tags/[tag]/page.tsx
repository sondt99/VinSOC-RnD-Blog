import { notFound } from "next/navigation";
import { getAllPosts, getAllTags } from "@/lib/content/posts";
import { PageHero } from "@/components/layout/PageHero";
import { PostCard } from "@/components/blog/PostCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const tags = getAllTags(posts);
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `Posts tagged with #${tag} from VinSOC RnD CTF.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((p) =>
    p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );

  if (posts.length === 0) notFound();

  return (
    <div>
      <PageHero title={`#${tag.toUpperCase()}`} subtitle={`${posts.length} POST${posts.length !== 1 ? "S" : ""}`} />
      <div className="max-w-[820px] mx-auto px-5 py-10">
        <div>
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
      </div>
    </div>
  );
}
