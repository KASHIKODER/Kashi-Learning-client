import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // ✅ DISABLE ALL IMAGE OPTIMIZATION
    unoptimized: true,
    
    // ✅ Remove remotePatterns since we're disabling optimization
    // remotePatterns: [] 
  },
  // ✅ Disable prefetching to reduce unnecessary API calls
  experimental: {
    // Disable these to reduce errors
    workerThreads: false,
    cpus: 1,
  },
  // ✅ Add these headers to prevent CORS issues
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://kashi-learning-server.onrender.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
        ],
      },
    ]
  },
};

export default nextConfig;