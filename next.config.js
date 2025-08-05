/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { enabled: true },
  },
  transpilePackages: ['@prisma/client'],
}

module.exports = nextConfig 