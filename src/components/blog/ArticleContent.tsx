"use client";

import { useEffect, useRef } from "react";

const COLLAPSE_THRESHOLD = 30; // lines

// Human-readable language labels
const LANG_LABELS: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TypeScript JSX",
  jsx: "JavaScript JSX",
  py: "Python",
  python: "Python",
  sh: "Shell",
  bash: "Bash",
  zsh: "Zsh",
  shell: "Shell",
  c: "C",
  cpp: "C++",
  "c++": "C++",
  rs: "Rust",
  rust: "Rust",
  go: "Go",
  java: "Java",
  rb: "Ruby",
  ruby: "Ruby",
  php: "PHP",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  sass: "Sass",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  toml: "TOML",
  md: "Markdown",
  markdown: "Markdown",
  sql: "SQL",
  graphql: "GraphQL",
  dockerfile: "Dockerfile",
  makefile: "Makefile",
  tex: "LaTeX",
  latex: "LaTeX",
  asm: "Assembly",
  nasm: "Assembly",
  r: "R",
  swift: "Swift",
  kotlin: "Kotlin",
  scala: "Scala",
  lua: "Lua",
  vim: "Vim Script",
  nginx: "Nginx",
  powershell: "PowerShell",
  ps1: "PowerShell",
  xml: "XML",
  ini: "INI",
  env: ".env",
  diff: "Diff",
  plaintext: "Plain Text",
  text: "Plain Text",
  txt: "Plain Text",
};

function getLangLabel(lang: string | null): string {
  if (!lang) return "Code";
  return LANG_LABELS[lang.toLowerCase()] ?? lang.toUpperCase();
}

export function ArticleContent({ html }: { html: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const pres = Array.from(el.querySelectorAll<HTMLElement>("pre"));
    const cleanup: (() => void)[] = [];

    for (const pre of pres) {
      const code = pre.querySelector("code");
      if (!code) continue;

      const fragment = pre.closest<HTMLElement>("[data-rehype-pretty-code-fragment]");
      const lang = code.getAttribute("data-language");

      // --- Language header bar (skip if rehype-pretty-code title already present) ---
      const hasTitle = fragment?.querySelector("[data-rehype-pretty-code-title]");
      if (!hasTitle) {
        const header = document.createElement("div");
        header.className = "code-header";

        const langSpan = document.createElement("span");
        langSpan.className = "code-lang";
        langSpan.textContent = getLangLabel(lang);
        header.appendChild(langSpan);

        // Copy button lives in the header
        const btn = document.createElement("button");
        btn.textContent = "COPY";
        btn.className = "article-copy-btn";
        btn.setAttribute("aria-label", "Copy code");

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
        header.appendChild(btn);

        // Insert header INSIDE the fragment (before pre), or before pre if no fragment
        if (fragment) {
          fragment.insertBefore(header, pre);
        } else {
          pre.parentNode?.insertBefore(header, pre);
        }
      }

      // --- Collapsible for large blocks ---
      const lines = code.querySelectorAll("[data-line]").length;
      if (lines > COLLAPSE_THRESHOLD) {
        pre.classList.add("code-collapsed");
        const toggle = document.createElement("button");
        toggle.textContent = `▼  SHOW ALL ${lines} LINES`;
        toggle.className = "article-code-expand";

        const handleToggle = () => {
          const isCollapsed = pre.classList.toggle("code-collapsed");
          toggle.textContent = isCollapsed ? `▼  SHOW ALL ${lines} LINES` : "▲  COLLAPSE";
        };

        toggle.addEventListener("click", handleToggle);
        cleanup.push(() => toggle.removeEventListener("click", handleToggle));

        const anchor = fragment ?? pre;
        anchor.parentNode?.insertBefore(toggle, anchor.nextSibling);
      }
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
