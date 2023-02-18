/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['127.0.0.1', 'pocketbase-production-cb7a.up.railway.app'],
  },
  reactStrictMode: false,
}

module.exports = nextConfig
