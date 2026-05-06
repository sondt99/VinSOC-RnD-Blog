import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import readingTime from "reading-time";
import { extractToc, type TocItem } from "./toc";

const COLLAPSE_THRESHOLD = 30;

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

export type MarkdownStats = {
  readingTime: string;
  wordCount: number;
};

export type CompiledMarkdown = {
  html: string;
  toc: TocItem[];
  stats: MarkdownStats;
};

function getLangLabel(lang?: string): string {
  if (!lang) return "Plain Text";
  return LANG_LABELS[lang.toLowerCase()] ?? lang.toUpperCase();
}

function normalizePlainCodeBlocks(html: string): string {
  return html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (_match, code: string) => {
    const lines = code.replace(/\n$/, "").split("\n");
    const renderedLines = lines.map((line) => `<span data-line="">${line}</span>`).join("\n");

    return `<figure data-rehype-pretty-code-figure=""><pre style="background-color:#282c34;color:#abb2bf" tabindex="0" data-theme="one-dark-pro"><code data-line-numbers data-theme="one-dark-pro" style="display: grid;">${renderedLines}</code></pre></figure>`;
  });
}

function addLineNumbers(html: string): string {
  return html.replace(
    /<pre([^>]*)><code(?![^>]*data-line-numbers)([^>]*)>/g,
    "<pre$1><code data-line-numbers$2>"
  );
}

function decorateCodeFigures(html: string): string {
  return html.replace(
    /<figure data-rehype-pretty-code-figure="">([\s\S]*?)<pre([^>]*)>([\s\S]*?)<\/pre><\/figure>/g,
    (_match, beforePre: string, preAttrs: string, preContent: string) => {
      const language = /data-language="([^"]+)"/.exec(preAttrs)?.[1] ??
        /data-language="([^"]+)"/.exec(preContent)?.[1];
      const lineCount = (preContent.match(/data-line=""/g) ?? []).length;
      const hasTitle = beforePre.includes("data-rehype-pretty-code-title");
      const hasHeader = beforePre.includes("code-header");
      const header = hasTitle || hasHeader
        ? ""
        : `<div class="code-header"><span class="code-lang">${getLangLabel(language)}</span><button type="button" class="article-copy-btn" aria-label="Copy code">COPY</button></div>`;
      const collapsedPreAttrs = lineCount > COLLAPSE_THRESHOLD && !/class="[^"]*code-collapsed/.test(preAttrs)
        ? preAttrs.includes("class=")
          ? preAttrs.replace(/class="([^"]*)"/, 'class="$1 code-collapsed"')
          : `${preAttrs} class="code-collapsed"`
        : preAttrs;
      const expand = lineCount > COLLAPSE_THRESHOLD
        ? `<button type="button" class="article-code-expand">▼  SHOW ALL ${lineCount} LINES</button>`
        : "";

      return `<figure data-rehype-pretty-code-figure="">${beforePre}${header}<pre${collapsedPreAttrs}>${preContent}</pre></figure>${expand}`;
    }
  );
}

export async function compileMarkdown(content: string): Promise<CompiledMarkdown> {
  const rtResult = readingTime(content);
  const toc = extractToc(content);

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["heading-anchor"] },
    })
    .use(rehypeKatex)
    .use(rehypePrettyCode, {
      theme: "one-dark-pro",
      keepBackground: true,
    })
    .use(rehypeStringify);

  let html = String(await processor.process(content));
  html = normalizePlainCodeBlocks(html);
  html = addLineNumbers(html);
  html = decorateCodeFigures(html);

  return {
    html,
    toc,
    stats: {
      readingTime: rtResult.text,
      wordCount: rtResult.words,
    },
  };
}
