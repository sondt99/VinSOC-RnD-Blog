"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/lib/content/toc";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [active, setActive] = useState<string>("");
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0% -70% 0%", threshold: 0 }
    );

    const headings = document.querySelectorAll("h2[id], h3[id], h4[id]");
    headings.forEach((el) => observer.current?.observe(el));

    return () => observer.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-[13px]">
      <p
        className="text-[10px] tracking-[0.18em] uppercase mb-3 font-semibold"
        style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}
      >
        ON THIS PAGE
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => {
          const isActive = active === item.id;
          const indent = item.depth === 2 ? "" : item.depth === 3 ? "pl-3" : "pl-6";
          return (
            <li key={item.id} className={indent}>
              <a
                href={`#${item.id}`}
                className="block leading-snug transition-colors duration-150 hover:text-[var(--accent-red)]"
                style={{
                  color: isActive ? "var(--accent-red)" : "var(--muted)",
                  fontWeight: isActive ? "600" : "normal",
                  fontSize: item.depth === 2 ? "13px" : "12px",
                }}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
