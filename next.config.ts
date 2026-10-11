import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  async redirects() {
    return [
      {
        source: '/admin/login',
        destination: '/login',
        permanent: false,
      },
      {
        source: '/admin/dashboard',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/admin/image-prompts',
        destination: '/dashboard/image-prompts',
        permanent: false,
      },
      {
        source: '/admin/image-prompts/:path*',
        destination: '/dashboard/image-prompts/:path*',
        permanent: false,
      },
      {
        source: '/admin/video-prompts',
        destination: '/dashboard/video-prompts',
        permanent: false,
      },
      {
        source: '/admin/video-prompts/:path*',
        destination: '/dashboard/video-prompts/:path*',
        permanent: false,
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
