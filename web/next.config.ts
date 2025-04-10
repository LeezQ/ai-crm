import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
        basePath: false,
      },
    ];
  },
  experimental: {
    proxyTimeout: 120000,
  },
};

export default nextConfig;
