import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ✅ COMPLETE IMAGE FIX
  images: {
    unoptimized: true,
    // Remove ALL remotePatterns - use unoptimized instead
  },
  
  // ✅ DISABLE RSC PREFETCHING
  experimental: {
    // Turn off RSC streaming/prefetching
    serverActions: {
      bodySizeLimit: '2mb'
    },
    // Disable automatic prefetching
    scrollRestoration: false,
    // Reduce bundle size
    optimizeCss: false,
    // Disable RSC prefetch
    staleTimes: {
      dynamic: 0,
      static: 0,
    }
  },
  
  // ✅ Disable all prefetching
  onDemandEntries: {
    // Keep pages in memory for less time
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;