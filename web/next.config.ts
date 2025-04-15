import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    proxyTimeout: 120000,
  },
};

export default nextConfig;
