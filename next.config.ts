import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ✅ FIX: Add ALL domains and COMPLETE unoptimized settings
  images: {
    unoptimized: true,
    // Add ALL domains that might have images
    domains: [
      'randomuser.me',
      'images.unsplash.com',
      'picsum.photos',
      'via.placeholder.com',
      'i.imgur.com',
      'localhost',
      'kashi-learning-client.vercel.app'
    ],
    // Also add remotePatterns for wildcard
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow ALL domains
      },
      {
        protocol: 'http',
        hostname: '**', // Allow ALL domains
      },
    ],
  },
  
  // Remove experimental settings that might interfere
  // experimental: {},
  
  // Add this to force disable image optimization
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|avif)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next',
            name: 'static/media/[name].[hash].[ext]',
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;