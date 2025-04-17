import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const isDev = process.env.NODE_ENV === "development";
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
        basePath: false,
      },
    ];
  },
  output: "standalone",
  experimental: {
    proxyTimeout: 120000,
  },
};

export default nextConfig;
