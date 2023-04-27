const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/x',
        permanent: true,
      },
      {
        source: '/c/:slug',
        destination: '/x/c/:slug',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.subsocial.network',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
