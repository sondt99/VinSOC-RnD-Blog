import type { CTFtimeMember } from "@/lib/ctftime/members";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { EmptyState } from "@/components/ui/EmptyState";

interface CTFtimeMemberGridProps {
  members: CTFtimeMember[];
}

function initials(handle: string): string {
  return handle.slice(0, 2).toUpperCase();
}

export function CTFtimeMemberGrid({ members }: CTFtimeMemberGridProps) {
  if (members.length === 0) {
    return <EmptyState title="No CTFtime members found" description="Falling back to local profiles." />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 anim-stagger">
      {members.map((member) => (
        <ExternalLink
          key={`${member.status}-${member.userId}`}
          href={member.profileUrl}
          className="group relative flex flex-col items-center p-6 text-center rounded-[18px] anim-fade-in-up shimmer-hover transition-all duration-200 hover:-translate-y-1"
          style={{
            border: "1px solid var(--line)",
            background: "var(--surface)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 transition-all duration-200 group-hover:ring-2 group-hover:ring-[var(--accent-red)]"
            style={{
              background: "var(--surface-muted)",
              color: "var(--muted)",
              fontFamily: "var(--font-display)",
            }}
          >
            {initials(member.handle)}
          </div>

          <h2
            className="text-[15px] tracking-[0.12em] uppercase font-semibold mb-1 transition-colors duration-200 group-hover:text-[var(--accent-red)]"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            {member.handle}
          </h2>

          <p className="text-[12px] tracking-[0.08em] uppercase" style={{ color: "var(--muted)" }}>
            CTFtime {member.status === "current" ? "current" : "former"} member
          </p>

          <span
            className="mt-4 text-[10px] tracking-[0.14em] uppercase px-2 py-1 rounded-full border"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--accent-red)",
              borderColor: "var(--line)",
              background: "var(--surface-muted)",
            }}
          >
            View profile →
          </span>
        </ExternalLink>
      ))}
    </div>
  );
}
