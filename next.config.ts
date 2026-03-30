/**
 * NEXT.JS CONFIGURATION
 * Optimized for performance with code splitting, caching, and bundle optimization
 */
import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Enable Turbopack in development
  // Note: Turbopack is enabled by default in Next.js 15+ when using `next dev --turbo`

  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_API_HOSTNAME || 'apidev.predictgalore.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],

    // Modern image formats for better performance
    formats: ['image/avif', 'image/webp'],

    // Image quality settings - reduce quality for smaller bundles
    minimumCacheTTL: 60, // Cache images for 60 seconds
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // Device sizes for responsive images (optimized)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],

    // Image sizes for responsive images (optimized)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // CORS proxy for API requests
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://apidev.predictgalore.com';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ];
  },

  // Cache and security headers
  async headers() {
    return [
      {
        // Apply headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache images
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // API routes
        source: '/api/v1/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
          },
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },

  // Compiler options for production
  compiler: {
    // Remove console logs in production (except error and warn)
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports - tree-shake unused exports
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'lucide-react',
      'react-icons',
      'dayjs',
    ],

    // Enable optimizeCss for smaller CSS bundles
    optimizeCss: true,
  },

  // Transpile packages that need to be processed by Next.js
  transpilePackages: ['react-window'],

  // Output configuration
  output: 'standalone',

  // Production source maps (disabled for better performance)
  productionBrowserSourceMaps: false,
};

export default withBundleAnalyzer(nextConfig);
