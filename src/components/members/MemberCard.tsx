"use client";

import Image from "next/image";
import Link from "next/link";
import type { Member } from "@/lib/content/members";
import { MemberSocialsLinks } from "./MemberSocials";

interface MemberCardProps {
  member: Member;
}

function AvatarFallback({ name }: { name: string }) {
  return (
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
      style={{ background: "var(--surface-muted)", color: "var(--muted)", fontFamily: "var(--font-display)" }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <div
      className="group relative flex flex-col items-center p-6 text-center rounded-[18px] anim-fade-in-up shimmer-hover"
      style={{
        border: "1px solid var(--line)",
        background: "var(--surface)",
        transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, border-color 0.25s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-5px)";
        el.style.boxShadow = "0 14px 36px rgba(0,0,0,0.10)";
        el.style.borderColor = "var(--accent-red)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
        el.style.borderColor = "var(--line)";
      }}
    >
      {/* Avatar */}
      <Link
        href={`/members/${member.slug}`}
        className="block mb-4 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]"
        tabIndex={-1}
        aria-hidden
      >
        {member.avatar ? (
          <Image
            src={member.avatar}
            alt={member.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-transparent transition-all duration-300 group-hover:ring-[var(--accent-red)]"
          />
        ) : (
          <AvatarFallback name={member.name} />
        )}
      </Link>

      {/* Name */}
      <Link href={`/members/${member.slug}`} className="block outline-none">
        <h2
          className="text-[15px] tracking-[0.12em] uppercase font-semibold mb-1 transition-colors duration-200 group-hover:text-[var(--accent-red)]"
          style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
        >
          {member.name}
        </h2>
      </Link>

      {/* Role */}
      {member.role && (
        <p className="text-[12px] tracking-[0.08em] mb-3" style={{ color: "var(--muted)" }}>
          {member.role}
        </p>
      )}

      {/* Expandable section: hidden by default, revealed on hover */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out w-full sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-64 sm:group-hover:opacity-100 sm:group-focus-within:max-h-64 sm:group-focus-within:opacity-100"
      >
        {/* Bio */}
        {member.bio && (
          <p className="text-[13px] leading-relaxed mt-3 mb-3" style={{ color: "var(--text-soft)" }}>
            {member.bio}
          </p>
        )}

        {/* Skills */}
        {member.skills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
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

        {/* Socials */}
        <MemberSocialsLinks socials={member.socials} />
      </div>
    </div>
  );
}
