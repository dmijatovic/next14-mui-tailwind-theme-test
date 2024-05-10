/** @type {import('next').NextConfig} */

import rewritesConfig from './next.rewrites.mjs'
import securityHeaders from './next.headers.mjs'
// console.log('rewritesConfig...', rewritesConfig)

const nextConfig = {
  // create standalone output to use in docker image
  // and achieve minimal image size (see Dockerfile)
  output: 'standalone',
  // enable source maps in production?
  productionBrowserSourceMaps: true,
  // disable strict mode if you want react to render compent once
  // see for more info https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: false,
  // only in development
  rewrites: () => rewritesConfig,

  // direct svg import support
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },

  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },

  // support for svg import - TURBOPACK
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}

export default nextConfig
