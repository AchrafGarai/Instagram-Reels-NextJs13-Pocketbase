import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: {
      // Video uploads go through a Server Action; keep in sync with the
      // `posts.video` maxSize in the PocketBase migration (50 MB) plus overhead.
      bodySizeLimit: '52mb',
    },
  },
}

export default nextConfig
