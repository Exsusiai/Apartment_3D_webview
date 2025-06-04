/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/projects/memospace',
  assetPrefix: '/projects/memospace',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig
