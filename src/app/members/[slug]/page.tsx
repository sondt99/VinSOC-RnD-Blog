import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMember, getAllMemberSlugs } from "@/lib/content/members";
import { getAllPosts } from "@/lib/content/posts";
import { MemberSocialsLinks } from "@/components/members/MemberSocials";
import { PostCard } from "@/components/blog/PostCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllMemberSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = await getMember(slug);
  if (!member) return {};
  return {
    title: member.name,
    description: member.bio ?? `${member.name} — VinSOC RnD CTF member.`,
  };
}

export default async function MemberDetailPage({ params }: Props) {
  const { slug } = await params;
  const member = await getMember(slug);
  if (!member) notFound();

  const allPosts = await getAllPosts();
  const memberPosts = allPosts.filter((p) => p.authors.includes(member.handle));

  return (
    <div className="max-w-[760px] mx-auto px-5 py-12">
      <Link
        href="/members"
        className="text-[11px] tracking-[0.16em] uppercase mb-8 inline-block transition-colors hover:text-[var(--accent-red)]"
        style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
      >
        ← MEMBERS
      </Link>

      <div className="flex flex-col sm:flex-row items-start gap-8 mb-10">
        {member.avatar ? (
          <Image
            src={member.avatar}
            alt={member.name}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0"
            style={{ background: "var(--line)", color: "var(--text-soft)", fontFamily: "var(--font-display)" }}
          >
            {member.name.charAt(0)}
          </div>
        )}

        <div className="flex-1">
          <h1
            className="text-[32px] font-bold tracking-[0.06em] mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            {member.name}
          </h1>
          <p
            className="text-[13px] tracking-[0.10em] mb-3"
            style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}
          >
            @{member.handle}
            {member.role && ` · ${member.role}`}
            {member.location && ` · ${member.location}`}
          </p>

          {member.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] tracking-[0.10em] uppercase px-2 py-0.5 rounded"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "var(--surface-muted)",
                    color: "var(--muted)",
                    border: "1px solid var(--line-soft)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <MemberSocialsLinks socials={member.socials} />
        </div>
      </div>

      {member.html && (
        <div className="article mb-12" dangerouslySetInnerHTML={{ __html: member.html }} />
      )}

      {memberPosts.length > 0 && (
        <section>
          <h2
            className="text-[11px] tracking-[0.22em] uppercase mb-6"
            style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
          >
            POSTS BY {member.name.toUpperCase()}
          </h2>
          <div>
            {memberPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
