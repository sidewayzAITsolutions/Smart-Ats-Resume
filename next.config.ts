import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack configuration
  turbopack: {
    // Root directory to resolve the lockfile warning
    root: process.cwd(),
  },
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.stripe.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // TypeScript configuration - run during build but don't fail
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Experimental features for Next.js 16
  experimental: {
    // Enable server actions (now stable in Next.js 15+)
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Enable optimized package imports
    optimizePackageImports: [
      'lucide-react',
      '@stripe/stripe-js',
      'react-icons',
    ],
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
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
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      // Add any redirects here if needed
    ];
  },
  
  // Rewrites
  async rewrites() {
    return [
      // Add any rewrites here if needed
    ];
  },
  
  // Webpack configuration (only used when not using Turbopack)
  webpack: (config, { isServer }) => {
    // Handle PDF.js worker files
    config.resolve.alias = {
      ...config.resolve.alias,
      'canvas': false,
    };
    
    // Add support for importing PDF files
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
    });
    
    return config;
  },
  
  // Environment variables that should be available at build time
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
  },
  
  // Powered by header
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
  
  // Production source maps (disable in production for better performance)
  productionBrowserSourceMaps: false,
  
  // Trailing slash configuration
  trailingSlash: false,
  
  // i18n configuration (if needed)
  // i18n: {
  //   locales: ['en'],
  //   defaultLocale: 'en',
  // },
};

export default nextConfig;
