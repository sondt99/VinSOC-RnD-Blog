import type { Member } from "@/lib/content/members";
import { MemberCard } from "./MemberCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface MemberGridProps {
  members: Member[];
}

export function MemberGrid({ members }: MemberGridProps) {
  if (members.length === 0) {
    return <EmptyState title="No members found" description="Check back later." />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 anim-stagger">
      {members.map((member) => (
        <MemberCard key={member.slug} member={member} />
      ))}
    </div>
  );
}
