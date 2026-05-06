import Link from "next/link";
import { getAllPosts } from "@/lib/content/posts";
import { getCachedVinSOCAchievements } from "@/lib/ctftime/cache";
import { PostCard } from "@/components/blog/PostCard";
import { ordinal } from "@/lib/utils/rank";
import { ExternalLink } from "@/components/ui/ExternalLink";

export const revalidate = 21600;

export default async function HomePage() {
  const [posts, ctf] = await Promise.all([
    getAllPosts(),
    getCachedVinSOCAchievements().catch(() => null),
  ]);

  const recentPosts = posts.slice(0, 3);
  const team = ctf?.team;

  return (
    <div>
      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center text-center py-24 px-5"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        {/* Logo */}
        <div
          className="text-[clamp(52px,9vw,88px)] font-bold tracking-[0.10em] mb-5 anim-fade-in-up"
          style={{ fontFamily: "var(--font-display)", lineHeight: 1 }}
        >
          <span style={{ color: "var(--muted)" }}>[</span>
          <span style={{ color: "var(--text)" }}>VinSOC RnD</span>
          <span style={{ color: "var(--accent-red)" }}>]</span>
        </div>

        <p
          className="text-[13px] tracking-[0.26em] uppercase mb-6 anim-fade-in-up delay-1"
          style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}
        >
          VIETNAMESE CTF TEAM
        </p>

        {/* Red divider */}
        <div
          className="w-12 h-px mb-8 anim-scale-in delay-2"
          style={{ background: "var(--accent-red)" }}
        />

        <p
          className="text-[16px] max-w-lg leading-relaxed mb-10 anim-fade-in-up delay-2"
          style={{ color: "var(--text-soft)" }}
        >
          Security research, writeups, and competitive CTF.
          We play, we learn, we share.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-3 anim-fade-in-up delay-3">
          {[
            { href: "https://ctftime.org/team/414698", label: "CTFTIME", external: true },
            { href: "https://github.com", label: "GITHUB", external: true },
            { href: "/blog", label: "WRITEUPS", external: false },
            { href: "/members", label: "TEAM", external: false },
          ].map((link) => {
            const cls =
              "shimmer-hover px-5 py-2 rounded-full text-[11px] tracking-[0.16em] uppercase border transition-all duration-200 hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] hover:-translate-y-0.5";
            const style = {
              fontFamily: "var(--font-display)",
              color: "var(--text-soft)",
              borderColor: "var(--line)",
            };
            return link.external ? (
              <ExternalLink key={link.label} href={link.href} className={cls} style={style}>
                {link.label}
              </ExternalLink>
            ) : (
              <Link key={link.label} href={link.href} className={cls} style={style}>
                {link.label}
              </Link>
            );
          })}
        </div>
      </section>

      <div className="max-w-[1040px] mx-auto px-5 py-16 space-y-16">
        {/* CTFtime stats */}
        {team && (
          <section>
            <p
              className="text-[11px] tracking-[0.22em] uppercase mb-6 anim-fade-in"
              style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
            >
              COMPETITIVE STATS
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 anim-stagger">
              {team.overallPlace != null && (
                <div
                  className="p-4 rounded-[14px] shimmer-hover border border-[var(--line)] bg-[var(--surface)] transition-colors hover:border-[var(--accent-red)]"
                >
                  <p className="text-[10px] tracking-[0.14em] uppercase mb-1" style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}>
                    OVERALL RANK
                  </p>
                  <p className="text-[24px] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent-red)" }}>
                    #{ordinal(team.overallPlace)}
                  </p>
                </div>
              )}
              {team.countryPlace != null && (
                <div
                  className="p-4 rounded-[14px] shimmer-hover border border-[var(--line)] bg-[var(--surface)] transition-colors hover:border-[var(--accent-red)]"
                >
                  <p className="text-[10px] tracking-[0.14em] uppercase mb-1" style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}>
                    {team.country ?? "COUNTRY"} RANK
                  </p>
                  <p className="text-[24px] font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-soft)" }}>
                    #{ordinal(team.countryPlace)}
                  </p>
                </div>
              )}
              <Link
                href="/achievements"
                className="p-4 rounded-[14px] flex flex-col justify-between shimmer-hover"
                style={{ border: "1px solid var(--accent-red)", background: "var(--surface)", transition: "background 0.2s ease" }}
              >
                <p className="text-[10px] tracking-[0.14em] uppercase mb-1" style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}>
                  ALL RESULTS
                </p>
                <p className="text-[13px] font-bold" style={{ color: "var(--accent-red)", fontFamily: "var(--font-display)" }}>
                  VIEW →
                </p>
              </Link>
            </div>
          </section>
        )}

        {/* Recent posts */}
        {recentPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6 anim-fade-in">
              <p
                className="text-[11px] tracking-[0.22em] uppercase"
                style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
              >
                RECENT WRITEUPS
              </p>
              <Link
                href="/blog"
                className="text-[11px] tracking-[0.14em] uppercase transition-colors hover:text-[var(--accent-red)]"
                style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
              >
                VIEW ALL →
              </Link>
            </div>
            <div className="divide-y anim-stagger" style={{ borderColor: "var(--line-soft)" }}>
              {recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
