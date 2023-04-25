const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const SUBDOMAINS = ['subid']

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
  async rewrites() {
    return [
      {
        has: SUBDOMAINS.map((subdomain) => ({
          type: 'host',
          value: `(?<host>${subdomain}.*)`,
        })),
        source: '/',
        destination: '/:host',
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
