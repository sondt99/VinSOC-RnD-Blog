import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinsoc.team";
const SITE_NAME = "VinSOC RnD CTF";
const SITE_DESCRIPTION =
  "Vietnamese CTF team focused on security research, writeups, and competitions.";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: ["/og/default.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function makePostMetadata(post: {
  title: string;
  excerpt: string;
  date: string;
  authors: string[];
  cover?: string;
  slug: string;
}): Metadata {
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: post.authors,
      images: [post.cover ?? "/og/default.png"],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}
