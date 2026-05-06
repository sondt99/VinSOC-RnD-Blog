import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHero({ title, subtitle, action }: PageHeroProps) {
  return (
    <div
      className="text-center py-16 sm:py-20"
      style={{ borderBottom: "1px solid var(--line)" }}
    >
      <h1
        className="text-[clamp(36px,6vw,60px)] font-normal tracking-[0.18em] uppercase mb-4 anim-fade-in-up"
        style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="text-[13px] tracking-[0.18em] uppercase anim-fade-in-up delay-2"
          style={{ color: "var(--muted)" }}
        >
          {subtitle}
        </p>
      )}
      {action && <div className="mt-6 anim-fade-in delay-3">{action}</div>}
    </div>
  );
}
