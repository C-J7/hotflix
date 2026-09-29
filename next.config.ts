import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // TMDB's CDN already serves pre-sized images; re-optimizing them would only burn Vercel's image quota.
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/homepage", destination: "/browse", permanent: true },
      { source: "/recommendations", destination: "/browse", permanent: true },
      { source: "/aboutPage", destination: "/about", permanent: true },
      {
        source: "/streaming",
        has: [{ type: "query", key: "video_id", value: "(?<id>\\d+)" }],
        destination: "/movie/:id",
        permanent: true,
      },
      { source: "/streaming", destination: "/browse", permanent: true },
    ]
  },
}

export default nextConfig
