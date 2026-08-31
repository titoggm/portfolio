import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    // ProjectCard renders screenshots at quality 90; Next only serves
    // qualities listed here.
    qualities: [75, 90],
  },
};

export default nextConfig;
