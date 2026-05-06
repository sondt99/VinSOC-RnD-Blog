import type { MemberSocials } from "@/lib/content/members";
import { ExternalLink } from "@/components/ui/ExternalLink";

interface MemberSocialsProps {
  socials: MemberSocials;
}

function SocialIcon({ type }: { type: string }) {
  const labels: Record<string, string> = {
    github: "GH",
    website: "WEB",
    x: "X",
    email: "MAIL",
    ctftime: "CTF",
    linkedin: "LI",
  };
  return <span>{labels[type] ?? type.toUpperCase()}</span>;
}

export function MemberSocialsLinks({ socials }: MemberSocialsProps) {
  const links = Object.entries(socials).filter(([, v]) => v) as [string, string][];
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {links.map(([type, url]) => {
        const href = type === "email" && !url.startsWith("mailto:") ? `mailto:${url}` : url;
        return (
          <ExternalLink
            key={type}
            href={href}
            className="text-[10px] tracking-[0.12em] uppercase px-2 py-1 rounded border transition-colors duration-150 hover:border-[var(--accent-red)] hover:text-[var(--accent-red)]"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--muted)",
              borderColor: "var(--line)",
            }}
          >
            <SocialIcon type={type} />
          </ExternalLink>
        );
      })}
    </div>
  );
}
