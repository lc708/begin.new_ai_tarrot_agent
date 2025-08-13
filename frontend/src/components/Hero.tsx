/**
 * Hero组件 - 首页欢迎区域
 */

"use client";

import { useState } from 'react';
import { Sparkles, Star, Zap } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  onStartDivination: () => void;
  loading?: boolean;
}

export function Hero({ title, subtitle, onStartDivination, loading = false }: HeroProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-gray-800">
        {/* 浮动星星动画 */}
        <div className="absolute top-20 left-20 text-accent-400 animate-sparkle">
          <Star size={24} />
        </div>
        <div className="absolute top-32 right-32 text-primary-400 animate-sparkle" style={{ animationDelay: '1s' }}>
          <Sparkles size={20} />
        </div>
        <div className="absolute bottom-32 left-32 text-accent-300 animate-sparkle" style={{ animationDelay: '2s' }}>
          <Zap size={18} />
        </div>
        <div className="absolute bottom-20 right-20 text-primary-300 animate-sparkle" style={{ animationDelay: '0.5s' }}>
          <Star size={16} />
        </div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* 标题 */}
        <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-400 bg-clip-text text-transparent animate-float">
          {title}
        </h1>
        
        {/* 副标题 */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* 装饰性塔罗牌图标 */}
        <div className="flex justify-center space-x-8 mb-12">
          {['🌙', '⭐', '🔮', '✨', '🌟'].map((emoji, index) => (
            <div
              key={index}
              className="text-4xl animate-float"
              style={{ 
                animationDelay: `${index * 0.5}s`,
                animationDuration: `${3 + index * 0.5}s`
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        {/* 开始按钮 */}
        <button
          onClick={onStartDivination}
          disabled={loading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative group px-12 py-4 text-xl font-semibold rounded-full
            bg-gradient-to-r from-primary-600 to-accent-500
            hover:from-primary-500 hover:to-accent-400
            text-white shadow-lg hover:shadow-2xl
            transform transition-all duration-300
            ${isHovered ? 'scale-105 shadow-glow' : ''}
            ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-1'}
          `}
        >
          {/* 按钮背景效果 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          
          {/* 按钮内容 */}
          <span className="relative flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>连接中...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>开始占卜</span>
                <Sparkles size={20} />
              </>
            )}
          </span>
        </button>

        {/* 提示文字 */}
        <p className="mt-8 text-gray-400 text-sm">
          🔮 让AI占卜师星月为你解读命运的奥秘
        </p>
      </div>

      {/* 底部渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </div>
  );
}
