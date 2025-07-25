import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fix for TailwindCSS v4 and Google Fonts compatibility
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
