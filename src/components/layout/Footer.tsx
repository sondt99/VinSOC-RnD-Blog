import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto py-8"
      style={{ borderTop: "1px solid var(--line)", background: "var(--bg)" }}
    >
      <div className="max-w-[1040px] mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div
          className="font-mono text-[13px] tracking-[0.08em]"
          style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
        >
          <span style={{ color: "var(--muted)" }}>[</span>
          <span style={{ color: "var(--text)" }}>VinSOC RnD</span>
          <span style={{ color: "var(--accent-red)" }}>]</span>
          <span className="ml-2">© {year}</span>
        </div>
        <div className="flex items-center gap-6">
          {[
            { href: "/feed.xml", label: "RSS" },
            { href: "https://ctftime.org/team/414698", label: "CTFTIME", external: true },
            { href: "https://github.com", label: "GITHUB", external: true },
          ].map((link) =>
            "external" in link ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] tracking-[0.16em] uppercase transition-colors hover:text-[var(--accent-red)]"
                style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] tracking-[0.16em] uppercase transition-colors hover:text-[var(--accent-red)]"
                style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
