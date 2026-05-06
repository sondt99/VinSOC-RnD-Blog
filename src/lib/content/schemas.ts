import { z } from "zod";

export const PostFrontmatterSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  updated: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "updated must be YYYY-MM-DD")
    .optional(),
  authors: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  ctf: z
    .object({
      name: z.string(),
      url: z.string().url().optional(),
    })
    .optional(),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

export const MemberFrontmatterSchema = z.object({
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

export type MemberFrontmatter = z.infer<typeof MemberFrontmatterSchema>;
