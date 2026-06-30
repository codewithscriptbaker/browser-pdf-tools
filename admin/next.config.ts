import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL ?? "file:./dev.db",
  },
  turbopack: {
    root: "..",
  },
};

export default nextConfig;
