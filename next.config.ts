import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/feed.xml",
        headers: [{ key: "Content-Type", value: "application/atom+xml; charset=utf-8" }],
      },
    ];
  },
};

export default nextConfig;
