import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: "32mb",
  },
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{key: "Content-Type", value: "application/json"}],
      },
      {
        source: "/.well-known/assetlinks.json",
        headers: [{key: "Content-Type", value: "application/json"}],
      },
    ];
  },
};

export default nextConfig;
