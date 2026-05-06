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

export type MarkdownStats = {
  readingTime: string;
  wordCount: number;
};

export type CompiledMarkdown = {
  html: string;
  toc: TocItem[];
  stats: MarkdownStats;
};

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

  // Add data-line-numbers to all fenced code blocks so CSS renders line numbers.
  // rehype-pretty-code omits data-language for plain triple-backtick fences, so handle both shapes.
  let html = String(await processor.process(content));
  html = html.replace(/<code(?![^>]*data-line-numbers)([^>]*)>/g, "<code data-line-numbers$1>");

  return {
    html,
    toc,
    stats: {
      readingTime: rtResult.text,
      wordCount: rtResult.words,
    },
  };
}
