#!/usr/bin/env tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const POSTS_DIR = path.join(CONTENT_ROOT, "posts");
const MEMBERS_DIR = path.join(CONTENT_ROOT, "members");

const PostFrontmatterSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  authors: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  ctf: z.object({ name: z.string(), url: z.string().url().optional() }).optional(),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
});

const MemberFrontmatterSchema = z.object({
  name: z.string().min(1),
  handle: z.string().min(1),
  avatar: z.string().optional(),
  role: z.string().optional(),
  status: z.enum(["active", "alumni", "hidden"]).default("active"),
  location: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).default([]),
  socials: z
    .object({
      github: z.string().url().optional(),
      website: z.string().url().optional(),
      x: z.string().url().optional(),
      email: z.string().optional(),
      ctftime: z.string().url().optional(),
      linkedin: z.string().url().optional(),
    })
    .default({}),
  order: z.number().default(999),
});

let errors = 0;

function error(file: string, message: string) {
  console.error(`[content error] ${file}`);
  console.error(`  - ${message}`);
  errors++;
}

function readMarkdownFiles(dir: string): string[] {
  try {
    return fs.readdirSync(dir).filter((file) => file.endsWith(".md"));
  } catch {
    return [];
  }
}

const memberHandles = new Set(readMarkdownFiles(MEMBERS_DIR).map((file) => file.replace(/\.md$/, "")));
const slugs = new Set<string>();

for (const filename of readMarkdownFiles(POSTS_DIR)) {
  const slug = filename.replace(/\.md$/, "");
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  if (slugs.has(slug)) error(filename, `Duplicate slug: ${slug}`);
  slugs.add(slug);

  const parsed = PostFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      error(filename, `${issue.path.join(".")}: ${issue.message}`);
    }
    continue;
  }

  const frontmatter = parsed.data;
  if (Number.isNaN(new Date(frontmatter.date).getTime())) {
    error(filename, `Invalid date: ${frontmatter.date}`);
  }

  for (const author of frontmatter.authors) {
    if (!memberHandles.has(author)) {
      error(filename, `Author "${author}" not found in content/members/${author}.md`);
    }
  }

  if (frontmatter.cover?.startsWith("/") && !frontmatter.cover.startsWith("http")) {
    const coverPath = path.join(CONTENT_ROOT, frontmatter.cover.replace(/^\//, ""));
    if (!fs.existsSync(coverPath)) error(filename, `Cover not found: ${frontmatter.cover}`);
  }

  if (frontmatter.tags.length === 0) {
    console.warn(`[content warn] ${filename}: no tags`);
  }
}

for (const filename of readMarkdownFiles(MEMBERS_DIR)) {
  const filePath = path.join(MEMBERS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  const parsed = MemberFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      error(filename, `${issue.path.join(".")}: ${issue.message}`);
    }
    continue;
  }

  const frontmatter = parsed.data;
  if (frontmatter.avatar?.startsWith("/") && !frontmatter.avatar.startsWith("http")) {
    const avatarPath = path.join(CONTENT_ROOT, frontmatter.avatar.replace(/^\//, ""));
    if (!fs.existsSync(avatarPath)) error(filename, `Avatar not found: ${frontmatter.avatar}`);
  }
}

if (errors > 0) {
  console.error(`\n${errors} content error(s) found.`);
  process.exit(1);
}

console.log("✓ Content validation passed.");
