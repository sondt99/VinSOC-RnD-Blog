import Link from "next/link";

interface TagPillProps {
  tag: string;
  href?: string;
  small?: boolean;
}

export function TagPill({ tag, href, small = false }: TagPillProps) {
  const cls = [
    "inline-block rounded-full border transition-all duration-150",
    small ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-[11px]",
    "tracking-[0.10em] uppercase",
    "hover:border-[var(--accent-red)] hover:text-[var(--accent-red)]",
  ].join(" ");

  const style = {
    fontFamily: "var(--font-display)",
    color: "var(--muted)",
    borderColor: "var(--line)",
    background: "var(--surface-muted)",
  };

  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {tag}
      </Link>
    );
  }
  return (
    <span className={cls} style={style}>
      {tag}
    </span>
  );
}
