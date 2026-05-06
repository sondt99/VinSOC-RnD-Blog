import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { POSTS_DIR } from "./paths";
import { PostFrontmatterSchema } from "./schemas";
import { compileMarkdown } from "./markdown";
import type { TocItem } from "./toc";

export type PostListItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updated?: string;
  authors: string[];
  tags: string[];
  ctf?: { name: string; url?: string };
  cover?: string;
  draft: boolean;
  featured: boolean;
  readingTime: string;
  wordCount: number;
};

export type Post = PostListItem & {
  html: string;
  toc: TocItem[];
};

const isDev = process.env.NODE_ENV === "development";

async function readPostFile(filename: string): Promise<PostListItem | null> {
  const slug = filename.replace(/\.md$/, "");
  const filePath = path.join(POSTS_DIR, filename);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);

  const parsed = PostFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    console.error(`[posts] Invalid frontmatter in ${filename}:`, parsed.error.flatten());
    return null;
  }

  const fm = parsed.data;
  if (fm.draft && !isDev) return null;

  const rtResult = readingTime(content);

  return {
    slug,
    ...fm,
    readingTime: rtResult.text,
    wordCount: rtResult.words,
  };
}

export async function getAllPosts(): Promise<PostListItem[]> {
  let files: string[];
  try {
    files = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }

  const mdFiles = files.filter((f) => f.endsWith(".md"));
  const posts = await Promise.all(mdFiles.map(readPostFile));

  return posts
    .filter((p): p is PostListItem => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  const parsed = PostFrontmatterSchema.safeParse(data);
  if (!parsed.success) return null;

  const fm = parsed.data;
  if (fm.draft && !isDev) return null;

  const compiled = await compileMarkdown(content);

  return {
    slug,
    ...fm,
    readingTime: compiled.stats.readingTime,
    wordCount: compiled.stats.wordCount,
    html: compiled.html,
    toc: compiled.toc,
  };
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    return files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

export function groupPostsByYear(posts: PostListItem[]): [number, PostListItem[]][] {
  const groups = new Map<number, PostListItem[]>();
  for (const post of posts) {
    const year = parseInt(post.date.slice(0, 4), 10);
    const arr = groups.get(year) ?? [];
    arr.push(post);
    groups.set(year, arr);
  }
  return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
}

export function getAllTags(posts: PostListItem[]): string[] {
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tags.add(tag.toLowerCase());
    }
  }
  return Array.from(tags).sort();
}
