import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // ✅ For Vercel: Disable ALL optimization temporarily
    unoptimized: true,
    
    // ✅ Add domains if needed
    domains: ['randomuser.me'],
    
    // ✅ Add remote patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all for now
      },
    ],
  },
  
  // ✅ Remove headers - they might cause issues on Vercel
  // async headers() {
  //   return [];
  // },
  
  // ✅ Add output: 'standalone' for better Vercel compatibility
  output: 'standalone',
};

export default nextConfig;