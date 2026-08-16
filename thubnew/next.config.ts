import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ['aipipeline'],
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
};

export default nextConfig;
