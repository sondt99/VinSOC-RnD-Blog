"use client";

import { useEffect, useRef } from "react";

export function ArticleContent({ html }: { html: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanup: (() => void)[] = [];

    for (const btn of Array.from(el.querySelectorAll<HTMLButtonElement>(".article-copy-btn"))) {
      const figure = btn.closest<HTMLElement>("[data-rehype-pretty-code-figure]");
      const code = figure?.querySelector<HTMLElement>("pre code");
      if (!code) continue;

      const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(code.innerText);
        } catch {
          const range = document.createRange();
          range.selectNode(code);
          window.getSelection()?.removeAllRanges();
          window.getSelection()?.addRange(range);
          document.execCommand("copy");
          window.getSelection()?.removeAllRanges();
        }

        btn.textContent = "COPIED";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = "COPY";
          btn.classList.remove("copied");
        }, 2000);
      };

      btn.addEventListener("click", handleCopy);
      cleanup.push(() => btn.removeEventListener("click", handleCopy));
    }

    for (const btn of Array.from(el.querySelectorAll<HTMLButtonElement>(".article-code-expand"))) {
      const figure = btn.previousElementSibling as HTMLElement | null;
      const pre = figure?.matches("[data-rehype-pretty-code-figure]")
        ? figure.querySelector<HTMLElement>("pre")
        : null;
      if (!pre) continue;

      const original = btn.textContent ?? "▼  SHOW ALL";
      const handleToggle = () => {
        const isCollapsed = pre.classList.toggle("code-collapsed");
        btn.textContent = isCollapsed ? original : "▲  COLLAPSE";
      };

      btn.addEventListener("click", handleToggle);
      cleanup.push(() => btn.removeEventListener("click", handleToggle));
    }

    return () => cleanup.forEach((fn) => fn());
  }, [html]);

  return (
    <main
      ref={ref}
      className="article min-w-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
