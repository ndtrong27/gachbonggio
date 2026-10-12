import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gachbonggio.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yxzlcvhprkdctoeqjmrw.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
