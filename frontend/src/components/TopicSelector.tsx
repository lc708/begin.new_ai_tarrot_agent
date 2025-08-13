/**
 * TopicSelector组件 - 占卜主题选择
 */

"use client";

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Topic } from '@/lib/api';

interface TopicSelectorProps {
  topics: Record<string, Topic>;
  selectedTopic: string | null;
  onTopicSelect: (topicId: string) => void;
  loading?: boolean;
  className?: string;
}

export function TopicSelector({
  topics,
  selectedTopic,
  onTopicSelect,
  loading = false,
  className = ""
}: TopicSelectorProps) {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  const topicEntries = Object.entries(topics);

  return (
    <div className={`${className}`}>
      {/* 标题 */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          🔮 选择占卜主题
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          选择你最关心的领域，让星月为你揭示其中的奥秘
        </p>
      </div>

      {/* 主题网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {topicEntries.map(([topicId, topic]) => {
          const isSelected = selectedTopic === topicId;
          const isHovered = hoveredTopic === topicId;

          return (
            <button
              key={topicId}
              onClick={() => !loading && onTopicSelect(topicId)}
              onMouseEnter={() => setHoveredTopic(topicId)}
              onMouseLeave={() => setHoveredTopic(null)}
              disabled={loading}
              className={`
                relative group p-6 rounded-2xl border backdrop-blur-sm
                transform transition-all duration-300 
                ${isSelected 
                  ? 'bg-gradient-to-br from-purple-600/30 to-amber-500/30 border-purple-400/50 ring-2 ring-purple-400/50' 
                  : 'bg-gradient-to-br from-gray-800/40 to-gray-700/40 border-gray-600/30 hover:border-purple-500/50'
                }
                ${isHovered && !isSelected ? 'scale-105 hover:bg-gradient-to-br hover:from-purple-900/30 hover:to-purple-800/30' : ''}
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}
              `}
            >
              {/* 选中指示器 */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle size={20} className="text-purple-400" />
                </div>
              )}

              {/* 主题图标 */}
              <div className="text-4xl mb-4 text-center">
                {topic.emoji}
              </div>

              {/* 主题名称 */}
              <h3 className="text-xl font-semibold text-white mb-2 text-center">
                {topic.name}
              </h3>

              {/* 主题描述 */}
              <p className="text-gray-400 text-sm text-center leading-relaxed">
                {topic.description}
              </p>

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

      {/* 确认按钮 */}
      {selectedTopic && (
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 text-green-400">
            <CheckCircle size={20} />
            <span>已选择：{topics[selectedTopic]?.name}</span>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 text-purple-400">
            <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
            <span>正在处理你的选择...</span>
          </div>
        </div>
      )}

      {/* 提示文字 */}
      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">
          ✨ 选择完成后将进入下一步
        </p>
      </div>
    </div>
  );
}

