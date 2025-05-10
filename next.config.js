/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  images: {
    unoptimized: true,
    domains: ['i.ebayimg.com', 'i.ebaystatic.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ebayimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.ebaystatic.com',
      },
    ],
  },
  trailingSlash: true,
  reactStrictMode: true,
  // Add basePath if your app is not deployed at the root
  // basePath: '/flipfinder',
  // Add assetPrefix if your app is not deployed at the root
  // assetPrefix: '/flipfinder/',
  swcMinify: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
    level: 'info',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  }
}

module.exports = nextConfig 