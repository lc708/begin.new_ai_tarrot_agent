import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_APP_NAME: '智能塔罗占卜师',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // 优化配置
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // 图片配置
  images: {
    domains: ['localhost'],
  },
  
  // 构建配置
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
