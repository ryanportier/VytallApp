import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Allow Google OAuth popup to post messages back to parent window
          { key: "Cross-Origin-Opener-Policy", value: "unsafe-none" },
        ],
      },
    ];
  },
};

export default nextConfig;
