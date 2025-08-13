/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
  },
  // 优化构建
  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query']
  }
}

module.exports = nextConfig
