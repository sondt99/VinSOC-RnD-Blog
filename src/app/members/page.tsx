import type { Metadata } from "next";
import { getAllMembers } from "@/lib/content/members";
import { getCachedCTFtimeMembers } from "@/lib/ctftime/cache";
import { PageHero } from "@/components/layout/PageHero";
import { MemberGrid } from "@/components/members/MemberGrid";
import { CTFtimeMemberGrid } from "@/components/members/CTFtimeMemberGrid";
import { formatDate } from "@/lib/utils/date";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Members",
  description: "The VinSOC RnD CTF team members.",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[11px] tracking-[0.22em] uppercase mb-6"
      style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
    >
      {children}
    </h2>
  );
}

export default async function MembersPage() {
  const [members, ctftimeMembers] = await Promise.all([
    getAllMembers(),
    getCachedCTFtimeMembers().catch(() => ({
      current: [],
      former: [],
      lastUpdated: new Date().toISOString(),
      stale: true,
    })),
  ]);

  const active = members.filter((member) => member.status === "active");
  const alumni = members.filter((member) => member.status === "alumni");
  const hasCTFtimeMembers = ctftimeMembers.current.length > 0 || ctftimeMembers.former.length > 0;

  return (
    <div>
      <PageHero title="MEMBERS" subtitle="AUTO-SYNCED FROM CTFTIME" />
      <div className="max-w-[1040px] mx-auto px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <SectionTitle>CURRENT MEMBERS</SectionTitle>
          {hasCTFtimeMembers && (
            <p className="text-[11px] tracking-[0.12em] uppercase" style={{ color: "var(--muted)" }}>
              Synced from CTFtime · {formatDate(ctftimeMembers.lastUpdated, "MMM d, yyyy HH:mm")}
              {ctftimeMembers.stale ? " · cached fallback" : ""}
            </p>
          )}
        </div>

        {ctftimeMembers.current.length > 0 ? (
          <CTFtimeMemberGrid members={ctftimeMembers.current} />
        ) : (
          <MemberGrid members={active} />
        )}

        {(ctftimeMembers.former.length > 0 || alumni.length > 0) && (
          <div className="mt-16">
            <SectionTitle>FORMER MEMBERS</SectionTitle>
            {ctftimeMembers.former.length > 0 ? (
              <CTFtimeMemberGrid members={ctftimeMembers.former} />
            ) : (
              <MemberGrid members={alumni} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
