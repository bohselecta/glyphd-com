/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@core': path.resolve(__dirname, '../../packages/core'),
      '@ai': path.resolve(__dirname, '../../packages/ai'),
      '@schemas': path.resolve(__dirname, '../../packages/schemas'),
      '@designer': path.resolve(__dirname, '../../packages/designer'),
      '@deployer': path.resolve(__dirname, '../../packages/deployer'),
      '@utils': path.resolve(__dirname, '../../packages/utils'),
      '@config': path.resolve(__dirname, '../../packages/config'),
    }
    return config
  }
}

module.exports = nextConfig
