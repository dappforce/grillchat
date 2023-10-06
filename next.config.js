const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const runtimeCaching = require('./cache')
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV !== 'production',
  buildExcludes: [/chunks\/.*$/, /media\/.*$/],
  publicExcludes: ['!splashscreens/**/*', '!screenshots/**/*'],
  runtimeCaching,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
    largePageDataBytes: 200 * 1024, // 200kb
  },
  transpilePackages: ['react-tweet'],

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
      { source: '/hubs', destination: '/' },
      { source: '/my-chats', destination: '/' },
      { source: '/hot-chats', destination: '/' },
      { source: '/ai-bots', destination: '/' },
    ]
  },
  async redirects() {
    return [
      {
        source: '/c/:slug',
        destination: '/x/c/:slug',
        permanent: false,
      },
      {
        source: '/:hubId/c/:slug',
        destination: '/:hubId/:slug',
        permanent: false,
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
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'metadata.ens.domains',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = withPWA(withBundleAnalyzer(nextConfig))
