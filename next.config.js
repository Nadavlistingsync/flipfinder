/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
  // Add basePath if your app is not deployed at the root
  // basePath: '/flipfinder',
  // Add assetPrefix if your app is not deployed at the root
  // assetPrefix: '/flipfinder/',
}

module.exports = nextConfig 