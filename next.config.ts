import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static export mode
  images: {
    unoptimized: true, // Disable image optimization for static export compatibility
  },
};

export default nextConfig;
