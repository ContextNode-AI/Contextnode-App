import type { NextConfig } from "next";

const API_BACKEND = process.env.API_BACKEND_URL || "http://localhost:3001";

const nextConfig: NextConfig = {
  transpilePackages: ["@contextnode/ui", "@contextnode/types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BACKEND}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
