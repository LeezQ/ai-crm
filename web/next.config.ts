import type { NextConfig } from "next";

const apiOrigin =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_SERVER_ORIGIN ||
  "http://localhost:3001";

const nextConfig: NextConfig = {
  async rewrites() {
    const origin = apiOrigin.replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${origin}/api/:path*`,
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
