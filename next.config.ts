import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  typescript: { tsconfigPath: "tsconfig.app.json" },
  async headers() {
    return [{
      source: "/audit/:path*",
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
    }, {
      source: "/administration/:path*",
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }, { key: "Cache-Control", value: "private, no-store" }],
    }, {
      source: "/api/leads/:path*",
      headers: [{ key: "Cache-Control", value: "private, no-store" }],
    }];
  },
};

export default nextConfig;
