import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-terminal-emulator-ui"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
