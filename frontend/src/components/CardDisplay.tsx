/**
 * CardDisplay组件 - 塔罗牌展示
 */

"use client";

import { useState } from 'react';
import { RotateCcw, Info, Sparkles } from 'lucide-react';
import { TarotCard } from '@/lib/api';

interface CardDisplayProps {
  cards: TarotCard[];
  showCards?: boolean;
  animated?: boolean;
  onCardClick?: (card: TarotCard) => void;
  className?: string;
}

export function CardDisplay({
  cards,
  showCards = true,
  animated = true,
  onCardClick,
  className = ""
}: CardDisplayProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleCardClick = (card: TarotCard) => {
    if (onCardClick) {
      onCardClick(card);
    } else {
      // 默认行为：翻转卡片
      setFlippedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(card.id)) {
          newSet.delete(card.id);
        } else {
          newSet.add(card.id);
        }
        return newSet;
      });
    }
  };

  const getCardStyle = (index: number) => {
    if (!animated) return {};
    
    return {
      animationDelay: `${index * 0.3}s`,
      animationFillMode: 'both'
    };
  };

  if (!showCards || cards.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">🎴</div>
        <p className="text-gray-400">等待抽牌...</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* 标题 */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          🔮 你的塔罗牌
        </h2>
        <p className="text-gray-400">
          点击卡片查看详细信息
        </p>
      </div>

      {/* 卡片布局 */}
      <div className={`
        flex justify-center items-center gap-4 md:gap-6
        ${cards.length === 1 ? 'flex-col' : 'flex-wrap md:flex-nowrap'}
      `}>
        {cards.map((card, index) => {
          const isFlipped = flippedCards.has(card.id);
          const isHovered = hoveredCard === card.id;

          return (
            <div
              key={card.id}
              className={`
                relative group cursor-pointer
                ${animated ? 'animate-[fadeInUp_0.6s_ease-out]' : ''}
              `}
              style={getCardStyle(index)}
              onClick={() => handleCardClick(card)}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* 卡片容器 */}
              <div
                className={`
                  relative w-32 h-48 md:w-40 md:h-60 lg:w-48 lg:h-72
                  transform transition-all duration-500 preserve-3d
                  ${isHovered ? 'scale-105 -translate-y-2' : ''}
                  ${isFlipped ? 'rotate-y-180' : ''}
                `}
              >
                {/* 卡片背面 */}
                <div
                  className={`
                    absolute inset-0 w-full h-full rounded-xl
                    bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900
                    border border-purple-500/30 shadow-lg
                    backface-hidden
                    ${isFlipped ? 'rotate-y-180' : ''}
                  `}
                >
                  <div className="h-full flex flex-col items-center justify-center p-4">
                    {/* 神秘图案 */}
                    <div className="text-4xl md:text-5xl mb-4 text-amber-400">
                      🌟
                    </div>
                    <div className="text-xs text-center text-purple-200 leading-relaxed">
                      塔罗奥秘
                    </div>
                  </div>
                </div>

                {/* 卡片正面 */}
                <div
                  className={`
                    absolute inset-0 w-full h-full rounded-xl
                    bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800
                    border shadow-lg backface-hidden rotate-y-180
                    ${card.is_reversed 
                      ? 'border-red-500/30 bg-gradient-to-br from-red-900/20 via-gray-800 to-red-900/20' 
                      : 'border-green-500/30 bg-gradient-to-br from-green-900/20 via-gray-800 to-green-900/20'
                    }
                    ${isFlipped ? '' : 'rotate-y-180'}
                  `}
                >
                  <div className="h-full flex flex-col p-4">
                    {/* 卡片头部 */}
                    <div className="text-center mb-3">
                      {/* 正逆位指示器 */}
                      <div className="flex items-center justify-between mb-2">
                        <div className={`
                          flex items-center space-x-1 px-2 py-1 rounded-full text-xs
                          ${card.is_reversed 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-green-500/20 text-green-300'
                          }
                        `}>
                          {card.is_reversed && <RotateCcw size={12} />}
                          <span>{card.orientation}</span>
                        </div>
                        <Info size={12} className="text-gray-400" />
                      </div>

                      {/* 卡片emoji */}
                      <div className="text-3xl md:text-4xl mb-2">
                        {card.emoji}
                      </div>

                      {/* 卡片名称 */}
                      <h3 className="font-bold text-white text-sm md:text-base">
                        {card.name}
                      </h3>
                      
                      {/* 位置信息 */}
                      {card.position && (
                        <p className="text-xs text-amber-400 mt-1">
                          {card.position}
                        </p>
                      )}
                    </div>

                    {/* 关键词 */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-2">关键词</p>
                        <div className="flex flex-wrap justify-center gap-1">
                          {card.keywords.slice(0, 3).map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded-md text-xs"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 卡片底部 */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        No. {card.number}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 悬浮光效 */}
              {isHovered && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-amber-500/20 pointer-events-none animate-pulse"></div>
              )}

              {/* 发光边框 */}
              <div
                className={`
                  absolute inset-0 rounded-xl pointer-events-none
                  transition-all duration-300
                  ${isHovered 
                    ? 'shadow-lg shadow-purple-500/30' 
                    : ''
                  }
                `}
              ></div>
            </div>
          );
        })}
      </div>

      {/* 卡片信息面板 */}
      {cards.length > 0 && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
            <Sparkles size={16} />
            <span>点击卡片查看详情，再次点击翻转</span>
          </div>
        </div>
      )}

      {/* 抽牌动画样式 */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .preserve-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

