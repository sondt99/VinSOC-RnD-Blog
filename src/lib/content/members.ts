import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { MEMBERS_DIR } from "./paths";
import { MemberFrontmatterSchema } from "./schemas";
import { compileMarkdown } from "./markdown";

export type MemberSocials = {
  github?: string;
  website?: string;
  x?: string;
  email?: string;
  ctftime?: string;
  linkedin?: string;
};

export type Member = {
  slug: string;
  name: string;
  handle: string;
  avatar?: string;
  role?: string;
  status: "active" | "alumni" | "hidden";
  location?: string;
  bio?: string;
  skills: string[];
  socials: MemberSocials;
  order: number;
  html: string;
};

async function readMemberFile(filename: string): Promise<Member | null> {
  const slug = filename.replace(/\.md$/, "");
  const filePath = path.join(MEMBERS_DIR, filename);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);

  const parsed = MemberFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    console.error(`[members] Invalid frontmatter in ${filename}:`, parsed.error.flatten());
    return null;
  }

  const fm = parsed.data;
  if (fm.status === "hidden") return null;

  const compiled = await compileMarkdown(content);

  return {
    slug,
    name: fm.name,
    handle: fm.handle,
    avatar: fm.avatar,
    role: fm.role,
    status: fm.status,
    location: fm.location,
    bio: fm.bio,
    skills: fm.skills,
    socials: fm.socials,
    order: fm.order,
    html: compiled.html,
  };
}

export async function getAllMembers(): Promise<Member[]> {
  let files: string[];
  try {
    files = await fs.readdir(MEMBERS_DIR);
  } catch {
    return [];
  }

  const mdFiles = files.filter((f) => f.endsWith(".md"));
  const members = await Promise.all(mdFiles.map(readMemberFile));

  return members
    .filter((m): m is Member => m !== null)
    .sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.name.localeCompare(b.name);
    });
}

export async function getMember(slug: string): Promise<Member | null> {
  const filePath = path.join(MEMBERS_DIR, `${slug}.md`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  const parsed = MemberFrontmatterSchema.safeParse(data);
  if (!parsed.success) return null;

  const fm = parsed.data;
  if (fm.status === "hidden") return null;

  const compiled = await compileMarkdown(content);

  return {
    slug,
    name: fm.name,
    handle: fm.handle,
    avatar: fm.avatar,
    role: fm.role,
    status: fm.status,
    location: fm.location,
    bio: fm.bio,
    skills: fm.skills,
    socials: fm.socials,
    order: fm.order,
    html: compiled.html,
  };
}

export async function getAllMemberSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(MEMBERS_DIR);
    return files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}
