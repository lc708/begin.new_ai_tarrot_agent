/**
 * DivinationInterface组件 - 完整的占卜流程界面
 */

"use client";

import { useEffect, useState } from 'react';
import { ArrowLeft, Play, RotateCcw, MessageCircle, X } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { TopicSelector } from './TopicSelector';
import { SpreadSelector } from './SpreadSelector';
import { CardDisplay } from './CardDisplay';
import { useDivinationFlow, useTopics, useSpreads } from '@/hooks/useDivinationAPI';
import { useDivination } from '@/lib/store';

interface DivinationInterfaceProps {
  onBack?: () => void;
  className?: string;
}

export function DivinationInterface({ onBack, className = "" }: DivinationInterfaceProps) {
  // 移动端检测和对话弹窗状态
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // API hooks
  const { data: topicsData, isLoading: topicsLoading } = useTopics();
  const { data: spreadsData, isLoading: spreadsLoading } = useSpreads();
  
  // 占卜流程
  const {
    sessionId,
    currentStep,
    selectedTopic,
    selectedSpread,
    startNewDivination,
    selectTopic,
    selectSpread,
    drawCards,
    processStep,
    isStarting,
    isProcessing
  } = useDivinationFlow();

  // 状态管理
  const {
    conversationHistory,
    drawnCards,
    interpretation,
    advice,
    progress,
    completed,
    loading,
    error,
    resetDivination
  } = useDivination();

  // 移动端检测
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 自动开始占卜
  useEffect(() => {
    if (!sessionId && !isStarting) {
      startNewDivination();
    }
  }, [sessionId, isStarting, startNewDivination]);

  // 转换对话历史为聊天消息格式
  const chatMessages = conversationHistory.map((msg, index) => ({
    id: `${index}-${msg.timestamp}`,
    type: 'ai' as const,
    content: msg.message,
    timestamp: msg.timestamp,
    step: msg.step
  }));

  // 处理主题选择
  const handleTopicSelect = (topicId: string) => {
    selectTopic(topicId);
  };

  // 处理牌阵选择
  const handleSpreadSelect = (spreadId: string) => {
    selectSpread(spreadId);
  };

  // 处理抽牌
  const handleDrawCards = () => {
    drawCards();
  };

  // 重新开始
  const handleRestart = () => {
    resetDivination();
    startNewDivination();
  };

  // 渲染浮动对话按钮（移动端）
  const renderFloatingChatButton = () => {
    if (!isMobile) return null;
    
    return (
      <button
        onClick={() => setShowMobileChat(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-500 rounded-full shadow-lg z-40 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
      >
        <MessageCircle size={24} className="text-white" />
        {conversationHistory.length > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {conversationHistory.length > 9 ? '9+' : conversationHistory.length}
            </span>
          </div>
        )}
      </button>
    );
  };

  // 渲染移动端对话弹窗
  const renderMobileChatModal = () => {
    if (!isMobile || !showMobileChat) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
        <div className="w-full h-4/5 bg-gray-900 rounded-t-2xl border-t border-gray-700/50 flex flex-col">
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <h3 className="text-lg font-bold text-white">对话历史</h3>
            <button
              onClick={() => setShowMobileChat(false)}
              className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
          
          {/* 对话内容 */}
          <div className="flex-1 overflow-hidden">
            <ChatInterface
              messages={chatMessages}
              loading={loading || isProcessing}
              disableSmoothScroll={true}
            />
          </div>
        </div>
      </div>
    );
  };

  // 渲染进度条
  const renderProgressBar = () => (
    <div className="w-full bg-gray-700/50 rounded-full h-2 mb-6">
      <div 
        className="bg-gradient-to-r from-purple-600 to-amber-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  // 渲染步骤指示器
  const renderStepIndicator = () => {
    const steps = [
      { key: 'welcome', label: '欢迎', emoji: '👋' },
      { key: 'topic_selection', label: '选择主题', emoji: '🎯' },
      { key: 'spread_selection', label: '选择牌阵', emoji: '🎴' },
      { key: 'drawing_cards', label: '抽牌', emoji: '✨' },
      { key: 'interpretation', label: '解读', emoji: '🔮' },
      { key: 'completed', label: '完成', emoji: '🌟' }
    ];

    const currentStepIndex = steps.findIndex(step => 
      currentStep.includes(step.key) || 
      (currentStep === 'waiting_topic' && step.key === 'topic_selection') ||
      (currentStep === 'waiting_spread' && step.key === 'spread_selection')
    );

    return (
      <div className="flex justify-center items-center space-x-1 sm:space-x-2 md:space-x-4 mb-6 md:mb-8 px-4 overflow-x-auto">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          
          return (
            <div key={step.key} className="flex items-center">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 transition-all duration-300
                  ${isActive 
                    ? 'bg-purple-600 border-purple-500 text-white' 
                    : isCompleted 
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-400'
                  }
                `}
              >
                <span className="text-xs sm:text-sm">{step.emoji}</span>
              </div>
              <div className="ml-2 text-xs text-gray-400 hidden md:block">
                {step.label}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-3 sm:w-4 md:w-6 lg:w-12 h-0.5 mx-1 sm:mx-1.5 md:mx-2 transition-all duration-300
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-600'}
                  `}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染当前步骤内容
  const renderCurrentStepContent = () => {
    // 错误状态
    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-400 text-lg mb-4">⚠️ 出现错误</div>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            重新开始
          </button>
        </div>
      );
    }

    // 根据当前步骤渲染内容
    switch (currentStep) {
      case 'welcome':
      case 'topic_selection':
      case 'waiting_topic':
        if (!topicsData || topicsLoading) {
          return (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">加载占卜主题中...</p>
            </div>
          );
        }
        
        return (
          <TopicSelector
            topics={topicsData?.topics || {}}
            selectedTopic={selectedTopic}
            onTopicSelect={handleTopicSelect}
            loading={isProcessing}
          />
        );

      case 'spread_selection':
      case 'waiting_spread':
        if (!spreadsData || spreadsLoading) {
          return (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">加载牌阵选项中...</p>
            </div>
          );
        }

        return (
          <SpreadSelector
            spreads={spreadsData?.spreads || {}}
            selectedSpread={selectedSpread}
            onSpreadSelect={handleSpreadSelect}
            loading={isProcessing}
          />
        );

      case 'drawing_cards':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              🎴 准备抽牌
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              请集中注意力，深呼吸，当你准备好时点击下方按钮开始抽牌
            </p>
            <button
              onClick={handleDrawCards}
              disabled={isProcessing}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-semibold rounded-full transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>抽牌中...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Play size={20} />
                  <span>开始抽牌</span>
                </div>
              )}
            </button>
          </div>
        );

      case 'interpretation':
        // 如果还没有解读内容，显示等待状态
        if (!interpretation) {
          return (
            <div className="space-y-8">
              {/* 抽到的牌 */}
              <CardDisplay
                cards={drawnCards}
                showCards={true}
                animated={true}
              />
              
              {/* 等待解读 */}
              <div className="text-center py-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-3">🔮 牌面已显现</h3>
                  <p className="text-gray-400">请点击下方按钮，让塔罗师为您解读牌面的奥秘...</p>
                </div>
                <button
                  onClick={() => {
                    if (sessionId) {
                      processStep.mutate({
                        session_id: sessionId,
                        step: 'get_interpretation',
                        data: {}
                      });
                    }
                  }}
                  disabled={isProcessing}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-semibold rounded-full transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>解读中...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>✨</span>
                      <span>开始解读</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          );
        }
        // 否则，继续显示完整内容
        /* falls through */
      case 'advice':
      case 'completed':
        return (
          <div className="space-y-8">
            {/* 抽到的牌 */}
            <CardDisplay
              cards={drawnCards}
              showCards={true}
              animated={true}
            />

            {/* 解读和建议 */}
            {(interpretation || advice) && (
              <div className="max-w-3xl mx-auto space-y-6">
                {interpretation && (
                  <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <span className="mr-2">🔮</span>
                      塔罗解读
                    </h3>
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {interpretation}
                    </p>
                  </div>
                )}

                {advice && (
                  <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <span className="mr-2">✨</span>
                      人生建议
                    </h3>
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {advice}
                    </p>
                  </div>
                )}

                {/* 重新开始按钮 */}
                {completed && (
                  <div className="text-center">
                    <button
                      onClick={handleRestart}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-semibold rounded-full transform transition-all duration-300 hover:scale-105"
                    >
                      <RotateCcw size={18} />
                      <span>再次占卜</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">处理中...</p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${className}`}>
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* 返回按钮 */}
          {onBack && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('返回按钮被点击');
                onBack();
              }}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors z-20 relative cursor-pointer"
            >
              <ArrowLeft size={20} />
              <span>返回</span>
            </button>
          )}

          {/* 会话信息 */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              会话: {sessionId?.slice(-8) || '未连接'}
            </div>
            {loading && (
              <div className="flex items-center space-x-2 text-purple-400">
                <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                <span className="text-sm">处理中</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-6xl mx-auto p-6">
        {/* 进度条 */}
        {renderProgressBar()}

        {/* 步骤指示器 */}
        {renderStepIndicator()}

        {/* 响应式布局：移动端隐藏聊天，桌面端显示双栏 */}
        {isMobile ? (
          /* 移动端布局：全屏主内容 */
          <div className="w-full">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 sm:p-6 min-h-[calc(100vh-300px)]">
              {renderCurrentStepContent()}
            </div>
          </div>
        ) : (
          /* 桌面端布局：左侧聊天，右侧操作 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 聊天界面 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 h-96 lg:h-[600px]">
                  <ChatInterface
                    messages={chatMessages}
                    loading={loading || isProcessing}
                  />
                </div>
              </div>
            </div>

            {/* 主要操作区域 */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 min-h-96">
                {renderCurrentStepContent()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 移动端浮动对话按钮 */}
      {renderFloatingChatButton()}

      {/* 移动端对话弹窗 */}
      {renderMobileChatModal()}
    </div>
  );
}
