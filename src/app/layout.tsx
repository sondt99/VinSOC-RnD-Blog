import type { Metadata } from "next";
import { Share_Tech_Mono, JetBrains_Mono, IBM_Plex_Sans_Condensed } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { defaultMetadata } from "@/lib/seo/metadata";
import "./globals.css";
import "@/styles/article.css";
import "katex/dist/katex.min.css";

const displayFont = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const codeFont = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
});

const bodyFont = IBM_Plex_Sans_Condensed({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${codeFont.variable} ${bodyFont.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
