# VinSOC RnD Website

Official website and technical blog for **VinSOC RnD**, a CTF and security research team.

The site is built with Next.js App Router, TypeScript, Tailwind CSS v4, local Markdown content, and live CTFtime achievements integration.

## Features

- **Landing page** for team introduction and highlights
- **Blog / writeup system** powered by Markdown files in `content/posts/`
- **Member profiles** powered by local Markdown files in `content/members/`
- **Automatic member avatars** from `content/assets/members/<handle>.<ext>`
- **CTFtime achievements page** using the CTFtime API with fallback data
- **Syntax-highlighted code blocks** with:
  - Shiki `one-dark-pro` theme
  - language labels
  - line numbers
  - copy buttons
  - collapsible long code blocks
  - normalized rendering for plain triple-backtick fences
- **Math rendering** with KaTeX
- **RSS feed**, sitemap, robots.txt, and SEO metadata
- **Vercel-ready deployment** with daily cron revalidation compatible with the Hobby plan

## Tech Stack

- **Framework:** Next.js 15 App Router
- **Language:** TypeScript
- **UI:** React 19
- **Styling:** Tailwind CSS v4 + CSS custom properties
- **Markdown:** unified, remark, rehype
- **Syntax highlighting:** rehype-pretty-code + Shiki
- **Math:** remark-math + rehype-katex
- **Validation:** Zod
- **Deployment:** Vercel

## Project Structure

```txt
.
├── content/
│   ├── assets/
│   │   └── members/              # Member avatar images, named by handle
│   ├── members/                  # Local member profiles
│   └── posts/                    # Blog posts and CTF writeups
├── scripts/
│   └── validate-content.ts       # Frontmatter validation
├── src/
│   ├── app/                      # Next.js App Router routes
│   ├── components/               # UI components
│   ├── config/                   # Site-wide configuration
│   ├── lib/                      # Content, CTFtime, SEO, utilities
│   └── styles/                   # Article/prose CSS
├── vercel.json                   # Vercel cron configuration
└── package.json
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Available Scripts

```bash
npm run dev               # Start local development server
npm run build             # Create production build
npm run start             # Start production server
npm run typecheck         # Run TypeScript type-checking
npm run validate:content  # Validate post/member frontmatter
npm run check             # Run lint, typecheck, content validation, and build
npm run format            # Format files with Prettier
```

## Content Authoring

### Blog Posts

Create Markdown files in:

```txt
content/posts/
```

Example:

```md
---
title: "Example Writeup"
excerpt: "Short summary for cards and metadata."
date: "2026-01-01"
authors:
  - sondt
tags:
  - writeup
  - reverse
ctf:
  name: "Example CTF"
draft: false
featured: false
---

## Overview

Write your content here.
```

The filename becomes the slug. For example:

```txt
content/posts/2026-01-01-example.md
```

renders at:

```txt
/blog/2026-01-01-example
```

### Member Profiles

Create Markdown files in:

```txt
content/members/
```

Example:

```md
---
name: "Thai Son Dinh"
handle: "sondt"
role: "Captain / Reverse Engineering"
status: "active"
location: "Vietnam"
bio: "CTF player and security researcher."
skills:
  - reverse
  - pwn
socials:
  github: "https://github.com/sondt99"
order: 1
---

## About

Member biography goes here.
```

Supported member statuses:

- `active`
- `alumni`
- `hidden`

`hidden` members are not rendered.

### Member Avatars

Member avatars are detected automatically from:

```txt
content/assets/members/<handle>.<ext>
```

Supported extensions:

```txt
jpeg, jpg, png, webp, avif, gif
```

Example:

```txt
content/assets/members/sondt.jpeg
```

If a member has `handle: "sondt"`, that image is automatically used on `/members` and `/members/sondt`.

You can still override the auto-detected image by setting `avatar` directly in the member frontmatter.

## Markdown Rendering

The article renderer supports:

- headings
- tables
- task lists
- blockquotes
- inline code
- fenced code blocks
- math expressions
- images
- horizontal rules

Code blocks with a language:

````md
```python
print("hello")
```
````

and plain code blocks:

````md
```
plain text code
```
````

are both rendered with the same code-frame UI. Plain blocks simply do not receive syntax colors.

## CTFtime Integration

CTFtime is used only for achievements and ranking data, not for member profiles.

The achievements pipeline:

- fetches the configured CTFtime team
- fetches yearly results
- enriches events with dates
- filters displayed achievements to top 50 placements
- falls back to `src/lib/ctftime/fallback.json` if the live API is unavailable

The members page is intentionally local-content driven because CTFtime team membership may not match the real team roster.

## Deployment

The project is configured for Vercel.

`vercel.json` includes a once-daily cron job compatible with Vercel Hobby accounts:

```json
{
  "crons": [
    {
      "path": "/api/revalidate?tag=ctftime",
      "schedule": "0 2 * * *"
    }
  ]
}
```

CTFtime data also uses ISR/cache revalidation, so the cron is only a backup refresh trigger.

## Validation

Before pushing changes, run:

```bash
npm run check
```

This runs:

- linting
- TypeScript type-checking
- content frontmatter validation
- production build

## License

Private project for VinSOC RnD unless a license is added.
