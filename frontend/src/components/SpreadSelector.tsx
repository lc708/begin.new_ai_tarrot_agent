/**
 * SpreadSelector组件 - 牌阵选择
 */

"use client";

import { useState } from 'react';
import { CheckCircle, Grid3X3, Square } from 'lucide-react';
import { Spread } from '@/lib/api';

interface SpreadSelectorProps {
  spreads: Record<string, Spread>;
  selectedSpread: string | null;
  onSpreadSelect: (spreadId: string) => void;
  loading?: boolean;
  className?: string;
}

export function SpreadSelector({
  spreads,
  selectedSpread,
  onSpreadSelect,
  loading = false,
  className = ""
}: SpreadSelectorProps) {
  const [hoveredSpread, setHoveredSpread] = useState<string | null>(null);

  const spreadEntries = Object.entries(spreads);

  const getSpreadIcon = (spreadId: string) => {
    switch (spreadId) {
      case 'single':
        return <Square size={32} className="text-amber-400" />;
      case 'past_present_future':
        return <Grid3X3 size={32} className="text-purple-400" />;
      default:
        return <Square size={32} className="text-gray-400" />;
    }
  };

  const getSpreadVisualization = (spreadId: string, positions: string[]) => {
    switch (spreadId) {
      case 'single':
        return (
          <div className="flex justify-center">
            <div className="w-16 h-24 bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-lg flex items-center justify-center">
              <span className="text-xs text-amber-300">当前</span>
            </div>
          </div>
        );
      case 'past_present_future':
        return (
          <div className="flex justify-center space-x-2">
            {positions.map((position, index) => (
              <div
                key={index}
                className="w-12 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-md flex items-center justify-center"
              >
                <span className="text-xs text-purple-300 text-center px-1">
                  {position}
                </span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${className}`}>
      {/* 标题 */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          🎴 选择牌阵
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          不同的牌阵会给你不同的视角和洞察
        </p>
      </div>

      {/* 牌阵网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {spreadEntries.map(([spreadId, spread]) => {
          const isSelected = selectedSpread === spreadId;
          const isHovered = hoveredSpread === spreadId;

          return (
            <button
              key={spreadId}
              onClick={() => !loading && onSpreadSelect(spreadId)}
              onMouseEnter={() => setHoveredSpread(spreadId)}
              onMouseLeave={() => setHoveredSpread(null)}
              disabled={loading}
              className={`
                relative group p-6 rounded-2xl border backdrop-blur-sm
                transform transition-all duration-300 text-left
                ${isSelected 
                  ? 'bg-gradient-to-br from-purple-600/30 to-amber-500/30 border-purple-400/50 ring-2 ring-purple-400/50' 
                  : 'bg-gradient-to-br from-gray-800/40 to-gray-700/40 border-gray-600/30 hover:border-purple-500/50'
                }
                ${isHovered && !isSelected ? 'scale-102 hover:bg-gradient-to-br hover:from-purple-900/30 hover:to-purple-800/30' : ''}
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}
              `}
            >
              {/* 选中指示器 */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <CheckCircle size={20} className="text-purple-400" />
                </div>
              )}

              {/* 牌阵头部 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getSpreadIcon(spreadId)}
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {spread.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {spread.card_count} 张牌
                    </p>
                  </div>
                </div>
              </div>

              {/* 牌阵描述 */}
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {spread.description}
              </p>

              {/* 牌阵可视化 */}
              <div className="bg-gray-900/30 rounded-lg p-4 mb-4">
                {getSpreadVisualization(spreadId, spread.positions)}
              </div>

              {/* 位置说明 */}
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-medium">牌位含义：</p>
                <div className="flex flex-wrap gap-1">
                  {spread.positions.map((position, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-gray-700/50 text-xs text-gray-300"
                    >
                      {position}
                    </span>
                  ))}
                </div>
              </div>

              {/* 悬浮效果 */}
              {(isHovered || isSelected) && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-amber-500/10 pointer-events-none"></div>
              )}

              {/* 发光效果 */}
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl shadow-lg shadow-purple-500/25 pointer-events-none"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* 确认信息 */}
      {selectedSpread && (
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 text-green-400">
            <CheckCircle size={20} />
            <span>已选择：{spreads[selectedSpread]?.name}</span>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 text-purple-400">
            <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
            <span>正在准备牌阵...</span>
          </div>
        </div>
      )}

      {/* 提示文字 */}
      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">
          🔮 选择后即可开始抽牌
        </p>
      </div>
    </div>
  );
}
