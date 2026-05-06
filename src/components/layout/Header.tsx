"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "BLOGS & WRITEUPS", href: "/blog" },
  { label: "MEMBERS", href: "/members" },
  { label: "ACHIEVEMENTS", href: "/achievements" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        background: "rgba(244, 244, 244, 0.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--line)",
      }}
      className="sticky top-0 z-50 h-14"
    >
      <div className="max-w-[1040px] mx-auto px-5 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-0 font-mono text-[18px] font-bold tracking-[0.08em] group"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span
            className="transition-all duration-200 group-hover:text-[var(--accent-red)]"
            style={{ color: "var(--muted)" }}
          >
            [
          </span>
          <span
            className="transition-colors duration-200"
            style={{ color: "var(--text)" }}
          >
            VinSOC RnD
          </span>
          <span
            className="transition-all duration-200 group-hover:text-[var(--accent-red)]"
            style={{ color: "var(--accent-red)" }}
          >
            ]
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="relative text-[11px] tracking-[0.20em] uppercase transition-colors duration-150 group/nav"
                style={{
                  fontFamily: "var(--font-display)",
                  color: active ? "var(--accent-red)" : "var(--text-soft)",
                }}
              >
                {item.label}
                {/* Animated underline */}
                <span
                  className="absolute -bottom-0.5 left-0 h-px transition-all duration-250"
                  style={{
                    background: "var(--accent-red)",
                    width: active ? "100%" : "0%",
                  }}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5 h-0.5 transition-all duration-200"
              style={{
                background: "var(--text)",
                transform:
                  i === 0 && open ? "rotate(45deg) translate(4px, 4px)" :
                  i === 1 && open ? "scaleX(0)" :
                  i === 2 && open ? "rotate(-45deg) translate(4px, -4px)" :
                  "none",
                opacity: i === 1 && open ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden absolute top-14 left-0 right-0 z-50 py-2 anim-fade-in-down"
          style={{
            background: "var(--bg)",
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <nav className="max-w-[1040px] mx-auto px-5 flex flex-col gap-0" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="py-3 text-[11px] tracking-[0.20em] uppercase border-b last:border-b-0 transition-colors"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: active ? "var(--accent-red)" : "var(--text-soft)",
                    borderColor: "var(--line-soft)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
