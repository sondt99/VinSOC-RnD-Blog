import type { Metadata } from "next";
import { getAllMembers } from "@/lib/content/members";
import { PageHero } from "@/components/layout/PageHero";
import { MemberGrid } from "@/components/members/MemberGrid";

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
  const members = await getAllMembers();
  const active = members.filter((member) => member.status === "active");
  const alumni = members.filter((member) => member.status === "alumni");

  return (
    <div>
      <PageHero title="MEMBERS" subtitle="TEAM PROFILES FROM LOCAL CONTENT" />
      <div className="max-w-[1040px] mx-auto px-5 py-10">
        <SectionTitle>CURRENT MEMBERS</SectionTitle>
        <MemberGrid members={active} />

        {alumni.length > 0 && (
          <div className="mt-16">
            <SectionTitle>FORMER MEMBERS</SectionTitle>
            <MemberGrid members={alumni} />
          </div>
        )}
      </div>
    </div>
  );
}
